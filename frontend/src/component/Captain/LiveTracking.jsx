import React, { useState, useEffect, useMemo } from "react";
import { LoadScript, GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import polyline from "@mapbox/polyline";
import axios from "axios";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 22.7196,
  lng: 75.8577,
};

const bikeIcon = {
  url: "/bike-icon.png",
  scaledSize: { width: 40, height: 40 },
};

const LiveTracking = ({ pickup, destination, showDirections }) => {
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);
  const [loading, setLoading] = useState(true);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [routePath, setRoutePath] = useState([]);

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    }),
    []
  );

  const handleGoogleMapsLoad = () => setGoogleMapsLoaded(true);

  // Get current position
  useEffect(() => {
    let isMounted = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (isMounted) {
            setCurrentPosition({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setLoading(false);
          }
        },
        (error) => {
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          if (isMounted) {
            setCurrentPosition({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          }
        },
        () => {}
      );
      return () => {
        isMounted = false;
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch directions when ride starts (showDirections=true)
  useEffect(() => {
    const fetchDirections = async () => {
      if (pickup && destination && showDirections) {
        try {
          // Use address string or lat/lng as needed
          const origin =
            typeof pickup === "string"
              ? pickup
              : `${pickup.lat},${pickup.lng}`;
          const dest =
            typeof destination === "string"
              ? destination
              : `${destination.lat},${destination.lng}`;
          const { data } = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/maps/directions`,
            {
              params: { origin, destination: dest },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("captainToken")}`,
              },
            }
          );
          // Decode polyline to array of lat/lng
          const decoded = polyline.decode(data.polyline).map(([lat, lng]) => ({
            lat,
            lng,
          }));
          setRoutePath(decoded);
        } catch (err) {
          setRoutePath([]);
        }
      } else {
        setRoutePath([]);
      }
    };
    fetchDirections();
  }, [pickup, destination, showDirections]);

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
          <div className="text-white text-xl">Locating...</div>
        </div>
      )}

      <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
        onLoad={handleGoogleMapsLoad}
      >
        {googleMapsLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={currentPosition}
            zoom={19}
            options={mapOptions}
          >
            {/* Pickup Marker */}
            {pickup && (
              <Marker
                position={pickup}
                label={{ text: "Pickup", color: "white" }}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                }}
              />
            )}
            {/* Destination Marker */}
            {destination && (
              <Marker
                position={destination}
                label={{ text: "Drop", color: "white" }}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                }}
              />
            )}
            {/* Bike/Current Position Marker */}
            <Marker
              position={currentPosition}
              icon={bikeIcon}
              label={{ text: "You", color: "black" }}
            />
            {/* Route Polyline */}
            {routePath.length > 1 && (
              <Polyline
                path={routePath}
                options={{
                  strokeColor: "#4285F4",
                  strokeOpacity: 0.9,
                  strokeWeight: 5,
                }}
              />
            )}
          </GoogleMap>
        )}
      </LoadScript>
    </div>
  );
};

export default LiveTracking;
