const rideService = require("../services/ride.service");
const { validationResult } = require("express-validator");
const mapService = require("../services/maps.service");
const rideModel = require("../models/ride");
const { sendMessageToSocketId } = require("../socket");
const Order = require("../models/Order"); // Add this at the top
const StoreOwner = require("../models/storeOwner"); // Add this at the top
const CaptainModel = require("../models/captain");
const userModel = require("../models/user");
const Captain = require("../models/captain");
const Ride = require("../models/ride");

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination, vehicleType, orderId } = req.body; // <-- added orderId

  try {
    // 1. Get pickup coordinates first (early exit on failure)
    const pickupCoordinates = await mapService.getAddressCoordinates(pickup);
    console.log("pickupCoordinates:", pickupCoordinates);
    if (
      !pickupCoordinates ||
      typeof pickupCoordinates.lat !== "number" ||
      typeof pickupCoordinates.lng !== "number"
    ) {
      return res.status(400).json({ message: "Invalid pickup coordinates" });
    }

    // 2. Create the ride only after validating coordinates
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
      orderId, // <-- pass this!
    });

    // 3. Get captains in radius safely
    const captainsInRadius = await mapService.getCaptainInTheRadius(
      pickupCoordinates.lng,
      pickupCoordinates.lat,
      10000
    );
    console.log("captain:", captainsInRadius);

    // 4. Populate and emit ride
    ride.otp = "";
    const rideWithUser = await rideModel
      .findOne({ _id: ride._id })
      .populate("user")
      .populate({
        path: "captain",
        select: "firstname lastname contact", // Add the fields you want
      });

    captainsInRadius.forEach((captain) => {
      console.log("new", captain, ride);
      if (rideWithUser) {
        sendMessageToSocketId(captain.socketId, {
          event: "new-ride",
          data: rideWithUser,
        });
      } else {
        console.error("rideWithUser is null for ride id:", ride._id);
      }
    });

    // Notify store owner
    const storeOwner = await StoreOwner.findById(req.user.storeOwnerId); // get the correct store owner
    if (storeOwner && storeOwner.socketId) {
      sendMessageToSocketId(storeOwner.socketId, {
        event: "ride-awaiting-store-owner",
        data: rideWithUser, // or ride info you want to send
      });
    }

    // 5. Send final response after everything succeeds
    return res.status(201).json(rideWithUser);
  } catch (err) {
    console.log("Error in createRide:", err);
    if (!res.headersSent) {
      return res.status(500).json({ message: err.message });
    }
  }
};

module.exports.getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;

  try {
    const fare = await rideService.getFare(pickup, destination);

    // Round the fare values to 2 decimal places
    const roundedFare = {};
    for (const vehicleType in fare) {
      roundedFare[vehicleType] = fare[vehicleType].toFixed(2); // Round to 2 decimal places
    }

    return res.status(200).json(roundedFare);
  } catch (error) {
    console.error("Error fetching ride:", error);
    return res.status(500).json({ message: "Error fetching ride" });
  }
};

module.exports.confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.confirmRide(rideId, req.captain._id);

    if (ride && ride.orderId) {
      const order = await Order.findById(ride.orderId);
      if (order) {
        ride.status = "accepted";
        ride.captain = req.captain._id;
        await ride.save();
        order.captain = req.captain._id;
        await order.save();
      }
    }
    console.log(req.captain._id);
    // After assigning captain to ride and order
    const user = await userModel.findById(ride.user);
    if (user && user.socketId) {
      sendMessageToSocketId(user.socketId, {
        event: "ride-confirmed-captain",
        data: ride, // or ride info you want to send
      });
    }

    if (ride?.user?.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
        event: "ride-confirmed",
        data: ride,
      });
    } else {
      console.error("ride.user or socketId is missing", ride);
    }

    return res.status(200).json(ride);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports.storeOwnerAcceptRide = async (req, res) => {
  const { rideId } = req.body;
  try {
    let ride = await rideModel.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    ride.status = "pending-captain";
    await ride.save();

    // Populate user details before sending to captains
    ride = await rideModel.findById(rideId).populate("user");

    const captains = await CaptainModel.find({ isOnline: true });
    captains.forEach((captain) => {
      if (captain.socketId) {
        sendMessageToSocketId(captain.socketId, {
          event: "new-ride",
          data: ride,
        });
      }
    });

    res.json({ message: "Ride accepted by store owner." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.captainAcceptRide = async (req, res) => {
  const { rideId } = req.body;
  try {
    const ride = await rideModel.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    ride.status = "accepted";
    ride.captain = req.captain._id;
    await ride.save();

    // Assign captain to order
    const order = await Order.findById(ride.orderId);
    if (order) {
      order.captain = req.captain._id;
      await order.save();
    }

    // Notify user (customer)
    const user = await userModel.findById(ride.user);
    if (user && user.socketId) {
      sendMessageToSocketId(user.socketId, {
        event: "ride-confirmed-captain",
        data: ride,
      });
    }

    res.json({ message: "Ride accepted by captain." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.storeOwnerRejectRide = async (req, res) => {
  const { rideId } = req.body;
  try {
    const ride = await rideModel.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    ride.status = "rejected-by-store-owner";
    await ride.save();

    // Optionally notify user/admin
    res.json({ message: "Ride rejected by store owner." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.captainRejectRide = async (req, res) => {
  const { rideId } = req.body;
  try {
    const ride = await rideModel.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    ride.status = "rejected-by-captain";
    await ride.save();

    // Optionally notify user/store owner
    res.json({ message: "Ride rejected by captain." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.verifyStoreOtp = async (req, res) => {
  const { rideId, otp } = req.body;
  try {
    const ride = await rideModel.findById(rideId).select("+otpStoreOwner");
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (ride.otpStoreOwner !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    ride.status = "enroute";
    await ride.save();

    if (ride.orderId) {
      await Order.findByIdAndUpdate(ride.orderId, { status: "Shipped" });
    }
    res.json({ message: "OTP verified, ride started", ride });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.confirmDelivery = async (req, res) => {
  const { rideId, otp, rating, productRatings } = req.body;
  try {
    const ride = await Ride.findById(rideId).select("+otpCustomer");
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (ride.otpCustomer !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    ride.status = "delivered";
    await ride.save();

    // Update order as delivered
    if (ride.orderId) {
      const order = await Order.findById(ride.orderId);
      if (order) {
        order.isDelivered = true;
        order.deliveredAt = new Date();
        order.status = "Delivered";
        await order.save();

        // Add delivery history
        if (order.captain) {
          await Captain.findByIdAndUpdate(order.captain, {
            $push: {
              deliveries: {
                orderId: order._id,
                address: order.destination,
                status: "Completed",
                earnings: ride.fare || 0, // <-- use fare here
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString(),
              },
            },
            $inc: { deliveriesCount: 1 }, // if you want to keep a count
          });
        }

        // Save captain rating if provided
        if (order.captain && rating) {
          await Captain.findByIdAndUpdate(order.captain, {
            $push: { ratings: rating },
          });
        }

        // Save product ratings if provided
        if (productRatings && Array.isArray(productRatings)) {
          for (const { productId, rating } of productRatings) {
            await Product.findByIdAndUpdate(productId, {
              $push: { ratings: rating },
            });
          }
        }
      }
    }

    res.json({ message: "Delivery confirmed", ride });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
