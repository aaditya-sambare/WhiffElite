import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../component/Products/FilterSidebar";
import SortOptions from "../component/Products/SortOptions";
import ProductGrid from "../component/Products/ProductGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByFilters } from "../redux/slice/productSlice";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const queryParams = Object.fromEntries([...searchParams]);

  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProductByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    if (
      isSidebarOpen &&
      sidebarRef.current &&
      !sidebarRef.current.contains(e.target)
    ) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <div className="relative lg:flex bg-gray-50 min-h-screen">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed z-40 top-0 left-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:relative lg:translate-x-0 lg:z-auto`}
      >
        <div className="h-full overflow-y-auto border-r">
          <FilterSidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 lg:p-8">
        {/* Mobile filter button */}
        <div className="lg:hidden mb-4 flex justify-end">
          <button
            onClick={toggleSidebar}
            className="inline-flex items-center px-4 py-2 text-sm font-medium bg-white border rounded shadow hover:bg-gray-100"
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
        </div>

        <h2 className="text-2xl font-semibold tracking-wide uppercase  text-gray-800">
       All collection
        </h2>

        <div className="mb-6">
          <SortOptions />
        </div>

        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CollectionPage;
