const express = require("express");
const StoreOwner = require("../models/storeOwner");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const Product = require("../models/product");
const Store = require("../models/Store");
const Ride = require("../models/ride"); // <-- Add this line

// Register
router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password, contact } = req.body;
    if (!firstname || !email || !password || !contact)
      return res.status(400).json({ message: "All fields are required" });

    let user = await StoreOwner.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    user = new StoreOwner({ firstname, lastname, email, password, contact });
    await user.save();

    const token = user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await StoreOwner.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = user.generateAuthToken();
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Store Owner Profile (protected)
router.get("/profile", authMiddleware.protectStoreOwner, async (req, res) => {
  try {
    const owner = await StoreOwner.findById(req.user._id).populate("stores");
    if (!owner) return res.status(404).json({ message: "Owner not found" });
    res.json(owner); // <-- This is correct
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update Store Status
router.put(
  "/store/:id/online",
  authMiddleware.protectStoreOwner,
  async (req, res) => {
    try {
      const { isActive } = req.body;
      const store = await Store.findById(req.params.id);
      if (!store) return res.status(404).json({ message: "Store not found" });
      store.isActive = isActive;
      await store.save();
      res.json({ message: "Store status updated", isActive: store.isActive });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.put("/online", authMiddleware.protectStoreOwner, async (req, res) => {
  try {
    const { isActive } = req.body;
    const store = await Store.findOne({ user: req.user._id });
    if (!store) return res.status(404).json({ message: "Store not found" });
    store.isActive = isActive;
    await store.save();
    res.json({ isActive: store.isActive });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all orders for the store owner's stores
router.get("/my-orders", authMiddleware.protectStoreOwner, async (req, res) => {
  try {
    // Get all store IDs for this owner
    const owner = await StoreOwner.findById(req.user._id).populate("stores");
    const storeIds = owner.stores.map((store) => store._id);

    // Find all orders that have at least one orderItem with a product belonging to these stores
    const orders = await Order.find({
      "orderItems.productId": { $exists: true },
    })
      .populate({
        path: "orderItems.productId",
        select: "store price",
      })
      .populate({
        path: "user",
        select: "firstname lastname email",
      })
      .populate({
        path: "captain",
        select: "firstname lastname email contact vehicle profileImage",
      })
      .populate({
        path: "ride",
        select: "+otpStoreOwner +otpCustomer", // <-- add the plus sign!
      })


      .sort({ createdAt: -1 });

    // Filter orders where at least one product belongs to the owner's stores
    const filteredOrders = orders.filter((order) =>
      order.orderItems.some((item) =>
        storeIds.some(
          (storeId) =>
            item.productId &&
            item.productId.store &&
            item.productId.store.equals(storeId)
        )
      )
    );

    // For each order, find the related ride and attach the OTPs
    // const ordersWithOtp = await Promise.all(
    //   filteredOrders.map(async (order) => {
    //     const ride = await Ride.findOne({ orderId: order._id });
    //     return {
    //       ...order.toObject(),
    //       otpStoreOwner: ride?.otpStoreOwner || null,
    //       otpCustomer: ride?.otpCustomer || null,
    //     };
    //   })
    // );

   // res.json(ordersWithOtp);
   res.json(filteredOrders);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
