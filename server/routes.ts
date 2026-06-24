import type { Express, Request, Response } from "express";
import { storage } from "./storage.js";
import { isAuthenticated } from "./replit_integrations/auth/index.js";
import { ObjectStorageService } from "./replit_integrations/object_storage/index.js";
import multer from "multer";

const objectStorage = new ObjectStorageService();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

export function registerRoutes(app: Express) {
  // ─── Public product routes ────────────────────────────────────────────────

  app.get("/api/products", async (_req, res) => {
    try {
      const data = await storage.getAvailableProducts();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (_req, res) => {
    try {
      const data = await storage.getFeaturedProducts();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/recent", async (_req, res) => {
    try {
      const all = await storage.getProducts();
      res.json(all.slice(0, 4));
    } catch (e) {
      res.status(500).json({ message: "Failed to fetch recent products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) return res.status(404).json({ message: "Not found" });
      res.json(product);
    } catch (e) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get("/api/products/:id/related", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) return res.status(404).json({ message: "Not found" });
      const related = await storage.getRelatedProducts(product.category, product.id);
      res.json(related);
    } catch (e) {
      res.status(500).json({ message: "Failed to fetch related products" });
    }
  });

  // ─── Admin product routes (protected) ────────────────────────────────────

  app.get("/api/admin/products", isAuthenticated, async (_req, res) => {
    try {
      const data = await storage.getProducts();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/admin/stats", isAuthenticated, async (_req, res) => {
    try {
      const stats = await storage.getProductStats();
      res.json(stats);
    } catch (e) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.post("/api/admin/products", isAuthenticated, async (req, res) => {
    try {
      const product = await storage.createProduct(req.body);
      res.status(201).json(product);
    } catch (e) {
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.patch("/api/admin/products/:id", isAuthenticated, async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      res.json(product);
    } catch (e: any) {
      if (e.message === "Product not found") return res.status(404).json({ message: "Not found" });
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // ─── Image upload (admin only, stores via Object Storage) ────────────────

  app.post("/api/admin/upload", isAuthenticated, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "No file provided" });

      const { bucket } = await import("@google-cloud/storage").then(
        () => ({ bucket: objectStorage })
      );

      const uploadUrl = await objectStorage.getObjectEntityUploadURL();
      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: req.file.buffer,
        headers: { "Content-Type": req.file.mimetype },
      });

      if (!response.ok) throw new Error("Failed to store file");

      const objectPath = objectStorage.normalizeObjectEntityPath(uploadUrl);
      const publicUrl = `${req.protocol}://${req.hostname}${objectPath}`;
      res.json({ url: publicUrl, objectPath });
    } catch (e) {
      console.error("Upload error:", e);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });
}
