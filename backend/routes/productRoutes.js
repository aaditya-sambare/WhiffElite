const express = require("express");
const Product = require("../models/product");
const Store = require("../models/Store");
const mongoose = require("mongoose");

const { protect, protectStoreOwner } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

const router = express.Router();

// @route   POST /api/products
// @desc    Create a new product
// @access  Private/Admin
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      store,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user._id,
      store,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Product Create Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

//@route PUT /api/products/:id
//@desc Update an existing product by ID
//@access Private/Admin
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      store,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.discountPrice = discountPrice || product.discountPrice;
    product.countInStock = countInStock || product.countInStock;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.sizes = sizes || product.sizes;
    product.colors = colors || product.colors;
    product.collections = collections || product.collections;
    product.material = material || product.material;
    product.gender = gender || product.gender;
    product.images = images || product.images;
    product.isFeatured =
      isFeatured !== undefined ? isFeatured : product.isFeatured;
    product.isPublished =
      isPublished !== undefined ? isPublished : product.isPublished;
    product.tags = tags || product.tags;
    product.dimensions = dimensions || product.dimensions;
    product.weight = weight || product.weight;
    product.sku = sku || product.sku;
    product.store = store || product.store;

    //updates product
    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Product Update Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

//@route DELETE /api/products/:id
//@desc Delete product by id
//@access private/admin

router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    //find the product by id
    const product = await Product.findById(req.params.id);

    if (product) {
      //remove the product
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Prodcut not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
});

//@route GET /api/products
//@desc Get all products with optional query filters
//@access Public

router.get("/", async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;

    let query = {};

    if (collection && collection.toLowerCase() !== "all") {
      query.collections = collection;
    }

    if (category && category.toLowerCase() !== "all") {
      query.category = category;
    }

    if (size) {
      query.sizes = { $in: size.split(",") };
    }

    if (color) {
      query.colors = { $in: [color] };
    }

    if (gender && gender.toLowerCase() !== "all") {
      query.gender = gender;
    }

    if (material) {
      query.material = { $in: material.split(",") };
    }

    if (brand) {
      query.brand = { $in: brand.split(",") };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          break;
      }
    }

    const limitVal = Number(limit) || 50;

    const products = await Product.find(query).sort(sort).limit(limitVal);

    res.status(200).json(products);
  } catch (error) {
    console.error("Fetch Products Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/products/store/:storeId
// @desc    Get all products for a specific store
// @access  Public (or protect if needed)
router.get("/store/:storeId", async (req, res) => {
  try {
    const products = await Product.find({ store: req.params.storeId });
    res.status(200).json(products);
  } catch (error) {
    console.error("Fetch Products By Store Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a product (Store Owner)
router.post("/store/:storeId", protectStoreOwner, async (req, res) => {
  try {
    const { storeId } = req.params;
    const store = await Store.findById(storeId);

    if (!store) return res.status(404).json({ message: "Store not found" });

    // Only allow the owner of the store to add products
    if (store.storeOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const product = new Product({
      ...req.body,
      store: storeId,
      user: req.user._id,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Add Product Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Edit a product (Store Owner)
router.put("/store/:storeId/:productId", protectStoreOwner, async (req, res) => {
  try {
    const { storeId, productId } = req.params;
    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });

    // Only allow the owner of the store to edit products
    if (store.storeOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const product = await Product.findOne({ _id: productId, store: storeId });
    if (!product) return res.status(404).json({ message: "Product not found" });

    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (error) {
    console.error("Edit Product Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a product (Store Owner)
router.delete("/store/:storeId/:productId", protectStoreOwner, async (req, res) => {
  try {
    const { storeId, productId } = req.params;
    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });

    // Only allow the owner of the store to delete products
    if (store.storeOwner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const product = await Product.findOneAndDelete({ _id: productId, store: storeId });
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Delete Product Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

//@route   GET /api/products/best-seller
//@desc    Retrieve the product with the highest rating
//@access  Public

router.get("/best-seller", async (req, res) => {
  try {
    const bestSeller = await Product.findOne().sort({ rating: -1 });

    if (bestSeller) {
      res.json(bestSeller);
    } else {
      res.status(404).json({ message: "No best products found" });
    }
  } catch (error) {
    console.error("Best Seller Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

//@route GET /api/products/new-arrivalss
//@desc retrive latest 8 products by date
//@access public

router.get("/new-arrivals", async (req, res) => {
  try {
    //fetch latest 8 products
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(10);
    res.json(newArrivals);
  } catch (error) {
    console.error(error);
    resizeTo.status(500).send("Server Error");
  }
});

//@route GET /api/product/:id
//@desc Get a single product by ID
//@access public

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//@route GET /api/products/similar/:id
//@desc Retrieve similar products based on the current product's gender and category
//@access Public

router.get("/similar/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Find the product by ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { category, gender } = product;

    // Check if category or gender is missing
    if (!category || !gender) {
      return res
        .status(400)
        .json({ message: "Product missing category or gender" });
    }

    // Find similar products (same category and gender), excluding the current one
    const similarProducts = await Product.find({
      _id: { $ne: id },
      category: category,
      gender: gender,
    }).limit(20); // display adjustmate for limit

    if (similarProducts.length === 0) {
      return res.status(404).json({ message: "No similar products found" });
    }

    res.status(200).json(similarProducts);
  } catch (error) {
    console.error("Similar Products Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
