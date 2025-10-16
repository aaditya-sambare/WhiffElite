import React, { useState, useEffect, useRef } from "react";
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
  FaSignOutAlt,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slice/authSlice";
import { clearCart } from "../redux/slice/cartSlice";
import { gsap } from "gsap";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (!sidebarRef.current || !isMobile) return;
    gsap.to(sidebarRef.current, {
      x: sidebarOpen ? 0 : -300,
      duration: 0.4,
      ease: "power3.inOut",
    });
  }, [sidebarOpen, isMobile]);

  useEffect(() => {
    if (!sidebarOpen) return;
    function handleClickOutside(event) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isMobile
      ) {
        setSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

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
    <div className="flex h-screen bg-white text-black relative">
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className="fixed z-40 md:relative top-0 left-0 h-full w-64 bg-gray-50 border-r px-6 py-8 shadow-md md:translate-x-0 transform -translate-x-full"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative w-24 h-24">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover shadow-lg border-4 border-blue-100"
              />
            ) : (
              <FaUser className="text-5xl text-gray-400 bg-blue-50 rounded-full p-4" />
            )}
          </div>
          <h2 className="text-lg font-bold mt-3">
            {profile.firstname
              ? profile.firstname.toUpperCase()
              : profile.email || "Guest"}
          </h2>
          <button className="mt-1 text-sm text-blue-600 hover:underline">
            <FaInfoCircle className="inline mr-1" /> View Details
          </button>
        </div>

        <nav className="space-y-3">
          {sidebarItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-100 transition text-sm font-medium text-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="text-blue-600">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 sm:p-6 md:p-12 overflow-auto bg-white relative">
        {/* Toggle Button */}
        {!sidebarOpen && (
          <button
            className="md:hidden text-black text-3xl absolute top-5 left-6"
            onClick={() => setSidebarOpen(true)}
          >
            <i className="ri-menu-line"></i>
          </button>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6 mt-4 px-2">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaUser className="mr-2 text-blue-600" />
            Profile
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition text-sm"
          >
            <FaSignOutAlt className="text-lg" />
            Logout
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 border rounded-xl shadow-md p-6 sm:p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "First Name", value: profile.firstname },
              { label: "Last Name", value: profile.lastname },
              { label: "Email", value: profile.email },
              { label: "Mobile Number", value: profile.contact },
            ].map((item, i) => (
              <div key={i}>
                <label className="block mb-1 text-sm font-semibold text-gray-700">
                  {item.label}
                </label>
                <input
                  type="text"
                  value={item.value || ""}
                  disabled
                  className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none text-gray-800"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium">
              Edit Profile
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
