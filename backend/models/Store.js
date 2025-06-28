const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
    },
    landmark: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: false,
    },
    storeOwner: {
      type: mongoose.Schema.ObjectId,
      ref: "StoreOwner",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Store", storeSchema);
