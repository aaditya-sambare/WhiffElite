import React from "react";
import {
  FaBoxOpen,
  FaClipboardList,
  FaHome,
  FaSignOutAlt,
  FaStore,
  FaUser,
  FaGift,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slice/authSlice";
import { clearCart } from "../../redux/slice/cartSlice";
import logo from "../../assets/Logo/logo1.png";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      dispatch(logout());
      dispatch(clearCart());
      navigate("/");
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin" className="text-2xl font-medium">
          <img
            src={logo}
            alt="Logo"
            className="max-w-full max-h-full object-contain"
          />
        </Link>
      </div>
      <h2 className="mt-4 text-xl font-semibold text-center">
        Admin Dashboard
      </h2>
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-6 px-4 rounded flex items-center space-x-2 transition-all duration-300"
              : "text-gray-300 hover:bg-gray-700 py-3 px-4 rounded flex items-center space-x-2 transition-all duration-300"
          }
        >
          <FaUser aria-label="Users" />
          <span>Users</span>
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-6 px-4 rounded flex items-center space-x-2 transition-all duration-300"
              : "text-gray-300 hover:bg-gray-700 py-3 px-4 rounded flex items-center space-x-2 transition-all duration-300"
          }
        >
          <FaBoxOpen aria-label="Products" />
          <span>Products</span>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-6 px-4 rounded flex items-center space-x-2 transition-all duration-300"
              : "text-gray-300 hover:bg-gray-700 py-3 px-4 rounded flex items-center space-x-2 transition-all duration-300"
          }
        >
          <FaClipboardList aria-label="Orders" />
          <span>Orders</span>
        </NavLink>

        <NavLink
          to="/admin/store"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-6 px-4 rounded flex items-center space-x-2 transition-all duration-300"
              : "text-gray-300 hover:bg-gray-700 py-3 px-4 rounded flex items-center space-x-2 transition-all duration-300"
          }
        >
          <FaStore aria-label="Store" />
          <span>Store</span>
        </NavLink>

        <NavLink
          to="/admin/offers"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-6 px-4 rounded flex items-center space-x-2 transition-all duration-300"
              : "text-gray-300 hover:bg-gray-700 py-3 px-4 rounded flex items-center space-x-2 transition-all duration-300"
          }
        >
          <FaGift aria-label="Offers" />
          <span>Offers</span>
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-6 px-4 rounded flex items-center space-x-2 transition-all duration-300"
              : "text-gray-300 hover:bg-gray-700 py-3 px-4 rounded flex items-center space-x-2 transition-all duration-300"
          }
        >
          <FaHome aria-label="Shop" />
          <span>Shop</span>
        </NavLink>
      </nav>

      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center space-x-2 transition-all duration-300"
        >
          <FaSignOutAlt aria-label="Logout" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
