const express = require("express");
const Store = require("../models/Store");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/admin/stores - List all stores
router.get("/", protect, admin, async (req, res) => {
  try {
    const stores = await Store.find({});
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stores" });
  }
});

// POST /api/admin/stores - Add a new store
router.post("/", protect, admin, async (req, res) => {
  try {
    const store = new Store(req.body);
    await store.save();

    // Add the store to the store owner's stores array
    if (store.storeOwner) {
      const StoreOwner = require("../models/storeOwner");
      await StoreOwner.findByIdAndUpdate(
        store.storeOwner,
        { $push: { stores: store._id } },
        { new: true }
      );
    }

    res.status(201).json(store);
  } catch (error) {
    console.error("Store creation error:", error);
    res.status(400).json({ message: "Failed to add store", error: error.message });
  }
});

// PUT /api/admin/stores/:id - Edit a store
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!store) return res.status(404).json({ message: "Store not found" });
    res.json(store);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update store", error: error.message });
  }
});

// DELETE /api/admin/stores/:id - Delete a store
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) return res.status(404).json({ message: "Store not found" });
    res.json({ message: "Store deleted" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to delete store", error: error.message });
  }
});

module.exports = router;
