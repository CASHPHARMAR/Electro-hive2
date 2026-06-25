import type { Express, Request, Response } from "express";
import { storage } from "./storage.js";
import { isAdminAuthenticated } from "./adminAuth.js";

const cors = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
};

function setCors(res: Response) {
  for (const [k, v] of Object.entries(cors)) {
    res.setHeader(k, v);
  }
}

export function registerRoutes(app: Express) {
  // CORS preflight
  app.use("/api", (req, res, next) => {
    setCors(res);
    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }
    next();
  });

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

  app.get("/api/admin/products", isAdminAuthenticated, async (_req, res) => {
    try {
      const data = await storage.getProducts();
      res.json(data);
    } catch (e) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/admin/stats", isAdminAuthenticated, async (_req, res) => {
    try {
      const stats = await storage.getProductStats();
      res.json(stats);
    } catch (e) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.post("/api/admin/products", isAdminAuthenticated, async (req, res) => {
    try {
      const product = await storage.createProduct(req.body);
      res.status(201).json(product);
    } catch (e) {
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.patch("/api/admin/products/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      res.json(product);
    } catch (e: any) {
      if (e.message === "Product not found") return res.status(404).json({ message: "Not found" });
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", isAdminAuthenticated, async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // ─── Image upload (base64, works on serverless) ───────────────────────

  app.post("/api/admin/upload", isAdminAuthenticated, async (req, res) => {
    try {
      const { base64, name } = req.body ?? {};
      if (!base64 || !name) {
        return res.status(400).json({ message: "base64 and name required" });
      }
      const ext = name.split(".").pop() || "jpg";
      const dataUrl = `data:image/${ext === "png" ? "png" : "jpeg"};base64,${base64}`;
      res.json({ url: dataUrl });
    } catch (e) {
      console.error("Upload error:", e);
      res.status(500).json({ message: "Failed to process image" });
    }
  });
}
