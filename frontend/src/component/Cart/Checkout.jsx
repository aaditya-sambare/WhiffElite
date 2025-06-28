import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../redux/slice/checkoutSlice";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [fare, setFare] = useState(null);
  const [checkoutId, setCheckoutId] = useState(null);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  // Find fare between store and customer destination
  async function findTrip() {
    const storeId = cart?.products?.[0]?.store;
    const destination = `${shippingAddress.address}, ${shippingAddress.city}, ${
      shippingAddress.state || ""
    }`;

    if (!storeId) {
      console.error("No store ID found in cart items.");
      return null;
    }

    try {
      // Fetching store location
      const storeRes = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/stores/location/${storeId}`
      );
      const pickup = storeRes.data.address;

      // Fetching fare
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/rides/get-fare`,
        {
          params: {
            pickup,
            destination,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      // Only use the 'bike' fare
      const selectedFare = response.data.bike;

      if (selectedFare) {
        setFare(selectedFare); // Set the bike fare in state
        return { fare: selectedFare, pickup }; // Return the bike fare and pickup address
      } else {
        console.error("Bike fare is not available.");
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

    const fareResult = await findTrip();

    if (!fareResult || !fareResult.fare) {
      alert("Failed to calculate delivery fare.");
      return;
    }

    // Ensure totalPrice is a valid number
    const totalWithFare =
      parseFloat(cart.totalPrice) + parseFloat(fareResult.fare);

    const res = await dispatch(
      createCheckout({
        checkoutItems: cart.products,
        shippingAddress,
        paymentMethod: "Paypal",
        totalPrice: totalWithFare,
        deliveryCharge: fareResult.fare,
        pickup: fareResult.pickup, // <-- ADD THIS
        destination: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.country}`, // <-- ADD THIS
      })
    );
console.log(fareResult.pickup);
    if (res.payload && res.payload._id) {
      setCheckoutId(res.payload._id);
      navigate("/payment", {
        state: {
          checkoutId: res.payload._id,
          fare: fareResult.fare,
          shippingAddress,
          storeAddress: fareResult.pickup, // <-- pass store address here
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
    <div className="max-w-3xl mx-auto py-10 px-6 tracking-tighter">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg font-medium mb-4">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              className="w-full p-3 border rounded-lg shadow-sm"
              disabled
            />
          </div>

          {/* Delivery Info */}
          <h3 className="text-lg font-medium mb-4">Delivery Information</h3>
          <div className="mb-4 grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-lg shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-lg shadow-sm"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg shadow-sm"
              required
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-lg shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                className="w-full p-3 border rounded-lg shadow-sm"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg shadow-sm"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg shadow-sm"
              required
            />
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg shadow-md transition transform hover:scale-105"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
