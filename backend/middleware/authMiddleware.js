const CaptainModel = require("../models/captain");
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const blackListTokenModel = require("../models/blackListToken");
const StoreOwner = require("../models/storeOwner");


//user
module.exports.protect = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const isBlacklisted = await blackListTokenModel.findOne({ token: token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Token is blacklisted" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await userModel.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    return next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Unauthorized is not valid" });
  }
};


//admin
module.exports.admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};

//captain
module.exports.authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const isBlacklisted = await blackListTokenModel.findOne({ token: token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Token is blacklisted" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Use decoded._id to find captain
    const captain = await CaptainModel.findById(decoded._id); // Assuming the JWT contains _id for the captain
    if (!captain) {
      return res.status(401).json({ message: "Captain not found" });
    }

    req.captain = captain; // Attach the captain to the request object

    return next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Unauthorized token is not valid" });
  }
};


//store owner
module.exports.protectStoreOwner = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await StoreOwner.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

//store owner or user
module.exports.protectUserOrStoreOwner = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const isBlacklisted = await blackListTokenModel.findOne({ token: token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Token is blacklisted" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try user first
    let user = await userModel.findById(decoded.id).select("-password");
    if (user) {
      req.user = user;
      req.isStoreOwner = false;
      return next();
    }

    // Try store owner
    let storeOwner = await StoreOwner.findById(decoded.id).select("-password");
    if (storeOwner) {
      req.user = storeOwner;
      req.isStoreOwner = true;
      return next();
    }

    return res.status(401).json({ message: "User not found" });
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Unauthorized is not valid" });
  }
};

//store owner or admin
module.exports.protectAdminOrStoreOwner = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const isBlacklisted = await blackListTokenModel.findOne({ token: token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Token is blacklisted" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try admin (assuming admin is a StoreOwner with role field)
    let storeOwner = await StoreOwner.findById(decoded.id).select("-password");
    if (storeOwner && storeOwner.role === "admin") {
      req.user = storeOwner;
      req.isAdmin = true;
      req.isStoreOwner = true;
      return next();
    }

    // Try store owner
    if (storeOwner) {
      req.user = storeOwner;
      req.isAdmin = false;
      req.isStoreOwner = true;
      return next();
    }

    return res.status(401).json({ message: "User not found" });
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Unauthorized is not valid" });
  }
};

// Combined user/captain auth
module.exports.protectUserOrCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const isBlacklisted = await blackListTokenModel.findOne({ token: token });
  if (isBlacklisted) {
    return res.status(401).json({ message: "Token is blacklisted" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try user first
    let user = await userModel.findById(decoded.id || decoded._id).select("-password");
    if (user) {
      req.user = user;
      req.userType = "user";
      return next();
    }

    // Try captain
    let captain = await CaptainModel.findById(decoded.id || decoded._id).select("-password");
    if (captain) {
      req.user = captain;
      req.userType = "captain";
      return next();
    }

    return res.status(401).json({ message: "User or Captain not found" });
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Unauthorized: token is not valid" });
  }
};


