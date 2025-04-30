import React, { useState } from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  updateCartItemQuantity,
  removeFromCart,
} from "../../redux/slice/cartSlice";

const CartContent = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();
  const [loadingImages, setLoadingImages] = useState(true);

  // Handle adding and subtracting cart quantity
  const handleToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  //Handle removal of proudct from cart
  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };

  // Handle image load and error
  const handleImageLoad = () => setLoadingImages(false);
  const handleImageError = () => setLoadingImages(false);

  // Calculate subtotal
  const subtotal = cart.products.reduce((total, product) => {
    const price = parseFloat(product.price) || 0;
    const quantity = product.quantity || 1;
    return total + price * quantity;
  }, 0);

  return (
    <div className="p-4 h-full flex flex-col justify-between">
      {/* Loading Indicator */}
      {loadingImages && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Items */}
      <div className="overflow-y-auto flex-grow relative">
        {cart.products.length === 0 ? (
          <p>Your cart is empty!</p>
        ) : (
          cart.products.map((product) => (
            <div key={product.productId} className="flex items-center mb-4">
              {/* Image */}
              <div>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24 object-cover rounded"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </div>

              {/* Info */}
              <div className="flex-1 px-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Size: {product.size} | Color: {product.color}
                </p>

                <div className="flex items-center space-x-2">
                  <button
                    disabled={product.quantity === 1}
                    onClick={() =>
                      handleToCart(
                        product.productId,
                        -1,
                        product.quantity,
                        product.size,
                        product.color
                      )
                    }
                    className={`border rounded px-3 py-1 text-lg font-medium ${
                      product.quantity === 1
                        ? "cursor-not-allowed text-gray-400 border-gray-300"
                        : ""
                    }`}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="mx-4">{product.quantity}</span>
                  <button
                    onClick={() =>
                      handleToCart(
                        product.productId,
                        1,
                        product.quantity,
                        product.size,
                        product.color
                      )
                    }
                    className="border rounded px-3 py-1 text-lg font-medium"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="text-md font-semibold">
                  ₹{parseFloat(product.price).toFixed(2)}
                </p>
                <button
                  onClick={() =>
                    handleRemoveFromCart(
                      product.productId,
                      product.size,
                      product.color
                    )
                  }
                  aria-label="Remove product"
                >
                  <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Subtotal */}
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">Subtotal:</h2>
          <p className="text-lg font-bold">₹{subtotal.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default CartContent;
