import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails } from "../redux/slice/orderSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {
  RiMapPinUserFill,
  RiMapPin2Fill,
  RiCurrencyLine,
  RiCheckLine,
  RiMotorbikeFill,
  RiPhoneFill,
  RiUser3Fill,
  RiCheckboxCircleLine,
} from "react-icons/ri";
import searching from "../assets/searching.gif";
import waiting from "../assets/waiting.gif";
import CaptainMap from "../component/Captain/CaptainOrderMap";

const fallbackImage = "https://ui-avatars.com/api/?name=Captain";

const StarRating = ({ rating, onRate }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <FontAwesomeIcon
          key={n}
          icon={solidStar}
          onClick={() => onRate(n)}
          className={`cursor-pointer text-2xl ${
            n <= rating ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const stepDescriptions = {
  "Order Confirm": "We’ve received your order.",
  "Store Accept Order": "Store has accept the order",
  "Captain Assigned": "A delivery captain is on the way.",
  "Order Picked": "Your order is heading to your location.",
  Delivered: "Waiting to be marked delivered.",
};

const OrderTracking = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [captainRating, setCaptainRating] = useState(0);
  const [productRatings, setProductRatings] = useState({});

  useEffect(() => {
    if (!id) return;

    // Fetch initially
    dispatch(fetchOrderDetails(id));

    // Set interval to refetch every 15 seconds
    const intervalId = setInterval(() => {
      dispatch(fetchOrderDetails(id));
    }, 15000); // 15000ms = 15s

    // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, [dispatch, id]);

  useEffect(() => {
    if (orderDetails && orderDetails.isDelivered && !orderDetails.orderRated) {
      setShowRatingModal(true);
    }
  }, [orderDetails]);

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    const ratingData = Object.entries(productRatings).map(
      ([productId, rating]) => ({
        productId,
        rating,
      })
    );

    await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/orders/${orderDetails._id}/rate`,
      {
        captainRating,
        productRatings: ratingData,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );

    setShowRatingModal(false);
    // Optionally update orderDetails.orderRated = true here or refetch order details
  };

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  if (!orderDetails)
    return (
      <div className="min-h-screen flex items-center justify-center">
        No order details found.
      </div>
    );

  const pickupAddress =
    orderDetails.orderItems[0]?.productId?.store?.address ||
    "Pickup address not available";
  const shipping = orderDetails.shippingAddress || {};
  const destinationAddress = `${shipping.address || ""}, ${
    shipping.city || ""
  }, ${shipping.country || ""}, ${shipping.postalCode || ""}`;
  const fare = orderDetails.deliveryCharge || orderDetails.fare || 0;
  const captain = orderDetails.captain;
  const currentStatus = orderDetails.ride?.status || "pending-store-owner";
  const statusSteps = [
    "pending-store-owner",
    "pending-captain",
    "accepted",
    "enroute",
    "delivered",
  ];

  const onStatusSteps = [
    "Order Confirm",
    "Store Accept Order",
    "Captain Assigned",
    "Order Picked",
    "Delivered",
  ];
  const currentStatusIndex = statusSteps.indexOf(currentStatus);

  console.log(orderDetails);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">
        Track Your Order
      </h1>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        Stay updated as your order makes its way to you!
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-2xl mb-10">
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div
            className="absolute top-0 left-0 h-2 bg-green-500 rounded-full transition-all duration-500 ease-in-out"
            style={{
              width: `${
                ((currentStatusIndex + 1) / statusSteps.length) * 100
              }%`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          {onStatusSteps.map((step, i) => (
            <span
              key={i}
              className={`${
                i <= currentStatusIndex ? "text-green-600 font-medium" : ""
              }`}
            >
              {step}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-center gap-10">
        {/* Left Column */}
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-6">
          {currentStatus === "pending-store-owner" ? (
            <div className="text-center transition-all duration-700 ease-in-out opacity-100 translate-y-0">
              <h3 className="text-xl font-semibold text-yellow-600">
                Waiting for Store Owner
              </h3>
              <img
                src={waiting}
                alt="Waiting for store owner"
                className="w-32 h-32 mx-auto my-4"
              />
              <p className="text-sm text-gray-600">
                We’ve notified the store. Please hang tight while they accept
                your order.
              </p>
            </div>
          ) : currentStatus === "pending-captain" ? (
            <div className="text-center">
              <img
                src={searching}
                alt="Searching for captain"
                className="w-32 h-32 mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-blue-600">
                Searching for Delivery Captain...
              </h3>
            </div>
          ) : currentStatus === "accepted" ? (
            <div className="transition-all duration-700 ease-in-out opacity-100 translate-y-0 text-center">
              <h3 className="text-xl font-semibold text-green-600">
                Captain Assigned
              </h3>
              <img
                src={captain.profileImage || fallbackImage}
                alt="Captain"
                loading="lazy"
                className="w-20 h-20 rounded-full object-cover border-2 border-green-500 mx-auto mt-4"
              />
              <div className="mt-3 space-y-1 text-sm">
                <p className="flex justify-center items-center gap-2 font-medium">
                  <RiUser3Fill /> {captain.firstname} {captain.lastname}
                </p>
                <p className="text-gray-600 flex justify-center items-center gap-2">
                  <RiPhoneFill /> {captain.contact}
                </p>
                <p className="text-gray-600 flex justify-center items-center gap-2 capitalize">
                  <RiMotorbikeFill /> {captain.vehicle?.vehicleType} (
                  {captain.vehicle?.plate})
                </p>
                <p className="text-sm font-semibold text-red-600 mt-2">
                  OTP: {orderDetails.ride.otpCustomer}
                </p>
              </div>
            </div>
          ) : currentStatus === "enroute" ? (
            <div className="transition-all duration-700 ease-in-out opacity-100 translate-y-0 text-center">
              <h3 className="text-xl font-semibold text-green-600 s">
                Captain Assigned
              </h3>
              <img
                src={captain.profileImage || fallbackImage}
                alt="Captain"
                loading="lazy"
                className="w-20 h-20 rounded-full object-cover border-2 border-green-500 mx-auto mt-4 shadow-lg"
              />
              <div className="mt-3 space-y-1 text-sm">
                <p className="flex justify-center items-center gap-2 font-medium">
                  <RiUser3Fill /> {captain.firstname} {captain.lastname}
                </p>
                <p className="text-gray-600 flex justify-center items-center gap-2">
                  <RiPhoneFill /> {captain.contact}
                </p>
                <p className="text-gray-600 flex justify-center items-center gap-2 capitalize">
                  <RiMotorbikeFill /> {captain.vehicle?.vehicleType} (
                  {captain.vehicle?.plate})
                </p>
                <p className="text-sm font-semibold text-red-600 mt-2">
                  OTP: {orderDetails.ride.otpCustomer}
                </p>
              </div>
            </div>
          ) : currentStatus === "delivered" ? (
            <div className="text-center text-green-700">
              <RiCheckboxCircleLine className="text-5xl mx-auto mb-4" />
              <h3 className="text-2xl font-bold">Delivered!</h3>
              <p className="text-sm text-gray-600">
                Your package has been successfully delivered.
              </p>
            </div>
          ) : null}

          {/* Shared Info */}
          <div className="space-y-5 border-t pt-5">
            <div className="flex items-start gap-3">
              <RiMapPinUserFill className="text-xl text-gray-700 mt-1" />
              <div>
                <h3 className="text-sm font-medium text-gray-800 capitalize">
                  {pickupAddress}
                </h3>
                <p className="text-xs text-gray-500">Pickup Location</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RiMapPin2Fill className="text-xl text-gray-700 mt-1" />
              <div>
                <h3 className="text-sm font-medium text-gray-800 capitalize">
                  {destinationAddress}
                </h3>
                <p className="text-xs text-gray-500">Delivery Address</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RiCurrencyLine className="text-xl text-gray-700 mt-1" />
              <div>
                <h3 className="text-sm font-medium text-gray-800">
                  ₹{orderDetails.totalPrice?.toFixed(2)}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Payment via{" "}
                  <span className="font-medium capitalize">
                    {orderDetails.PaymentMethod || "N/A"}
                  </span>{" "}
                  –{" "}
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                      orderDetails.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {orderDetails.paymentStatus || "Unknown"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Steps */}
        <div className="w-full max-w-md space-y-6">
          {onStatusSteps.map((step, index) => {
            const isCompleted = index <= currentStatusIndex;
            return (
              <div key={index} className="flex items-start gap-4">
                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  <RiCheckLine />
                </div>
                <div>
                  <p
                    className={`font-semibold ${
                      isCompleted ? "text-green-700" : "text-gray-800"
                    }`}
                  >
                    {step}
                  </p>
                  <p
                    className={`text-sm ${
                      isCompleted ? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    {stepDescriptions[step]}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {currentStatus === "enroute" || currentStatus === "accepted" ? (
          <div className="w-full flex justify-center py-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-4">
              {orderDetails?.captain?.location?.coordinates ? (
                <>
                  <div className="w-full h-64 rounded-lg border border-black overflow-hidden shadow-lg ">
                    <CaptainMap
                      lat={orderDetails.captain.location.coordinates[0]}
                      lng={orderDetails.captain.location.coordinates[1]}
                    />
                  </div>
                  <div className="text-xs text-red-600 mt-2 text-center">
                    <i class="ri-map-pin-user-fill">Captain's live location</i>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mb-2"></div>
                  <p className="text-sm text-gray-400">
                    Fetching captain's location...
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* ETA */}
      <div className="mt-12 text-center">
        {orderDetails.isDelivered ? (
          <>
            <p className="text-sm text-gray-500">Delivered At</p>
            <p className="text-xl font-semibold text-green-700 mt-1">
              {new Date(orderDetails.deliveredAt).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              )}{" "}
              at{" "}
              {new Date(orderDetails.deliveredAt).toLocaleTimeString(
                undefined,
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500">Estimated Arrival By</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {orderDetails.estimatedDelivery
                ? new Date(orderDetails.estimatedDelivery).toLocaleTimeString(
                    undefined,
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : "Calculating..."}
            </p>
          </>
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 max-w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              Rate Your Experience
            </h2>
            <form onSubmit={handleSubmitRating}>
              {/* Captain Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Rate your Captain:
                </label>
                <StarRating rating={captainRating} onRate={setCaptainRating} />
              </div>

              {/* Product Ratings */}
              {orderDetails.orderItems.map((item) => {
                const prodId =
                  typeof item.productId === "object"
                    ? item.productId._id
                    : item.productId;
                return (
                  <div key={prodId} className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Rate {item.name}:
                    </label>
                    <StarRating
                      rating={productRatings[prodId] || 0}
                      onRate={(rating) =>
                        setProductRatings((prevRatings) => ({
                          ...prevRatings,
                          [prodId]: rating,
                        }))
                      }
                    />
                  </div>
                );
              })}
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors duration-300"
              >
                Submit Ratings
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
