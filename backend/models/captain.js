const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const captainSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstname: {
      type: String,
      required: true,
      minlength: [3, "Firstname must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      minlength: [3, "Lastname must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    socketId: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    vehicle: {
      color: { type: String, required: true },
      plate: { type: String, required: true },
      capacity: { type: Number },
      vehicleType: {
        type: String,
        enum: ["bike", "scooty", "ev"],
        required: true,
      },
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],

        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]

        default: [0, 0],
      },
    },
    role: {
      type: String,
      enum: ["captain"],
      default: "captain",
    },
    contact: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "https://ui-avatars.com/api/?name=Captain",
    },
    dob: Date,
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    address: String,
    license: {
      number: String,
      image: String,
    },
    aadhar: {
      number: String,
      image: String,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    rating: Number,
   
    ratings: [{ type: Number, min: 1, max: 5 }],
    deliveries: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
        address: String,
        status: String, // e.g., "Completed", "Pending", "Failed"
        earnings: Number,
        date: String, // or Date
        time: String, // or store as Date and format in frontend
      }
    ],
  },
  { timestamps: true }
);

captainSchema.index({ location: "2dsphere" });

captainSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

captainSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

captainSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

module.exports = mongoose.model("Captain", captainSchema);

