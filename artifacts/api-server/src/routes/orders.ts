import { Router } from "express";
import { db } from "@workspace/db";
import { orders } from "@workspace/db";

const router = Router();

// POST /api/orders
router.post("/orders", async (req, res) => {
  try {
    const { name, email, phone, message, orderType } = req.body as {
      name: string;
      email: string;
      phone: string;
      message: string;
      orderType: string;
    };

    if (!name || !email || !phone || !message || !orderType) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const [order] = await db
      .insert(orders)
      .values({ name, email, phone, message, orderType })
      .returning();

    res.status(201).json(order);
  } catch (err) {
    req.log.error(err, "Failed to create order");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
