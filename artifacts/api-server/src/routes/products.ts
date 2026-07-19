import { Router } from "express";
import { db } from "@workspace/db";
import { products, ingredients } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// GET /api/products
router.get("/products", async (req, res) => {
  try {
    const { category } = req.query as { category?: string };
    const rows = await db.query.products.findMany({
      where: category ? eq(products.category, category) : undefined,
      with: { ingredients: true },
      orderBy: (p, { asc }) => [asc(p.name)],
    });
    const mapped = rows.map((p) => ({
      ...p,
      price: Number(p.price),
      highlights: (p.highlights as string[]) || [],
    }));
    res.json(mapped);
  } catch (err) {
    req.log.error(err, "Failed to list products");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/products/:id
router.get("/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const row = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: { ingredients: true },
    });
    if (!row) return res.status(404).json({ error: "Not found" });

    res.json({ ...row, price: Number(row.price), highlights: (row.highlights as string[]) || [] });
  } catch (err) {
    req.log.error(err, "Failed to get product");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/ingredients
router.get("/ingredients", async (req, res) => {
  try {
    const rows = await db.query.ingredients.findMany({
      orderBy: (i, { asc }) => [asc(i.productId), asc(i.name)],
    });
    res.json(rows);
  } catch (err) {
    req.log.error(err, "Failed to list ingredients");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
