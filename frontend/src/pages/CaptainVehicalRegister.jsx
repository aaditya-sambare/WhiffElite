import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerCaptain } from "../redux/slice/authSlice";
import login from "../assets/Logo/logo.jpg";
import { toast } from "react-toastify";
import { FaCar, FaStore } from "react-icons/fa";

const CaptainVehicleInfo = () => {
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, captain, error } = useSelector((state) => state.auth);

  const personalInfo = location.state;

  useEffect(() => {
    if (!personalInfo) navigate("/captain-register");
  }, [personalInfo, navigate]);

  useEffect(() => {
    if (captain) {
      toast.success("Successfully Registered!");
      navigate("/captain-home"); // or dashboard route
    }

    if (error) {
      toast.error("Registration failed. Please try again.");
      setErrorMessage(error); // If there's an error, set the error message to display
    }
  }, [captain, error, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate vehicle plate (combination of alphabets and numbers)
    const plateRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/;
    if (!plateRegex.test(vehiclePlate)) {
      setErrorMessage(
        "Vehicle plate must be a combination of alphabets and numbers (e.g., ABC123)."
      );
      return;
    }

    // Convert vehicle plate to uppercase
    const formattedPlate = vehiclePlate.toUpperCase();

    // Validate vehicle capacity (ensure it's a positive number)
    if (vehicleCapacity <= 0) {
      setErrorMessage("Vehicle capacity must be a positive number.");
      return;
    }

    dispatch(
      registerCaptain({
        ...personalInfo,
        vehicle: {
          color: vehicleColor,
          plate: formattedPlate, // Send the uppercase formatted plate
          capacity: Number(vehicleCapacity),
          vehicleType,
        },
      })
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm mr-10">
        <h2 className="text-3xl font-bold text-center text-black mb-4 tracking-wide">
          Vehicle Details
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Help us know your delivery vehicle better to ensure optimized
          dispatching.
        </p>

        {/* Display Error Message */}
        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            value={vehicleColor}
            onChange={(e) => setVehicleColor(e.target.value)}
            required
            className="w-full p-2 mb-4 border rounded"
            placeholder="Vehicle Color"
          />
          <input
            value={vehiclePlate}
            onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())} // Automatically convert to uppercase
            required
            className="w-full p-2 mb-4 border rounded"
            placeholder="Vehicle Plate"
          />
          <input
            type="number"
            value={vehicleCapacity}
            onChange={(e) => setVehicleCapacity(e.target.value)}
            required
            className="w-full p-2 mb-4 border rounded"
            placeholder="Vehicle Capacity"
          />
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            required
            className="w-full p-2 mb-6 border rounded"
          >
            <option value="">Select vehicle type</option>
            <option value="bike">Bike</option>
            <option value="scooty">Scooty</option>
            <option value="ev">EV</option>
          </select>
          <button
            type="submit"
            disabled={loading} // Disable button while loading
            className="w-full bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition"
          >
            {loading ? "Registering..." : "Join Now"}
          </button>
        </form>

        <div className="mt-6">
          <p className="text-center text-sm text-gray-500 mb-3">Login as:</p>
          <div className="flex justify-center gap-6">
            <Link
              to={"/login"}
              className="flex flex-col items-center text-gray-700 hover:text-black"
            >
              <FaCar className="text-3xl mb-1" />
              <span className="text-xs">Customer</span>
            </Link>

            <Link
              to={`/store-owner/login`}
              className="flex flex-col items-center text-gray-700 hover:text-black"
            >
              <FaStore className="text-3xl mb-1" />
              <span className="text-xs">Store</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Right side: Image Section */}
      <div className="hidden md:block w-1/2 bg-black rounded-lg">
        <div className="h-full flex flex-col justify-center items-center px-6">
          <img
            src={login}
            alt="Login visual"
            className="h-[750px] w-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default CaptainVehicleInfo;
