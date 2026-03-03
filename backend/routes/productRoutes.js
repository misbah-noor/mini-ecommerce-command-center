const express = require("express");
const Product = require("../models/Product");

const upload = require("../middleware/upload");
const { isAdmin } = require("../middleware/authmiddleware");

const router = express.Router();

/*
====================================
GET PRODUCTS (Public)
====================================
*/
router.get("/products", async (req, res) => {
  try {

    const { search } = req.query;

    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } }
        ]
      };
    }

    const products = await Product.find(query);

    res.json(products);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/*
====================================
ADMIN ADD PRODUCT (Protected)
====================================
*/
router.post("/products", isAdmin, upload.single("image"), async (req, res) => {

  try {

    const { name, price, category, A, B, C } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image required" });
    }

    const product = new Product({
      name,
      price: Number(price),
      category,
      image: req.file.path,
      warehouses: {
        A: Number(A) || 0,
        B: Number(B) || 0,
        C: Number(C) || 0
      }
    });

    await product.save();

    res.status(201).json(product);

    console.log("Product created:", product.name);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Product upload failed" });
  }

});

/*
====================================
ADMIN DELETE PRODUCT (Protected)
====================================
*/
router.delete("/products/:id", isAdmin, async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });

    console.log("Product deleted:", product.name);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Delete failed" });
  }
});


console.log("Product route loaded");

module.exports = router;