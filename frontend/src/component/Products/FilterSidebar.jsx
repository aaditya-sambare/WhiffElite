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

  const [priceRange, setPriceRange] = useState([0, 100]);
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

    setFilters({
      brand: params.brand ? params.brand.split(",") : [],
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      minPrice: parseInt(params.minPrice) || 0,
      maxPrice: parseInt(params.maxPrice) || 2000,
    });

    setPriceRange([
      parseInt(params.minPrice) || 0,
      parseInt(params.maxPrice) || 2000,
    ]);
  }, [searchParams]);

  const handleColorSelect = (color) => {
    setSelectedColor((prev) => (prev === color ? "" : color));
    updateSearchParams({ color: color === selectedColor ? "" : color });
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
    setSelectedColor(""); 
    setSelectedSizes([]); 
    updateSearchParams({ category });
  };

  // Helper to update searchParams without resetting the other filters
  const updateSearchParams = (newParams) => {
    const updatedParams = {
      ...Object.fromEntries([...searchParams]),
      ...newParams,
    };
    setSearchParams(updatedParams);
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-sm">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Filters</h3>

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
              className="form-radio text-blue-500 mr-2"
            />
            <span className="text-gray-600">{category}</span>
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
              onChange={() => updateSearchParams({ gender })}
              className="form-radio text-blue-500 mr-2"
            />
            <span className="text-gray-600">{gender}</span>
          </label>
        ))}
      </div>

      {/* Color Picker */}
      <div className="mb-6">
        <p className="font-semibold text-black  mb-2">Color</p>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorSelect(color)}
              className={`w-8 h-8 rounded-full border-2 shadow-sm transition-all ${
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

      {/* Size, Material, and Brand Filters */}
      {[
        ["Size", sizes, selectedSizes, handleSizeSelect],
        ["Material", material, selectedMaterial, handleMaterialSelect],
        ["Brand", brand, selectedBrand, handleBrandSelect],
      ].map(([label, list, selected, handler]) => (
        <div className="mb-6" key={label}>
          <p className="font-semibold text-black mb-2">{label}</p>

          <div className="flex flex-col gap-2">
            {list.map((item) => (
              <label
                key={item}
                className="flex items-center space-x-2 text-gray-700 dark:text-white"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(item)}
                  onChange={() => handler(item)}
                  className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Price Range */}
      {/* <div className="mb-4">
        <p className="font-semibold text-black mb-2">Price Range</p>
        <div className="space-y-3">
          <div className="relative h-6">
            <input
              type="range"
              min={0}
              max={500}
              value={priceRange[0]}
              name="min"
              onChange={handlePriceChange}
              className="absolute top-0 w-full appearance-none h-2 bg-blue-200 rounded-lg"
              style={{ zIndex: 1 }}
            />
            <input
              type="range"
              min={0}
              max={2000}
              value={priceRange[1]}
              name="max"
              onChange={handlePriceChange}
              className="absolute top-0 w-full appearance-none h-2 bg-blue-500 rounded-lg"
              style={{ zIndex: 2 }}
            />
          </div>
          <div className="flex justify-between text-gray-600 text-sm">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default FilterSidebar;
