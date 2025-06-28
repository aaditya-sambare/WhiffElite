import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllOrders,
  updateOrderStatus,
} from "../../redux/slice/adminOrderSlice";
import { toast } from "react-toastify"; // For notifications
import { FiLoader } from "react-icons/fi";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  // Handle Status change
  const handleStatusChange = (orderId, newStatus) => {
    dispatch(
      updateOrderStatus({
        id: orderId,
        status: newStatus,
      })
    );
    toast.success("Order status updated successfully!"); // Success notification
  };

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("You do not have access to this page.");
      navigate("/"); // Redirect to home if not an admin
    } else {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, user, navigate]);

  
    if (loading)
      return (
        <div className="flex justify-center items-center min-h-[200px]">
          <FiLoader className="animate-spin text-4xl text-blue-500" />
        </div>
      );
  if (error)
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md shadow-md mb-6">
        Error: {error}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Total Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                    {order._id}
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                    {order.user?._id}
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                    ₹{order.totalPrice.toFixed(2)}
                  </td>
                  <td
                    className={`p-4 font-semibold ${
                      order.status === "Processing"
                        ? "text-yellow-800"
                        : order.status === "Shipped"
                        ? " text-blue-800"
                        : order.status === "Delivered"
                        ? " text-green-900"
                        : " text-red-800"
                    }`}
                  >
                    {order.status}
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="border bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 border-gray-300"
                    >
                      <option value="">Change Status</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
