import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearCart } from "../redux/slice/cartSlice";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout);
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (checkout && checkout._id && !toastShownRef.current) {
      dispatch(clearCart());
      toast.success("Order placed successfully! 🎉");
      toastShownRef.current = true;
    } else if (!checkout?._id) {
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate]);

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

    console.log(checkout)
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 bg-white">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-emerald-700 mb-10">
        Thank You for Your Order!
      </h1>

      {checkout && (
        <div className="bg-gray-50 p-6 sm:p-8 rounded-xl shadow-md border">
          {/* Order Summary Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                Order ID:{" "}
                <span className="font-mono text-gray-700">{checkout._id}</span>
              </h2>
              <p className="text-sm text-gray-600">
                Order Date: {new Date(checkout.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                Delivery by{" "}
                {(() => {
                  const orderDate = new Date(checkout.createdAt);
                  orderDate.setMinutes(orderDate.getMinutes() + 45);
                  return (
                    orderDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }) +
                    " on " +
                    orderDate.toLocaleDateString()
                  );
                })()}
              </span>
            </div>
          </div>

          {/* Product List */}
          <div className="space-y-6 mb-10">
            {checkout.checkoutItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between gap-4 border-b pb-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.color} | Size: {item.size}
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-700">
                  <p>Qty: {item.quantity}</p>
                  <p className="font-medium">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment & Address Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700 mb-6">
            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-2">
                Payment Method
              </h4>
              <p>PayPal</p>
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-2">
                Shipping Address
              </h4>
              <p>{checkout.shippingAddress.address}</p>
              <p>
                {checkout.shippingAddress.city},{" "}
                {checkout.shippingAddress.country}
              </p>
            </div>
          </div>

          {/* Total */}
          <div className="text-right border-t pt-4 text-gray-800 space-y-1 text-sm sm:text-base">
            <p>
              <span className="font-medium">Subtotal:</span> ₹
              {calculateTotal().toFixed(2)}
            </p>
            <p>
              <span className="font-medium">Delivery Charges:</span> ₹
              {checkout.deliveryCharge?.toFixed(2) || "0.00"}
            </p>
            <p className="text-lg font-bold text-gray-900">
              Grand Total: ₹
              {(calculateTotal() + (checkout.deliveryCharge || 0)).toFixed(2)}
            </p>
          </div>

          <div className="flex justify-center">
            <Link
              to={`/my-orders`}
              onClick={(e) => e.stopPropagation()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              Track Here
            </Link>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-10">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              We appreciate your business!
            </h2>
            <Link
              to="/"
              className="inline-block text-blue-600 hover:text-blue-800 text-sm underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
