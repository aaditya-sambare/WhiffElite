import React from "react";
import { Link } from "react-router-dom";

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-red-600">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-2 sm:p-4">
      {products.map((product, index) => (
        <Link
          key={index}
          to={`/product/${product._id}`}
          className="block group"
        >
          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm hover:shadow-lg transition-transform transform hover:scale-[1.02]">
            <div className="w-full aspect-[4/5] overflow-hidden rounded-lg mb-3 bg-gray-100">
              {product.images?.[0]?.url ? (
                <img
                  src={product.images[0].url}
                  alt={product.images[0].altText || product.name}
                  title={product.name}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                  No Image
                </div>
              )}
            </div>

            <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
              {product.name}
            </h3>

            <p className="text-sm sm:text-base font-semibold text-red-600 mt-1">
              ₹{product.discountPrice || product.price}
              {product.discountPrice &&
                product.discountPrice < product.price && (
                  <span className="ml-2 text-gray-400 line-through text-xs sm:text-sm">
                    ₹{product.price}
                  </span>
                )}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
