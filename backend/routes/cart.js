import express from "express";
import Cart from "../models/Cart.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product",
      "name price image",
    );

    if (!cart)
      return res.status(200).json({ message: "No product yet", data: [] });

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  const { product, quantity } = req.body;

  try {
    // 1. Find existing cart for the user
    let cart = await Cart.findOne({ user: req.user.id });

    if (cart) {
      // 2. Check if product already exists in the cart array
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === product,
      );

      if (itemIndex > -1) {
        // Product exists, increment quantity
        cart.items[itemIndex].quantity += quantity || 1;
      } else {
        // Product does not exist, push to array
        cart.items.push({ product, quantity: quantity || 1 });
      }

      await cart.save();
      return res.status(200).json(cart);
    } else {
      // 3. No cart exists, create a brand new one
      const newCart = await Cart.create({
        user: req.user.id,
        items: [{ product, quantity: quantity || 1 }],
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/:id", auth, async (req, res) => {
  const { product, quantity } = req.body; // Expects product ID and new exact quantity

  try {
    const updatedCart = await Cart.findOneAndUpdate(
      {
        user: req.user.id,
        "items.product": product, // Matches the cart and the specific item inside the array
      },
      {
        $set: { "items.$.quantity": quantity }, // The '$' represents the matched item's index
      },
      { new: true, runValidators: true },
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart or Product not found" });
    }

    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { items: { product: req.params.id } } },
      { new: true },
    );

    if (!updatedCart)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
