import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 2000,
  });

  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);

  const brand = [
    "Snitch",
    "Max Fashion",
    "West Side",
    "Levi's",
    "Peter England",
    "Nike",
    "CK",
    "US Polo Assn",
    "Spykar",
  ];
  const categories = [
    "Shirt",
    "T-Shirt",
    "Trouser",
    "Jacket",
    "Pant",
    "Joggers",
    "Skirt",
    "Sweatshirt",
    "Blazer",
    "Top",
  ];
  const colors = [
    "Red",
    "Blue",
    "Black",
    "Green",
    "Yellow",
    "Gray",
    "White",
    "Pink",
    "Beige",
    "Navy",
  ];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const material = [
    "Cotton",
    "Wool",
    "Denim",
    "Polyester",
    "Silk",
    "Linen",
    "Viscose",
    "Fleece",
  ];
  const genders = ["Men", "Women", "Boy", "Girl"];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    const updatedFilters = {
      brand: params.brand ? params.brand.split(",") : [],
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      minPrice: parseInt(params.minPrice) || 0,
      maxPrice: parseInt(params.maxPrice) || 2000,
    };

    setFilters(updatedFilters);
    setSelectedSizes(updatedFilters.size);
    setSelectedColor(updatedFilters.color);
    setSelectedMaterial(updatedFilters.material);
    setSelectedBrand(updatedFilters.brand);
    setPriceRange([updatedFilters.minPrice, updatedFilters.maxPrice]);
  }, [searchParams]);

  const updateSearchParams = (newParams) => {
    const updatedParams = {
      ...Object.fromEntries([...searchParams]),
      ...newParams,
    };
    setSearchParams(updatedParams);
  };

  const handleColorSelect = (color) => {
    const newColor = selectedColor === color ? "" : color;
    setSelectedColor(newColor);
    updateSearchParams({ color: newColor });
  };

  const handleSizeSelect = (size) => {
    const newSizeArray = selectedSizes.includes(size)
      ? selectedSizes.filter((item) => item !== size)
      : [...selectedSizes, size];
    setSelectedSizes(newSizeArray);
    updateSearchParams({ size: newSizeArray.join(",") });
  };

  const handleMaterialSelect = (item) => {
    const newMaterialArray = selectedMaterial.includes(item)
      ? selectedMaterial.filter((i) => i !== item)
      : [...selectedMaterial, item];
    setSelectedMaterial(newMaterialArray);
    updateSearchParams({ material: newMaterialArray.join(",") });
  };

  const handleBrandSelect = (item) => {
    const newBrandArray = selectedBrand.includes(item)
      ? selectedBrand.filter((i) => i !== item)
      : [...selectedBrand, item];
    setSelectedBrand(newBrandArray);
    updateSearchParams({ brand: newBrandArray.join(",") });
  };

  const handlePriceChange = (e) => {
    const updated = [...priceRange];
    updated[e.target.name === "min" ? 0 : 1] = +e.target.value;
    setPriceRange(updated);
    updateSearchParams({ minPrice: updated[0], maxPrice: updated[1] });
  };

  const handleCategorySelect = (category) => {
    setFilters((prev) => ({ ...prev, category }));
    updateSearchParams({ category });
  };

  const handleGenderSelect = (gender) => {
    setFilters((prev) => ({ ...prev, gender }));
    updateSearchParams({ gender });
  };

  const handleClearAll = () => {
    setSearchParams({});
    setFilters({
      category: "",
      gender: "",
      color: "",
      size: [],
      material: [],
      brand: [],
      minPrice: 0,
      maxPrice: 2000,
    });
    setSelectedSizes([]);
    setSelectedColor("");
    setSelectedMaterial([]);
    setSelectedBrand([]);
    setPriceRange([0, 2000]);
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm overflow-y-auto max-h-[90vh]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-gray-800">Filters</h3>
        <button
          onClick={handleClearAll}
          className="text-blue-600 hover:underline text-sm"
        >
          Clear All
        </button>
      </div>

      {/* Category Section */}
      <div className="mb-6">
        <p className="font-semibold text-black mb-2">Category</p>
        {categories.map((category) => (
          <label
            key={category}
            className="flex items-center mb-2 cursor-pointer"
          >
            <input
              type="radio"
              name="category"
              value={category}
              checked={filters.category === category}
              onChange={() => handleCategorySelect(category)}
              className="h-4 w-4 text-blue-600 mr-2"
            />
            <span className="text-gray-700">{category}</span>
          </label>
        ))}
      </div>

      {/* Gender Section */}
      <div className="mb-6">
        <p className="font-semibold text-black mb-2">Gender</p>
        {genders.map((gender) => (
          <label key={gender} className="flex items-center mb-2 cursor-pointer">
            <input
              type="radio"
              name="gender"
              value={gender}
              checked={filters.gender === gender}
              onChange={() => handleGenderSelect(gender)}
              className="h-4 w-4 text-blue-600 mr-2"
            />
            <span className="text-gray-700">{gender}</span>
          </label>
        ))}
      </div>

      {/* Color Picker */}
      <div className="mb-6">
        <p className="font-semibold text-black mb-2">Color</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorSelect(color)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                selectedColor === color
                  ? "ring-2 ring-blue-500 border-blue-500 scale-110"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
              aria-label={color}
            />
          ))}
        </div>
      </div>

      {/* Size Buttons */}
      <div className="mb-6">
        <p className="font-semibold text-black mb-2">Size</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeSelect(size)}
              className={`px-3 py-1 rounded-md border text-sm ${
                selectedSizes.includes(size)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Material and Brand Sections */}
      {[
        ["Material", material, selectedMaterial, handleMaterialSelect],
        ["Brand", brand, selectedBrand, handleBrandSelect],
      ].map(([label, list, selected, handler]) => (
        <div className="mb-6" key={label}>
          <p className="font-semibold text-black mb-2">{label}</p>
          <div className="flex flex-col gap-2">
            {list.map((item) => (
              <label
                key={item}
                className="flex items-center space-x-2 text-gray-700"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(item)}
                  onChange={() => handler(item)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Price Range - (optional, currently commented out) */}
      {/* 
      <div className="mb-6">
        <p className="font-semibold text-black mb-2">Price Range</p>
        <div className="flex items-center gap-4">
          <input
            type="number"
            name="min"
            value={priceRange[0]}
            onChange={handlePriceChange}
            className="w-20 p-1 border rounded text-sm"
          />
          <span>-</span>
          <input
            type="number"
            name="max"
            value={priceRange[1]}
            onChange={handlePriceChange}
            className="w-20 p-1 border rounded text-sm"
          />
        </div>
      </div>
      */}
    </div>
  );
};

export default FilterSidebar;
