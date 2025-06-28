import React, {
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  useContext,
} from "react";
import { Link } from "react-router-dom";
import RidePopUp from "../component/Captain/RidePopUp";
import ConfirmRidePopUp from "../component/Captain/ConfirmRidePopUp";
import { gsap } from "gsap";
import logo from "../assets/Logo/logo1.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import CaptainDetails from "../component/Captain/CaptainDetails";
import { SocketContext } from "../context/SocketContext";
import { useSelector } from "react-redux";
import axios from "axios";
import LiveTracking from "../component/Captain/LiveTracking";



const sample = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [ride, setRide] = useState(null);
  const [currentRide, setCurrentRide] = useState(null);

  const { socket } = useContext(SocketContext);

  const { captain } = useSelector((state) => state.auth); // Get captain from Redux store

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);

  const ridePopupTimer = useRef(null);

  useEffect(() => {
    if (!captain) return;

    // Join captain room
    socket.emit("join", {
      userType: "captain",
      userId: captain._id,
    });

    // Location tracking
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        });
      }
    };

    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation();

    return () => clearInterval(locationInterval);
  }, [socket, captain]);

  useEffect(() => {
    if (!socket) return;
    const handler = (data) => {
      console.log("Received ride data:", data);
      if (data.status === "pending-captain") {
        setRide(data);
        setRidePopupPanel(true);
      }
    };
    socket.on("new-ride", handler);
    return () => socket.off("new-ride", handler);
  }, [socket]);

  useEffect(() => {
    async function fetchCurrentRide() {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/rides/current-for-captain`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("captainToken")}`,
            },
          }
        );
        setCurrentRide(data);
      } catch {
        setCurrentRide(null);
      }
    }
    fetchCurrentRide();

    // Optionally, poll every 10s
    const interval = setInterval(fetchCurrentRide, 10000);
    return () => clearInterval(interval);
  }, []);

  useLayoutEffect(() => {
    const popup = ridePopupPanelRef.current;
    if (!popup) return;

    // Clear any previous timer
    if (ridePopupTimer.current) clearTimeout(ridePopupTimer.current);

    if (ridePopupPanel) {
      // Slide in + fade in
      gsap.fromTo(
        popup,
        { y: "100%", opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );

      // Auto-close after 15 seconds
      ridePopupTimer.current = setTimeout(() => {
        setRidePopupPanel(false);
      }, 15000);
    } else {
      // Slide out + fade out
      gsap.to(popup, {
        y: "100%",
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
      });
    }

    // Cleanup on unmount
    return () => {
      if (ridePopupTimer.current) clearTimeout(ridePopupTimer.current);
    };
  }, [ridePopupPanel]);

  useLayoutEffect(() => {
    if (confirmRidePopupPanel && confirmRidePopupPanelRef.current) {
      gsap.to(confirmRidePopupPanelRef.current, {
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
    if (!confirmRidePopupPanel && confirmRidePopupPanelRef.current) {
      gsap.to(confirmRidePopupPanelRef.current, {
        y: "100%",
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [confirmRidePopupPanel]);

  async function confirmRide(rideId) {
    if (!captain) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/rides/captain-accept`,
        { rideId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("captainToken")}`,
          },
        }
      );

      // Optional: handle response.data if needed

      setRidePopupPanel(false);
      setConfirmRidePopupPanel(true);
      // setRecentRides((rides) => rides.filter((r) => r._id !== rideId));
    } catch (error) {
      alert(
        "Failed to accept ride: " +
          (error.response?.data?.message || error.message)
      );
    }
  }

  return (
    <div className="h-screen relative">
      {/* Header */}
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen z-20">
        <img className="w-16 bg-black rounded-lg" src={logo} alt="logo" />
        <Link
          to="/captain-profile"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md"
        >
          <FontAwesomeIcon icon={faCircleUser} size="2x" />
        </Link>
      </div>

      {/* Map Section */}
      <div className="h-[60vh]">
       <LiveTracking/>
      </div>

      {/* Captain Info Section */}
      <div className="h-[40vh] p-4">
        <div className="h-full w-full bg-white shadow rounded-xl p-4">
          <CaptainDetails />
        </div>
      </div>

      {/* Ride Pop-Up */}
      {ridePopupPanel && (
        <RidePopUp
          ref={ridePopupPanelRef}
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
          currentRide={currentRide} // pass as prop
        />
      )}

      {/* Confirm Ride Pop-Up */}
      {/* {confirmRidePopupPanel && (
        <ConfirmRidePopUp
          ref={confirmRidePopupPanelRef}
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
        />
      )} */}

      {/* Overlay */}
      {ridePopupPanel && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30" />
      )}
    </div>
  );
};

export default sample;
