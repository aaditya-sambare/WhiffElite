import React, { useState } from "react";


import ConfirmRidePopUp from '../component/Captain/ConfirmRidePopUp';
import RidePopUp from '../component/Captain/RidePopUp';

const TestRidePopupPage = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);

  const mockRide = {
    user: "Aaditya",
    distance: "2.2 KM",
    pickup: "562/11-A",
    destination: "78/B, Green Street",
    fare: 100,
  };

  const confirmRide = () => {
    setConfirmRidePopupPanel(true);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Captain Dashboard</h2>
      <button
        onClick={() => setRidePopupPanel(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Show Ride Popup
      </button>

      {ridePopupPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
            <RidePopUp
              setRidePopupPanel={setRidePopupPanel}
              setConfirmRidePopupPanel={setConfirmRidePopupPanel}
              confirmRide={confirmRide}
              ride={mockRide}
            />
          </div>
        </div>
      )}

      {confirmRidePopupPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-lg">
            <ConfirmRidePopUp
              setRidePopupPanel={setRidePopupPanel}
              setConfirmRidePopupPanel={setConfirmRidePopupPanel}
              ride={mockRide}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TestRidePopupPage;
