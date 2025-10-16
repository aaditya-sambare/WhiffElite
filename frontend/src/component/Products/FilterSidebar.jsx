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
    const newArray = selectedMaterial.includes(item)
      ? selectedMaterial.filter((i) => i !== item)
      : [...selectedMaterial, item];
    setSelectedMaterial(newArray);
    updateSearchParams({ material: newArray.join(",") });
  };

  const handleBrandSelect = (item) => {
    const newArray = selectedBrand.includes(item)
      ? selectedBrand.filter((i) => i !== item)
      : [...selectedBrand, item];
    setSelectedBrand(newArray);
    updateSearchParams({ brand: newArray.join(",") });
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
    <div className="bg-white shadow-md rounded-2xl px-5 py-6 w-full max-w-sm lg:max-w-xs overflow-y-auto max-h-[90vh] sticky top-4">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Filters</h3>
        <button
          onClick={handleClearAll}
          className="text-blue-600 text-sm hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Filter Section */}
      {[
        {
          title: "Category",
          items: categories,
          selected: filters.category,
          type: "radio",
          handler: handleCategorySelect,
        },
        {
          title: "Gender",
          items: genders,
          selected: filters.gender,
          type: "radio",
          handler: handleGenderSelect,
        },
      ].map(({ title, items, selected, handler, type }) => (
        <div className="mb-5" key={title}>
          <p className="font-semibold text-gray-800 mb-2">{title}</p>
          {items.map((item) => (
            <label key={item} className="flex items-center mb-2 text-sm">
              <input
                type={type}
                name={title}
                value={item}
                checked={selected === item}
                onChange={() => handler(item)}
                className="h-4 w-4 mr-2 accent-blue-600"
              />
              {item}
            </label>
          ))}
        </div>
      ))}

      {/* Color Picker */}
      <div className="mb-6">
        <p className="font-semibold text-gray-800 mb-2">Color</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorSelect(color)}
              className={`w-7 h-7 rounded-full border-2 focus:outline-none ${
                selectedColor === color
                  ? "ring-2 ring-offset-2 ring-blue-500 border-blue-500 scale-110"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
              title={color}
              aria-label={color}
            />
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="mb-6">
        <p className="font-semibold text-gray-800 mb-2">Size</p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeSelect(size)}
              className={`px-3 py-1 rounded-full border text-sm font-medium transition ${
                selectedSizes.includes(size)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Material & Brand */}
      {[
        ["Material", material, selectedMaterial, handleMaterialSelect],
        ["Brand", brand, selectedBrand, handleBrandSelect],
      ].map(([label, list, selected, handler]) => (
        <div className="mb-6" key={label}>
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
            {list.map((item) => (
              <label
                key={item}
                className="flex items-center text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(item)}
                  onChange={() => handler(item)}
                  className="h-4 w-4 mr-2 accent-blue-600"
                />
                {item}
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Price Range (optional) */}
      {/* 
      <div className="mb-6">
        <p className="font-semibold text-gray-800 mb-2">Price Range</p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            name="min"
            value={priceRange[0]}
            onChange={handlePriceChange}
            className="w-20 p-1 border border-gray-300 rounded text-sm"
          />
          <span>-</span>
          <input
            type="number"
            name="max"
            value={priceRange[1]}
            onChange={handlePriceChange}
            className="w-20 p-1 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>
      */}
    </div>
  );
};

export default FilterSidebar;
