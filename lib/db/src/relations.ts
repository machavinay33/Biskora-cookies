import { relations } from "drizzle-orm";
import { products, ingredients } from "./schema";

export const productsRelations = relations(products, ({ many }) => ({
  ingredients: many(ingredients),
}));

export const ingredientsRelations = relations(ingredients, ({ one }) => ({
  product: one(products, {
    fields: [ingredients.productId],
    references: [products.id],
  }),
}));
