const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: String,
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model("Offer", offerSchema);
