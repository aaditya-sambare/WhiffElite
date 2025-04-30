const express = require("express");
const router = express.Router();
const Store = require("../models/Store");

const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

// @route   POST /api/stores
// @desc    Create a new store
// @access  Private/Admin
router.post("/", protect, isAdmin, async (req, res) => {
  try {
    const { name, city, state, address, contact, landmark, image } = req.body;

    if (!name || !city || !state || !address || !landmark || !image) {
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
    });

    const savedStore = await newStore.save();
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

module.exports = router;
