import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Re-export auth models (sessions and users tables for Replit Auth)
export * from "./models/auth";

// App-specific tables that extend user functionality
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(), // Links to auth users.id
  displayName: text("display_name"),
  bio: text("bio"),
  trustScore: integer("trust_score").default(100),
  isDriver: boolean("is_driver").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  sellerId: text("seller_id").notNull(), // Links to auth users.id
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  condition: text("condition").notNull(),
  category: text("category").notNull(),
  imageUrls: text("image_urls").array().notNull(),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rides = pgTable("rides", {
  id: serial("id").primaryKey(),
  riderId: text("rider_id").notNull(), // Links to auth users.id
  driverId: text("driver_id"),
  pickupLocation: text("pickup_location").notNull(),
  dropoffLocation: text("dropoff_location").notNull(),
  status: text("status").default("requested"),
  price: integer("price").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: text("sender_id").notNull(),
  receiverId: text("receiver_id").notNull(),
  content: text("content").notNull(),
  listingId: integer("listing_id"),
  rideId: integer("ride_id"),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  listings: many(listings),
}));

export const listingsRelations = relations(listings, ({ one }) => ({
  profile: one(profiles, {
    fields: [listings.sellerId],
    references: [profiles.userId],
  }),
}));

// Schemas
export const insertProfileSchema = createInsertSchema(profiles).omit({ id: true, trustScore: true, createdAt: true });
export const insertListingSchema = createInsertSchema(listings).omit({ id: true, createdAt: true, status: true });
export const insertRideSchema = createInsertSchema(rides).omit({ id: true, createdAt: true, status: true, driverId: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true, read: true });

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Listing = typeof listings.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Ride = typeof rides.$inferSelect;
export type InsertRide = z.infer<typeof insertRideSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
