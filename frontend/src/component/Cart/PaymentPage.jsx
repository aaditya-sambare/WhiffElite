import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import PayPalButton from "./PayPalButton";
import { useSelector } from "react-redux";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { checkoutId, fare, shippingAddress, storeAddress } = location.state || {};
  const cart = useSelector((state) => state.cart.cart);
  const [loading, setLoading] = useState(false);
  const totalWithFare =
    parseFloat(cart.totalPrice || 0) + parseFloat(fare || 0);

  const destinationAddress = `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`;

  console.log(fare);

  useEffect(() => {
    if (!checkoutId) {
      navigate("/");
    }
  }, [checkoutId, navigate]);

  const handlePaymentSuccess = async (details) => {
    try {
      setLoading(true);

      // 1. Mark checkout as paid
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

      // 2. Finalize checkout and get the orderId from the response
      const finalizeRes = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      const orderId = finalizeRes.data._id; // <-- get orderId from response

      // 3. Create a ride with orderId
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/rides/create`,
        {
          pickup: storeAddress,
          destination: destinationAddress,
          vehicleType: "bike",
          orderId, // <-- use orderId here!
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
      alert("There was an issue processing your payment or creating a ride. Please try again.");
    }
  };

  if (!cart)
    return (
      <div className="flex justify-center items-center mt-20">
        <div
          className="spinner-border animate-spin inline-block w-10 h-10 border-4 border-current border-t-transparent rounded-full"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h2 className="text-3xl font-semibold mb-6">Order Summary</h2>
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        {cart.products.map((product, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center border-b py-4"
          >
            <div className="flex items-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-20 object-cover rounded-lg mr-4"
              />
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-gray-500">
                  Size: {product.size}, Color: {product.color}
                </p>
              </div>
            </div>
            <p className="font-semibold text-lg">
              ₹{product.price?.toLocaleString()}
            </p>
          </div>
        ))}

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 sm:text-sm">
            Shipping Details
          </h3>

          <div className="grid grid-cols-2 gap-x-4 text-[0.7rem] sm:text-sm">
            <div className="flex justify-between mb-2">
              <p className="text-gray-600 text-[0.7rem] sm:text-sm">
                Full Name:
              </p>
              <p className="font-semibold text-gray-800 text-[0.7rem] sm:text-sm">
                {shippingAddress?.firstName} {shippingAddress?.lastName}
              </p>
            </div>

            <div className="flex justify-between mb-2">
              <p className="text-gray-600 text-[0.7rem] sm:text-sm">Address:</p>
              <p className="font-semibold text-gray-800 text-[0.7rem] sm:text-sm">
                {shippingAddress?.address}
              </p>
            </div>

            <div className="flex justify-between mb-2">
              <p className="text-gray-600 text-[0.7rem] sm:text-sm">City:</p>
              <p className="font-semibold text-gray-800 text-[0.7rem] sm:text-sm">
                {shippingAddress?.city}
              </p>
            </div>

            <div className="flex justify-between mb-2">
              <p className="text-gray-600 text-[0.7rem] sm:text-sm">
                Postal Code:
              </p>
              <p className="font-semibold text-gray-800 text-[0.7rem] sm:text-sm">
                {shippingAddress?.postalCode}
              </p>
            </div>

            <div className="flex justify-between mb-2">
              <p className="text-gray-600 text-[0.7rem] sm:text-sm">Country:</p>
              <p className="font-semibold text-gray-800 text-[0.7rem] sm:text-sm">
                {shippingAddress?.country}
              </p>
            </div>

            <div className="flex justify-between mb-2">
              <p className="text-gray-600 text-[0.7rem] sm:text-sm">Phone:</p>
              <p className="font-semibold text-gray-800 text-[0.7rem] sm:text-sm">
                {shippingAddress?.phone}
              </p>
            </div>
          </div>
        </div>

        <hr className="mt-2" />

        <div className="flex justify-between items-center text-lg mt-4">
          <p className="text-gray-600">Subtotal:</p>
          <p className="font-semibold">₹{cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p className="text-gray-600">Delivery charges:</p>
          <p className="font-semibold">₹{fare?.toLocaleString()}</p>
        </div>

        <hr className="mt-2" />

        <div className="flex justify-between items-center font-bold text-xl mt-4">
          <p className="text-gray-600">Total:</p>
          <p className="font-semibold">₹{totalWithFare.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center">
              <div
                className="spinner-border animate-spin inline-block w-10 h-10 border-4 border-current border-t-transparent rounded-full"
                role="status"
              >
                <span className="sr-only">Processing...</span>
              </div>
            </div>
            <p className="text-gray-600 ml-4">Processing your payment...</p>
          </div>
        ) : (
          <PayPalButton
            amount={totalWithFare}
            onSuccess={handlePaymentSuccess}
            onError={(err) => alert("Payment failed. Please try again.")}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
