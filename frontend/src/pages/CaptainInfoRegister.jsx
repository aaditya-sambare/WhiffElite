import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import login from "../assets/Logo/logo.jpg";

const CaptainPersonalInfo = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const phonePattern = /^[0-9]{10}$/;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleNext = (e) => {
    e.preventDefault();

    if (!phonePattern.test(contact)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!passwordPattern.test(password)) {
      alert(
        "Password must be at least 8 characters, and contain at least 1 letter and 1 number."
      );
      return;
    }

    navigate("/captain-vehicle-info", {
      state: { firstname, lastname, contact, email, password },
    });
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-gray-100 p-4">
  
      <div className="w-full md:max-w-md bg-white p-8 rounded-lg border shadow-sm md:mr-10 mb-6 md:mb-0">
        <h2 className="text-3xl font-bold text-center text-black mb-2 tracking-wide">
          WhiffÉlite
        </h2>
        <h3 className="text-xl font-semibold text-center mb-1">
          Welcome, Future Captain 🚀
        </h3>
        <p className="text-center text-gray-600 mb-6">
          Start your journey by entering personal details.
        </p>

        <form onSubmit={handleNext}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              First Name
            </label>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your first name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your last name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your mobile number"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition"
          >
            Proceed to Vehicle Info
          </button>

          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link to="/captain-login" className="text-blue-500 hover:underline">
              Back to Login
            </Link>
          </p>
        </form>
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

export default CaptainPersonalInfo;
