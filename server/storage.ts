import { db } from "./db";
import {
  profiles, listings, rides, messages, wallSpaces, wallBookings,
  type Profile, type InsertProfile,
  type Listing, type InsertListing,
  type Ride, type InsertRide,
  type Message, type InsertMessage,
  type WallSpace, type WallBooking, type InsertWallBooking
} from "@shared/schema";
import { eq, desc, or } from "drizzle-orm";

export interface IStorage {
  // Profiles
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, profile: Partial<InsertProfile>): Promise<Profile>;

  // Listings
  getListings(): Promise<Listing[]>;
  getListing(id: number): Promise<Listing | undefined>;
  createListing(listing: InsertListing): Promise<Listing>;
  updateListing(id: number, listing: Partial<Listing>): Promise<Listing>;

  // Rides
  getRides(): Promise<Ride[]>;
  getRidesForUser(userId: string): Promise<Ride[]>;
  createRide(ride: InsertRide): Promise<Ride>;
  updateRide(id: number, ride: Partial<Ride>): Promise<Ride>;

  // Messages
  getMessages(userId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Wall Spaces
  getWallSpaces(): Promise<WallSpace[]>;
  getWallSpace(id: number): Promise<WallSpace | undefined>;
  createWallSpace(wall: Omit<WallSpace, 'id'>): Promise<WallSpace>;
  createWallBooking(booking: InsertWallBooking & { totalPrice: number }): Promise<WallBooking>;
  getWallBookingsForUser(userId: string): Promise<WallBooking[]>;
  updateWallStatus(id: number, status: string): Promise<WallSpace>;
}

export class DatabaseStorage implements IStorage {
  // Profiles
  async getProfile(userId: string): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile;
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [profile] = await db.insert(profiles).values(insertProfile).returning();
    return profile;
  }

  async updateProfile(userId: string, updates: Partial<InsertProfile>): Promise<Profile> {
    const [profile] = await db.update(profiles).set(updates).where(eq(profiles.userId, userId)).returning();
    return profile;
  }

  // Listings
  async getListings(): Promise<Listing[]> {
    return await db.select().from(listings).orderBy(desc(listings.createdAt));
  }

  async getListing(id: number): Promise<Listing | undefined> {
    const [listing] = await db.select().from(listings).where(eq(listings.id, id));
    return listing;
  }

  async createListing(insertListing: InsertListing): Promise<Listing> {
    const [listing] = await db.insert(listings).values(insertListing).returning();
    return listing;
  }

  async updateListing(id: number, updates: Partial<Listing>): Promise<Listing> {
    const [listing] = await db.update(listings).set(updates).where(eq(listings.id, id)).returning();
    return listing;
  }

  // Rides
  async getRides(): Promise<Ride[]> {
    return await db.select().from(rides).orderBy(desc(rides.createdAt));
  }

  async getRidesForUser(userId: string): Promise<Ride[]> {
    return await db.select().from(rides)
      .where(or(eq(rides.riderId, userId), eq(rides.driverId, userId)))
      .orderBy(desc(rides.createdAt));
  }

  async createRide(insertRide: InsertRide): Promise<Ride> {
    const [ride] = await db.insert(rides).values(insertRide).returning();
    return ride;
  }

  async updateRide(id: number, updates: Partial<Ride>): Promise<Ride> {
    const [ride] = await db.update(rides).set(updates).where(eq(rides.id, id)).returning();
    return ride;
  }

  // Messages
  async getMessages(userId: string): Promise<Message[]> {
    return await db.select().from(messages)
      .where(or(eq(messages.receiverId, userId), eq(messages.senderId, userId)))
      .orderBy(desc(messages.createdAt));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  // Wall Spaces
  async getWallSpaces(): Promise<WallSpace[]> {
    return await db.select().from(wallSpaces);
  }

  async getWallSpace(id: number): Promise<WallSpace | undefined> {
    const [wall] = await db.select().from(wallSpaces).where(eq(wallSpaces.id, id));
    return wall;
  }

  async createWallSpace(wall: Omit<WallSpace, 'id'>): Promise<WallSpace> {
    const [newWall] = await db.insert(wallSpaces).values(wall).returning();
    return newWall;
  }

  async createWallBooking(booking: InsertWallBooking & { totalPrice: number }): Promise<WallBooking> {
    const [newBooking] = await db.insert(wallBookings).values(booking).returning();
    return newBooking;
  }

  async getWallBookingsForUser(userId: string): Promise<WallBooking[]> {
    return await db.select().from(wallBookings)
      .where(eq(wallBookings.userId, userId))
      .orderBy(desc(wallBookings.createdAt));
  }

  async updateWallStatus(id: number, status: string): Promise<WallSpace> {
    const [wall] = await db.update(wallSpaces).set({ status }).where(eq(wallSpaces.id, id)).returning();
    return wall;
  }
}

export const storage = new DatabaseStorage();
