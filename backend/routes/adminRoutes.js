const express = require("express");
const User = require("../models/user");
const StoreOwner = require("../models/storeOwner");
const Captain = require("../models/captain");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route   GET /api/admin/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    const storeOwners = await StoreOwner.find({});
    const captains = await Captain.find({});

    // Normalize all to a common structure for frontend
    const allUsers = [
      ...users.map((u) => ({
        _id: u._id,
        firstname: u.firstname,
        lastname: u.lastname,
        email: u.email,
        role: u.role || "customer",
        contact: u.contact,
        type: "User",
      })),
      ...storeOwners.map((u) => ({
        _id: u._id,
        firstname: u.firstname,
        lastname: u.lastname,
        email: u.email,
        role: "storeowner",
        contact: u.contact,
        type: "StoreOwner",
      })),
      ...captains.map((u) => ({
        _id: u._id,
        firstname: u.firstname,
        lastname: u.lastname,
        email: u.email,
        role: "delivery",
        contact: u.contact,
        type: "Captain",
      })),
    ];

    res.json(allUsers);
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route POST /api/admin/users
//@desc add new user
//@access private/admin

router.post("/", protect, admin, async (req, res) => {
  const { firstname, lastname, email, password, role, contact, type } = req.body;
  try {
    let Model;
    if (type === "StoreOwner") Model = StoreOwner;
    else if (type === "Captain") Model = Captain;
    else Model = User;

    // Check if user already exists in the selected collection
    let user = await Model.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new Model({
      firstname,
      lastname,
      email,
      password,
      contact,
      role: role || (type === "StoreOwner" ? "storeowner" : type === "Captain" ? "captain" : "customer"),
    });

    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route Put /api/admin/user/:id
//@desc update user info. like name, email,role
//@access private/admin

// Update user by type
router.put("/:id", protect, admin, async (req, res) => {
  const { type } = req.body; // type should be 'User', 'StoreOwner', or 'Captain'
  let Model;
  if (type === "StoreOwner") Model = StoreOwner;
  else if (type === "Captain") Model = Captain;
  else Model = User;

  try {
    const user = await Model.findById(req.params.id);
    if (user) {
      // Use correct fields for each model
      user.firstname = req.body.firstname || user.firstname;
      user.lastname = req.body.lastname || user.lastname;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;
      user.contact = req.body.contact || user.contact;
      const updatedUser = await user.save();
      res.json({ message: "User updated successfully", user: updatedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

//@route DELETE /api/admin/users/:id
//@desc delete a user
//@access private/admin

// Delete user by type
router.delete("/:id", protect, admin, async (req, res) => {
  const { type } = req.body; // type should be 'User', 'StoreOwner', or 'Captain'
  let Model;
  if (type === "StoreOwner") Model = StoreOwner;
  else if (type === "Captain") Model = Captain;
  else Model = User;

  try {
    const user = await Model.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: "Successfully deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/admin/stats
// @desc    Get counts for users, captains, store owners, and rides
// @access  Private/Admin
router.get("/stats", protect, admin, async (req, res) => {
  try {
    const User = require("../models/user");
    const Captain = require("../models/captain");
    const StoreOwner = require("../models/storeOwner");
    const Ride = require("../models/ride");

    const [customerCount, captainCount, storeOwnerCount, rideCount] =
      await Promise.all([
        User.countDocuments(),
        Captain.countDocuments(),
        StoreOwner.countDocuments(),
        Ride.countDocuments(),
      ]);

    res.json({
      customerCount,
      captainCount,
      storeOwnerCount,
      rideCount,
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
