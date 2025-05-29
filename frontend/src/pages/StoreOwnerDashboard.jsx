import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchStoreOwnerOrders } from "../redux/slice/storeOwnerOrderSlice";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchStoreOwnerProfile } from "../redux/slice/storeOwnerAuthSlice";

const StoreOwnerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading } = useSelector((state) => state.storeOwnerOrders);
  const { user: storeOwner, error } = useSelector((state) => state.storeOwnerAuth);

  useEffect(() => {
    if (!storeOwner) {
      dispatch(fetchStoreOwnerProfile());
    }
  }, [storeOwner, dispatch]);

  useEffect(() => {
    dispatch(fetchStoreOwnerOrders());
    const interval = setInterval(() => {
      dispatch(fetchStoreOwnerOrders());
    }, 10000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleRowClick = (orderId) => {
    navigate(`/store-orders/${orderId}`);
  };

  const totalSales = orders?.reduce(
    (sum, order) =>
      sum +
      (order.orderItems?.reduce(
        (itemSum, item) =>
          item.productId?.price
            ? itemSum + item.productId.price * item.quantity
            : itemSum,
        0
      ) || 0),
    0
  );

  const totalOrders = orders?.length || 0;
  const recentOrders = orders?.slice(0, 5) || [];

  console.log(recentOrders)

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Welcome, {storeOwner?.firstname + " " + storeOwner?.lastname || "Store Owner"}!
      </h1>

      <div className="fixed top-6 right-12 z-20">
        <Link
          to="/store-owner/profile"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md"
        >
          <FontAwesomeIcon icon={faCircleUser} size="2x" />
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <h2 className="text-xl font-semibold mb-2">Total Stores</h2>
          <p className="text-2xl">{storeOwner?.stores?.length || 0}</p>
        </div>
        <div className="bg-gradient-to-r from-green-400 to-teal-400 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <h2 className="text-xl font-semibold mb-2">Total Sales</h2>
          <p className="text-2xl">₹{totalSales.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
          <h2 className="text-xl font-semibold mb-2">Total Orders</h2>
          <p className="text-2xl">{totalOrders}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow-xl mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Orders</h2>

        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : recentOrders.length === 0 ? (
          <p className="text-gray-500">No recent orders available.</p>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Order ID</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Customer</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Captain</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Total</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">GOTO</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const totalPrice =
                  order.orderItems?.reduce(
                    (sum, item) =>
                      item.productId?.price
                        ? sum + item.productId.price * item.quantity
                        : sum,
                    0
                  ) || 0;

                return (
                  <tr
                    key={order._id}
                    onClick={() => handleRowClick(order._id)}
                    className="hover:bg-gray-100 hover:shadow-sm transition duration-200 cursor-pointer"
                  >
                    <td className="py-4 px-6 text-sm text-gray-700">{order._id}</td>
                    <td className="py-4 px-6 text-sm text-gray-700 capitalize">
                      {order?.user?.firstname || "Unknown"} {order?.user?.lastname || ""}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700 capitalize">
                      {order?.captain ? (
                        `${order.captain.firstname} ${order.captain.lastname}`
                      ) : (
                        <span className="italic text-gray-400">Not Assigned</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      ₹{totalPrice.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      <span
                        className={`${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Shipped"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        } px-3 py-1 rounded-full capitalize`}
                      >
                        {order.ride.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-blue-600 font-semibold underline">
                      View Details
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
