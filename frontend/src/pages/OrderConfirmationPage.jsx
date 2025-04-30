import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Import toast
import { clearCart } from "../redux/slice/cartSlice"; // Import clearCart

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout);

  // useRef to track if the toast was shown
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (checkout && checkout._id && !toastShownRef.current) {
      dispatch(clearCart());
      toast.success("Order placed successfully! 🎉");
      toastShownRef.current = true; // Set ref to true after showing toast
    } else if (!checkout?._id) {
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate]); // Dependency on checkout

  const calculateEstimateDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  const calculateTotal = () =>
    checkout.checkoutItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You for your order!
      </h1>

      {checkout && (
        <div className="p-6 rounded-lg border">
          {/* Order details */}
          <div className="flex justify-between mb-12">
            <div>
              <h2 className="text-xl font-semibold">
                Order ID: {checkout._id}
              </h2>
              <p className="text-gray-700">
                Order date: {new Date(checkout.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-emerald-700 text-sm">
                Estimated Delivery:{" "}
                {calculateEstimateDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>

          {/* Ordered items */}
          <div className="mb-12">
            {checkout.checkoutItems.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between items-center mb-4"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div>
                    <h4 className="text-md font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-500">
                      Color: {item.color} | Size: {item.size}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  <p className="text-md font-medium text-gray-800">
                    ₹{item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment and Delivery info */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Payment Mode:</h4>
              <p className="text-gray-600">PayPal</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Delivery Address:</h4>
              <p className="text-gray-600">
                {checkout.shippingAddress.address}
              </p>
              <p className="text-gray-600">
                {checkout.shippingAddress.city},{" "}
                {checkout.shippingAddress.country}
              </p>
            </div>
          </div>

          {/* Total */}
          <div className="text-right font-semibold text-lg">
            Total: ₹{calculateTotal()}
          </div>

          {/* Back to home page */}
          <div className="text-center mt-10">
            <h2 className="text-2xl font-bold mb-4">
              Thank you for your purchase!
            </h2>
            <Link to="/" className="text-blue-600 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
