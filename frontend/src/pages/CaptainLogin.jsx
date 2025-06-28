import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import login from "../assets/Logo/logo.jpg";
import { loginCaptain } from "../redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getRedirectPathByRole } from "../utils/redirectUtils";
import { FaCar, FaStore, FaUser } from "react-icons/fa";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { captain, guestId, loading } = useSelector((state) => state.auth);

  const [toastShown, setToastShown] = useState(false);

  const redirect =
    new URLSearchParams(location.search).get("redirect") || "/captain-home";

  useEffect(() => {
    if (captain && !toastShown) {
      setToastShown(true);
      toast.success("Successfully Logged In!");
      navigate(getRedirectPathByRole("captain"));
    }
  }, [captain, toastShown, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginCaptain({ email: email.toLowerCase(), password }));
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-gray-100 p-4">
      {/* Left Side: Login Form */}
      <div className="w-full md:max-w-md bg-white p-8 rounded-lg border shadow-sm md:mr-10 mb-6 md:mb-0">
        <h2 className="text-2xl text-center font-bold">WhiffÉlite</h2>
        <h3 className="text-xl font-semibold text-center mb-2">
          Hello Captain 👋
        </h3>
        <p className="text-center mb-6">Enter your email and password.</p>
        <form onSubmit={handleSubmit}>
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
            {loading ? "loading..." : "Sign In"}
          </button>

          <p className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link
              to={`/captain-register?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500 hover:underline"
            >
              Register as Captain
            </Link>
          </p>
        </form>

        <div className="mt-6">
          <p className="text-center text-sm text-gray-500 mb-3">Login as:</p>
          <div className="flex justify-center gap-6">
            <Link
              to={"/login"}
              className="flex flex-col items-center text-gray-700 hover:text-black"
            >
              <FaUser className="text-3xl mb-1" />
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

      {/* Right Side: Image */}
      <div className="hidden md:block md:w-1/2 bg-black rounded-lg">
        <div className="h-full flex justify-center items-center px-6">
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

export default CaptainLogin;
