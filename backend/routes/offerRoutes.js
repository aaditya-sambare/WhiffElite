const express = require("express");
const router = express.Router();
const Offer = require("../models/offer");

// Get all offers
router.get("/", async (req, res) => {
  const offers = await Offer.find({ active: true });
  res.json(offers);
});

// Add new offer
router.post("/", async (req, res) => {
  const offer = new Offer(req.body);
  await offer.save();
  res.json(offer);
});

// Update offer
router.put("/:id", async (req, res) => {
  const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(offer);
});

// Delete offer
router.delete("/:id", async (req, res) => {
  await Offer.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
