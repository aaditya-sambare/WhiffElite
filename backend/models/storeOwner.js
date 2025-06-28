const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const storeOwnerSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minLength: 8, select: false },
    contact: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    socketId: String,
    profileImage: {
      type: String,
      default: "https://ui-avatars.com/api/?name=Store+Owner",
    },
    stores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
      },
    ],
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
    role: {
      type: String,
      default: "storeowner",
    },
  },
  { timestamps: true }
);

// Password hash middleware
storeOwnerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// JWT token method
storeOwnerSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, type: "storeOwner" },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
};

// Password compare method
storeOwnerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("StoreOwner", storeOwnerSchema);
