import React, { useState, forwardRef } from "react";
import { useNavigate } from "react-router-dom";

const ConfirmRidePopUp = forwardRef(
  ({ ride, setRidePopupPanel, setConfirmRidePopupPanel }, ref) => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    const submitHandler = (e) => {
      e.preventDefault();
      setConfirmRidePopupPanel(false);
      setRidePopupPanel(false);
      navigate("/captain-riding", { state: { ride } });
    };

    return (
      <div
        ref={ref}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      >
        <div className="w-full sm:max-w-md bg-white rounded-t-2xl px-6 pt-6 pb-10 shadow-xl transition-all duration-300 animate-slideUp text-gray-800">
          {/* Header */}
          <div className="flex justify-center w-full relative mb-4">
            <button
              onClick={() => setRidePopupPanel(false)}
              className="absolute top-0 right-3 text-gray-400 hover:text-gray-600"
            >
              <i className="ri-close-line text-3xl"></i>
            </button>
            <h3 className="text-2xl font-bold text-center text-green-700">
              🟢 Confirm Delivery Start
            </h3>
          </div>

          {/* Customer Info */}
          <div className="flex items-center justify-between p-4 border-2 border-yellow-400 bg-yellow-50 rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <img
                className="h-12 w-12 rounded-full object-cover border-2 border-white"
                src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
                alt="Customer"
              />
              <div>
                <h2 className="text-lg font-semibold capitalize">
                  {ride?.user?.firstname ?? "Fullname"}{" "}
                  {ride?.user?.lastname ?? ""}
                </h2>
                <p className="text-sm text-gray-600">Customer</p>
              </div>
            </div>
            <h5 className="text-lg font-bold text-gray-700">
              📍 {ride?.distance ?? "2.2 KM"}
            </h5>
          </div>

          {/* Delivery Info */}
          <div className="w-full mt-6 space-y-4">
            <div className="flex items-center gap-4 border-b pb-2">
              <i className="ri-store-2-fill text-xl text-blue-600"></i>
              <div>
                <h3 className="text-base font-semibold">
                  {ride?.pickup ?? "Warehouse 562/11-A"}
                </h3>
                <p className="text-sm text-gray-500">Pickup Location</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b pb-2">
              <i className="ri-home-4-fill text-xl text-red-500"></i>
              <div>
                <h3 className="text-base font-semibold">
                  {ride?.destination ?? "Customer 562/11-A"}
                </h3>
                <p className="text-sm text-gray-500">Delivery Location</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <i className="ri-wallet-3-line text-xl text-green-700"></i>
              <div>
                <h3 className="text-base font-semibold">₹{ride?.fare ?? 100}</h3>
                <p className="text-sm text-gray-500">Cash on Delivery</p>
              </div>
            </div>
          </div>

          {/* OTP and Actions */}
          <div className="mt-6 w-full">
            <form onSubmit={submitHandler}>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                type="text"
                className="bg-gray-100 px-6 py-4 font-mono text-lg rounded-xl w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter Delivery OTP"
                required
              />

              <button
                type="submit"
                className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition"
              >
                Confirm & Start Delivery
              </button>

              <button
                type="button"
                onClick={() => {
                  setConfirmRidePopupPanel(false);
                  setRidePopupPanel(false);
                }}
                className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
);

export default ConfirmRidePopUp;
