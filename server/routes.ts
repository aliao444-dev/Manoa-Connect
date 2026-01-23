import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Setup Integrations
  await setupAuth(app);
  registerAuthRoutes(app);
  registerObjectStorageRoutes(app);

  // Users
  app.get(api.users.me.path, async (req, res) => {
    // In a real Replit Auth app, we get username from headers
    const username = req.header('x-replit-user-name');
    if (!username) {
      return res.status(401).json(null);
    }

    let user = await storage.getUserByUsername(username);
    if (!user) {
      // Auto-create user on first login
      user = await storage.createUser({
        username,
        email: `${username}@hawaii.edu`, // Assume hawaii.edu for now
        displayName: username,
        bio: "New student",
        avatarUrl: "",
        isDriver: false
      });
    }
    res.json(user);
  });

  app.patch(api.users.update.path, async (req, res) => {
     const username = req.header('x-replit-user-name');
     if (!username) return res.sendStatus(401);
     const user = await storage.getUserByUsername(username);
     if (!user) return res.sendStatus(404);

     const input = api.users.update.input.parse(req.body);
     const updated = await storage.updateUser(user.id, input);
     res.json(updated);
  });

  // Listings
  app.get(api.listings.list.path, async (req, res) => {
    const listings = await storage.getListings();
    res.json(listings);
  });

  app.get(api.listings.get.path, async (req, res) => {
    const listing = await storage.getListing(Number(req.params.id));
    if (!listing) return res.status(404).json({ message: "Listing not found" });
    res.json(listing);
  });

  app.post(api.listings.create.path, async (req, res) => {
    try {
      const input = api.listings.create.input.parse(req.body);
      const listing = await storage.createListing(input);
      res.status(201).json(listing);
    } catch (err) {
      if (err instanceof z.ZodError) {
         res.status(400).json({ message: err.errors[0].message });
      }
    }
  });

  // Rides
  app.get(api.rides.list.path, async (req, res) => {
    const rides = await storage.getRides();
    res.json(rides);
  });

  app.post(api.rides.create.path, async (req, res) => {
    const input = api.rides.create.input.parse(req.body);
    const ride = await storage.createRide(input);
    res.status(201).json(ride);
  });

  app.patch(api.rides.update.path, async (req, res) => {
    const input = api.rides.update.input.parse(req.body);
    const ride = await storage.updateRide(Number(req.params.id), input);
    res.json(ride);
  });

  // Seed data on startup
  seedDatabase().catch(console.error);

  return httpServer;
}

// Seed data function
export async function seedDatabase() {
  const existingUsers = await storage.getUserByUsername("demo_student");
  if (!existingUsers) {
    const seller = await storage.createUser({
      username: "demo_student",
      displayName: "Kimo",
      email: "kimo@hawaii.edu",
      bio: "Economics Major. Selling my old books.",
      avatarUrl: "https://ui.shadcn.com/avatars/01.png",
      isDriver: false
    });

    const driver = await storage.createUser({
      username: "swoop_driver",
      displayName: "Kai",
      email: "kai@hawaii.edu",
      bio: "Campus driver. Fast and safe.",
      avatarUrl: "https://ui.shadcn.com/avatars/02.png",
      isDriver: true
    });

    await storage.createListing({
      sellerId: seller.id,
      title: "ECON 130 Textbook",
      description: "Principles of Microeconomics. Good condition, some highlighting.",
      price: 4500, // $45.00
      condition: "Good",
      category: "Textbook",
      imageUrls: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"],
    });

    await storage.createListing({
      sellerId: seller.id,
      title: "Mini Fridge",
      description: "Perfect for dorms. 3.2 cu ft.",
      price: 8000, // $80.00
      condition: "Like New",
      category: "Dorm",
      imageUrls: ["https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&q=80&w=800"],
    });
  }
}
