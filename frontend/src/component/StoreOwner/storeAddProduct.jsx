import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const genderOptions = ["Men", "Women", "Boy", "Girl"];

const StoreAddProduct = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    countInStock: "",
    sku: "",
    category: "",
    brand: "",
    sizes: "",
    colors: "",
    collections: "",
    material: "",
    gender: "",
    isPublished: false,
    images: [],
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Image upload logic
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, { url: data.imageUrl, altText: "" }],
      }));
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleImageAltChange = (index, value) => {
    setProductData((prev) => {
      const images = [...prev.images];
      images[index].altText = value;
      return { ...prev, images };
    });
  };

  const handleDeleteImage = (index) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/products/store/${storeId}`,
        {
          ...productData,
          sizes: productData.sizes.split(",").map((s) => s.trim()),
          colors: productData.colors.split(",").map((c) => c.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("storeOwnerToken")}`,
          },
        }
      );
      navigate(`/store/${storeId}/products`);
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-lg">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-sm text-gray-600 hover:text-blue-600 transition"
        >
          <span className="text-lg mr-2">&larr;</span>
          Back
        </button>

        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          Add New Product
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {[
            { label: "Product Name", name: "name", type: "text" },
            { label: "Description", name: "description", type: "textarea" },
            { label: "Price", name: "price", type: "number" },
            { label: "Discount Price", name: "discountPrice", type: "number" },
            { label: "Stock Count", name: "countInStock", type: "number" },
            { label: "SKU", name: "sku", type: "text" },
            { label: "Category", name: "category", type: "text" },
            { label: "Brand", name: "brand", type: "text" },
            { label: "Sizes (comma separated)", name: "sizes", type: "text" },
            { label: "Colors (comma separated)", name: "colors", type: "text" },
            { label: "Collections", name: "collections", type: "text" },
            { label: "Material", name: "material", type: "text" },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block mb-1 font-medium">{label}</label>
              {type === "textarea" ? (
                <textarea
                  name={name}
                  value={productData[name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded resize-none"
                  required
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={productData[name]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  required={
                    name !== "discountPrice" &&
                    name !== "brand" &&
                    name !== "material"
                  }
                />
              )}
            </div>
          ))}

          {/* Gender Dropdown */}
          <div>
            <label className="block mb-1 font-medium">Gender</label>
            <select
              name="gender"
              value={productData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            >
              <option value="">Select Gender</option>
              {genderOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-1 font-medium">Product Images</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {uploading && <p className="text-blue-500 text-sm">Uploading...</p>}
            <div className="flex gap-4 mt-2 flex-wrap">
              {productData.images.map((img, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <img
                    src={img.url}
                    alt={img.altText || "Product"}
                    className="w-20 h-20 object-cover rounded shadow"
                  />
                  <input
                    type="text"
                    placeholder="Alt text"
                    value={img.altText}
                    onChange={(e) => handleImageAltChange(idx, e.target.value)}
                    className="text-xs mt-1 border border-gray-300 p-1 rounded w-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(idx)}
                    className="text-red-500 text-xs mt-1"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Publish Toggle */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isPublished"
              checked={productData.isPublished}
              onChange={handleChange}
            />
            <label className="text-sm font-medium">Publish Immediately</label>
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-lg"
          >
            Submit Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default StoreAddProduct;
