import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import PayPalButton from "./PayPalButton";
import { useSelector } from "react-redux";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { checkoutId, fare, shippingAddress, storeAddress } =
    location.state || {};
  const cart = useSelector((state) => state.cart.cart);
  const [loading, setLoading] = useState(false);
  const totalWithFare =
    parseFloat(cart.totalPrice || 0) + parseFloat(fare || 0);
  const destinationAddress = `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`;

  useEffect(() => {
    if (!checkoutId) navigate("/");
  }, [checkoutId, navigate]);

  const handlePaymentSuccess = async (details) => {
    try {
      setLoading(true);

      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails: details,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      const finalizeRes = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      const orderId = finalizeRes.data._id;

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/rides/create`,
        {
          pickup: storeAddress,
          destination: destinationAddress,
          vehicleType: "bike",
          orderId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      setLoading(false);
      navigate("/order-confirmation", { state: { storeAddress } });
    } catch (error) {
      setLoading(false);
      console.error("Error during payment flow:", error);
      alert(
        "There was an issue processing your payment or creating a ride. Please try again."
      );
    }
  };

  if (!cart)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-0">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-gray-800">
        Order Summary
      </h2>

      <div className="bg-white shadow-md rounded-xl p-5 space-y-6">
        {/* Cart Products */}
        {cart.products.map((product, idx) => (
          <div
            key={idx}
            className="flex items-start justify-between gap-4 border-b pb-4"
          >
            <div className="flex gap-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-20 object-cover rounded-lg"
              />
              <div className="text-sm sm:text-base">
                <p className="font-semibold">{product.name}</p>
                <p className="text-gray-500">
                  Size: {product.size}, Color: {product.color}
                </p>
              </div>
            </div>
            <p className="font-semibold text-base sm:text-lg text-right min-w-fit">
              ₹{product.price?.toLocaleString()}
            </p>
          </div>
        ))}

        {/* Shipping Details */}
        <div className="text-sm">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
            Shipping Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              [
                "Full Name",
                `${shippingAddress?.firstName} ${shippingAddress?.lastName}`,
              ],
              ["Address", shippingAddress?.address],
              ["City", shippingAddress?.city],
              ["Postal Code", shippingAddress?.postalCode],
              ["Country", shippingAddress?.country],
              ["Phone", shippingAddress?.phone],
            ].map(([label, value], index) => (
              <div key={index} className="flex justify-between gap-2">
                <p className="text-gray-600">{label}:</p>
                <p className="font-medium text-gray-800 text-right">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="text-sm sm:text-base">
          <div className="flex justify-between mt-2">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">
              ₹{cart.totalPrice?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery charges:</span>
            <span className="font-medium">₹{fare?.toLocaleString()}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between text-lg font-bold text-gray-800">
            <span>Total:</span>
            <span>₹{totalWithFare.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* PayPal */}
      <div className="mt-8 bg-white shadow-md rounded-xl p-6 text-center">
        {loading ? (
          <div className="flex items-center justify-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 text-sm">Processing your payment...</p>
          </div>
        ) : (
          <PayPalButton
            amount={totalWithFare}
            onSuccess={handlePaymentSuccess}
            onError={() => alert("Payment failed. Please try again.")}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
