const axios = require("axios");
const captainModel = require("../models/captain");
const rideModel = require("../models/ride");

module.exports.getAddressCoordinates = async (address) => {
  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);

    if (response.status === 200 && response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      console.error("Google Maps API Error:", response.data);
      throw new Error("Failed to fetch coordinates from Google Maps API.");
    }
  } catch (error) {
    console.error(
      "Google Maps API fetch error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch coordinates from Google Maps API.");
  }
};

module.exports.getDistanceAndTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required.");
  }

  const apiKey = process.env.GOOGLE_MAPS_API;

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (
      data.status === "OK" &&
      data.rows?.[0]?.elements?.[0]?.status === "OK"
    ) {
      const element = data.rows[0].elements[0];
      return {
        distance: element.distance.text,
        duration: element.duration.text,
        distanceValue: element.distance.value,
        durationValue: element.duration.value,
      };
    } else if (data.rows?.[0]?.elements?.[0]?.status === "ZERO_RESULTS") {
      throw new Error("No route found between the origin and destination.");
    } else {
      console.error("Google Maps API Error:", data);
      throw new Error(
        "Failed to fetch distance and time from Google Maps API."
      );
    }
  } catch (error) {
    console.error(
      "Google Maps API fetch error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch distance and time from Google Maps API.");
  }
};

module.exports.getSuggestions = async (input) => {
  if (!input) {
    throw new Error("Query is required.");
  }
  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status === "OK") {
      return data.predictions;
    } else {
      console.error("Google Maps API Error:", data);
      throw new Error("Failed to fetch suggestions from Google Maps API.");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports.getCaptainInTheRadius = async (lat, lng, radiusInKm) => {
  if (typeof lat !== "number" || typeof lng !== "number") {
    throw new Error(`Invalid lat/lng for geo query: ${lat}, ${lng}`);
  }

  const radiusInRadians = radiusInKm / 6371;

  try {
    const captains = await captainModel.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radiusInRadians],
        },
      },
    });
    return captains;
  } catch (err) {
    console.error("Error querying captains in radius:", err);
    throw err;
  }
};
