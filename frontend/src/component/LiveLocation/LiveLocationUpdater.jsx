import { useEffect } from "react";
import { useSelector } from "react-redux";
import { sendMessage } from "../Socket/socket"; // Your socket utility

const LiveLocationUpdater = ({ role }) => {
  const { user, captain } = useSelector((state) => state.auth);

  useEffect(() => {
    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Send location to backend via socket
          sendMessage("location-update", {
            role,
            id: role === "captain" ? captain?._id : user?._id,
            lat: latitude,
            lng: longitude,
          });
        },
        (err) => {},
        { enableHighAccuracy: true }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [role, user, captain]);

  return null;
};

export default LiveLocationUpdater;
