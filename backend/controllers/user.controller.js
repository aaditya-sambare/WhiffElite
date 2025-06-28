const { validationResult } = require("express-validator");
const User = require("../models/user");
const userService = require("../services/user.service");
const blackListToken = require("../models/blackListToken");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { firstname, lastname, email, password, contact } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await User.hashPassword(password);

  const user = await userService.createUser({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    contact,
  });

  const token = user.generateAuthToken();

  res.status(201).json({
    user: {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      contact: user.contact,
      role: user.role,
      profileImage: user.profileImage,
    },
    token,
  });
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email and password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email and password" });
    }

    const token = user.generateAuthToken();

    res.cookie("token", token);

    res.status(200).json({
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        contact: user.contact,
        role: user.role,
        profileImage: user.profileImage,
      },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).send("Server Error");
  }
};

module.exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("+password"); // or remove +password if you don't want to send it
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  await blackListToken.create({ token });
  res.status(200).json({ message: "Logged out successfully" });
};
