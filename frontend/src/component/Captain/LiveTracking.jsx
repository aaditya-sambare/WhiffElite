import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = [22.7196, 75.8577]; // Note: Leaflet uses [lat, lng]

const bikeIcon = L.icon({
  iconUrl: "/bike-icon.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Custom component to update map center
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const LiveTracking = ({ pickup, destination, showDirections }) => {
  const [currentPosition, setCurrentPosition] = useState(defaultCenter);
  const [loading, setLoading] = useState(true);
  const [routePath, setRoutePath] = useState([]);

  // Get current position
  useEffect(() => {
    let isMounted = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (isMounted) {
            setCurrentPosition([
              position.coords.latitude,
              position.coords.longitude,
            ]);
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
            setCurrentPosition([
              position.coords.latitude,
              position.coords.longitude,
            ]);
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

  // Fetch directions when ride starts
  useEffect(() => {
    const fetchDirections = async () => {
      if (pickup && destination && showDirections) {
        try {
          const origin =
            typeof pickup === "string" ? pickup : `${pickup.lat},${pickup.lng}`;
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
          setRoutePath(data.coordinates || []);
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

      <MapContainer
        center={currentPosition}
        zoom={19}
        style={containerStyle}
        zoomControl={true}
        attributionControl={false}
      >
        {/* <TileLayer
          attribution='Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap contributors'
          url={`https://maps.geoapify.com/v1/styles/osm-carto/vector/tile/{z}/{x}/{y}.pbf?apiKey=${process.env.REACT_APP_GEOAPIFY_API_KEY}`}
          maxZoom={20}
        /> */}
        <TileLayer
          attribution='Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={currentPosition} />

        {pickup && (
          <Marker
            position={[pickup.lat, pickup.lng]}
            icon={L.divIcon({
              className: "custom-div-icon",
              html: '<div style="background-color: #4CAF50; padding: 5px; border-radius: 50%; color: white;">P</div>',
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            })}
          >
            <Popup>Pickup Location</Popup>
          </Marker>
        )}

        {destination && (
          <Marker
            position={[destination.lat, destination.lng]}
            icon={L.divIcon({
              className: "custom-div-icon",
              html: '<div style="background-color: #f44336; padding: 5px; border-radius: 50%; color: white;">D</div>',
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            })}
          >
            <Popup>Destination</Popup>
          </Marker>
        )}

        <Marker position={currentPosition} icon={bikeIcon}>
          <Popup>You are here</Popup>
        </Marker>

        {routePath.length > 1 && (
          <Polyline
            positions={routePath}
            color="#4285F4"
            weight={5}
            opacity={0.9}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default LiveTracking;
