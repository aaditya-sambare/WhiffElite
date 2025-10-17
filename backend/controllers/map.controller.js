const mapService = require("../services/maps.service");
const { validationResult } = require("express-validator");
const axios = require("axios");

module.exports.getCordinates = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address } = req.query;
  if (!address) {
    return res.status(400).json({ message: "Address is required" });
  }

  try {
    const coordinates = await mapService.getAddressCoordinates(address);
    return res.status(200).json(coordinates);
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return res.status(500).json({ message: "Error fetching coordinates" });
  }
};

module.exports.getDistanceAndTime = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { origin, destination } = req.query;

    const distanceAndTime = await mapService.getDistanceAndTime(
      origin,
      destination
    );

    res.status(200).json({ distanceAndTime });
  } catch (error) {
    console.error("Error fetching distance and time:", error);
    return res
      .status(500)
      .json({ message: "Error fetching distance and time" });
  }
};

module.exports.getSuggestions = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { input } = req.query;

    const suggestions = await mapService.getSuggestions(input);

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getDirections = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { origin, destination } = req.query;
  if (!origin || !destination) {
    return res.status(400).json({ message: "Origin and destination required" });
  }

  try {
    const originCoords = await mapService.getAddressCoordinates(origin);
    const destCoords = await mapService.getAddressCoordinates(destination);

    const response = await axios.get(
      `https://api.geoapify.com/v1/routing?waypoints=${originCoords.lat},${originCoords.lng}|${destCoords.lat},${destCoords.lng}&mode=drive&details=instruction_details&apiKey=${process.env.GEOAPIFY_API_KEY}`
    );

    if (response.data.features && response.data.features.length > 0) {
      return res.json({
        route: response.data.features[0],
        legs: response.data.features[0].properties.legs,
      });
    } else {
      return res.status(400).json({ message: "No route found" });
    }
  } catch (error) {
    console.error("Directions API error:", error);
    return res.status(500).json({ message: "Directions API error" });
  }
};
