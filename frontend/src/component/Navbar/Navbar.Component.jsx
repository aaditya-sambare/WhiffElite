import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CartDrawer from "../../layout/CartDrawer";
import SearchBar from "../Common/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleUser,
  faCartShopping,
  faSearch,
  faXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../../assets/Logo/logo1.png";
import useCaptainRole from "../../hook/useCaptainRole";

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();

  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const captain = useCaptainRole();

  const cartItemCount = cart?.products?.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  const toggleCartDrawer = () => setDrawerOpen(!drawerOpen);

  const handleUserClick = () => {
    if (user) {
      if (user.role === "captain") navigate("/captain-profile");
      else if (user.role === "admin") navigate("/admin");
      else navigate("/profile");
    } else navigate("/login");
  };

  const toggleMobileSearch = () => {
    setShowMobileSearch((prev) => !prev);
  };

  console.log("user in navbar:", user);

  return (
    <nav className="bg-black px-3 py-2 w-full">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="w-10 h-10 sm:w-8 sm:h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 object-contain"
            />
          </Link>
        </div>

        {/* Search bar - Desktop */}
        <div className="hidden sm:flex flex-1 max-w-sm sm:max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
          <SearchBar />
        </div>

        {/* Mobile Search Button */}
        <div className="sm:hidden flex-1 flex justify-center">
          <button
            onClick={toggleMobileSearch}
            className="text-gray-300 hover:text-white flex items-center gap-1"
          >
            <FontAwesomeIcon
              icon={showMobileSearch ? faXmark : faSearch}
              className="text-xl"
            />
            <span className="text-sm">
              {showMobileSearch ? "Close" : "Search"}
            </span>
          </button>
        </div>

        {/* User Location */}
        {user && (
          <div className="items-center gap-2 px-3 py-1 rounded-full shadow-sm hidden sm:flex">
            <FontAwesomeIcon
              icon={faLocationDot}
              className="w-4 h-4 text-red-500"
              aria-label="Location"
            />
            <span className="text-sm text-gray-200 font-medium truncate max-w-[200px] ">
              {user?.location?.name
                ? (() => {
                    const parts = user.location.name.split(",");
                    const locality = parts[0]?.trim() || "";
                    const city = parts[3]?.trim() || "";
                    return `${locality}${city ? ", " + city : ""}`;
                  })()
                : "Location not set"}
            </span>
          </div>
        )}

        {/* Icons */}
        <div className="flex items-center gap-4 sm:gap-3 lg:gap-8">
          {/* Cart */}
          <button
            onClick={toggleCartDrawer}
            className="relative text-gray-200 hover:text-white"
            aria-label="Cart"
          >
            <FontAwesomeIcon
              icon={faCartShopping}
              className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl"
            />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <button
            onClick={handleUserClick}
            className="text-gray-200 hover:text-white"
            aria-label="User Profile"
          >
            <FontAwesomeIcon
              icon={faCircleUser}
              className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl"
            />
          </button>
        </div>
      </div>

      {/* Mobile Search Input Dropdown */}
      {showMobileSearch && (
        <div className="sm:hidden px-4 pt-2">
          <SearchBar />
        </div>
      )}

      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />
    </nav>
  );
}

export default Navbar;
