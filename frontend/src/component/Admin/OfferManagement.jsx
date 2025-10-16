import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/admin/offers`;
const UPLOAD_URL = `${process.env.REACT_APP_BACKEND_URL}/api/upload`;

const OfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    imageUrl: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    const { data } = await axios.get(API_URL);
    setOffers(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!imageFile) return "";
    setUploading(true);
    const formData = new FormData();
    formData.append("image", imageFile);
    try {
      const { data } = await axios.post(UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploading(false);
      return data.imageUrl;
    } catch (err) {
      setUploading(false);
      alert("Image upload failed");
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = form.imageUrl;
    if (imageFile) {
      imageUrl = await handleImageUpload();
    }
    await axios.post(API_URL, { ...form, imageUrl });
    setForm({ title: "", imageUrl: "", description: "" });
    setImageFile(null);
    fetchOffers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchOffers();
  };

  const handleEdit = async (id) => {
    const offer = offers.find((o) => o._id === id);
    setForm(offer);
    setImageFile(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    let imageUrl = form.imageUrl;
    if (imageFile) {
      imageUrl = await handleImageUpload();
    }
    await axios.put(`${API_URL}/${form._id}`, { ...form, imageUrl });
    setForm({ title: "", imageUrl: "", description: "" });
    setImageFile(null);
    fetchOffers();
  };

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          🎁 Offer Management
        </h2>

        {/* Form Section */}
        <form
          onSubmit={form._id ? handleUpdate : handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        >
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Offer Title"
            className="border rounded p-3 focus:ring focus:ring-blue-300"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border rounded p-3"
          />

          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="Image URL (optional)"
            className="border rounded p-3 focus:ring focus:ring-blue-300"
            disabled={!!imageFile}
            required={!imageFile}
          />

          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Short Description"
            className="border rounded p-3 focus:ring focus:ring-blue-300"
          />

          <div className="col-span-1 md:col-span-2 flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded shadow"
              disabled={uploading}
            >
              {form._id ? "Update Offer ✏️" : "Add Offer ➕"}
            </button>
            {form._id && (
              <button
                type="button"
                onClick={() =>
                  setForm({ title: "", imageUrl: "", description: "" })
                }
                className="bg-gray-500 hover:bg-gray-600 transition text-white px-6 py-2 rounded shadow"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* List of Offers */}
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full bg-white rounded-lg">
            <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
              <tr>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr
                  key={offer._id}
                  className="text-center border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">
                    <img
                      src={offer.imageUrl}
                      alt={offer.title}
                      className="w-16 h-16 object-cover mx-auto rounded-lg shadow"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium">{offer.title}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {offer.description}
                  </td>
                  <td className="py-3 px-4 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(offer._id)}
                      className="bg-yellow-500 hover:bg-yellow-600 transition text-white px-4 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(offer._id)}
                      className="bg-red-600 hover:bg-red-700 transition text-white px-4 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {offers.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-gray-500 italic">
                    No offers found. Add one above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

};

export default OfferManagement;
