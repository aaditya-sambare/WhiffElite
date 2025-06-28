import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchStoreOwnerProfile } from "../../redux/slice/storeOwnerAuthSlice";

const StoreAddStore = () => {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "",
    address: "",
    contact: "",
    landmark: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const token = useSelector((state) => state.storeOwnerAuth.token);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setImageFile(files[0]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const uploadToServer = async (file) => {
    const data = new FormData();
    data.append("image", file);
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/upload`, {
      method: "POST",
      body: data,
    });
    const result = await res.json();
    return result.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      let imageUrl = formData.image;
      if (imageFile) {
        setUploading(true);
        imageUrl = await uploadToServer(imageFile);
        setUploading(false);
      }
      const payload = { ...formData, image: imageUrl };
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/stores`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Store created successfully!");
      await dispatch(fetchStoreOwnerProfile());
      setTimeout(() => navigate("/store-owner/profile"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create store. Try again."
      );
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">Add Store</h1>
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Store Name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Store Address"
            value={formData.address}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
          <input
            type="text"
            name="landmark"
            placeholder="Landmark"
            value={formData.landmark}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded"
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded"
          />
          {uploading && <div className="text-blue-600">Uploading image...</div>}
          {error && <div className="text-red-600">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={loading || uploading}
          >
            {loading ? "Adding..." : "Add Store"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StoreAddStore;
