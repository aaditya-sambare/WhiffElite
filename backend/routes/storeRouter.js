const express = require("express");
const router = express.Router();
const Store = require("../models/Store");
const path = require("path");

const {
  protect,
  protectAdminOrStoreOwner,
} = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");
const storeOwner = require("../models/storeOwner");

// @route   POST /api/stores
// @desc    Create a new store
// @access  Private/Admin or StoreOwner
router.post("/", protectAdminOrStoreOwner, async (req, res) => {
  try {
    const { name, city, state, address, contact, landmark, image } = req.body;
    if (!name || !city || !state || !address || !landmark) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const newStore = new Store({
      name,
      city,
      state,
      address,
      contact,
      landmark,
      image,
      user: req.user._id,
      storeOwner: req.user._id,
    });

    const savedStore = await newStore.save();

    // Add the store to the store owner's stores array
    const StoreOwner = require("../models/storeOwner");
    await StoreOwner.findByIdAndUpdate(
      req.user._id,
      { $push: { stores: savedStore._id } },
      { new: true }
    );

    res.status(201).json(savedStore);
  } catch (error) {
    console.error("Error creating store:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/stores/:id
// @desc    Update an existing store by ID
// @access  Private/Admin
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Update fields
    const { name, city, state, address, contact, landmark, image } = req.body;

    store.name = name || store.name;
    store.city = city || store.city;
    store.state = state || store.state;
    store.address = address || store.address;
    store.contact = contact || store.contact;
    store.landmark = landmark || store.landmark;
    store.image = image || store.image;

    const updatedStore = await store.save();
    res.json(updatedStore);
  } catch (error) {
    console.error("Error updating store:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/stores/:id
// @desc    Delete store by ID
// @access  Private/Admin
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    await store.deleteOne();
    res.json({ message: "Store deleted successfully" });
  } catch (error) {
    console.error("Error deleting store:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/stores
// @desc    Get all stores (optionally filtered by city or state)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { city, state } = req.query;

    // Build dynamic filter
    const filter = {};
    if (city) filter.city = new RegExp(city, "i");
    if (state) filter.state = new RegExp(state, "i");

    const stores = await Store.find(filter);
    res.json(stores);
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route GET /api/stores/:id
//@desc Get a store with its products
//@access Public
router.get("/:id", async (req, res) => {
  try {
    const store = await Store.findById(req.params.id)
      .populate("products")
      .exec();

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    res.json(store);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET store location by ID
router.get("/location/:id", async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res
        .status(404)
        .json({ message: `Store with ID ${req.params.id} not found` });
    }

    const fullAddress = `${store.address}, ${store.landmark}, ${store.city}, ${store.state}`;
    res.status(200).json({ address: fullAddress });
  } catch (error) {
    console.error("Failed to fetch store address:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
