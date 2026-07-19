import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  numeric,
  pgEnum,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// ── Enums ────────────────────────────────────────────────────────────────────
export const orderStatusEnum = pgEnum("order_status", [
  "new",
  "read",
  "responded",
  "completed",
]);

// ── Products ─────────────────────────────────────────────────────────────────
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull().default(""),
  highlights: jsonb("highlights").$type<string[]>().notNull().default([]),
  isAvailable: boolean("is_available").notNull().default(true),
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// ── Ingredients ───────────────────────────────────────────────────────────────
export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  productId: serial("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  isInStock: boolean("is_in_stock").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertIngredientSchema = createInsertSchema(ingredients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertIngredient = z.infer<typeof insertIngredientSchema>;
export type Ingredient = typeof ingredients.$inferSelect;

// ── Orders ────────────────────────────────────────────────────────────────────
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  message: text("message").notNull(),
  orderType: varchar("order_type", { length: 100 }).notNull(),
  status: orderStatusEnum("status").notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
