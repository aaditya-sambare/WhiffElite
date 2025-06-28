import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleCaptainOnline,
  fetchCaptainProfile,
} from "../../redux/slice/authSlice";
import LiveTracking from "./LiveTracking";
import PopupWithMap from "./PopupWithMap";

const CaptainDetails = () => {
  const { captain } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [recentRides, setRecentRides] = useState([]);
  const [currentRide, setCurrentRide] = useState(null);
  const [showNewRidePopup, setShowNewRidePopup] = useState(false);
  const [isTogglingOnline, setIsTogglingOnline] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const [pickupConfirmed, setPickupConfirmed] = useState(false);
  const [storeOtp, setStoreOtp] = useState("");
  const [customerOtp, setCustomerOtp] = useState("");
  const [captainRating, setCaptainRating] = useState(0);
  const [productRatings, setProductRatings] = useState({});
  const [showDirections, setShowDirections] = useState(false);
  const [showMapPopup, setShowMapPopup] = useState(false);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [captainLocation, setCaptainLocation] = useState(null);

  const prevRideIdsRef = useRef([]);
  const newRideAudio = useRef(null);

  useEffect(() => {
    const handleUserInteraction = () => setUserInteracted(true);
    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("touchstart", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    if (userInteracted && !newRideAudio.current) {
      newRideAudio.current = new Audio("/new-ride.mp3");
      newRideAudio.current.load();
    }
  }, [userInteracted]);

  useEffect(() => {
    if (!captain) dispatch(fetchCaptainProfile());
  }, [captain, dispatch]);

  useEffect(() => {
    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCaptainLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {},
        { enableHighAccuracy: true }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const fetchRecentRides = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/rides/pending-for-captain`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("captainToken")}`,
          },
        }
      );

      const previousIds = prevRideIdsRef.current;
      const newRideAdded = data.some((ride) => !previousIds.includes(ride._id));

      setRecentRides(data);
      prevRideIdsRef.current = data.map((r) => r._id);

      if (newRideAdded && userInteracted && newRideAudio.current) {
        newRideAudio.current
          .play()
          .catch((err) => console.warn("Audio play failed:", err));
        setShowNewRidePopup(true);
        setTimeout(() => setShowNewRidePopup(false), 3000);
      }
    } catch (error) {
      console.error("Failed to fetch recent rides:", error);
    }
  };

  const fetchCurrentRide = async () => {
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
      setPickupConfirmed(false); // reset OTP flow on new ride
    } catch {
      setCurrentRide(null);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchCaptainProfile());
      fetchRecentRides();
      fetchCurrentRide();
    }, 1250);

    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    const fetchCoords = async () => {
      if (
        currentRide &&
        currentRide.pickup &&
        currentRide.destination &&
        showDirections
      ) {
        try {
          const [pickupRes, destRes] = await Promise.all([
            axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/api/maps/get-coordinates`,
              {
                params: { address: currentRide.pickup },
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "captainToken"
                  )}`,
                },
              }
            ),
            axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/api/maps/get-coordinates`,
              {
                params: { address: currentRide.destination },
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "captainToken"
                  )}`,
                },
              }
            ),
          ]);
          setPickupCoords(pickupRes.data);
          setDestinationCoords(destRes.data);
        } catch (err) {
          setPickupCoords(null);
          setDestinationCoords(null);
        }
      } else {
        setPickupCoords(null);
        setDestinationCoords(null);
      }
    };
    fetchCoords();
  }, [currentRide, showDirections]);

  const handleToggleOnline = async () => {
    if (!captain) return;
    setIsTogglingOnline(true);
    try {
      await dispatch(toggleCaptainOnline(!captain.isOnline)).unwrap();
    } catch {
      alert("Failed to update status");
    } finally {
      setIsTogglingOnline(false);
    }
  };

  const handleAcceptRide = async (rideId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/rides/captain-accept`,
        { rideId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("captainToken")}`,
          },
        }
      );
      alert("Ride accepted!");
      setRecentRides((rides) => rides.filter((r) => r._id !== rideId));
    } catch (error) {
      alert(
        "Failed to accept ride: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleStoreOtpSubmit = async (e) => {
    e.preventDefault();
    if (storeOtp.trim() === "") return alert("Enter store OTP");

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/rides/verify-store-otp`,
        {
          rideId: currentRide._id,
          otp: storeOtp,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("captainToken")}`,
          },
        }
      );
      alert("Pickup confirmed, ride started!");
      setPickupConfirmed(true);
      setShowDirections(true);
      setShowMapPopup(true);
      fetchCurrentRide(); // Refresh ride status
    } catch (error) {
      alert(
        "OTP verification failed: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleCustomerOtpSubmit = async (e) => {
    e.preventDefault();
    if (customerOtp.trim() === "") return alert("Enter customer OTP");

    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/rides/confirm-delivery`,
        {
          rideId: currentRide._id,
          otp: customerOtp,
          rating: captainRating,
          productRatings: Object.entries(productRatings).map(
            ([productId, rating]) => ({ productId, rating })
          ),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("captainToken")}`,
          },
        }
      );

      alert("Delivery marked as completed");
      setCurrentRide(null);
      setPickupConfirmed(false);
      setStoreOtp("");
      setCustomerOtp("");
      setShowDirections(false);
      setShowMapPopup(false);
    } catch (error) {
      console.log(error);
      alert(
        "Delivery failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  const avgRating =
    captain.ratings && captain.ratings.length
      ? (
          captain.ratings.reduce((a, b) => a + b, 0) / captain.ratings.length
        ).toFixed(1)
      : "No ratings";

  const totalEarnings = Array.isArray(captain?.deliveries)
    ? captain.deliveries.reduce(
        (total, delivery) => total + (delivery.earnings || 0),
        0
      )
    : 0;

  console.log(captain);

  return (
    <div className="p-4 w-full space-y-10">
      {showNewRidePopup && (
        <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-md shadow-lg transition-all animate-slide-in">
          🚗 New ride available!
        </div>
      )}

      {/* Profile Info */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <img
            className="h-14 w-14 rounded-full object-cover border border-gray-300"
            src={captain?.profileImage}
            alt={captain?.firstname}
          />
          <div>
            <h4 className="font-semibold text-gray-800">
              {captain?.firstname || "Unknown"} {captain?.lastname || ""}
            </h4>
            <p
              className={`text-sm font-medium ${
                captain?.isOnline ? "text-green-600" : "text-red-500"
              }`}
            >
              {captain?.isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleOnline}
          disabled={isTogglingOnline}
          className={`px-5 py-2 rounded-full font-semibold shadow-sm transition-colors flex items-center gap-2 ${
            captain?.isOnline
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          } ${isTogglingOnline ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {isTogglingOnline && (
            <span className="loader border-white border-2 w-4 h-4 rounded-full animate-spin"></span>
          )}
          {captain?.isOnline ? "Go Offline" : "Go Online"}
        </button>

        <div className="text-right">
          <h4 className="text-xl font-bold text-gray-900">₹ {totalEarnings}</h4>
          <p className="text-sm text-gray-500">Total Earnings</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-white rounded-xl p-4 shadow-sm">
        {[
          {
            icon: "ri-bike-line",
            value: captain.vehicle
              ? [captain.vehicle.vehicleType, ": ", captain.vehicle.plate]
              : "—",

            label: "Vehical Details",
            color: "text-blue-500",
          },
          {
            icon: "ri-speed-up-line",
            value: Array.isArray(captain?.deliveries)
              ? captain.deliveries.length
              : 0,

            label: "Rides Completed",
            color: "text-green-500",
          },
          {
            icon: "ri-booklet-line",
            value: avgRating,
            label: "Rating",
            color: "text-yellow-500",
          },
        ].map((stat, i) => (
          <div key={i} className="text-center space-y-1">
            <i className={`${stat.icon} text-3xl ${stat.color}`}></i>
            <h5 className="text-lg font-semibold capitalize">{stat.value}</h5>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Current Ride Section */}
      {currentRide &&
      (currentRide.status === "accepted" ||
        currentRide.status === "enroute") ? (
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-6">
            <div>
              <p className="text-xs text-gray-500">Customer</p>
              <h4 className="font-semibold text-gray-800">
                {currentRide.user.firstname} {currentRide.user.lastname}
              </h4>
            </div>
            <div>
              <p className="text-xs text-gray-500">Pickup</p>
              <h4 className="font-medium text-gray-800">
                {currentRide.pickup?.split(",")[0]}
              </h4>
            </div>
            <div>
              <p className="text-xs text-gray-500">Drop</p>
              <h4 className="font-medium text-gray-800">
                {currentRide.destination?.split(",")[0]}
              </h4>
            </div>
            <div>
              <p className="text-xs text-gray-500">Fare</p>
              <h4 className="text-sm font-semibold text-black">
                ₹{currentRide.fare || "—"}
              </h4>
            </div>
          </div>

          {/* OTP Logic */}
          {currentRide.status === "enroute" ? (
            <form onSubmit={handleCustomerOtpSubmit} className="space-y-3">
              <input
                type="text"
                value={customerOtp}
                onChange={(e) => setCustomerOtp(e.target.value)}
                placeholder="Enter Customer OTP"
                className="w-full p-3 rounded-lg border border-gray-300"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Mark as Delivered
              </button>
            </form>
          ) : (
            <form onSubmit={handleStoreOtpSubmit} className="space-y-3">
              <input
                type="text"
                value={storeOtp}
                onChange={(e) => setStoreOtp(e.target.value)}
                placeholder="Enter Store OTP"
                className="w-full p-3 rounded-lg border border-gray-300"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Start Ride
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-600 shadow-sm">
          No current ride assigned.
        </div>
      )}

      {/* Recent Rides */}
      {!currentRide && recentRides.length > 0 && captain?.isOnline && (
        <table className="min-w-full text-sm text-left text-gray-800 border rounded-md overflow-hidden">
          <thead className="bg-gray-100 font-medium text-gray-700">
            <tr>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Pickup</th>
              <th className="px-4 py-2">Drop</th>
              <th className="px-4 py-2">Distance</th>
              <th className="px-4 py-2">Fare</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentRides.map((ride) => (
              <tr
                key={ride._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-4 py-2 font-semibold capitalize">
                  {ride.user.firstname} {ride.user.lastname}
                </td>
                <td className="px-4 py-2">{ride.pickup?.split(",")[0]}</td>
                <td className="px-4 py-2">{ride.destination?.split(",")[0]}</td>
                <td className="px-4 py-2">
                  {(ride.distance / 1000).toFixed(2)} km
                </td>
                <td className="px-4 py-2">₹{ride.fare}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleAcceptRide(ride._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Accept
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <PopupWithMap
        isOpen={showMapPopup}
        onClose={() => setShowMapPopup(false)}
        pickupLat={pickupCoords?.lat}
        pickupLng={pickupCoords?.lng}
        destinationLat={destinationCoords?.lat}
        destinationLng={destinationCoords?.lng}
        captainLat={captainLocation?.lat}
        captainLng={captainLocation?.lng}
        pickupAddress={currentRide?.pickup}
        destinationAddress={currentRide?.destination}
      />
    </div>
  );
};

export default CaptainDetails;
