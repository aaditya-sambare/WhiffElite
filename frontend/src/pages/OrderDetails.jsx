import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchOrderDetails } from "../redux/slice/orderSlice";

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (error)
    return <p className="text-center text-red-600 py-8">Error: {error}</p>;

console.log(orderDetails);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Order Summary</h2>

      {!orderDetails ? (
        <p className="text-gray-600">No order details found</p>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md border space-y-8">
          {/* Order Meta Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Order #{orderDetails._id}
              </h3>
              <p className="text-gray-500 text-sm">
                Placed on{" "}
                <span className="font-medium">
                  {new Date(orderDetails.createdAt).toLocaleDateString(
                    undefined,
                    {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </span>{" "}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span
                className={`${
                  orderDetails.isPaid
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                } px-3 py-1 rounded-full text-sm font-medium`}
              >
                {orderDetails.isPaid ? "Paid" : "Unpaid"}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  orderDetails.isDelivered
                    ? "bg-green-100 text-green-700"
                    : orderDetails.status
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {orderDetails.isDelivered
                  ? "Delivered"
                  : orderDetails.status
                  ? `Status: ${orderDetails.status}`
                  : "Pending Delivery"}
              </span>
            </div>
          </div>

          {/* Payment & Shipping Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <h4 className="text-lg font-semibold text-gray-800">
                Payment Info
              </h4>
              <p className="text-gray-600">
                Method: {orderDetails.PaymentMethod}
              </p>
              <p className="text-gray-600">
                Status: {orderDetails.isPaid ? "Paid" : "Unpaid"}
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-semibold text-gray-800">
                Shipping Info
              </h4>

              <p className="text-gray-600">
                Address: {orderDetails.shippingAddress.address},{" "}
                {orderDetails.shippingAddress.city},{" "}
                {orderDetails.shippingAddress.country},{" "}
                {orderDetails.shippingAddress.postalCode}
              </p>
            </div>
          </div>

          {/* Product Table */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Ordered Products
            </h4>
            <div className="overflow-x-auto rounded-lg border">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Qty</th>
                    <th className="px-4 py-3 font-medium">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.orderItems.map((item) => (
                    <tr key={item.productid} className="border-t">
                      <td className="px-4 py-3 flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <Link
                          to={`/product/${item.productId}`}
                          className="hover:underline text-blue-600 font-medium"
                        >
                          {item.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">₹{item.price}</td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3 font-medium">
                        ₹{item.price * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 border-t font-semibold text-gray-900">
                    <td className="px-4 py-3 text-right" colSpan="3">
                      Total:
                    </td>
                    <td className="px-4 py-3 flex">
                      ₹{orderDetails.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <p className="text-end text-xs text-gray-500 pl-2 pt-0.5">
              (Shipping Charges included)
            </p>
          </div>

          {/* Back Link */}
          <div className="text-right">
            <Link
              to="/my-orders"
              className="text-blue-600 hover:underline font-medium"
            >
              ← Back to My Orders
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
