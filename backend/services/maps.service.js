const axios = require("axios");
const captainModel = require("../models/captain");
const rideModel = require("../models/ride");

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY; // Add this to your .env file

async function getAddressCoordinates(address) {
  try {
    const response = await axios.get(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        address
      )}&apiKey=${GEOAPIFY_API_KEY}`
    );

    if (response.data.features && response.data.features.length > 0) {
      const location = response.data.features[0].geometry.coordinates;
      return {
        lng: location[0],
        lat: location[1],
      };
    }
    throw new Error("No coordinates found for this address");
  } catch (error) {
    console.error("Geocoding error:", error);
    throw error;
  }
}

async function getDistanceAndTime(origin, destination) {
  try {
    // First get coordinates for both addresses
    const originCoords = await getAddressCoordinates(origin);
    const destCoords = await getAddressCoordinates(destination);

    // Use Geoapify Routing API
    const response = await axios.get(
      `https://api.geoapify.com/v1/routing?waypoints=${originCoords.lat},${originCoords.lng}|${destCoords.lat},${destCoords.lng}&mode=drive&apiKey=${GEOAPIFY_API_KEY}`
    );

    if (response.data.features && response.data.features.length > 0) {
      const route = response.data.features[0].properties;
      return {
        distanceValue: route.distance, // Distance in meters
        durationValue: route.time, // Time in seconds
        distance: `${(route.distance / 1000).toFixed(2)} km`,
        duration: `${Math.round(route.time / 60)} mins`,
      };
    }
    throw new Error("No route found");
  } catch (error) {
    console.error("Routing error:", error);
    throw error;
  }
}

async function getSuggestions(input) {
  try {
    const response = await axios.get(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
        input
      )}&apiKey=${GEOAPIFY_API_KEY}`
    );

    if (response.data.features) {
      return response.data.features.map((feature) => ({
        placeId: feature.properties.place_id,
        description: feature.properties.formatted,
        mainText: feature.properties.name,
        secondaryText: feature.properties.formatted,
      }));
    }
    return [];
  } catch (error) {
    console.error("Autocomplete error:", error);
    throw error;
  }
}

module.exports = {
  getAddressCoordinates,
  getDistanceAndTime,
  getSuggestions,
  getCaptainInTheRadius: async (lat, lng, radiusInKm) => {
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
  },
};
