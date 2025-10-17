import React from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const containerStyle = {
  width: "100%",
  height: "260px",
};

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Custom bike icon
const bikeIcon = L.icon({
  iconUrl: "/bike-icon.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Add MapUpdater component
function MapUpdater({ center }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const CaptainMap = ({ lat, lng }) => {
  const position = [lat, lng];

  return (
    <div style={containerStyle}>
      <MapContainer
        center={position}
        zoom={18}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={position} />
        <Marker position={position} icon={bikeIcon} />
      </MapContainer>
    </div>
  );
};

export default CaptainMap;
