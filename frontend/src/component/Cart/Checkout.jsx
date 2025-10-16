import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slice/checkoutSlice";
import axios from "axios";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = { lat: 23.2599, lng: 77.4126 }; // Bhopal

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [fare, setFare] = useState(null);
  const [checkoutId, setCheckoutId] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
    location: null, // lat/lng will be stored here
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  // Update shippingAddress.location from map selection
  useEffect(() => {
    if (selectedLocation) {
      setShippingAddress((prev) => ({
        ...prev,
        location: selectedLocation,
      }));
    }
  }, [selectedLocation]);

  // Calculate fare
  async function findTrip() {
    const storeId = cart?.products?.[0]?.store;
    const destination = `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}`;

    if (!storeId) {
      console.error("No store ID found in cart items.");
      return null;
    }

    try {
      const storeRes = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/stores/location/${storeId}`
      );
      const pickup = storeRes.data.address;

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/rides/get-fare`,
        {
          params: { pickup, destination },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      const selectedFare = response.data.bike;
      if (selectedFare) {
        setFare(selectedFare);
        return { fare: selectedFare, pickup };
      } else {
        console.error("Bike fare not available.");
        return null;
      }
    } catch (err) {
      console.error("Error fetching trip fare:", err);
      return null;
    }
  }

  // Submit checkout
  const handleCreateCheckout = async (e) => {
    e.preventDefault();

    if (!selectedLocation) {
      alert("Please select a delivery location on the map.");
      return;
    }

    const fareResult = await findTrip();
    if (!fareResult || !fareResult.fare) {
      alert("Failed to calculate delivery fare.");
      return;
    }

    const totalWithFare =
      parseFloat(cart.totalPrice) + parseFloat(fareResult.fare);

    const res = await dispatch(
      createCheckout({
        checkoutItems: cart.products,
        shippingAddress,
        paymentMethod: "Paypal",
        totalPrice: totalWithFare,
        deliveryCharge: fareResult.fare,
        pickup: fareResult.pickup,
        destination: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.country}`,
      })
    );

    if (res.payload && res.payload._id) {
      setCheckoutId(res.payload._id);
      navigate("/payment", {
        state: {
          checkoutId: res.payload._id,
          fare: fareResult.fare,
          shippingAddress,
          storeAddress: fareResult.pickup,
        },
      });
    }
  };

  if (loading) return <p className="text-center py-6">Loading cart...</p>;
  if (error)
    return <p className="text-center text-red-500 py-6">Error: {error}</p>;
  if (!cart || !cart.products || cart.products.length === 0)
    return <p className="text-center py-6">Your cart is empty!</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
          Checkout
        </h2>

        <form onSubmit={handleCreateCheckout} className="space-y-6">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Contact Information
            </h3>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
            />
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Shipping Address
            </h3>

            {/* Map */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Select Delivery Location
              </h3>
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={selectedLocation || defaultCenter}
                  zoom={14}
                  onClick={(e) =>
                    setSelectedLocation({
                      lat: e.latLng.lat(),
                      lng: e.latLng.lng(),
                    })
                  }
                >
                  {selectedLocation && (
                    <Marker
                      position={selectedLocation}
                      draggable
                      onDragEnd={(e) =>
                        setSelectedLocation({
                          lat: e.latLng.lat(),
                          lng: e.latLng.lng(),
                        })
                      }
                    />
                  )}
                </GoogleMap>
              ) : (
                <p className="text-center text-gray-500 py-2">
                  Map is loading...
                </p>
              )}
              {selectedLocation && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected Location: {selectedLocation.lat.toFixed(4)},{" "}
                  {selectedLocation.lng.toFixed(4)}
                </div>
              )}
            </div>

            {/* Address Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                placeholder="First Name"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
                className="p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
                className="p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <input
              type="text"
              placeholder="Address"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="w-full mt-4 p-3 border border-gray-300 rounded-lg"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                placeholder="City"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                className="p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="State"
                value={shippingAddress.state}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    state: e.target.value,
                  })
                }
                className="p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                placeholder="Postal Code"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                className="p-3 border border-gray-300 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Country"
                value={shippingAddress.country}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    country: e.target.value,
                  })
                }
                className="p-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <input
              type="tel"
              placeholder="Phone"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              className="w-full mt-4 p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* Estimated Fare */}
          {fare !== null && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-md">
              Estimated Delivery Charge: ₹{fare}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg shadow-lg hover:opacity-90 transition duration-200"
          >
            Continue to Payment
          </button>
        </form>

        {/* Optional: Error Message */}
        {error && (
          <p className="text-red-600 mt-4 text-center text-sm">
            Error: {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Checkout;
