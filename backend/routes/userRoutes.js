const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const { body } = require("express-validator");
const userController = require("../controllers/user.controller");

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email address"),
    body("firstname")
      .trim()
      .escape()
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  userController.registerUser
);

// @route   POST /api/users/login
// @desc    Authenticate user
// @access  Public
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email address"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  userController.loginUser
);

// @route   GET /api/users/profile
// @desc    Get logged-in user's profile
// @access  Private
router.get("/profile", authMiddleware.protect, userController.getUserProfile);

//@route GET /api/logout
//@desc Logout user
//@access Public
router.get("/logout", authMiddleware.protect, userController.logoutUser);

// @route   PUT /api/users/location
// @desc    Update user's location
// @access  Private
router.put("/location", authMiddleware.protect, async (req, res) => {
  try {
    const { location } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { location },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update location" });
  }
});

module.exports = router;
