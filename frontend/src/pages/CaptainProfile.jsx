import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCaptainProfile,
  logout,
  toggleCaptainOnline,
} from "../redux/slice/authSlice";
import { FaCar } from "react-icons/fa";

const CaptainProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { captain } = useSelector((state) => state.auth);

  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!captain) {
      dispatch(fetchCaptainProfile());
    } else if (captain.role !== "captain") {
      navigate("/login");
    }
  }, [captain, dispatch, navigate]);

  const filteredDeliveries = Array.isArray(captain?.deliveries)
    ? captain.deliveries.filter((delivery) =>
        filter === "All" ? true : delivery.status === filter
      )
    : [];

  const handleLogout = async () => {
    if (captain?.isOnline) {
      await dispatch(toggleCaptainOnline(false));
    }
    dispatch(logout());
    navigate("/login");
  };

  const handleToggleOnline = () => {
    dispatch(toggleCaptainOnline(!captain.isOnline));
  };

  const avgRating =
    captain.ratings && captain.ratings.length
      ? (
          captain.ratings.reduce((a, b) => a + b, 0) / captain.ratings.length
        ).toFixed(1)
      : "No ratings";

  const today = new Date();
  const formattedToday = `${
    today.getMonth() + 1
  }/${today.getDate()}/${today.getFullYear()}`; // e.g., "5/13/2025"

  const onlyTodaysDeliveries = Array.isArray(captain?.deliveries)
    ? captain.deliveries.filter((delivery) => delivery.date === formattedToday)
    : [];

  const earningsToday = onlyTodaysDeliveries.reduce(
    (total, delivery) => total + (delivery.earnings || 0),
    0
  );

  console.log(captain.deliveries);

  return (
    <>
      {/* NAVIGATION BAR */}
      <nav className="bg-black text-white px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 shadow-md">
        <h1 className="hidden sm:block text-lg sm:text-xl font-bold uppercase">
          WhiffÉlite Captain
        </h1>

        <Link
          to="/captain-home"
          className="flex items-center text-white gap-2 justify-end"
        >
          <span className="text-base sm:text-lg font-semibold">
            Captain Page
          </span>
          <FaCar className="text-xl sm:text-2xl" />
        </Link>
      </nav>

      {/* MAIN CONTENT */}
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto mt-6 p-4 gap-6">
        {/* LEFT PROFILE SECTION */}
        <div className="w-full lg:w-1/3 bg-white shadow-xl rounded-2xl p-4 sm:p-6">
          <div className="flex flex-col items-center">
            <img
              src={captain?.profileImage}
              alt="Captain"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-blue-500"
            />
            <h2 className="text-lg sm:text-xl font-semibold mt-4 capitalize">
              {captain?.firstname + " " + captain?.lastname}
            </h2>
            <span
              className={`mt-1 text-sm px-3 py-1 rounded-full ${
                captain?.isOnline
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {captain?.isOnline ? "Online" : "Offline"}
            </span>
          </div>

          <div className="mt-6 text-sm text-gray-700 space-y-2">
            <p>
              <strong>Phone:</strong> {captain?.contact}
            </p>
            <p>
              <strong>Email:</strong> {captain?.email}
            </p>
            <p>
              <strong>Joined:</strong>{" "}
              {captain?.createdAt &&
                new Date(captain.createdAt).toLocaleDateString()}
            </p>

            <hr className="my-3" />

            <h3 className="font-semibold text-lg">Vehicle Info</h3>
            <p>
              <strong>Type:</strong> {captain?.vehicle?.vehicleType}
            </p>
            <p>
              <strong>Color:</strong> {captain?.vehicle?.color}
            </p>
            <p>
              <strong>Number:</strong> {captain?.vehicle?.plate}
            </p>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full"
            >
              Edit Profile
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full"
            >
              Logout
            </button>
          </div>
        </div>

        {/* RIGHT DASHBOARD SECTION */}
        <div className="w-full lg:w-2/3 bg-white shadow-xl rounded-2xl p-4 sm:p-6 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Dashboard
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Today's Deliveries</p>
              <h3 className="text-lg font-bold">
                {onlyTodaysDeliveries.length}
              </h3>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Earnings Today</p>
              <h3 className="text-lg font-bold">₹{earningsToday || 0}</h3>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Total Deliveries</p>
              <h3 className="text-lg font-bold">{captain.deliveries.length}</h3>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">
              Ratings & Availability
            </h3>
            <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-lg gap-2">
              <span>
                <strong>Current Rating:</strong> {avgRating || "N/A"} ★
              </span>
              <button
                onClick={handleToggleOnline}
                className={`px-4 py-2 rounded-lg text-white ${
                  captain?.isOnline ? "bg-red-500" : "bg-green-500"
                }`}
              >
                {captain?.isOnline ? "Go Offline" : "Go Online"}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Delivery History</h3>

            <div className="mb-4">
              <select
                className="px-4 py-2 border rounded-lg w-full sm:w-auto"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto bg-gray-50 rounded-lg shadow-md text-sm sm:text-base">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4 text-left">Order ID</th>
                    <th className="py-2 px-4 text-left">Delivered Address</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-left">Earnings</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeliveries.map((delivery) => (
                    <tr
                      key={delivery.orderId}
                      className="border-t border-gray-200"
                    >
                      <td>
                        {delivery.orderId
                          ? typeof delivery.orderId === "object"
                            ? delivery.orderId._id // or any field you want
                            : delivery.orderId
                          : "N/A"}
                      </td>
                      <td className="py-2 px-4">
                        {delivery.address ? delivery.address : "N/A"}
                      </td>
                      <td
                        className={`py-2 px-4 ${
                          delivery.status === "Completed"
                            ? "text-green-600"
                            : delivery.status === "Pending"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {delivery.status}
                      </td>
                      <td className="py-2 px-4">₹{delivery.earnings}</td>
                      <td className="py-2 px-4">{delivery.date}</td>
                      <td className="py-2 px-4">{delivery.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Optional: Edit Modal */}
        {/* {editing && <EditCaptainProfile onClose={() => setEditing(false)} />} */}
      </div>
    </>
  );
};

export default CaptainProfilePage;
