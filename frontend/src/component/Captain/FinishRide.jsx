import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FinishRide = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const endRide = () => {
    // Simulate an action and navigation after clicking Finish Ride
    setLoading(true);
    setError(null);

    // Simulating a delay for ride completion
    setTimeout(() => {
      setLoading(false);
      // Navigate to the home page after the simulated finish
      navigate("/captain-home");
    }, 1000); // Simulating a 1-second delay
  };

  return (
    <div className="p-4">
      {/* Close Panel Button */}
      <h5
        className="p-1 text-center w-[93%] absolute top-0 cursor-pointer"
        onClick={() => props.setFinishRidePanel(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5 text-center text-gray-800">
        Finish this Ride
      </h3>

      {/* Rider Info */}
      <div className="flex items-center justify-between p-4 border-2 border-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3">
          <img
            className="h-12 rounded-full object-cover w-12"
            src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
            alt=""
          />
          <h2 className="text-lg font-medium">
            {props.ride?.user.fullname.firstname}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">2.2 KM</h5>
      </div>

      {/* Address and Fare Information */}
      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill text-gray-600"></i>
            <div>
              <h3 className="text-lg font-medium">{props.ride?.pickup}</h3>
              <p className="text-sm -mt-1 text-gray-500">Pickup Location</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-2-fill text-gray-600"></i>
            <div>
              <h3 className="text-lg font-medium">{props.ride?.destination}</h3>
              <p className="text-sm -mt-1 text-gray-500">Destination</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line text-gray-600"></i>
            <div>
              <h3 className="text-lg font-medium">₹{props.ride?.fare}</h3>
              <p className="text-sm -mt-1 text-gray-500">Cash Payment</p>
            </div>
          </div>
        </div>

        {/* Finish Ride Button */}
        <div className="mt-10 w-full">
          <button
            onClick={endRide}
            disabled={loading}
            className={`w-full mt-5 flex text-lg justify-center ${
              loading ? "bg-gray-400" : "bg-green-600"
            } text-white font-semibold p-3 rounded-lg`}
          >
            {loading ? "Processing..." : "Finish Ride"}
          </button>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default FinishRide;
