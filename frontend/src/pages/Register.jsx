import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import login from "../assets/Logo/logo.jpg";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slice/authSlice";
import { mergeCart } from "../redux/slice/cartSlice";
import { toast } from "react-toastify";

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

  // This will handle successful registration
  useEffect(() => {
    if (user) {
      toast.success("Successfully Registered!"); // Show success toast
      if (cart?.products?.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate("/"); // Redirect to home page after cart merge
        });
      } else {
        navigate("/"); // Redirect to home page if no cart
      }
    }
  }, [user, guestId, cart, dispatch, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ firstname, lastname, email, password, contact }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Left side: Login Form */}
      <div className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm mr-10">
        {" "}
        {/* Added margin-right */}
        <div className="flex justify-center mb-6">
          <h2 className="text-2xl font-bold">WiffÉlite</h2>
        </div>
        <h3 className="text-xl font-semibold text-center mb-2">
          Hey there! 👋
        </h3>
        <p className="text-center mb-6">Enter your email and password.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              First name
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
              Last name
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
            {loading ? "loading..." : "Sign Up"}
          </button>

          <p className="mt-6 text-center text-sm">
            Already have a account.{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
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

export default Register;
