import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStoreOwnerProfile,
  logoutStoreOwner,
  toggleStoreOnline,
} from "../redux/slice/storeOwnerAuthSlice";
import { useNavigate } from "react-router-dom";

const StoreOwnerProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    user: storeOwner,
    loading,
    error,
  } = useSelector((state) => state.storeOwnerAuth);

  useEffect(() => {
    if (!storeOwner) {
      dispatch(fetchStoreOwnerProfile());
    }
  }, [storeOwner, dispatch]);

  const handleLogout = () => {
    dispatch(logoutStoreOwner());
    navigate("/login");
  };

  const handleToggleOnline = (storeId, isActive) => {
    dispatch(toggleStoreOnline({ storeId, isActive })).then(() => {
      dispatch(fetchStoreOwnerProfile());
    });
  };

  const handleToggleAllStores = () => {
    const shouldGoOnline = !storeOwner.stores.every((store) => store.isActive);

    storeOwner.stores.forEach((store) => {
      if (store.isActive !== shouldGoOnline) {
        dispatch(
          toggleStoreOnline({ storeId: store._id, isActive: shouldGoOnline })
        );
      }
    });

    // Re-fetch after delay to allow updates
    setTimeout(() => {
      dispatch(fetchStoreOwnerProfile());
    }, 500);
  };



  const allOnline = storeOwner.stores.every((store) => store.isActive);
  const toggleButtonText = allOnline
    ? "Make All Stores Offline"
    : "Make All Stores Online";

  const totalStores = storeOwner.stores?.length || 0;
  const onlineStores =
    storeOwner.stores?.filter((store) => store.isActive).length || 0;

  let overallStatus = "All Offline";
  let statusColor = "text-red-600";

  if (onlineStores === totalStores && totalStores > 0) {
    overallStatus = "All Online";
    statusColor = "text-green-600";
  } else if (onlineStores > 0) {
    overallStatus = "Partially Online";
    statusColor = "text-yellow-600";
  }

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-red-600 text-center mt-10">{error}</div>;
  if (!storeOwner)
    return <div className="text-center mt-10">No profile data found.</div>;


console.log("Store Owner Profile Data:", storeOwner);
  return (
    <div className="w-full min-h-screen bg-gray-50 py-12 px-4 sm:px-8">
      <div className="bg-white shadow-xl rounded-2xl p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center sm:text-left">
            Store Owner Profile
          </h2>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg mt-4 sm:mt-0"
          >
            Logout
          </button>
        </div>

        {/* Owner and Store Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Owner Info */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Owner Information
            </h3>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Owner Image */}
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                <img
                  src={
                    storeOwner.image ||
                    `https://ui-avatars.com/api/${storeOwner.firstname}`
                  }
                  alt="Owner"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Owner Details */}
              <div className="flex-1">
                <p className="mb-1">
                  <span className="font-medium capitalize">Name:</span>{" "}
                  {storeOwner.firstname} {storeOwner.lastname}
                </p>
                <p className="mb-1">
                  <span className="font-medium">Email:</span> {storeOwner.email}
                </p>
                <p>
                  <span className="font-medium">Contact:</span>{" "}
                  {storeOwner.contact}
                </p>
              </div>
            </div>
          </div>

          {/* Main Store Info */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Primary Store
            </h3>
            <p className="mb-1">
              <span className="font-medium">Total Stores:</span>{" "}
              {storeOwner.stores?.length || 0}
            </p>

            <p className="mb-1">
              <span className="font-medium">Status:</span>{" "}
              <span
                className={`font-semibold flex items-center gap-2 ${statusColor}`}
              >
                {overallStatus === "All Online" && <span>🟢</span>}
                {overallStatus === "All Offline" && <span>🔴</span>}
                {overallStatus === "Partially Online" && <span>🟡</span>}
                {overallStatus}
              </span>
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleToggleAllStores}
                className={`px-4 py-2 rounded-lg text-sm text-white ${
                  allOnline
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {toggleButtonText}
              </button>

              <button
                onClick={() => navigate("/store-owner/addstore")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
              >
                Create Store
              </button>
            </div>
          </div>
        </div>

        {/* Store Table */}
        {storeOwner.stores && storeOwner.stores.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              All Your Stores
            </h3>
            <div className="overflow-x-auto border rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                  <tr>
                    <th className="px-6 py-3 text-left">Image</th>
                    <th className="px-6 py-3 text-left">Store Name</th>
                    <th className="px-6 py-3 text-left">Address</th>
                    <th className="px-6 py-3 text-left">Check Products</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100 text-sm">
                  {storeOwner.stores.map((store, index) => (
                    <tr
                      key={store._id}
                      className="hover:bg-gray-50 transition-all"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={store.image}
                          alt="Not Uploaded"
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800 capitalize">
                        {store.name}
                      </td>
                      <td className="px-6 py-4">{store.landmark}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            navigate(`/store/${store._id}/products`)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm"
                        >
                          Check Products
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            handleToggleOnline(store._id, !store.isActive)
                          }
                          className={`mt-3 px-4 py-2 rounded-lg text-white transition ${
                            store.isActive
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          {store.isActive ? "Go Offline" : "Go Online"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerProfilePage;
