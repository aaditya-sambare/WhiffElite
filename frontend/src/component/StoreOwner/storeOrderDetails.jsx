import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchOrderDetails } from "../../redux/slice/orderSlice";
import axios from "axios";

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);
  const isActionDisabled = [
    "pending-captain",
    "accepted",
    "enroute",
    "delivered",
  ].includes(orderDetails?.ride.status);

  console.log(orderDetails)

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (error)
    return <p className="text-center text-red-600 py-8">Error: {error}</p>;

  if (!orderDetails)
    return <p className="text-center py-8">Order not found.</p>;

  const productsTotal = orderDetails.orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleAccept = async () => {
    try {
      // Call your backend endpoint to accept the ride as store owner
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/rides/store-owner-accept`,
        { rideId: orderDetails.ride._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("storeOwnerToken")}`,
          },
        }
      );
      alert("Order accepted! Waiting for captain.");
      dispatch(fetchOrderDetails(id));
    } catch (error) {
      console.log(error);
      alert(
        "Failed to accept order: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleReject = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/rides/store-owner-reject`,
        { rideId: orderDetails.ride._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("storeOwnerToken")}`,
          },
        }
      );
      alert("Order rejected!");
      dispatch(fetchOrderDetails(id));
    } catch (error) {
      alert(
        "Failed to reject order: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  console.log(orderDetails);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Order Summary</h2>

      <div className="bg-white p-6 rounded-xl shadow-md border space-y-8">
        {/* Order Meta Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Order #{orderDetails._id}
            </h3>
            <p className="text-gray-500 text-sm">
              Placed on {new Date(orderDetails.createdAt).toLocaleDateString()}
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
            {/* <span
              className={`${
                orderDetails.isDelivered
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              } px-3 py-1 rounded-full text-sm font-medium`}
            >
              {orderDetails.isDelivered ? "Delivered" : "Pending Delivery"}
            </span> */}
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              Status:{" "}
              {orderDetails.ride.status === "pending-captain"
                ? "Searching Captain"
                : orderDetails.ride.status}
            </span>
          </div>
        </div>

        {/* Payment & Shipping Info with OTP and Action */}

        {/* Payment & Shipping Info with OTP and Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payment Info */}
          <div className="bg-white p-4 border rounded-lg shadow-sm space-y-2">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              💳 Payment Info
            </h4>
            <p className="text-gray-600">
              <span className="font-medium">Method:</span>{" "}
              {orderDetails.PaymentMethod}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Status:</span>{" "}
              {orderDetails.isPaid ? (
                <span className="text-green-600 font-semibold">Paid</span>
              ) : (
                <span className="text-red-600 font-semibold">Unpaid</span>
              )}
            </p>
          </div>

          {/* Shipping Info + OTP + Buttons */}
          <div className="md:col-span-2 bg-gray-50 p-6 rounded-lg border shadow-sm space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              🚚 Shipping Info
            </h4>
            <p className="text-gray-700 leading-relaxed">
              <span className="font-medium">Address:</span>{" "}
              {orderDetails.shippingAddress?.address},{" "}
              {orderDetails.shippingAddress?.city},{" "}
              {orderDetails.shippingAddress?.country},{" "}
              {orderDetails.shippingAddress?.postalCode}
            </p>

            {/* OTP Display */}
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">Delivery OTP:</span>
              <p className="font-semibold text-lg">
                {orderDetails.ride.status === "pending-captain" || orderDetails.ride.status === "accepted"  ? (
                  orderDetails.ride.otpStoreOwner || "Not Assigned"
                ) : 
                  orderDetails.ride.status === "enroute" ||
                  orderDetails.ride.status === "delivered" ? (
                  <span className="italic text-gray-500">
                    Order accepted by you.
                  </span>
                ) : (
                  <span className="italic text-gray-500">
                    Order not accepted by you.
                  </span>
                )}
              </p>
            </div>

            {/* Accept / Reject Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleReject}
                disabled={isActionDisabled}
                className={`px-5 py-2 rounded-md font-medium shadow-md transition 
      ${
        isActionDisabled
          ? "bg-red-300 cursor-not-allowed"
          : "bg-red-500 hover:bg-red-600 text-white"
      }`}
              >
                ❌ Reject
              </button>

              <button
                onClick={handleAccept}
                disabled={isActionDisabled}
                className={`px-5 py-2 rounded-md font-medium shadow-md transition 
      ${
        isActionDisabled
          ? "bg-green-300 cursor-not-allowed"
          : "bg-green-500 hover:bg-green-600 text-white"
      }`}
              >
                ✅ Accept
              </button>
            </div>
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
                  <tr key={item._id} className="border-t">
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
                  <td className="px-4 py-3">₹{productsTotal.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-right pt-4">
          <Link
            to="/store-owner/dashboard"
            className="text-blue-600 hover:underline font-medium"
          >
            ← Back to My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
