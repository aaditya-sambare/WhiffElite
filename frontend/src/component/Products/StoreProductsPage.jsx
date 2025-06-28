import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import colorList from "../Color/color";
import { useSelector } from "react-redux";

const StoreProductsPage = () => {
  const { storeId } = useParams();
  const [products, setProducts] = useState([]);
  const { selectedProduct } = useSelector((state) => state.products);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/products/store/${storeId}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products:", err));
  }, [storeId]);

  const getColorHex = (name) => {
    const found = colorList.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    return found?.hex || "#ccc";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-sm text-gray-600 hover:text-blue-600 transition"
      >
        <span className="text-lg mr-2">&larr;</span>
        Back
      </button>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Manage Products
        </h2>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          onClick={() => navigate(`/store/${storeId}/add-product`)}
        >
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found for this store.</p>
      ) : (
        <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">Sr.</th>
                <th className="px-6 py-3 text-left">Image</th>
                <th className="px-6 py-3 text-left">Product Name</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Stock</th>
                <th className="px-6 py-3 text-left">Sizes</th>
                <th className="px-6 py-3 text-left">Colors</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm divide-y divide-gray-200">
              {products.map((product, index) => (
                <tr key={product._id}>
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">
                    <img
                      src={
                        product.images?.[0]?.url ||
                        "https://via.placeholder.com/100"
                      }
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4">
                    ₹{product.discountPrice || product.price}
                  </td>
                  <td className="px-6 py-4">{product.countInStock}</td>
                  <td className="px-6 py-4">
                    <div className="grid grid-cols-4 gap-2">
                      {product.sizes.map((size, i) => (
                        <div
                          key={i}
                          className="text-sm text-center py-1 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 font-medium shadow-sm"
                        >
                          {size}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {product.colors?.map((colorName) => {
                        const colorHex = getColorHex(colorName);
                        return (
                          <div
                            key={colorName}
                            className="w-6 h-6 rounded-full border border-gray-300"
                            style={{ backgroundColor: colorHex }}
                            title={colorName}
                          ></div>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        navigate(
                          `/store/${storeId}/edit-product/${product._id}`
                        )
                      }
                      className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StoreProductsPage;
