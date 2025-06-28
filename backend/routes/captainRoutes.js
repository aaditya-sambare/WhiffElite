const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const captainController = require("../controllers/captain.controller");
const authMiddleware = require("../middleware/authMiddleware");
const fileUpload = require("express-fileupload");

router.post(
  "/register",
  [
    body("firstname")
      .trim()
      .notEmpty()
      .withMessage("Firstname is required")
      .isLength({ min: 3 })
      .withMessage("Firstname must be at least 3 characters"),

    body("lastname")
      .optional()
      .isLength({ min: 3 })
      .withMessage("Lastname must be at least 3 characters"),

    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please enter a valid email"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),

    body("vehicle.color").notEmpty().withMessage("Vehicle color is required"),

    body("vehicle.plate").notEmpty().withMessage("Vehicle plate is required"),

    body("vehicle.capacity")
      .notEmpty()
      .withMessage("Vehicle capacity is required")
      .isNumeric()
      .withMessage("Vehicle capacity must be a number"),

    body("vehicle.vehicleType")
      .notEmpty()
      .withMessage("Vehicle type is required")
      .isIn(["bike", "scooty", "ev"])
      .withMessage("Vehicle type must be either bike, scooty, or ev"),
  ],
  captainController.registerCaptain
);

router.post(
  "/login",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please enter a valid email address"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  captainController.loginCaptain
);

router.get(
  "/profile",
  authMiddleware.authCaptain,
  captainController.getCaptainProfile
);

router.use(fileUpload({ useTempFiles: true }));

router.get(
  "/logout",
  authMiddleware.authCaptain,
  captainController.logoutCaptain
);

// GET /api/captains/user/:userId
router.get("/user/:_id", captainController.getCaptainByUserId);

// PUT /api/captain/profile/edit
// router.put("/profile", authMiddleware.authCaptain, captainController.updateCaptainProfile);

router.put(
  "/online",
  authMiddleware.authCaptain,
  captainController.toggleCaptainOnline
);

module.exports = router;
