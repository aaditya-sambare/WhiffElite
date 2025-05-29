import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import login from "../assets/Logo/logo.jpg";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slice/authSlice";
import { mergeCart } from "../redux/slice/cartSlice";
import { toast } from "react-toastify";
import { FaCar, FaStore } from "react-icons/fa";

const Register = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, guestId, loading } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  useEffect(() => {
    if (user) {
      toast.success("Successfully Registered!");
      if (cart?.products?.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => navigate("/"));
      } else {
        navigate("/");
      }
    }
  }, [user, guestId, cart, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ firstname, lastname, email, password, contact }));
  };

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center px-4">
      {/* Left: Form */}
      <div className="w-full max-w-lg bg-white p-10 rounded-2xl shadow-lg mr-0 md:mr-10">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Welcome to WhiffÉlite</h2>
          <p className="text-gray-600 mt-2">Create your account below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="John"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="1234567890"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="example@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
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
                      to={`/store-owner/login`}
                      className="flex flex-col items-center text-gray-700 hover:text-black"
                    >
                      <FaStore className="text-3xl mb-1" />
                      <span className="text-xs">Store</span>
                    </Link>
                  </div>
                </div>
      </div>

      {/* Right: Image */}
      <div className="hidden md:block w-1/2 h-[650px] rounded-xl overflow-hidden shadow-lg">
        <img
          src={login}
          alt="Visual"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Register;
