import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CartDrawer from "../../layout/CartDrawer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HiBars3BottomRight } from "react-icons/hi2";
import SearchBar from "../Common/SearchBar";
import logo from "../../assets/Logo/logo1.png";
import { useSelector } from "react-redux";
import {
  faCircleUser,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";

function NavLg({ drawerOpen, toggleCartDrawer }) {
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const cartItemCount = cart?.products?.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleUserClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <div className="container flex mx-auto px-4 items-center justify-between">
        <div className="flex items-center w-1/2 gap-3">
          <div className="w-10 h-10">
            <Link to="/" className="flex items-center cursor-pointer">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-contain"
              />
            </Link>
          </div>
          <div className="overflow-hidden">
            <SearchBar />
          </div>
        </div>
        <div className="flex items-center gap-10">
          <button
            onClick={toggleCartDrawer}
            className="relative text-gray-200 hover:text-white"
          >
            <FontAwesomeIcon icon={faCartShopping} size="2x" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="block bg-black px-2 rounded text-sm text-white"
            >
              Admin
            </Link>
          )}
          <button
            onClick={handleUserClick}
            className="text-gray-200 hover:text-white"
          >
            <FontAwesomeIcon icon={faCircleUser} size="2x" />
          </button>
        </div>
      </div>
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />
    </>
  );
}

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <nav className="bg-black px-4 py-3">
      <div className="flex lg:flex">
        <NavLg drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />
      </div>
    </nav>
  );
};

export default Navbar;
