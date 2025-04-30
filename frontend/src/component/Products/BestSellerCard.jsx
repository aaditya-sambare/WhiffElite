import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BestSellerCard = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center rounded-lg bg-gray-100 p-20">
      {/* Toast Notification */}
      {toastVisible && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg w-100 text-sm z-50 transition-all duration-300 ease-in-out transform ${
            !selectedColor || !selectedSize
              ? "bg-white text-red-500 animate-toast-fade-in animate-toast-shake"
              : "bg-white text-green-500 animate-toast-fade-in animate-toast-bounce"
          }`}
        >
          <p className="font-semibold">{toastMessage}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden bg-transparent transform transition-transform hover:scale-105 duration-500">
        {/* Left: Product Image */}
        <div className="md:w-1/2 w-full h-96 relative group">
          <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-xs font-semibold transform scale-0 group-hover:scale-100 transition-all duration-300 ease-in-out">
            SALE
          </div>
          <img
            src={product?.images?.[0]?.url}
            alt={product?.images?.[0]?.altText || product?.name}
            className="w-full h-full object-contain rounded-tl-3xl rounded-bl-3xl"
          />
        </div>

        {/* Right: Product Info */}
        <div className="md:w-1/2 w-full p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              {product?.name}
            </h2>
            <p className="text-red-500 font-semibold text-2xl mb-4">
              ₹{product?.price}
              {product?.discountPrice && (
                <span className="text-gray-400 line-through text-lg ml-2">
                  ₹{product.discountPrice}
                </span>
              )}
              {" "}
              {/* Save % badge */}
              {product.discountPrice && (
                <span className="text-green-600 bg-green-100 text-sm font-semibold px-2 py-1 rounded">
                  Save{" "}
                  {Math.round(
                    ((product.price - product.discountPrice) /
                      product.price) *
                      100
                  )}
                  %
                </span>
              )}
            </p>

            <p className="text-gray-600 text-sm mb-6">{product?.description}</p>

            {/* Colors */}
            <div className="mb-4">
              <p className="text-gray-700 text-lg mb-2">Colors:</p>
              <div className="flex gap-2">
                {product?.colors?.map((color) => (
                  <div
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border cursor-pointer transform hover:scale-110 transition-all duration-300 ${
                      selectedColor === color
                        ? "border-4 border-black"
                        : "border-gray-300"
                    }`}
                    style={{
                      backgroundColor: color.toLowerCase(),
                      filter: "brightness(0.9)",
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-6">
              <p className="text-gray-700 text-lg mb-2">Sizes:</p>
              <div className="flex gap-2">
                {product?.sizes?.map((size) => (
                  <span
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`text-xs border border-gray-300 rounded px-4 py-2 font-semibold cursor-pointer transform hover:scale-105 transition-all duration-300 ${
                      selectedSize === size ? "bg-black text-white" : ""
                    }`}
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* View Product Button */}
          <div className="flex flex-col gap-4 mt-4">
            <button
              onClick={() => navigate(`/product/${product?._id}`)}
              className="bg-black text-white py-3 px-6 rounded-xl w-full transition-transform transform hover:bg-gray-900 hover:scale-105"
            >
              VIEW PRODUCT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestSellerCard;
