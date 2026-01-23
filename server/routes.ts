import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Setup Integrations
  await setupAuth(app);
  registerAuthRoutes(app);
  registerObjectStorageRoutes(app);

  // Profile - get or create for authenticated user
  app.get(api.profile.me.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      let profile = await storage.getProfile(userId);
      if (!profile) {
        // Auto-create profile on first access
        const claims = req.user.claims;
        profile = await storage.createProfile({
          userId,
          displayName: claims.first_name || claims.email?.split('@')[0] || "New User",
          bio: "New student at UH Manoa",
          isDriver: false
        });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.patch(api.profile.update.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const input = api.profile.update.input.parse(req.body);
      const profile = await storage.updateProfile(userId, input);
      res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Listings - public access for viewing
  app.get(api.listings.list.path, async (req, res) => {
    try {
      const listings = await storage.getListings();
      res.json(listings);
    } catch (error) {
      console.error("Error fetching listings:", error);
      res.status(500).json({ message: "Failed to fetch listings" });
    }
  });

  app.get(api.listings.get.path, async (req, res) => {
    try {
      const listing = await storage.getListing(Number(req.params.id));
      if (!listing) return res.status(404).json({ message: "Listing not found" });
      res.json(listing);
    } catch (error) {
      console.error("Error fetching listing:", error);
      res.status(500).json({ message: "Failed to fetch listing" });
    }
  });

  app.post(api.listings.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const input = api.listings.create.input.parse(req.body);
      const listing = await storage.createListing({
        ...input,
        sellerId: userId
      });
      res.status(201).json(listing);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error creating listing:", err);
      res.status(500).json({ message: "Failed to create listing" });
    }
  });

  // Rides
  app.get(api.rides.list.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const rides = await storage.getRidesForUser(userId);
      res.json(rides);
    } catch (error) {
      console.error("Error fetching rides:", error);
      res.status(500).json({ message: "Failed to fetch rides" });
    }
  });

  app.get(api.rides.available.path, async (req, res) => {
    try {
      const rides = await storage.getRides();
      const availableRides = rides.filter(r => r.status === "requested");
      res.json(availableRides);
    } catch (error) {
      console.error("Error fetching available rides:", error);
      res.status(500).json({ message: "Failed to fetch available rides" });
    }
  });

  app.post(api.rides.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const input = api.rides.create.input.parse(req.body);
      const ride = await storage.createRide({
        ...input,
        riderId: userId
      });
      res.status(201).json(ride);
    } catch (err) {
      console.error("Error creating ride:", err);
      res.status(500).json({ message: "Failed to create ride" });
    }
  });

  app.patch(api.rides.update.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const input = api.rides.update.input.parse(req.body);
      
      // If accepting a ride, set the driver
      const updates: any = { status: input.status };
      if (input.status === "accepted") {
        updates.driverId = userId;
      }
      
      const ride = await storage.updateRide(Number(req.params.id), updates);
      res.json(ride);
    } catch (error) {
      console.error("Error updating ride:", error);
      res.status(500).json({ message: "Failed to update ride" });
    }
  });

  // Wall Spaces
  app.get(api.walls.list.path, async (req, res) => {
    try {
      const walls = await storage.getWallSpaces();
      res.json(walls);
    } catch (error) {
      console.error("Error fetching wall spaces:", error);
      res.status(500).json({ message: "Failed to fetch wall spaces" });
    }
  });

  app.get(api.walls.myBookings.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const bookings = await storage.getWallBookingsForUser(userId);
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching wall bookings:", error);
      res.status(500).json({ message: "Failed to fetch wall bookings" });
    }
  });

  app.get(api.walls.get.path, async (req, res) => {
    try {
      const wall = await storage.getWallSpace(Number(req.params.id));
      if (!wall) return res.status(404).json({ message: "Wall space not found" });
      res.json(wall);
    } catch (error) {
      console.error("Error fetching wall space:", error);
      res.status(500).json({ message: "Failed to fetch wall space" });
    }
  });

  app.post("/api/walls/:id/book", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const wallId = Number(req.params.id);
      const wall = await storage.getWallSpace(wallId);
      if (!wall) return res.status(404).json({ message: "Wall space not found" });
      if (wall.status !== "available") {
        return res.status(400).json({ message: "Wall space is not available" });
      }

      const input = api.walls.book.input.parse(req.body);
      const totalPrice = wall.pricePerMonth * input.duration;

      const booking = await storage.createWallBooking({
        ...input,
        wallId,
        userId,
        totalPrice
      });

      // Update wall status to booked
      await storage.updateWallStatus(wallId, "booked");

      res.status(201).json(booking);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error booking wall space:", err);
      res.status(500).json({ message: "Failed to book wall space" });
    }
  });

  // Seed database with demo data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  try {
    const existingListings = await storage.getListings();
    if (existingListings.length === 0) {
      // Create demo listings with a placeholder seller ID
      await storage.createListing({
        sellerId: "demo-seller",
        title: "ECON 130 Textbook - Principles of Microeconomics",
        description: "Great condition, some highlighting. Perfect for intro econ classes.",
        price: 4500,
        condition: "Good",
        category: "Textbook",
        imageUrls: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"],
      });

      await storage.createListing({
        sellerId: "demo-seller",
        title: "Mini Fridge - Perfect for Dorms",
        description: "3.2 cubic feet, works great. Moving out sale!",
        price: 8000,
        condition: "Like New",
        category: "Dorm",
        imageUrls: ["https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=800"],
      });

      await storage.createListing({
        sellerId: "demo-seller",
        title: "Desk Lamp with USB Charging",
        description: "LED desk lamp with built-in USB ports. Great for late night studying.",
        price: 2500,
        condition: "New",
        category: "Electronics",
        imageUrls: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800"],
      });

      console.log("Seeded database with demo listings");
    }

    // Seed wall spaces
    const existingWalls = await storage.getWallSpaces();
    if (existingWalls.length === 0) {
      await storage.createWallSpace({
        name: "Shidler Courtyard - East Wall",
        location: "Shidler College of Business, Ground Floor",
        description: "High-visibility wall facing the main courtyard where students gather between classes. Perfect for brand awareness.",
        dimensions: "15ft x 8ft",
        pricePerMonth: 50000, // $500/month in cents
        status: "available",
        imageUrl: null,
      });

      await storage.createWallSpace({
        name: "International Excellence Banner",
        location: "Shidler College, Building B Entrance",
        description: "Premium banner space at the main building entrance. Thousands of daily impressions from students and visitors.",
        dimensions: "6ft x 20ft",
        pricePerMonth: 75000,
        status: "available",
        imageUrl: null,
      });

      await storage.createWallSpace({
        name: "Garden Walkway Mural",
        location: "Shidler College, Garden Path",
        description: "Scenic location along the palm-lined walkway. A creative canvas surrounded by tropical landscaping.",
        dimensions: "20ft x 10ft",
        pricePerMonth: 65000,
        status: "available",
        imageUrl: null,
      });

      await storage.createWallSpace({
        name: "Study Hall Feature Wall",
        location: "Shidler College, Building A Interior",
        description: "Indoor feature wall in the main study area. Captive audience of focused students.",
        dimensions: "12ft x 6ft",
        pricePerMonth: 40000,
        status: "available",
        imageUrl: null,
      });

      await storage.createWallSpace({
        name: "Evening Terrace Display",
        location: "Shidler College, Terrace Area",
        description: "Evening-lit display area near the outdoor seating. Popular spot for networking events.",
        dimensions: "10ft x 8ft",
        pricePerMonth: 55000,
        status: "booked",
        imageUrl: null,
      });

      console.log("Seeded database with wall spaces");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
