import express from "express";
import Order from "../models/Order.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import Cart from "../models/Cart.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { items, totalAmount } = req.body;
  try {
    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount
    });

    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $set: { items: [] } },
    );

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "items.product",
      "name price image",
    );

    if (!orders)
      return res.status(200).json({ message: "No orders yet", data: [] });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/all", auth, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "firstName lastName email userName")
      .populate("items.product", "name price image");

    if (orders.length === 0)
      return res.status(200).json({ message: "No orders yet", data: [] });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
