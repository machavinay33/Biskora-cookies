import { Router, type Request, type Response, type NextFunction } from "express";
import { db } from "@workspace/db";
import { products, ingredients, orders } from "@workspace/db";
import { eq, count, and } from "drizzle-orm";
import * as jwt from "jsonwebtoken";

const router = Router();

const ADMIN_EMAIL = "admin@biskora.com";
const ADMIN_PASSWORD = "BiskoraAdmin@2024";
const JWT_SECRET = process.env.SESSION_SECRET || "biskora-jwt-secret-2024";

// ── Auth middleware ──────────────────────────────────────────────────────────
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { email: string; role: string };
    (req as any).adminUser = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ── POST /api/admin/login ─────────────────────────────────────────────────────
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ email, role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ success: true, token });
  } catch (err) {
    req.log.error(err, "Admin login error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── POST /api/admin/logout ────────────────────────────────────────────────────
router.post("/admin/logout", (req, res) => {
  res.json({ success: true });
});

// ── GET /api/admin/me ─────────────────────────────────────────────────────────
router.get("/admin/me", requireAdmin, (req, res) => {
  const user = (req as any).adminUser;
  res.json({ email: user.email, role: user.role });
});

// ── GET /api/admin/stats ──────────────────────────────────────────────────────
router.get("/admin/stats", requireAdmin, async (req, res) => {
  try {
    const [totalOrdersRow] = await db.select({ c: count() }).from(orders);
    const [newOrdersRow] = await db
      .select({ c: count() })
      .from(orders)
      .where(eq(orders.status, "new"));
    const [totalProductsRow] = await db.select({ c: count() }).from(products);
    const [outOfStockRow] = await db
      .select({ c: count() })
      .from(ingredients)
      .where(eq(ingredients.isInStock, false));

    res.json({
      totalOrders: Number(totalOrdersRow.c),
      newOrders: Number(newOrdersRow.c),
      totalProducts: Number(totalProductsRow.c),
      outOfStockIngredients: Number(outOfStockRow.c),
    });
  } catch (err) {
    req.log.error(err, "Failed to get admin stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── GET /api/admin/products ───────────────────────────────────────────────────
router.get("/admin/products", requireAdmin, async (req, res) => {
  try {
    const rows = await db.query.products.findMany({
      with: { ingredients: true },
      orderBy: (p, { asc }) => [asc(p.name)],
    });
    res.json(rows.map((p) => ({ ...p, price: Number(p.price), highlights: (p.highlights as string[]) || [] })));
  } catch (err) {
    req.log.error(err, "Failed to admin list products");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── POST /api/admin/products ──────────────────────────────────────────────────
router.post("/admin/products", requireAdmin, async (req, res) => {
  try {
    const { name, category, description, imageUrl, highlights, isAvailable, price } = req.body;
    const [row] = await db
      .insert(products)
      .values({ name, category, description, imageUrl: imageUrl || "", highlights: highlights || [], isAvailable: isAvailable ?? true, price: String(price || 0) })
      .returning();
    res.status(201).json({ ...row, price: Number(row.price), highlights: (row.highlights as string[]) || [] });
  } catch (err) {
    req.log.error(err, "Failed to create product");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── PUT /api/admin/products/:id ───────────────────────────────────────────────
router.put("/admin/products/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, category, description, imageUrl, highlights, isAvailable, price } = req.body;
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (highlights !== undefined) updateData.highlights = highlights;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
    if (price !== undefined) updateData.price = String(price);
    updateData.updatedAt = new Date();

    const [row] = await db.update(products).set(updateData).where(eq(products.id, id)).returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json({ ...row, price: Number(row.price), highlights: (row.highlights as string[]) || [] });
  } catch (err) {
    req.log.error(err, "Failed to update product");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── DELETE /api/admin/products/:id ───────────────────────────────────────────
router.delete("/admin/products/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(products).where(eq(products.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err, "Failed to delete product");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── GET /api/admin/ingredients ────────────────────────────────────────────────
router.get("/admin/ingredients", requireAdmin, async (req, res) => {
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

// ── POST /api/admin/ingredients ───────────────────────────────────────────────
router.post("/admin/ingredients", requireAdmin, async (req, res) => {
  try {
    const { productId, name, isInStock } = req.body;
    const [row] = await db
      .insert(ingredients)
      .values({ productId: Number(productId), name, isInStock: isInStock ?? true })
      .returning();
    res.status(201).json(row);
  } catch (err) {
    req.log.error(err, "Failed to create ingredient");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── PUT /api/admin/ingredients/:id ────────────────────────────────────────────
router.put("/admin/ingredients/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, isInStock } = req.body;
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name;
    if (isInStock !== undefined) updateData.isInStock = isInStock;

    const [row] = await db.update(ingredients).set(updateData).where(eq(ingredients.id, id)).returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) {
    req.log.error(err, "Failed to update ingredient");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── DELETE /api/admin/ingredients/:id ────────────────────────────────────────
router.delete("/admin/ingredients/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(ingredients).where(eq(ingredients.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.error(err, "Failed to delete ingredient");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── GET /api/admin/orders ─────────────────────────────────────────────────────
router.get("/admin/orders", requireAdmin, async (req, res) => {
  try {
    const rows = await db.query.orders.findMany({
      orderBy: (o, { desc }) => [desc(o.createdAt)],
    });
    res.json(rows);
  } catch (err) {
    req.log.error(err, "Failed to list orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── PUT /api/admin/orders/:id ─────────────────────────────────────────────────
router.put("/admin/orders/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body as { status: "new" | "read" | "responded" | "completed" };
    const [row] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (err) {
    req.log.error(err, "Failed to update order");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
