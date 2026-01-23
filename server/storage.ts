import { db } from "./db";
import {
  profiles, listings, rides, messages, wallSpaces, wallBookings,
  vehicles, classGroups, classGroupMembers, groupMessages, scholarships,
  type Profile, type InsertProfile,
  type Listing, type InsertListing,
  type Ride, type InsertRide,
  type Message, type InsertMessage,
  type WallSpace, type WallBooking, type InsertWallBooking,
  type Vehicle, type InsertVehicle,
  type ClassGroup, type InsertClassGroup, type ClassGroupMember,
  type GroupMessage, type InsertGroupMessage,
  type Scholarship, type InsertScholarship
} from "@shared/schema";
import { eq, desc, or, and, inArray } from "drizzle-orm";

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

  // Vehicles
  getVehicles(): Promise<Vehicle[]>;
  getVehiclesForUser(userId: string): Promise<Vehicle[]>;
  getAvailableVehicles(): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicleAvailability(id: number, ownerId: string, available: boolean): Promise<Vehicle>;

  // Class Groups
  getClassGroups(): Promise<ClassGroup[]>;
  getClassGroup(classId: string): Promise<ClassGroup | undefined>;
  getClassGroupById(id: number): Promise<ClassGroup | undefined>;
  createClassGroup(group: InsertClassGroup): Promise<ClassGroup>;
  joinClassGroup(groupId: number, userId: string): Promise<ClassGroupMember>;
  getUserClassGroups(userId: string): Promise<ClassGroup[]>;
  getClassGroupMembership(groupId: number, userId: string): Promise<ClassGroupMember | undefined>;
  getGroupMessages(groupId: number): Promise<GroupMessage[]>;
  createGroupMessage(message: InsertGroupMessage): Promise<GroupMessage>;

  // Scholarships
  getScholarships(): Promise<Scholarship[]>;
  getScholarship(id: number): Promise<Scholarship | undefined>;
  createScholarship(scholarship: InsertScholarship): Promise<Scholarship>;
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

  // Vehicles
  async getVehicles(): Promise<Vehicle[]> {
    return await db.select().from(vehicles).orderBy(desc(vehicles.createdAt));
  }

  async getVehiclesForUser(userId: string): Promise<Vehicle[]> {
    return await db.select().from(vehicles).where(eq(vehicles.ownerId, userId));
  }

  async getAvailableVehicles(): Promise<Vehicle[]> {
    return await db.select().from(vehicles).where(eq(vehicles.available, true));
  }

  async createVehicle(insertVehicle: InsertVehicle): Promise<Vehicle> {
    const [vehicle] = await db.insert(vehicles).values(insertVehicle).returning();
    return vehicle;
  }

  async updateVehicleAvailability(id: number, ownerId: string, available: boolean): Promise<Vehicle> {
    const [vehicle] = await db.update(vehicles)
      .set({ available })
      .where(and(eq(vehicles.id, id), eq(vehicles.ownerId, ownerId)))
      .returning();
    return vehicle;
  }

  // Class Groups
  async getClassGroups(): Promise<ClassGroup[]> {
    return await db.select().from(classGroups);
  }

  async getClassGroup(classId: string): Promise<ClassGroup | undefined> {
    const [group] = await db.select().from(classGroups).where(eq(classGroups.classId, classId));
    return group;
  }

  async getClassGroupById(id: number): Promise<ClassGroup | undefined> {
    const [group] = await db.select().from(classGroups).where(eq(classGroups.id, id));
    return group;
  }

  async createClassGroup(insertGroup: InsertClassGroup): Promise<ClassGroup> {
    const [group] = await db.insert(classGroups).values(insertGroup).returning();
    return group;
  }

  async joinClassGroup(groupId: number, userId: string): Promise<ClassGroupMember> {
    const [member] = await db.insert(classGroupMembers).values({ groupId, userId }).returning();
    return member;
  }

  async getUserClassGroups(userId: string): Promise<ClassGroup[]> {
    const memberships = await db.select().from(classGroupMembers).where(eq(classGroupMembers.userId, userId));
    if (memberships.length === 0) return [];
    const groupIds = memberships.map(m => m.groupId);
    return await db.select().from(classGroups).where(inArray(classGroups.id, groupIds));
  }

  async getClassGroupMembership(groupId: number, userId: string): Promise<ClassGroupMember | undefined> {
    const [member] = await db.select().from(classGroupMembers)
      .where(and(eq(classGroupMembers.groupId, groupId), eq(classGroupMembers.userId, userId)));
    return member;
  }

  async getGroupMessages(groupId: number): Promise<GroupMessage[]> {
    return await db.select().from(groupMessages)
      .where(eq(groupMessages.groupId, groupId))
      .orderBy(desc(groupMessages.createdAt));
  }

  async createGroupMessage(insertMessage: InsertGroupMessage): Promise<GroupMessage> {
    const [message] = await db.insert(groupMessages).values(insertMessage).returning();
    return message;
  }

  // Scholarships
  async getScholarships(): Promise<Scholarship[]> {
    return await db.select().from(scholarships);
  }

  async getScholarship(id: number): Promise<Scholarship | undefined> {
    const [scholarship] = await db.select().from(scholarships).where(eq(scholarships.id, id));
    return scholarship;
  }

  async createScholarship(insertScholarship: InsertScholarship): Promise<Scholarship> {
    const [scholarship] = await db.insert(scholarships).values(insertScholarship).returning();
    return scholarship;
  }
}

export const storage = new DatabaseStorage();
