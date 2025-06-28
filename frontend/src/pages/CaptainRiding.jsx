import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import FinishRide from "../component/Captain/FinishRide";
import gsap from "gsap";
import LiveTracking from "../component/Captain/LiveTracking";

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);

  // Trigger animations for the Finish Ride panel
  useEffect(() => {
    if (finishRidePanel) {
      gsap.to(finishRidePanelRef.current, {
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    } else {
      gsap.to(finishRidePanelRef.current, {
        y: "100%",
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [finishRidePanel]);

  return (
    <div className="h-screen relative flex flex-col justify-end bg-[#f3f4f6]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 flex items-center justify-between p-6 bg-white shadow-md z-10">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="WhiffÉlite Logo"
        />
        <Link
          to="/captain-home"
          className="h-10 w-10 bg-[#ff6347] text-white flex items-center justify-center rounded-full shadow-md"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Ride Information */}
      <div
        className="h-1/5 p-6 flex items-center justify-between bg-[#ffcc00] relative rounded-b-3xl shadow-md mt-16 cursor-pointer"
        onClick={() => setFinishRidePanel(true)}
      >
        <h5 className="absolute top-3 left-1/2 transform -translate-x-1/2 text-3xl text-gray-800">
          <i className="ri-arrow-up-wide-line"></i>
        </h5>
        <div>
          <h4 className="text-xl font-semibold text-gray-800">4 KM away</h4>
          <p className="text-sm text-gray-600">Approximate Time: 8 mins</p>
        </div>
        <button className="bg-[#ff6347] text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-[#e5533e] transition duration-200">
          Complete Ride
        </button>
      </div>

      {/* Finish Ride Pop-Up */}
      <div
        ref={finishRidePanelRef}
        className="fixed w-full z-[500] bottom-0 transform translate-y-full bg-white px-3 py-10 pt-12 shadow-lg rounded-t-3xl"
      >
        <FinishRide setFinishRidePanel={setFinishRidePanel} />
      </div>

      {/* Live Tracking */}
      <div className="fixed w-full top-0 left-0 right-0 z-[-1]">
        <LiveTracking />
      </div>
    </div>
  );
};

export default CaptainRiding;
