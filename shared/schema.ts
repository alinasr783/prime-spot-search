import { pgTable, text, serial, integer, boolean, uuid, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  password: text("password"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const locations = pgTable("locations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  governorate: text("governorate").notNull(),
  image_url: text("image_url"),
  is_active: boolean("is_active").notNull().default(true),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  price_type: text("price_type").default("للبيع"),
  property_type: text("property_type").notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  area: decimal("area", { precision: 8, scale: 2 }),
  parking: integer("parking"),
  images: text("images").array().notNull(),
  features: text("features").array(),
  amenities: text("amenities").array(),
  agent_name: text("agent_name"),
  agent_phone: text("agent_phone"),
  agent_email: text("agent_email"),
  agent_image: text("agent_image"),
  is_featured: boolean("is_featured").default(false),
  is_active: boolean("is_active").default(true),
  special_type: text("special_type").default("عادي"),
  floor_number: text("floor_number"),
  build_year: integer("build_year"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  message: text("message").notNull(),
  property_id: uuid("property_id").references(() => properties.id),
  inquiry_type: text("inquiry_type"),
  status: text("status").default("جديد"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const contact_settings = pgTable("contact_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  phone: text("phone"),
  email: text("email"),
  facebook_url: text("facebook_url"),
  instagram_url: text("instagram_url"),
  twitter_url: text("twitter_url"),
  linkedin_url: text("linkedin_url"),
  youtube_url: text("youtube_url"),
  whatsapp_number: text("whatsapp_number"),
  address: text("address"),
  company_name: text("company_name").notNull().default("شركة إنسباير العقارية"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  created_at: true,
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  created_at: true,
});

export const insertContactSettingsSchema = createInsertSchema(contact_settings).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;

export type InsertContactSettings = z.infer<typeof insertContactSettingsSchema>;
export type ContactSettings = typeof contact_settings.$inferSelect;
