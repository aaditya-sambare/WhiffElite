const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Captain",
  },
  pickup: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  fare: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "pending-store-owner",
  },
  duration: {
    type: Number, //in seconds
  },
  distance: {
    type: Number, //in meters
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  paymentID: {
    type: String,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  signature: {
    type: String,
  },
  otpStoreOwner: { type: String, select: false },
  otpCustomer: { type: String, select: false },
});

module.exports = mongoose.model("Ride", rideSchema);
