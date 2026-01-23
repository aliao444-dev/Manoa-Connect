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
      let listings = await storage.getListings();
      
      // Filter by category if provided
      const category = req.query.category as string | undefined;
      if (category && category !== 'all') {
        listings = listings.filter(l => 
          l.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      // Filter by search if provided
      const search = req.query.search as string | undefined;
      if (search) {
        const searchLower = search.toLowerCase();
        listings = listings.filter(l => 
          l.title.toLowerCase().includes(searchLower) ||
          l.description.toLowerCase().includes(searchLower)
        );
      }
      
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

  // Vehicles
  app.get(api.vehicles.list.path, async (req, res) => {
    try {
      const vehicles = await storage.getAvailableVehicles();
      res.json(vehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });

  app.get(api.vehicles.myVehicles.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const vehicles = await storage.getVehiclesForUser(userId);
      res.json(vehicles);
    } catch (error) {
      console.error("Error fetching user vehicles:", error);
      res.status(500).json({ message: "Failed to fetch vehicles" });
    }
  });

  app.post(api.vehicles.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const input = api.vehicles.create.input.parse(req.body);
      const vehicle = await storage.createVehicle({
        ...input,
        ownerId: userId
      });
      res.status(201).json(vehicle);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error creating vehicle:", err);
      res.status(500).json({ message: "Failed to create vehicle" });
    }
  });

  app.patch(api.vehicles.update.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const input = api.vehicles.update.input.parse(req.body);
      const vehicle = await storage.updateVehicleAvailability(
        Number(req.params.id), 
        userId, 
        input.available
      );
      res.json(vehicle);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      res.status(500).json({ message: "Failed to update vehicle" });
    }
  });

  // Scholarships
  app.get(api.scholarships.list.path, async (req, res) => {
    try {
      const scholarships = await storage.getScholarships();
      res.json(scholarships);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      res.status(500).json({ message: "Failed to fetch scholarships" });
    }
  });

  app.get(api.scholarships.get.path, async (req, res) => {
    try {
      const scholarship = await storage.getScholarship(Number(req.params.id));
      if (!scholarship) return res.status(404).json({ message: "Scholarship not found" });
      res.json(scholarship);
    } catch (error) {
      console.error("Error fetching scholarship:", error);
      res.status(500).json({ message: "Failed to fetch scholarship" });
    }
  });

  // Class Groups
  app.get(api.classGroups.list.path, async (req, res) => {
    try {
      const groups = await storage.getClassGroups();
      res.json(groups);
    } catch (error) {
      console.error("Error fetching class groups:", error);
      res.status(500).json({ message: "Failed to fetch class groups" });
    }
  });

  app.get(api.classGroups.myGroups.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const groups = await storage.getUserClassGroups(userId);
      res.json(groups);
    } catch (error) {
      console.error("Error fetching user class groups:", error);
      res.status(500).json({ message: "Failed to fetch class groups" });
    }
  });

  app.post(api.classGroups.join.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const input = api.classGroups.join.input.parse(req.body);
      let group = await storage.getClassGroup(input.classId);
      
      // If group doesn't exist, create it (auto-create on first join)
      if (!group) {
        group = await storage.createClassGroup({
          classId: input.classId,
          className: input.classId.replace(/-/g, ' ').toUpperCase(),
          semester: "Spring 2026"
        });
      }

      // Check if already a member
      const existing = await storage.getClassGroupMembership(group.id, userId);
      if (existing) {
        return res.json({ group, membership: existing });
      }

      const membership = await storage.joinClassGroup(group.id, userId);
      res.json({ group, membership });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error joining class group:", err);
      res.status(500).json({ message: "Failed to join class group" });
    }
  });

  app.get(api.classGroups.messages.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      const groupId = Number(req.params.id);
      
      // Verify user is a member
      const membership = await storage.getClassGroupMembership(groupId, userId);
      if (!membership) {
        return res.status(403).json({ message: "You are not a member of this class group" });
      }

      const messages = await storage.getGroupMessages(groupId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching group messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post(api.classGroups.sendMessage.path, isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const groupId = Number(req.params.id);
      
      // Verify user is a member
      const membership = await storage.getClassGroupMembership(groupId, userId);
      if (!membership) {
        return res.status(403).json({ message: "You are not a member of this class group" });
      }

      const input = api.classGroups.sendMessage.input.parse(req.body);
      const message = await storage.createGroupMessage({
        ...input,
        groupId,
        senderId: userId
      });
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Error sending group message:", err);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Seed database with demo data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  try {
    const existingListings = await storage.getListings();
    if (existingListings.length < 10) {
      // Student goods
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

      await storage.createListing({
        sellerId: "demo-seller",
        title: "TI-84 Plus Graphing Calculator",
        description: "Essential for math and science courses. Works perfectly, includes batteries.",
        price: 6500,
        condition: "Good",
        category: "Electronics",
        imageUrls: ["https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&q=80&w=800"],
      });

      await storage.createListing({
        sellerId: "demo-seller",
        title: "Anatomy & Physiology Textbook",
        description: "Latest edition for BIOL 141/142. No markings, like new condition.",
        price: 7500,
        condition: "Like New",
        category: "Textbook",
        imageUrls: ["https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800"],
      });

      await storage.createListing({
        sellerId: "demo-seller",
        title: "Dorm Futon Couch",
        description: "Compact futon perfect for dorm rooms. Converts to bed. Blue fabric.",
        price: 12000,
        condition: "Good",
        category: "Dorm",
        imageUrls: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800"],
      });

      await storage.createListing({
        sellerId: "demo-seller",
        title: "MacBook Pro 2020 13-inch",
        description: "M1 chip, 8GB RAM, 256GB SSD. Perfect for coding and design work.",
        price: 75000,
        condition: "Like New",
        category: "Electronics",
        imageUrls: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800"],
      });

      await storage.createListing({
        sellerId: "demo-seller",
        title: "Surfboard - 7ft Funboard",
        description: "Great for learning! Soft-top foam board. Perfect for Waikiki waves.",
        price: 15000,
        condition: "Good",
        category: "Sports",
        imageUrls: ["https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=800"],
      });

      // Hawaiian touristy goods
      await storage.createListing({
        sellerId: "demo-seller",
        title: "Handmade Koa Wood Ukulele",
        description: "Authentic Hawaiian koa wood ukulele, beautiful sound. Handcrafted on Oahu.",
        price: 25000,
        condition: "New",
        category: "Hawaiian",
        imageUrls: ["https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=800"],
      });

      await storage.createListing({
        sellerId: "demo-seller",
        title: "Aloha Shirt Collection - 3 Pack",
        description: "Authentic vintage aloha shirts. Various patterns, size M. Perfect condition.",
        price: 4500,
        condition: "Like New",
        category: "Hawaiian",
        imageUrls: ["https://images.unsplash.com/photo-1598522325074-042db73aa4e6?auto=format&fit=crop&q=80&w=800"],
      });

      await storage.createListing({
        sellerId: "demo-seller",
        title: "Hawaiian Lei Making Kit",
        description: "Complete kit with plumeria seeds, kukui nuts, and instructions. Make your own leis!",
        price: 3500,
        condition: "New",
        category: "Hawaiian",
        imageUrls: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800"],
      });

      await storage.createListing({
        sellerId: "demo-seller",
        title: "Coconut Wireless Beach Chair",
        description: "Portable beach chair, lightweight aluminum frame. Perfect for beach days.",
        price: 3000,
        condition: "New",
        category: "Hawaiian",
        imageUrls: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800"],
      });

      // Services
      await storage.createListing({
        sellerId: "demo-seller",
        title: "Professional Haircuts - Campus Barber",
        description: "Licensed barber offering cuts at Hamilton Library area. All styles welcome. $15/cut.",
        price: 1500,
        condition: "New",
        category: "Service",
        imageUrls: ["https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800"],
      });

      await storage.createListing({
        sellerId: "demo-seller",
        title: "Dental Cleaning - Volunteer Patient Needed",
        description: "UH Dental Hygiene program seeking volunteer patients. FREE dental cleaning & checkup!",
        price: 0,
        condition: "New",
        category: "Service",
        imageUrls: ["https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800"],
      });

      await storage.createListing({
        sellerId: "demo-seller",
        title: "Math Tutoring - Calculus I & II",
        description: "Math major offering tutoring sessions. $25/hour. Can meet at Hamilton or online.",
        price: 2500,
        condition: "New",
        category: "Service",
        imageUrls: ["https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800"],
      });

      await storage.createListing({
        sellerId: "demo-seller",
        title: "Resume Writing & Review",
        description: "Career Center certified. Will help polish your resume for internships/jobs. $20/session.",
        price: 2000,
        condition: "New",
        category: "Service",
        imageUrls: ["https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800"],
      });

      await storage.createListing({
        sellerId: "demo-seller",
        title: "Photography - Graduation Photos",
        description: "Professional grad photos at beautiful campus locations. Package starts at $75.",
        price: 7500,
        condition: "New",
        category: "Service",
        imageUrls: ["https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800"],
      });

      await storage.createListing({
        sellerId: "demo-seller",
        title: "Moving Help - Strong Students Available",
        description: "Need help moving? Group of 3 students with truck. $30/hour for all of us.",
        price: 3000,
        condition: "New",
        category: "Service",
        imageUrls: ["https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&q=80&w=800"],
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

    // Seed scholarships
    const existingScholarships = await storage.getScholarships();
    if (existingScholarships.length === 0) {
      await storage.createScholarship({
        name: "UH System Common Scholarship Application",
        provider: "University of Hawaii",
        description: "One application for hundreds of UH scholarships. Submit once and be considered for all matching awards based on your profile, major, and eligibility.",
        amount: "Varies ($500 - $20,000)",
        deadline: "March 1, 2026",
        eligibility: "Must be enrolled or accepted at any UH campus. Maintain minimum 2.5 GPA.",
        applicationUrl: "https://uhfoundation.org/scholarships",
        category: "General",
      });

      await storage.createScholarship({
        name: "Hawai'i Community Foundation Scholarships",
        provider: "HCF - Hawai'i Community Foundation",
        description: "Over 200 scholarship funds available through HCF, supporting students from diverse backgrounds, majors, and islands. One of Hawaii's largest scholarship programs.",
        amount: "Varies ($1,000 - $10,000)",
        deadline: "January 31, 2026",
        eligibility: "Hawaii residents or students attending Hawaii institutions. Requirements vary by fund.",
        applicationUrl: "https://www.hawaiicommunityfoundation.org/scholarships",
        category: "General",
      });

      await storage.createScholarship({
        name: "Regents Scholarship",
        provider: "University of Hawaii",
        description: "Merit-based scholarship for top incoming freshmen. Covers tuition and fees for up to 4 years.",
        amount: "Full Tuition",
        deadline: "February 1, 2026",
        eligibility: "Incoming freshmen with 3.5+ GPA and 1200+ SAT. Hawaii residents preferred.",
        applicationUrl: "https://manoa.hawaii.edu/admissions/scholarships",
        category: "Merit",
      });

      await storage.createScholarship({
        name: "Native Hawaiian Scholarship Program",
        provider: "Kamehameha Schools",
        description: "Supporting Native Hawaiian students pursuing higher education at UH or mainland institutions.",
        amount: "$2,500 - $7,500",
        deadline: "February 15, 2026",
        eligibility: "Must be of Hawaiian ancestry. Full-time enrollment required.",
        applicationUrl: "https://www.ksbe.edu/apply/financial-aid-and-scholarships",
        category: "Need-Based",
      });

      await storage.createScholarship({
        name: "STEM Excellence Award",
        provider: "Hawaii STEM Foundation",
        description: "For students pursuing degrees in Science, Technology, Engineering, or Mathematics fields.",
        amount: "$5,000",
        deadline: "April 15, 2026",
        eligibility: "STEM majors with 3.0+ GPA. Must demonstrate research interest.",
        applicationUrl: "https://example.com/stem-scholarship",
        category: "Major-Specific",
      });

      await storage.createScholarship({
        name: "Aloha State Business Scholarship",
        provider: "Hawaii Business Roundtable",
        description: "Supporting future business leaders at Shidler College of Business.",
        amount: "$3,000",
        deadline: "March 15, 2026",
        eligibility: "Business majors at Shidler College. Demonstrated leadership experience.",
        applicationUrl: "https://shidler.hawaii.edu/scholarships",
        category: "Major-Specific",
      });

      await storage.createScholarship({
        name: "First Generation Student Grant",
        provider: "University of Hawaii Foundation",
        description: "Supporting first-generation college students who are paving the way for their families.",
        amount: "$2,000",
        deadline: "Rolling Deadline",
        eligibility: "First in family to attend college. Demonstrated financial need.",
        applicationUrl: "https://uhfoundation.org/first-gen",
        category: "Need-Based",
      });

      await storage.createScholarship({
        name: "Pacific Islander Leadership Scholarship",
        provider: "Pacific Islander Affairs Office",
        description: "Empowering Pacific Islander students to succeed in higher education and become community leaders.",
        amount: "$4,000",
        deadline: "February 28, 2026",
        eligibility: "Pacific Islander heritage. Active in community service.",
        applicationUrl: "https://manoa.hawaii.edu/omsshp",
        category: "Community",
      });

      console.log("Seeded database with scholarships");
    }

    // Seed some class groups
    const existingGroups = await storage.getClassGroups();
    if (existingGroups.length === 0) {
      await storage.createClassGroup({
        classId: "ICS-311-001",
        className: "Algorithms",
        semester: "Spring 2026",
      });

      await storage.createClassGroup({
        classId: "ECON-130-002",
        className: "Principles of Microeconomics",
        semester: "Spring 2026",
      });

      await storage.createClassGroup({
        classId: "BIOL-171-001",
        className: "Introduction to Biology I",
        semester: "Spring 2026",
      });

      console.log("Seeded database with class groups");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
