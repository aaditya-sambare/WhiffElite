const express = require("express");
const router = express.Router();
const rideModel = require("../models/ride");

const { body, query } = require("express-validator");

const rideController = require("../controllers/ride.controller");
const authMiddleware = require("../middleware/authMiddleware");
router.post(
  "/create",
  authMiddleware.protect,
  body("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("pickup is required"),
  body("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("destination is required"),
  body("vehicleType")
    .isString()
    .isIn(["bike", "scooty", "ev"])
    .withMessage("vehicleType is required"),
  rideController.createRide
);

router.get(
  "/get-fare",
  authMiddleware.protect,
  query("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("pickup is required"),
  query("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("destination is required"),
  rideController.getFare
);

router.post(
  "/store-owner-accept",
  authMiddleware.protectStoreOwner,
  body("rideId").isMongoId().withMessage("Invalid ride Id"),
  rideController.storeOwnerAcceptRide
);

router.post(
  "/store-owner-reject",
  authMiddleware.protectStoreOwner,
  body("rideId").isMongoId().withMessage("Invalid ride Id"),
  rideController.storeOwnerRejectRide
);

router.post(
  "/captain-accept",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride Id"),
  rideController.captainAcceptRide
);

router.post(
  "/captain-reject",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride Id"),
  rideController.captainRejectRide
);

router.post(
  "/confirm",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Invalid rider Id"),

  rideController.confirmRide
);

router.get(
  "/pending-for-captain",
  authMiddleware.authCaptain,
  async (req, res) => {
    try {
      const rides = await rideModel
        .find({
          status: "pending-captain",
          captain: null,
        })
        .populate("user");
      res.json(rides);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get(
  "/pending-for-store-owner",
  authMiddleware.protectStoreOwner,
  async (req, res) => {
    try {
      const rides = await rideModel.find({
        status: "pending-store-owner",
      });
      res.json(rides);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get(
  "/current-for-captain",
  authMiddleware.authCaptain,
  async (req, res) => {
    try {
      const ride = await rideModel
        .findOne({
          status: { $in: ["accepted", "enroute"] }, // <-- include both statuses
          captain: req.captain._id,
        })
        .populate("user");

      res.json(ride);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.post(
  "/verify-store-otp",
  authMiddleware.authCaptain,
  body("rideId").isMongoId(),
  body("otp").isString(),
  rideController.verifyStoreOtp
);

router.post(
  "/confirm-delivery",
  authMiddleware.authCaptain,
  body("rideId").isMongoId(),
  body("otp").isString(),
  rideController.confirmDelivery
);

module.exports = router;
