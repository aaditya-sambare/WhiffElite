import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import "remixicon/fonts/remixicon.css";

const DeliveryPopUp = React.forwardRef(
  (
    {
      ride,
      setRidePopupPanel,
      setConfirmRidePopupPanel,
      confirmRide,
      currentRide,
    },
    ref
  ) => {
    if (!ride) return null;

    const { user, distance, pickup, destination, fare } = ride;
    const [remainingTime, setRemainingTime] = useState(15); // Timer starts at 15 seconds
    const [isPopupVisible, setIsPopupVisible] = useState(true); // Popup visibility control
    const ridePopupPanelRef = useRef(null);

    const isBusy = !!currentRide; // true if captain has an active ride

    // Timer logic to close the popup after 15 seconds
    useEffect(() => {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setRidePopupPanel(false); // Close popup after 15 seconds
          }
          return prevTime - 1;
        });
      }, 2000);

      return () => clearInterval(timer); // Cleanup timer on unmount
    }, [setRidePopupPanel]);

    // GSAP animation for popup open/close
    useEffect(() => {
      if (ridePopupPanelRef.current) {
        if (isPopupVisible) {
          gsap.fromTo(
            ridePopupPanelRef.current,
            { y: "100%", opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
          );
        } else {
          gsap.to(ridePopupPanelRef.current, {
            y: "100%",
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
          });
        }
      }
    }, [isPopupVisible]);

    // Log the ride info for debugging
    console.log("ride", ride._id);

    return (
      <div
        ref={ridePopupPanelRef}
        className="text-gray-800 fixed z-40 left-0 right-0 bottom-0 mx-auto max-w-md w-full px-4 pb-6"
      >
        {/* Header */}
        <div className="bg-white rounded-xl shadow-xl p-4 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-green-700">
              📦 New Delivery Assigned!
            </h3>
            <h3 className="text-xl font-bold text-red-700">
              {" "}
              {remainingTime}s left
            </h3>
            <button
              onClick={() => setRidePopupPanel(false)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>

          {/* Customer Info */}
          <div className="flex items-center justify-between bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-3 shadow-inner">
            <div className="flex items-center gap-3">
              <img
                className="h-12 w-12 rounded-full object-cover border-2 border-white"
                src={user.profileImage}
                alt="Customer"
              />
              <div className="text-white">
                <h2 className="text-lg font-semibold">
                  {user?.firstname ?? "Unknown"}
                </h2>
                <p className="text-sm">
                  {user?.firstname} {user?.lastname}
                </p>
                <p className="text-sm">{user?.contact ?? "N/A"}</p>
              </div>
            </div>
            <div className="text-white font-bold text-lg">
              <i className="ri-map-pin-line text-xl text-red-600"></i>
              {distance ? (distance / 1000).toFixed(2) + " km" : "N/A"}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <i className="ri-store-2-fill text-xl text-blue-600 mt-1"></i>
              <div>
                <h3 className="font-semibold">Pickup Location</h3>
                <p className="text-sm text-gray-500">{pickup ?? "N/A"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <i className="ri-home-4-fill text-xl text-red-500 mt-1"></i>
              <div>
                <h3 className="font-semibold">Delivery Location</h3>
                <p className="text-sm text-gray-500">{destination ?? "N/A"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <i className="ri-wallet-3-line text-xl text-green-700 mt-1"></i>
              <div>
                <h3 className="font-semibold text-lg">₹ {fare ?? "0"}</h3>
                <p className="text-sm text-gray-500">Payment: Cash</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-2">
            <button
              onClick={() => {
                if (!isBusy) {
                  setConfirmRidePopupPanel(true);
                  confirmRide(ride._id); // <-- pass the ride id here
                }
              }}
              className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition ${
                isBusy ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={isBusy}
            >
              ✅ Accept Delivery
            </button>

            {isBusy && (
              <div className="text-red-600 text-center text-sm font-semibold">
                You are already assigned to another order.
              </div>
            )}

            <button
              onClick={() => setRidePopupPanel(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition"
            >
              ❌ Ignore
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default DeliveryPopUp;
