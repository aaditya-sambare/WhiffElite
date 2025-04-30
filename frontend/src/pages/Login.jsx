import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import login from "../assets/Logo/logo.jpg";
import { loginUser } from "../redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slice/cartSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId ,loading} = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  // Get the redirect parameter and check if it's checkout or something
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  // Add a flag to track if toast has been shown
  const [toastShown, setToastShown] = useState(false);

  // If the user is logged in, handle cart merge and navigation
  useEffect(() => {
    if (user && !toastShown) {
      setToastShown(true); // Set the flag to true to prevent multiple toasts
      toast.success("Successfully Logged In!");

      if (cart?.products?.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, dispatch, navigate, isCheckoutRedirect, toastShown]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dispatch loginUser action
    dispatch(loginUser({ email: email.toLowerCase(), password }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Left side: Login Form */}
      <div className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm mr-10">
        <div className="flex justify-center mb-6">
          <h2 className="text-2xl font-bold">WiffÉlite</h2>
        </div>
        <h3 className="text-xl font-semibold text-center mb-2">
          Hey there! 👋
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
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500 hover:underline"
            >
              Register
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

export default Login;
