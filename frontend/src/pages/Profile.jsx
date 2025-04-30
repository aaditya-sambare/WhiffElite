import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaHeart,
  FaBoxOpen,
  FaCog,
  FaStore,
  FaPhone,
  FaInfoCircle,
  FaCreditCard,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slice/authSlice";
import { clearCart } from "../redux/slice/cartSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.auth); // Get user from the Redux store
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Dynamically fetch profile data from the Redux store
  const profile = user || {};

  const sidebarItems = [
    { icon: <FaBoxOpen />, label: "My Orders", path: "/my-orders" },
    { icon: <FaHeart />, label: "My Wishlist", path: "/wishlist" },
    { icon: <FaCreditCard />, label: "Saved Details", path: "/saved-details" },
    { icon: <FaCog />, label: "Account Settings", path: "/settings" },
    { icon: <FaStore />, label: "Store Locator", path: "/store-locator" },
    { icon: <FaPhone />, label: "Contact Us", path: "/contact" },
    { icon: <FaInfoCircle />, label: "About Us", path: "/about" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-screen bg-white text-black">
      {/* Sidebar */}
      <aside className="w-64 border-r px-6 py-8">
        <div className="flex flex-col items-center text-center mb-10">
          <FaUser className="text-4xl mb-2" />
          <h2 className="text-lg font-bold">
            Hello{" "}
            {profile.firstname
              ? profile.firstname.toUpperCase()
              : profile.email || "Guest"}
          </h2>
          <span className="text-sm text-blue-600 underline cursor-pointer">
            View Details
          </span>
        </div>

        <nav className="space-y-4">
          {sidebarItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className="flex items-center space-x-3 hover:text-blue-500"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout button at bottom */}
        <div className="pt-6">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-red-600 hover:text-red-800"
          >
            <FaUser />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-auto">
        <h1 className="text-2xl font-semibold mb-6">Profile Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <div>
            <label className="block mb-1 text-sm font-medium">First Name</label>
            <input
              type="text"
              value={profile.firstname || ""}
              disabled
              className="w-full p-3 border rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Last Name</label>
            <input
              type="text"
              value={profile.lastname || ""}
              disabled
              className="w-full p-3 border rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              value={profile.email || ""}
              disabled
              className="w-full p-3 border rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Mobile Number
            </label>
            <input
              type="text"
              value={profile.contact || ""}
              disabled
              className="w-full p-3 border rounded bg-gray-100"
            />
          </div>
        </div>
        {/* 
        <button className="mt-8 px-6 py-3 bg-black text-white rounded hover:bg-gray-800">
          Edit
        </button> */}
      </main>
    </div>
  );
};

export default Profile;
