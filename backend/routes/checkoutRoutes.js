const express = require("express");
const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Product = require("../models/product");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");
const rideService = require("../services/ride.service");
const storeOwner = require("../models/storeOwner");

const router = express.Router();

async function createRideAfterPayment(order) {
  // Create the ride with pending-store-owner status
  const ride = await rideService.createRideForOrder(order);

  // Only notify store owner
  if (storeOwner && storeOwner.socketId) {
    sendMessageToSocketId(storeOwner.socketId, {
      event: "ride-awaiting-store-owner",
      data: ride,
    });
  }

  // In createRideAfterPayment or after ride creation
  order.ride = ride._id;
  await order.save();
}

// @route POST /api/checkout
// @desc  Create a new checkout session (i.e., place an order)
// @access Private
router.post("/", protect, async (req, res) => {
  const {
    checkoutItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
    deliveryCharge,
  } = req.body;

  if (!checkoutItems || checkoutItems.length === 0) {
    return res.status(400).json({ message: "No items in checkout" });
  }

  try {
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "Pending",
      isPaid: false,
      deliveryCharge,
      pickup: req.body.pickup,         // <-- ADD THIS
      destination: req.body.destination // <-- ADD THIS
    });

    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("error creating checkout session:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route PUT /api/checkout/:id/pay
// @desc update checkout to mark as paid after successful payment
// @access private
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "No checkout found" });
    }

    if (paymentStatus === "paid") {
      checkout.isPaid = true;
      checkout.paymentStatus = paymentStatus;
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = Date.now();
      await checkout.save();

      res.status(200).json(checkout);
    } else {
      res.status(400).json({ message: "Invalid payment status" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route POST /api/checkout/:id/finalize
// @desc Finalize checkout and convert to an order after payment confirmation
// @access Private
router.post("/:id/finalize", protect, async (req, res) => {
  const checkoutId = req.params.id;

  try {
    const checkout = await Checkout.findById(checkoutId);
    if (!checkout) {
      console.log("No checkout session found");
      return res.status(404).json({ message: "Checkout session not found" });
    }

    if (!checkout.isPaid) {
      console.log("Checkout is not paid yet");
      return res.status(400).json({ message: "Checkout is not paid" });
    }

    if (checkout.isFinalized) {
      console.log("Checkout is already finalized");
      return res.status(400).json({ message: "Checkout is already finalized" });
    }

    // Ensure paymentMethod exists before creating order
    if (!checkout.paymentMethod) {
      console.log("Payment method is missing in the checkout");
      return res.status(400).json({ message: "Payment method is missing" });
    }

    const estimatedDelivery = new Date(Date.now() + 45 * 60 * 1000); // 45 minutes from now

    // Create the order with the correct field name for paymentMethod (case-sensitive)
    const finalOrder = await Order.create({
      user: checkout.user,
      orderItems: checkout.checkoutItems,
      shippingAddress: checkout.shippingAddress,
      PaymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
      deliveryCharge: checkout.deliveryCharge,
      isPaid: true,
      paidAt: checkout.paidAt,
      isDelivered: false,
      paymentStatus: "paid",
      paymentDetails: checkout.paymentDetails,
      paymentId: checkout.paymentDetails?.transactionId,
      pickup: checkout.pickup,
      destination: checkout.destination,
      estimatedDelivery, // <-- add this line
    });

    console.log("Order before creating ride:", finalOrder);
    await createRideAfterPayment(finalOrder);

    // Mark checkout as finalized
    checkout.isFinalized = true;
    checkout.finalizedAt = Date.now();
    // --- ADD THIS: store the orderId ---
    checkout.orderId = finalOrder._id;
    await checkout.save();

    // Delete the cart associated with the user
    await Cart.findOneAndDelete({ user: checkout.user });

    res.status(201).json(finalOrder);
  } catch (error) {
    console.error("Finalize Checkout Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
