import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import "remixicon/fonts/remixicon.css";

const OrderPopUp = React.forwardRef(({ order, setOrderPopupPanel }, ref) => {
  if (!order) return null;

  const [remainingTime, setRemainingTime] = useState(15);
  const [isPopupVisible, setIsPopupVisible] = useState(true);
  const orderPopupPanelRef = useRef(null);
  const audioRef = useRef(new Audio("/notification-sound.mp3")); // Add your notification sound file

  // Play sound when popup appears
  useEffect(() => {
    audioRef.current
      .play()
      .catch((err) => console.log("Audio play failed:", err));
  }, []);

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setOrderPopupPanel(false);
        }
        return prevTime - 1;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [setOrderPopupPanel]);

  // GSAP animation
  useEffect(() => {
    if (orderPopupPanelRef.current) {
      if (isPopupVisible) {
        gsap.fromTo(
          orderPopupPanelRef.current,
          { y: "100%", opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
        );
      } else {
        gsap.to(orderPopupPanelRef.current, {
          y: "100%",
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
        });
      }
    }
  }, [isPopupVisible]);

  // Calculate total order amount
  const totalAmount = order.orderItems?.reduce(
    (sum, item) => sum + (item.productId?.price * item.quantity || 0),
    0
  );
  
  console.log("order", order.shippingAddress.address);

  return (
    <div
      ref={orderPopupPanelRef}
      className="text-gray-800 fixed z-40 left-0 right-0 bottom-0 mx-auto max-w-md w-full px-4 pb-6"
    >
      <div className="bg-white rounded-xl shadow-xl p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-blue-700">
            🛍️ New Order Received!
          </h3>
          <h3 className="text-xl font-bold text-red-700">
            {remainingTime}s left
          </h3>
          <button
            onClick={() => setOrderPopupPanel(false)}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        {/* Customer Info */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg p-3 shadow-inner">
          <div className="flex items-center gap-3">
            <img
              className="h-12 w-12 rounded-full object-cover border-2 border-white"
              src={order.user?.profileImage || "/default-avatar.png"}
              alt="Customer"
            />
            <div className="text-white">
              <h2 className="text-lg font-semibold">
                {order.user?.firstname} {order.user?.lastname}
              </h2>
              <p className="text-sm">{order.user?.contact}</p>
            </div>
          </div>
          <div className="text-white font-bold text-lg">
            ₹{totalAmount.toLocaleString("en-IN")}
          </div>
        </div>

        {/* Order Details */}
        <div className="space-y-4">
          <div className="max-h-40 overflow-y-auto">
            {order.orderItems?.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{item.quantity}x</span>
                  <span>{item.productId?.name}</span>
                </div>
                <span>
                  ₹
                  {(item.productId?.price * item.quantity).toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3">
            <i className="ri-map-pin-line text-xl text-red-500 mt-1"></i>
            <div>
              <h3 className="font-semibold">Delivery Address</h3>
              <p className="text-sm text-gray-500">
                {order.shippingAddress.address}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-2">
          <button
            onClick={() =>
              (window.location.href = `/store-orders/${order._id}`)
            }
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
          >
            👉 View Order Details
          </button>
          <button
            onClick={() => setOrderPopupPanel(false)}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition"
          >
            ❌ Close
          </button>
        </div>
      </div>
    </div>
  );
});

export default OrderPopUp;