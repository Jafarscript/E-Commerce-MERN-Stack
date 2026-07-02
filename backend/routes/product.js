import express from "express";
import Product from "../models/Product.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = {};

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
    }

    const products = await Product.find(query);

    if (products.length === 0)
      return res.status(200).json({ message: "No products yet", data: [] });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", auth, admin, async (req, res) => {
  const { name, description, price, category, image, stock } = req.body;

  try {
    const product = await Product.create({
        name,
        description,
        price,
        category,
        image,
        stock,
        createdBy: req.user.id
    })

    res.status(201).json(product)
  } catch (error) {
    res.status(400).json({error : error.message})
  }
});

router.patch("/:id", auth, admin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, 
            {$set : req.body},
            { new: true, runValidators: true }
        );

        if (!updatedProduct) return res.status(404).json({message: "Product not found"});

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

router.delete("/:id", auth, admin, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if(!deletedProduct) return res.status(404).json({message: "Product not found"});

        res.status(200).json({message: "Product deleted successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

export default router;
