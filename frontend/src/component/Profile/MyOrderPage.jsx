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
    return <p className="text-gray-500 text-lg">Loading your orders...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-lg">Error: {error}</p>;
  }

  return (
    <div className="min-h-screen max-h-screen p-4 bg-gray-50 overflow-auto">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600 text-lg">
          You haven’t placed any orders yet.
        </p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-max w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="border-b bg-gray-100 text-sm text-gray-700">
                <th className="px-4 py-2 text-left">Item</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Shipping To</th>
                <th className="px-4 py-2 text-right">Total</th>
                <th className="px-4 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const item = order.orderItems?.[0];

                return (
                  <tr
                    key={order._id}
                    onClick={() => handleRowClick(order._id)}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={item?.image}
                        alt={item?.name || "Product image"}
                        className="w-12 h-12 rounded object-cover"
                      />
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-800">
                      {item.name}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-700">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {order.shippingAddress?.address || "—"},{" "}
                      {order.shippingAddress?.city || "—"},{" "}
                      {order.shippingAddress?.country || "—"}
                    </td>

                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      ₹{order.totalPrice?.toFixed(2) || "0.00"}
                    </td>

                    <td className="px-4 py-3 text-center space-y-1">
                      {order.isDelivered ? (
                        <span className="inline-block px-3 py-1 text-sm text-green-700 bg-green-100 rounded-full">
                          Delivered
                        </span>
                      ) : null}
                      <div className="space-y-1">
                        <Link
                          to={`/track/${order._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-600 hover:underline text-sm block"
                        >
                          Track Here
                        </Link>
                      </div>
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
