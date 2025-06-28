import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiLoader } from "react-icons/fi";

const initialForm = {
  name: "",
  city: "",
  state: "",
  address: "",
  contact: "",
  landmark: "",
  image: "",
  storeOwner: "",
};

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const token = localStorage.getItem("userToken");

  // Fetch all stores
  const fetchStores = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/stores`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStores(data);
    } catch (err) {
      setError("Failed to fetch stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file selection
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setForm((prev) => ({
        ...prev,
        image: data.imageUrl,
      }));
    } catch (error) {
      console.error(error);
      alert("Image upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Upload image to server and get URL
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data.imageUrl;
  };

  // Handle add/edit submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      let imageUrl = form.image;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      const payload = { ...form, image: imageUrl };

      if (editingId) {
        // Edit store
        await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/stores/${editingId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Store updated!");
      } else {
        // Add store
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/admin/stores`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess("Store added!");
      }
      setForm(initialForm);
      setImageFile(null);
      setEditingId(null);
      fetchStores();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add/update store");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button
  const handleEdit = (store) => {
    setForm({
      name: store.name,
      city: store.city,
      state: store.state,
      address: store.address,
      contact: store.contact,
      landmark: store.landmark,
      image: store.image,
      storeOwner: store.storeOwner,
    });
    setEditingId(store._id);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;
    setLoading(true);
    setError("");
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/stores/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Store deleted!");
      fetchStores();
    } catch (err) {
      setError("Failed to delete store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6">Store Management</h2>

      {/* Add/Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow mb-8 space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Store Name"
            className="border p-2 rounded"
            required
          />
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="City"
            className="border p-2 rounded"
            required
          />
          <input
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="State"
            className="border p-2 rounded"
            required
          />
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="border p-2 rounded"
            required
          />
          <input
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Contact"
            className="border p-2 rounded"
          />
          <input
            name="landmark"
            value={form.landmark}
            onChange={handleChange}
            placeholder="Landmark"
            className="border p-2 rounded"
            required
          />
          <input
            name="storeOwner"
            value={form.storeOwner}
            onChange={handleChange}
            placeholder="Store Owner ID"
            className="border p-2 rounded"
            required
          />
          <input
            name="document"
            value={form.document}
            onChange={handleChange}
            placeholder="Document- Aadhar Number"
            className="border p-2 rounded"
          />
          <div className="mb-6">
            <label className="block font-semibold mb-2">Upload Image</label>
            <input type="file" onChange={handleImageUpload} />
            <div className="flex gap-4 mt-4">
              {form.image && (
                <div>
                  <img
                    src={form.image}
                    alt="Store"
                    className="w-20 h-20 object-cover rounded-md shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                    className="text-red-500 text-sm"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {editingId ? "Update Store" : "Add Store"}
        </button>
        {loading && <FiLoader className="inline ml-2 animate-spin" />}
        {error && <div className="text-red-600 mt-2">{error}</div>}
        {success && <div className="text-green-600 mt-2">{success}</div>}
      </form>

      {/* Store Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">City</th>
              <th className="px-4 py-2">State</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">Contact</th>
              <th className="px-4 py-2">Landmark</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Store Owner</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-500">
                  No stores found.
                </td>
              </tr>
            ) : (
              stores.map((store) => (
                <tr key={store._id} className="border-b">
                  <td className="px-4 py-2">{store.name}</td>
                  <td className="px-4 py-2">{store.city}</td>
                  <td className="px-4 py-2">{store.state}</td>
                  <td className="px-4 py-2">{store.address}</td>
                  <td className="px-4 py-2">{store.contact}</td>
                  <td className="px-4 py-2">{store.landmark}</td>
                  <td className="px-4 py-2">
                    {store.image ? (
                      <img
                        src={store.image}
                        alt="Store"
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-2">{store.storeOwner}</td>
                  <td className="px-4 py-2 space-x-1">
                    <button
                      className="text-xl text-blue-600"
                      onClick={() => handleEdit(store)}
                    >
                      <i class="ri-file-edit-fill"></i>
                    </button>
                    <button
                      className="text-xl text-red-600"
                      onClick={() => handleDelete(store._id)}
                    >
                      <i class="ri-delete-bin-line"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {loading && (
          <div className="flex justify-center items-center py-6">
            <FiLoader className="animate-spin text-2xl text-blue-500" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreManagement;
