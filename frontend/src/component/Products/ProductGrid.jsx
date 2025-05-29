import React from "react";
import { Link } from "react-router-dom";

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-red-600">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Link key={index} to={`/product/${product._id}`} className="block">
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-transform transform hover:scale-105 hover:z-10">
            <div className="w-full h-96 mb-4">
              {/* Ensure images exist before trying to access them */}
              {product.images &&
              Array.isArray(product.images) &&
              product.images.length > 0 ? (
                <img
                  src={product.images[0].url}
                  alt={product.images[0].altText || product.name}
                  title={product.name} // Optional title for extra context
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
                  <span>No Image Available</span>
                </div>
              )}
            </div>
            <h3 className="text-sm mb-2 text-black font-semibold">
              {product.name}
            </h3>
            <p className="text-gray-500 font-semibold text-sm tracking-tighter">
              ₹{product.discountPrice || product.price}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
