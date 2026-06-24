export * from "./models/auth.js";

import { pgTable, text, numeric, boolean, timestamp, uuid } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  price: numeric("price").notNull().default("0"),
  category: text("category").notNull().default("laptop"),
  processor: text("processor"),
  ram: text("ram"),
  storage: text("storage"),
  condition: text("condition").default("used"),
  description: text("description"),
  images: text("images").array().notNull().default([]),
  status: text("status").notNull().default("available"),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
