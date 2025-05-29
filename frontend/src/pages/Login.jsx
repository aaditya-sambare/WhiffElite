import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import login from "../assets/Logo/logo.jpg";
import { loginUser, updateUserLocation } from "../redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slice/cartSlice";
import { toast } from "react-toastify";
import { FaCar, FaStore } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, loading, error, token } = useSelector(
    (state) => state.auth
  );
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    if (user && !toastShown) {
      setToastShown(true);
      toast.success("Successfully Logged In!");

      if (cart?.products?.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user }))
          .then(() => navigate(isCheckoutRedirect ? "/checkout" : "/"))
          .catch(() => {
            toast.error("Failed to merge cart. Please try again later.");
            navigate(isCheckoutRedirect ? "/checkout" : "/");
          });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }

    if (error && !toastShown) {
      toast.error(error);
      setToastShown(true);
    }
  }, [
    user,
    guestId,
    cart,
    dispatch,
    navigate,
    isCheckoutRedirect,
    toastShown,
    error,
  ]);

  const handleLogin = async (formData) => {
    const resultAction = await dispatch(loginUser(formData));
    if (loginUser.fulfilled.match(resultAction)) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          dispatch(
            updateUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              token: resultAction.payload.token,
            })
          );
        });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin({ email: email.toLowerCase(), password }).catch(() => {
      toast.error("Login failed. Please check your credentials and try again.");
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-100 p-4">
      {/* Left (Form) */}
      <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-lg shadow-md mb-8 md:mb-0 md:mr-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">WhiffÉlite</h2>
          <h3 className="text-xl font-semibold mt-2">Hey there! 👋</h3>
          <p className="text-sm text-gray-500">
            Enter your email and password.
          </p>
        </div>
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
        </form>

        <p className="mt-6 text-center text-sm">
          Don’t have an account?{" "}
          <Link
            to={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="text-blue-500 hover:underline"
          >
            Register
          </Link>
        </p>

        <div className="mt-6">
          <p className="text-center text-sm text-gray-500 mb-3">Login as:</p>
          <div className="flex justify-center gap-6">
            <Link
              to={`/captain-login?redirect=${encodeURIComponent(redirect)}`}
              className="flex flex-col items-center text-gray-700 hover:text-black"
            >
              <FaCar className="text-3xl mb-1" />
              <span className="text-xs">Captain</span>
            </Link>
            <Link
              to={`/store-owner/login?redirect=${encodeURIComponent(redirect)}`}
              className="flex flex-col items-center text-gray-700 hover:text-black"
            >
              <FaStore className="text-3xl mb-1" />
              <span className="text-xs">Store</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Right (Image) */}
      <div className="hidden md:block w-full md:w-1/2 max-w-[600px]">
        <img
          src={login}
          alt="Login visual"
          className="w-full h-auto object-cover rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default Login;
