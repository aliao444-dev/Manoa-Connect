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

// Wall Art / Startup Promotion
export const wallSpaces = pgTable("wall_spaces", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  dimensions: text("dimensions").notNull(),
  imageUrl: text("image_url"),
  pricePerMonth: integer("price_per_month").notNull(),
  status: text("status").default("available"), // available, booked, maintenance
});

export const wallBookings = pgTable("wall_bookings", {
  id: serial("id").primaryKey(),
  wallId: integer("wall_id").notNull(),
  userId: text("user_id").notNull(),
  startupName: text("startup_name").notNull(),
  startupDescription: text("startup_description").notNull(),
  designBrief: text("design_brief").notNull(),
  contactEmail: text("contact_email").notNull(),
  duration: integer("duration").notNull(), // months
  totalPrice: integer("total_price").notNull(),
  status: text("status").default("pending"), // pending, approved, in_progress, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

// Vehicles for SWOOP drivers
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  type: text("type").notNull(), // bike, moped, golf_cart
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  available: boolean("available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Class Groups for messaging
export const classGroups = pgTable("class_groups", {
  id: serial("id").primaryKey(),
  classId: text("class_id").notNull().unique(), // e.g., "ICS311-001"
  className: text("class_name").notNull(),
  semester: text("semester").notNull(), // e.g., "Spring 2026"
  createdAt: timestamp("created_at").defaultNow(),
});

export const classGroupMembers = pgTable("class_group_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull(),
  userId: text("user_id").notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const groupMessages = pgTable("group_messages", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull(),
  senderId: text("sender_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Scholarships
export const scholarships = pgTable("scholarships", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  provider: text("provider").notNull(), // UH, HCF, etc.
  description: text("description").notNull(),
  amount: text("amount").notNull(), // e.g., "$5,000" or "Varies"
  deadline: text("deadline"),
  eligibility: text("eligibility").notNull(),
  applicationUrl: text("application_url"),
  category: text("category").notNull(), // need-based, merit, specific-major, etc.
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
export const insertWallBookingSchema = createInsertSchema(wallBookings).omit({ id: true, createdAt: true, status: true, totalPrice: true });
export const insertVehicleSchema = createInsertSchema(vehicles).omit({ id: true, createdAt: true, available: true });
export const insertClassGroupSchema = createInsertSchema(classGroups).omit({ id: true, createdAt: true });
export const insertGroupMessageSchema = createInsertSchema(groupMessages).omit({ id: true, createdAt: true });
export const insertScholarshipSchema = createInsertSchema(scholarships).omit({ id: true, createdAt: true });

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Listing = typeof listings.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Ride = typeof rides.$inferSelect;
export type InsertRide = z.infer<typeof insertRideSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type WallSpace = typeof wallSpaces.$inferSelect;
export type WallBooking = typeof wallBookings.$inferSelect;
export type InsertWallBooking = z.infer<typeof insertWallBookingSchema>;
export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type ClassGroup = typeof classGroups.$inferSelect;
export type InsertClassGroup = z.infer<typeof insertClassGroupSchema>;
export type ClassGroupMember = typeof classGroupMembers.$inferSelect;
export type GroupMessage = typeof groupMessages.$inferSelect;
export type InsertGroupMessage = z.infer<typeof insertGroupMessageSchema>;
export type Scholarship = typeof scholarships.$inferSelect;
export type InsertScholarship = z.infer<typeof insertScholarshipSchema>;
