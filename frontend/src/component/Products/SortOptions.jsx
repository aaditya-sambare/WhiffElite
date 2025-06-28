import React from "react";
import { useSearchParams } from "react-router-dom";

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    const newSearchParams = new URLSearchParams(searchParams);
    if (sortBy) {
      newSearchParams.set("sortBy", sortBy);
    } else {
      newSearchParams.delete("sortBy");
    }
    setSearchParams(newSearchParams);
  };

  return (
    <div className="mb-4 flex items-center justify-end">
      <label htmlFor="sort" className="mr-2 text-sm font-medium text-gray-700">
        Sort by:
      </label>
      <select
        id="sort"
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchParams.get("sortBy") || ""}
        onChange={handleSortChange}
      >
        <option value="">Default</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  );
};

export default SortOptions;
