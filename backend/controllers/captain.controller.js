const CaptainModel = require("../models/captain");
const User = require("../models/user");
const Order = require("../models/Order");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blackListTokenModel = require("../models/blackListToken");
const cloudinary = require("cloudinary").v2;

// Register Captain
module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ errors: errors.array() });

  const { firstname, lastname, email, password, vehicle, contact } = req.body;

  const existingCaptain = await CaptainModel.findOne({ email });
  if (existingCaptain)
    return res.status(400).json({ message: "Captain already exists" });

  const hashedPassword = await CaptainModel.hashPassword(password);

  // Step 1: Create linked User
  const createdUser = new User({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    contact,
    role: "captain",
  });
  await createdUser.save();

  // Step 2: Create linked Captain
  const captain = await captainService.createCaptain({
    user: createdUser._id,
    firstname,
    lastname,
    email,
    password: hashedPassword,
    vehicle,
    contact,
  });

  const token = captain.generateAuthToken();

  res.status(201).json({
    captain: {
      _id: captain._id,
      firstname: captain.firstname,
      lastname: captain.lastname,
      email: captain.email,
      vehicle: captain.vehicle,
      contact: captain.contact,
      role: captain.role,
    },
    token,
  });
};

// Login Captain
module.exports.loginCaptain = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const captain = await CaptainModel.findOne({ email })
      .select("+password")
      .populate("user"); //  Fetch the linked User document

    if (!captain) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, captain.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = captain.generateAuthToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      token,
      captain,
      user: captain.user, 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Captain Profile
module.exports.getCaptainProfile = async (req, res) => {
  try {
    const captain = await CaptainModel.findById(req.captain._id)
      .select("-password")
      .populate(
        "deliveries.orderId",
        "totalPrice status deliveredAt destination"
      )
      .lean();

    if (!captain) {
      return res.status(404).json({ message: "Captain not found" });
    }

    console.log("captain profile:" ,captain);

    // Example stats (customize as needed)
    const totalOrders = await Order.countDocuments({ captain: captain._id });
    const completedOrders = await Order.countDocuments({
      captain: captain._id,
      status: "Delivered",
    });
    const pendingOrders = await Order.countDocuments({
      captain: captain._id,
      status: { $ne: "Delivered" },
    });

    // Recent orders (customize fields as needed)
    const recentOrders = await Order.find({ captain: captain._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("orderId status totalPrice createdAt");

    // Send the captain profile data along with the additional stats
    return res.status(200).json({
      ...captain,
      totalOrders,
      completedOrders,
      pendingOrders,
      recentOrders,
    });
  } catch (error) {
    console.error("Error fetching captain profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Logout Captain
module.exports.logoutCaptain = async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  await blackListTokenModel.create({ token });

  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

// Get Captain by User ID
module.exports.getCaptainByUserId = async (req, res) => {
  try {
    const userId = req.params._id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const captain = await CaptainModel.findOne({ user: userId }).populate(
      "user"
    );

    if (!captain) {
      return res.status(404).json({ message: "Captain not found" });
    }

    return res.status(200).json(captain);
  } catch (error) {
    console.error("Error fetching captain by user ID:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.toggleCaptainOnline = async (req, res) => {
  try {
    const { isOnline } = req.body;
    const captain = await CaptainModel.findById(req.captain._id);
    if (!captain) return res.status(404).json({ message: "Captain not found" });
    captain.isOnline = isOnline;
    await captain.save();
    res.json({ isOnline: captain.isOnline });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
