import React, { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProductByFilters } from "../../redux/slice/productSlice";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchProductByFilters({ search: searchTerm }));
    navigate(`/collections/all?search=${searchTerm}`);
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative w-full max-w-3xl flex items-center gap-4"
    >
      {/* Search Field */}
      <div className="w-full flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-md">
        <BiSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent border-none focus:outline-none placeholder:text-gray-700"
        />
        {/* Clear Button */}
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 text-gray-500"
          >
            X
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
