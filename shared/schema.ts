import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations, sql } from "drizzle-orm";

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  displayName: text("display_name"),
  email: text("email"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  trustScore: integer("trust_score").default(100),
  isDriver: boolean("is_driver").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // In cents
  condition: text("condition").notNull(),
  category: text("category").notNull(), // Textbook, Dorm, Electronics, etc.
  imageUrls: text("image_urls").array().notNull(),
  status: text("status").default("active"), // active, sold
  createdAt: timestamp("created_at").defaultNow(),
});

export const rides = pgTable("rides", {
  id: serial("id").primaryKey(),
  riderId: integer("rider_id").notNull(),
  driverId: integer("driver_id"),
  pickupLocation: text("pickup_location").notNull(),
  dropoffLocation: text("dropoff_location").notNull(),
  status: text("status").default("requested"), // requested, accepted, completed, cancelled
  price: integer("price").notNull(), // In cents
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull(),
  receiverId: integer("receiver_id").notNull(),
  content: text("content").notNull(),
  listingId: integer("listing_id"),
  rideId: integer("ride_id"),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  listings: many(listings),
  ridesAsRider: many(rides, { relationName: "rider" }),
  ridesAsDriver: many(rides, { relationName: "driver" }),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
}));

export const listingsRelations = relations(listings, ({ one }) => ({
  seller: one(users, {
    fields: [listings.sellerId],
    references: [users.id],
  }),
}));

export const ridesRelations = relations(rides, ({ one }) => ({
  rider: one(users, {
    fields: [rides.riderId],
    references: [users.id],
    relationName: "rider",
  }),
  driver: one(users, {
    fields: [rides.driverId],
    references: [users.id],
    relationName: "driver",
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receiver",
  }),
  listing: one(listings, {
    fields: [messages.listingId],
    references: [listings.id],
  }),
  ride: one(rides, {
    fields: [messages.rideId],
    references: [rides.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, trustScore: true, createdAt: true });
export const insertListingSchema = createInsertSchema(listings).omit({ id: true, createdAt: true, status: true });
export const insertRideSchema = createInsertSchema(rides).omit({ id: true, createdAt: true, status: true, driverId: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true, read: true });

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Listing = typeof listings.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Ride = typeof rides.$inferSelect;
export type InsertRide = z.infer<typeof insertRideSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
