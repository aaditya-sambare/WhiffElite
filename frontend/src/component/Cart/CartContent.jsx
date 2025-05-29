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
  const handleToCart = (productId, delta, quantity, size, color, store) => {
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
          storeId: store,
        })
      );
    }
  };

  // Handle removal of product from cart
  const handleRemoveFromCart = (productId, size, color, store) => {
    dispatch(
      removeFromCart({
        productId,
        guestId,
        userId,
        size,
        color,
        storeId: store,
      })
    );
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

  // Function to handle the button state for increase/decrease quantity
  const getButtonClass = (quantity, delta) => {
    if (delta === -1 && quantity === 1) {
      return "cursor-not-allowed border rounded px-3 py-1 text-lg font-medium";
    }
    return "border rounded px-3 py-1 text-lg font-medium";
  };

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
            <div
              key={product.productId}
              className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6"
            >
              {/* Image */}
              <div className="w-full sm:w-24 sm:h-32 mb-4 sm:mb-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </div>

              {/* Info */}
              <div className="flex-1 px-4">
                <h3 className="font-semibold text-base sm:text-lg">
                  {product.name}
                </h3>
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
                        product.color,
                        product.store
                      )
                    }
                    className={getButtonClass(product.quantity, -1)}
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
                        product.color,
                        product.store
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
              <div className="text-right mt-4 sm:mt-0 sm:text-right">
                <p className="text-md font-semibold">
                  ₹{parseFloat(product.price).toFixed(2)}
                </p>
                <button
                  onClick={() =>
                    handleRemoveFromCart(
                      product.productId,
                      product.size,
                      product.color,
                      product.store
                    )
                  }
                  aria-label="Remove product"
                  className="mt-2 sm:mt-4"
                >
                  <RiDeleteBin3Line className="h-6 w-6 text-red-600" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Subtotal */}
      <div className="border-t pt-4 mt-4">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-baseline">
          <h2 className="font-semibold text-lg">Subtotal:</h2>
          <p className="text-lg font-bold">₹{subtotal.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default CartContent;
