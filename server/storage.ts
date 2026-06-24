import { db } from "./db.js";
import { products, type Product, type InsertProduct } from "../shared/schema.js";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getAvailableProducts(): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getRelatedProducts(category: string, excludeId: string): Promise<Product[]>;
  createProduct(data: InsertProduct): Promise<Product>;
  updateProduct(id: string, data: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  getProductStats(): Promise<{ total: number; available: number; sold: number }>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(): Promise<Product[]> {
    return db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getAvailableProducts(): Promise<Product[]> {
    return db.select().from(products)
      .where(eq(products.status, "available"))
      .orderBy(desc(products.createdAt));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const { and } = await import("drizzle-orm");
    return db.select().from(products)
      .where(and(eq(products.featured, true), eq(products.status, "available")))
      .orderBy(desc(products.createdAt))
      .limit(8);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return db.select().from(products)
      .where(eq(products.category, category))
      .orderBy(desc(products.createdAt));
  }

  async getRelatedProducts(category: string, excludeId: string): Promise<Product[]> {
    const { and, ne } = await import("drizzle-orm");
    return db.select().from(products)
      .where(and(eq(products.category, category), eq(products.status, "available"), ne(products.id, excludeId)))
      .orderBy(desc(products.createdAt))
      .limit(4);
  }

  async createProduct(data: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(data).returning();
    return product;
  }

  async updateProduct(id: string, data: Partial<InsertProduct>): Promise<Product> {
    const [product] = await db.update(products).set(data).where(eq(products.id, id)).returning();
    if (!product) throw new Error("Product not found");
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async getProductStats(): Promise<{ total: number; available: number; sold: number }> {
    const all = await db.select({ status: products.status }).from(products);
    return {
      total: all.length,
      available: all.filter((p) => p.status === "available").length,
      sold: all.filter((p) => p.status === "sold").length,
    };
  }
}

export const storage = new DatabaseStorage();
