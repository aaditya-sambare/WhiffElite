import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slice/checkoutSlice";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const containerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = [23.2599, 77.4126]; // Bhopal [lat, lng]

// Map Click Handler Component
function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition({ lat, lng });
      onLocationSelect({ lat, lng });
    },
  });

  return position === null ? null : (
    <Marker
      position={[position.lat, position.lng]}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          onLocationSelect({ lat: position.lat, lng: position.lng });
        },
      }}
    />
  );
}

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [fare, setFare] = useState(null);
  const [checkoutId, setCheckoutId] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
    setIsProcessing(true); // Start loading

    try {
      if (!selectedLocation) {
        alert("Please select a delivery location on the map.");
        setIsProcessing(false);
        return;
      }

      const fareResult = await findTrip();
      if (!fareResult || !fareResult.fare) {
        alert("Failed to calculate delivery fare.");
        setIsProcessing(false);
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
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsProcessing(false); // Stop loading
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
              <div style={containerStyle}>
                <MapContainer
                  center={defaultCenter}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                  attributionControl={false}
                >
                  <TileLayer
                    attribution='Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {/* <TileLayer
                    attribution='Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap contributors'
                    url={`https://maps.geoapify.com/v1/styles/osm-carto/rendered/{z}/{x}/{y}.png?apiKey=${process.env.REACT_APP_GEOAPIFY_API_KEY}`}
                    maxZoom={20}
                  /> */}
                  <LocationMarker
                    onLocationSelect={(location) => {
                      setSelectedLocation(location);
                      setShippingAddress((prev) => ({
                        ...prev,
                        location: location,
                      }));
                    }}
                  />
                </MapContainer>
              </div>
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
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg shadow-lg hover:opacity-90 transition duration-200 flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              "Continue to Payment"
            )}
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
