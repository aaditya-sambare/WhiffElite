import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerStoreOwner } from "../redux/slice/storeOwnerAuthSlice";
import { useNavigate, Link } from "react-router-dom";
import login from "../assets/Logo/logo.jpg"; // Replace with appropriate image
import { FaCar, FaStore, FaUser } from "react-icons/fa";

const StoreOwnerRegister = () => {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    contact: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(
    (state) => state.storeOwnerAuth
  );

 
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerStoreOwner(form)).then((res) => {
      if (!res.error) navigate("/store-owner/dashboard");
    });
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-gray-100 p-4">
      {/* Left Side: Login Form */}
      <div className="w-full md:max-w-md bg-white p-8 rounded-lg border shadow-sm md:mr-10 mb-6 md:mb-0">
        <div className="flex justify-center mb-6">
          <h2 className="text-2xl font-bold"> Welcome Store Owner</h2>
        </div>
        <h3 className="text-xl font-semibold text-center mb-2">
          Join WhiffÉlite Marketplace 🛒
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              First name
            </label>
            <input
              type="text"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter your first name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Last name
            </label>
            <input
              type="text"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter your last name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter your mobile number"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}

          <p className="mt-6 text-center text-sm">
            Already registered?{" "}
            <Link
              to="/store-owner/login"
              className="text-blue-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </form>

        <div className="mt-6">
          <p className="text-center text-sm text-gray-500 mb-3">Login as:</p>
          <div className="flex justify-center gap-6">
            <Link
              to={"/captain-login"}
              className="flex flex-col items-center text-gray-700 hover:text-black"
            >
              <FaCar className="text-3xl mb-1" />
              <span className="text-xs">Captain</span>
            </Link>

            <Link
              to={`/login`}
              className="flex flex-col items-center text-gray-700 hover:text-black"
            >
              <FaUser className="text-3xl mb-1" />
              <span className="text-xs">Customer</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Right side: Image Section */}
      <div className="hidden md:block w-1/2 bg-black rounded-lg">
        <div className="h-full flex flex-col justify-center items-center px-6">
          <img
            src={login}
            alt="Store Owner Registration"
            className="h-[750px] w-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerRegister;
