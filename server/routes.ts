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
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
