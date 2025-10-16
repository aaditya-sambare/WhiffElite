import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../../redux/slice/orderSlice";

const MyOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p className="text-gray-500 text-lg">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-50 overflow-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600 text-lg">
          You haven’t placed any orders yet.
        </p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-sm">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="text-left px-4 py-3">Item</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Shipping To</th>
                <th className="text-right px-4 py-3">Total</th>
                <th className="text-center px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const item = order.orderItems?.[0] || {};
                const formattedDate = order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "N/A";

                return (
                  <tr
                    key={order._id}
                    onClick={() => handleRowClick(order._id)}
                    className="hover:bg-gray-50 transition cursor-pointer border-b"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name || "Product"}
                        className="w-12 h-12 rounded object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {item.name || "Unknown"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formattedDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {[
                        order.shippingAddress?.address,
                        order.shippingAddress?.city,
                        order.shippingAddress?.country,
                      ]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      ₹{order.totalPrice?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-4 py-3 text-center space-y-1 text-sm">
                      {order.isDelivered ? (
                        <span className="inline-block px-3 py-1 text-green-700 bg-green-100 rounded-full">
                          Delivered
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 text-yellow-700 bg-yellow-100 rounded-full">
                          Pending
                        </span>
                      )}
                      <Link
                        to={`/track/${order._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="block text-blue-600 hover:underline mt-1"
                      >
                        Track Here
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrderPage;
