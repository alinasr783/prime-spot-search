import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { 
  insertAdminSchema, 
  insertLocationSchema, 
  insertPropertySchema, 
  insertInquirySchema, 
  insertContactSettingsSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const admin = await storage.getAdminByEmail(email);
      if (!admin || !admin.password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Return admin data without password
      const { password: _, ...adminData } = admin;
      res.json({ success: true, admin: adminData });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Locations
  app.get("/api/locations", async (req, res) => {
    try {
      const locations = await storage.getActiveLocations();
      res.json(locations);
    } catch (error) {
      console.error("Get locations error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/locations", async (req, res) => {
    try {
      const locations = await storage.getLocations();
      res.json(locations);
    } catch (error) {
      console.error("Get admin locations error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/locations", async (req, res) => {
    try {
      const locationData = insertLocationSchema.parse(req.body);
      const location = await storage.createLocation(locationData);
      res.status(201).json(location);
    } catch (error) {
      console.error("Create location error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/admin/locations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const locationData = insertLocationSchema.partial().parse(req.body);
      const location = await storage.updateLocation(id, locationData);
      res.json(location);
    } catch (error) {
      console.error("Update location error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/admin/locations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteLocation(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete location error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Properties
  app.get("/api/properties", async (req, res) => {
    try {
      const filters = {
        location: req.query.location as string,
        propertyType: req.query.propertyType as string,
        priceType: req.query.priceType as string,
        bedrooms: req.query.bedrooms ? parseInt(req.query.bedrooms as string) : undefined,
        bathrooms: req.query.bathrooms ? parseInt(req.query.bathrooms as string) : undefined,
        priceMin: req.query.priceMin ? parseFloat(req.query.priceMin as string) : undefined,
        priceMax: req.query.priceMax ? parseFloat(req.query.priceMax as string) : undefined,
      };

      const properties = await storage.getProperties(filters);
      res.json(properties);
    } catch (error) {
      console.error("Get properties error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/properties/featured", async (req, res) => {
    try {
      const properties = await storage.getFeaturedProperties();
      res.json(properties);
    } catch (error) {
      console.error("Get featured properties error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const property = await storage.getProperty(id);
      
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      
      res.json(property);
    } catch (error) {
      console.error("Get property error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/properties", async (req, res) => {
    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(propertyData);
      res.status(201).json(property);
    } catch (error) {
      console.error("Create property error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/admin/properties/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const propertyData = insertPropertySchema.partial().parse(req.body);
      const property = await storage.updateProperty(id, propertyData);
      res.json(property);
    } catch (error) {
      console.error("Update property error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/admin/properties/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteProperty(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete property error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Inquiries
  app.post("/api/inquiries", async (req, res) => {
    try {
      const inquiryData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(inquiryData);
      res.status(201).json(inquiry);
    } catch (error) {
      console.error("Create inquiry error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getInquiries();
      res.json(inquiries);
    } catch (error) {
      console.error("Get inquiries error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/admin/inquiries/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const inquiry = await storage.updateInquiryStatus(id, status);
      res.json(inquiry);
    } catch (error) {
      console.error("Update inquiry status error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Contact Settings
  app.get("/api/contact-settings", async (req, res) => {
    try {
      const settings = await storage.getContactSettings();
      res.json(settings || {});
    } catch (error) {
      console.error("Get contact settings error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/admin/contact-settings", async (req, res) => {
    try {
      const settingsData = insertContactSettingsSchema.parse(req.body);
      const settings = await storage.updateContactSettings(settingsData);
      res.json(settings);
    } catch (error) {
      console.error("Update contact settings error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Dashboard stats
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const [properties, inquiries, locations] = await Promise.all([
        storage.getProperties(),
        storage.getInquiries(),
        storage.getLocations(),
      ]);

      const featuredProperties = properties.filter(p => p.is_featured);
      const newInquiries = inquiries.filter(i => i.status === 'جديد');

      res.json({
        totalProperties: properties.length,
        featuredProperties: featuredProperties.length,
        newInquiries: newInquiries.length,
        totalLocations: locations.length,
      });
    } catch (error) {
      console.error("Get admin stats error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
