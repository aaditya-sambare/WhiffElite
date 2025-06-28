const rideModel = require("../models/ride");
const mapService = require("./maps.service");
const crypto = require("crypto");

async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  const distanceAndTime = await mapService.getDistanceAndTime(
    pickup,
    destination
  );

  const distanceInMeters = distanceAndTime.distanceValue; // meters
  const distanceInKm = distanceInMeters / 1000; // convert to kilometers
  const timeInSeconds = distanceAndTime.durationValue; // seconds

  const baseFare = {
    bike: 20,
    scooty: 15,
    ev: 10,
  };

  const perMeterRate = {
    bike: 0.01, // ₹10/km = ₹0.01/m
    scooty: 0.008, // ₹8/km = ₹0.008/m
    ev: 0.005, // ₹5/km = ₹0.005/m
  };

  const perSecondRate = {
    bike: 0.033, // ₹2/min = ₹0.033/s
    scooty: 0.025, // ₹1.5/min = ₹0.025/s
    ev: 0.0167, // ₹1/min = ₹0.0167/s
  };

  const fare = {
    bike:
      baseFare.bike +
      distanceInKm * perMeterRate.bike +
      timeInSeconds * perSecondRate.bike,
    scooty:
      baseFare.scooty +
      distanceInKm * perMeterRate.scooty +
      timeInSeconds * perSecondRate.scooty,
    ev:
      baseFare.ev +
      distanceInKm * perMeterRate.ev +
      timeInSeconds * perSecondRate.ev,
  };

  return fare;
}

module.exports.getFare = getFare;

function getOtp(num) {
  function generateOTP(num) {
    const otp = crypto
      .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
      .toString();
    return otp;
  }
  return generateOTP(num);
}

module.exports.createRide = async ({
  user,
  pickup,
  destination,
  vehicleType,
  orderId,
}) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error("User, pickup, destination, and vehicleType are required");
  }

  const distanceAndTime = await mapService.getDistanceAndTime(pickup, destination);

  const fare = await getFare(pickup, destination);

  const ride = new rideModel({
    user,
    pickup,
    destination,
    otpStoreOwner: getOtp(5),
    otpCustomer: getOtp(5),
    fare: Math.round(fare[vehicleType]),
    orderId,
    distance: distanceAndTime.distanceValue, // <-- add this line
    duration: distanceAndTime.durationValue, // (optional, for duration)
  });
  await ride.save();
  return ride;
};

module.exports.createRideForOrder = async (order) => {
  if (!order.pickup || !order.destination) {
    throw new Error("Order missing pickup or destination");
  }

  // Calculate fare if not present
  let fare = order.deliveryCharge;
  let distanceAndTime;
  if (!fare) {
    distanceAndTime = await mapService.getDistanceAndTime(order.pickup, order.destination);
    const fareObj = await getFare(order.pickup, order.destination);
    fare = Math.round(fareObj["bike"]);
  } else {
    distanceAndTime = await mapService.getDistanceAndTime(order.pickup, order.destination);
  }

  const ride = await rideModel.create({
    user: order.user,
    pickup: order.pickup,
    destination: order.destination,
    otpStoreOwner: getOtp(5),
    otpCustomer: getOtp(5),
    orderId: order._id,
    fare,
    status: "pending-store-owner",
    captain: null,
    distance: distanceAndTime.distanceValue, // <-- add this line
    duration: distanceAndTime.durationValue, // (optional, for duration)
  });

  // Assign ride to order
  order.ride = ride._id;
  await order.save();

  return ride;
};

module.exports.confirmRide = async (rideId, captainId) => {
  if (!rideId || !captainId) {
    throw new Error("rideId and captainId are required");
  }

  const updatedRide = await rideModel
    .findOneAndUpdate(
      { _id: rideId },
      {
        status: "accepted",
        captain: captainId,
      },
      { new: true }
    )
    .populate("user");

  if (!updatedRide) {
    throw new Error("Ride not found");
  }

  return updatedRide;
};
