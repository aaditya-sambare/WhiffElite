import React from "react";
import { useSearchParams } from "react-router-dom";
import { FaSortAmountDownAlt } from "react-icons/fa";

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
    <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-2">
      <label
        htmlFor="sort"
        className="flex items-center text-sm font-medium text-gray-700"
      >
        <FaSortAmountDownAlt className="mr-1" />
        Sort by:
      </label>
      <select
        id="sort"
        className="border border-gray-300 bg-white rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
