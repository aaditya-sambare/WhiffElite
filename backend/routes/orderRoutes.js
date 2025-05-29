const express = require("express");
const Order = require("../models/Order");
const Captain = require("../models/captain");
const Product = require("../models/product");
const {
  protect,
  protectUserOrStoreOwner,
} = require("../middleware/authMiddleware");

const router = express.Router();

//@route GET /api/orders/my-orders
//@desc get logged users orders
//@access private

router.get("/my-orders", protect, async (req, res) => {
  try {
    //find order
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route GET /api/orders/:id
//@desc get orders by id
//@acess private

router.get("/:id", protectUserOrStoreOwner, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "firstname lastname email")
      .populate({
        path: "orderItems.productId",
        populate: {
          path: "store",
          model: "Store",
          select: "address",
        },
      })
      .populate(
        "captain",
      )
      .populate({
        path: "ride",
        select: "+otpStoreOwner +otpCustomer status", // add fields as needed
      });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route PUT /api/orders/:id/assign-captain
//@desc assign captain to an order
//@access private

router.put("/:id/assign-captain", protect, async (req, res) => {
  const { captainId } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.captain = captainId; // captainId from the accepting captain
    await order.save();

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route POST /api/orders/:id/rate
//@desc rate an order
//@access private

router.post("/:id/rate", protect, async (req, res) => {
  const { captainRating, productRatings } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  if (!order.isDelivered)
    return res.status(400).json({ message: "Order not delivered yet" });

  // Save captain rating
  if (order.captain && captainRating) {
    await Captain.findByIdAndUpdate(order.captain, {
      $push: { ratings: captainRating },
    });
  }

  
  // Save product ratings
  if (Array.isArray(productRatings)) {
    for (const { productId, rating } of productRatings) {
      if (!productId) continue;
      const id = typeof productId === "string" ? productId : String(productId);
      await Product.findByIdAndUpdate(id, {
        $push: { ratings: rating },
      });
    }
  }

  // Mark order as rated
  order.orderRated = true;
  await order.save();

  res.json({ message: "Thank you for your feedback!" });
});

module.exports = router;
