import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and, desc, asc, ilike, sql } from "drizzle-orm";
import { 
  users, 
  admins, 
  locations, 
  properties, 
  inquiries, 
  contact_settings,
  type User, 
  type InsertUser,
  type Admin,
  type InsertAdmin,
  type Location,
  type InsertLocation,
  type Property,
  type InsertProperty,
  type Inquiry,
  type InsertInquiry,
  type ContactSettings,
  type InsertContactSettings
} from "@shared/schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

const client = neon(databaseUrl);
export const db = drizzle(client);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Admins
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  
  // Locations
  getLocations(): Promise<Location[]>;
  getActiveLocations(): Promise<Location[]>;
  getLocationById(id: string): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
  updateLocation(id: string, location: Partial<InsertLocation>): Promise<Location>;
  deleteLocation(id: string): Promise<void>;
  
  // Properties
  getProperties(filters?: {
    location?: string;
    propertyType?: string;
    priceType?: string;
    bedrooms?: number;
    bathrooms?: number;
    priceMin?: number;
    priceMax?: number;
  }): Promise<Property[]>;
  getProperty(id: string): Promise<Property | undefined>;
  getFeaturedProperties(): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property>;
  deleteProperty(id: string): Promise<void>;
  
  // Inquiries
  getInquiries(): Promise<Inquiry[]>;
  getInquiry(id: string): Promise<Inquiry | undefined>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiryStatus(id: string, status: string): Promise<Inquiry>;
  
  // Contact Settings
  getContactSettings(): Promise<ContactSettings | undefined>;
  updateContactSettings(settings: Partial<InsertContactSettings>): Promise<ContactSettings>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Admins
  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    const result = await db.select().from(admins).where(eq(admins.email, email));
    return result[0];
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const result = await db.insert(admins).values(admin).returning();
    return result[0];
  }

  // Locations
  async getLocations(): Promise<Location[]> {
    return await db.select().from(locations).orderBy(asc(locations.name));
  }

  async getActiveLocations(): Promise<Location[]> {
    return await db.select().from(locations).where(eq(locations.is_active, true)).orderBy(asc(locations.name));
  }

  async getLocationById(id: string): Promise<Location | undefined> {
    const result = await db.select().from(locations).where(eq(locations.id, id));
    return result[0];
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    const result = await db.insert(locations).values({
      ...location,
      created_at: sql`now()`,
      updated_at: sql`now()`
    }).returning();
    return result[0];
  }

  async updateLocation(id: string, location: Partial<InsertLocation>): Promise<Location> {
    const result = await db.update(locations)
      .set({
        ...location,
        updated_at: sql`now()`
      })
      .where(eq(locations.id, id))
      .returning();
    return result[0];
  }

  async deleteLocation(id: string): Promise<void> {
    await db.delete(locations).where(eq(locations.id, id));
  }

  // Properties
  async getProperties(filters?: {
    location?: string;
    propertyType?: string;
    priceType?: string;
    bedrooms?: number;
    bathrooms?: number;
    priceMin?: number;
    priceMax?: number;
  }): Promise<Property[]> {
    let query = db.select().from(properties).where(eq(properties.is_active, true));
    
    if (filters) {
      const conditions = [eq(properties.is_active, true)];
      
      if (filters.location) {
        conditions.push(ilike(properties.location, `%${filters.location}%`));
      }
      if (filters.propertyType) {
        conditions.push(eq(properties.property_type, filters.propertyType));
      }
      if (filters.priceType) {
        conditions.push(eq(properties.price_type, filters.priceType));
      }
      if (filters.bedrooms) {
        conditions.push(eq(properties.bedrooms, filters.bedrooms));
      }
      if (filters.bathrooms) {
        conditions.push(eq(properties.bathrooms, filters.bathrooms));
      }
      if (filters.priceMin) {
        conditions.push(sql`${properties.price} >= ${filters.priceMin}`);
      }
      if (filters.priceMax) {
        conditions.push(sql`${properties.price} <= ${filters.priceMax}`);
      }
      
      query = db.select().from(properties).where(and(...conditions));
    }
    
    return await query.orderBy(desc(properties.created_at));
  }

  async getProperty(id: string): Promise<Property | undefined> {
    const result = await db.select().from(properties).where(eq(properties.id, id));
    return result[0];
  }

  async getFeaturedProperties(): Promise<Property[]> {
    return await db.select().from(properties)
      .where(and(eq(properties.is_active, true), eq(properties.is_featured, true)))
      .orderBy(desc(properties.created_at));
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const result = await db.insert(properties).values({
      ...property,
      created_at: sql`now()`,
      updated_at: sql`now()`
    }).returning();
    return result[0];
  }

  async updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property> {
    const result = await db.update(properties)
      .set({
        ...property,
        updated_at: sql`now()`
      })
      .where(eq(properties.id, id))
      .returning();
    return result[0];
  }

  async deleteProperty(id: string): Promise<void> {
    await db.delete(properties).where(eq(properties.id, id));
  }

  // Inquiries
  async getInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries).orderBy(desc(inquiries.created_at));
  }

  async getInquiry(id: string): Promise<Inquiry | undefined> {
    const result = await db.select().from(inquiries).where(eq(inquiries.id, id));
    return result[0];
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const result = await db.insert(inquiries).values({
      ...inquiry,
      created_at: sql`now()`
    }).returning();
    return result[0];
  }

  async updateInquiryStatus(id: string, status: string): Promise<Inquiry> {
    const result = await db.update(inquiries)
      .set({ status })
      .where(eq(inquiries.id, id))
      .returning();
    return result[0];
  }

  // Contact Settings
  async getContactSettings(): Promise<ContactSettings | undefined> {
    const result = await db.select().from(contact_settings).limit(1);
    return result[0];
  }

  async updateContactSettings(settings: Partial<InsertContactSettings>): Promise<ContactSettings> {
    // First try to update existing settings
    const existing = await this.getContactSettings();
    
    if (existing) {
      const result = await db.update(contact_settings)
        .set({
          ...settings,
          updated_at: sql`now()`
        })
        .where(eq(contact_settings.id, existing.id))
        .returning();
      return result[0];
    } else {
      // Create new settings if none exist
      const result = await db.insert(contact_settings).values({
        ...settings,
        created_at: sql`now()`,
        updated_at: sql`now()`
      }).returning();
      return result[0];
    }
  }
}

export const storage = new DatabaseStorage();
