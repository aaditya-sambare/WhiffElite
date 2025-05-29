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

  // Check screen width for mobile
  const isMobile = window.innerWidth < 768;

  // Animate sidebar for mobile only
  useEffect(() => {
    if (sidebarOpen && isMobile) {
      gsap.to(".sidebar", { duration: 0.5, x: 0, ease: "power3.out" });
    } else if (isMobile) {
      gsap.to(".sidebar", { duration: 0.5, x: -250, ease: "power3.in" });
    }
  }, [sidebarOpen, isMobile]);

  // Close drawer on outside click (mobile only)
  useEffect(() => {
    if (!sidebarOpen) return;
    function handleClickOutside(event) {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 768
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
      {/* Overlay for mobile drawer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Drawer) */}
      <aside
        ref={sidebarRef}
        className={`
          sidebar fixed md:relative z-40 md:z-10 top-0 left-0 h-full w-64 border-r px-6 py-8 bg-gray-50 shadow-sm
          transition-transform transform
          -translate-x-full md:translate-x-0
        `}
        style={{
          // Keep sidebar open on md+ screens
          transform:
            sidebarOpen || window.innerWidth >= 768
              ? "translateX(0)"
              : "translateX(-100%)",
        }}
      >
        <div className="flex flex-col items-center text-center mb-10">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt="Profile"
              className="h-24 w-24 rounded object-cover shadow"
            />
          ) : (
            <FaUser className="text-5xl mb-2 text-gray-400" />
          )}

          <h2 className="text-lg font-bold mt-2">
            Hello,{" "}
            {profile.firstname
              ? profile.firstname.toUpperCase()
              : profile.email || "Guest"}
          </h2>
          <span className="text-sm text-blue-600 underline cursor-pointer">
            View Details
          </span>
        </div>

        <nav className="space-y-4 text-m">
          {sidebarItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-100 transition"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="text-blue-600">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-12 overflow-auto bg-white">
        {/* Sidebar Toggle Button (mobile only) */}
        {!sidebarOpen && (
          <button
            className="md:hidden text-black text-3xl font-semibold absolute top-5 left-6"
            onClick={() => setSidebarOpen(true)}
          >
            <i className="ri-menu-fold-2-line"></i>
          </button>
        )}

        {/* Logout and Profile Title in One Line */}
        <div className="flex items-center justify-between mb-4 mt-2">
          <h1 className="text-2xl font-semibold text-gray-800 pl-12 sm:pl-0">
            Profile Details
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 transition"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </button>
        </div>

        <div className="bg-gray-50 border rounded-lg shadow-sm p-4 sm:p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                value={profile.firstname || ""}
                disabled
                className="w-full p-3 border rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                value={profile.lastname || ""}
                disabled
                className="w-full p-3 border rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={profile.email || ""}
                disabled
                className="w-full p-3 border rounded bg-gray-100"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
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
        </div>
      </main>
    </div>
  );
};

export default Profile;
