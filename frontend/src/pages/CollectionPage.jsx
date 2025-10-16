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
    <div className="relative flex flex-col lg:flex-row bg-gray-50 min-h-screen">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed z-50 top-0 left-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:z-0 border-r`}
      >
        <div className="h-full overflow-y-auto px-4 py-6">
          <FilterSidebar />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* Top bar for mobile */}
        <div className="lg:hidden sticky top-0 bg-gray-50 z-30 pb-4 mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-gray-800">
            All Collection
          </h2>
          <button
            onClick={toggleSidebar}
            className="inline-flex items-center px-3 py-2 text-sm font-medium bg-white border rounded shadow hover:bg-gray-100"
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
        </div>

        {/* Heading for desktop */}
        <div className="hidden lg:block mb-6">
          <h2 className="text-3xl font-bold tracking-wide text-gray-900 mb-2">
            All Collection
          </h2>
        </div>

        {/* Sort Options */}
        <div className="mb-6">
          <SortOptions />
        </div>

        {/* Products */}
        <ProductGrid products={products} loading={loading} error={error} />
      </main>
    </div>
  );
};

export default CollectionPage;
