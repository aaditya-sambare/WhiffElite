import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "260px",
};

const mapStyles = [
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road.local",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
];
  

const mapOptions = {
  mapTypeControl: false, // removes the map/satellite toggle
  fullscreenControl: true,
  streetViewControl: false,
  zoomControl: false, // optional: remove zoom buttons
  clickableIcons: false,
  disableDefaultUI: true, // disables all default UI, use this instead if you want a clean map
  styles: mapStyles,
};

const CaptainMap = ({ lat, lng }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const center = { lat, lng };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={18}
      options={mapOptions}
    >
      <Marker
        position={center}
        icon={{
          url: "/bike-icon.png", // make sure this is placed in public/
          scaledSize: new window.google.maps.Size(40, 40),
        }}
      />
    </GoogleMap>
  ) : (
    <div>Loading map...</div>
  );
};

export default CaptainMap;
