import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMale,
  faPersonDress,
  faChild,
  faChildDress,
} from "@fortawesome/free-solid-svg-icons";
import { BiChevronDown } from "react-icons/bi";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Men",
    path: "/collections/all?gender=Men",
    icon: faMale,
    subcategories: [
      { name: "Shirts", path: "/collections/all?gender=Men&category=Shirt" },
      {
        name: "Trousers",
        path: "/collections/all?gender=Men&category=Trouser",
      },
      { name: "Jackets", path: "/collections/all?gender=Men&category=Jacket" },
    ],
  },
  {
    name: "Women",
    path: "/collections/all?gender=Women",
    icon: faPersonDress,
    subcategories: [
      {
        name: "Dresses",
        path: "/collections/all?gender=Women&category=Dresse",
      },
      { name: "Tops", path: "/collections/all?gender=Women&category=Top" },
      {
        name: "Palazzos",
        path: "/collections/all?gender=Women&category=Palazzo",
      },
    ],
  },
  {
    name: "Boy",
    path: "/collections/all?gender=Boy",
    icon: faChild,
    subcategories: [
      {
        name: "T-Shirts",
        path: "/collections/all?gender=Boy&category=T-Shirt",
      },
      { name: "Shorts", path: "/collections/all?gender=Boy&category=Short" },
      { name: "Jeans", path: "/collections/all?gender=Boy&category=Jean" },
    ],
  },
  {
    name: "Girl",
    path: "/collections/all?gender=Girl",
    icon: faChildDress,
    subcategories: [
      { name: "Frocks", path: "/collections/all?gender=Girl&category=Frock" },
      { name: "Skirts", path: "/collections/all?gender=Girl&category=Skirt" },
      {
        name: "Leggings",
        path: "/collections/all?gender=Girl&category=Legging",
      },
    ],
  },
];

const CategoryNavbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = (categoryName) => {
    setOpenDropdown((prev) => (prev === categoryName ? null : categoryName));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="bg-white  w-full pt-1"></div>

      <nav className="bg-black shadow-md ">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div
            ref={dropdownRef}
            className="flex justify-between sm:justify-center items-center h-14 flex-wrap gap-x-2 gap-y-2 sm:gap-x-4"
          >
            {categories.map((category) => (
              <div key={category.name} className="relative">
                <button
                  onClick={() => toggleDropdown(category.name)}
                  className="flex items-center gap-1 text-[13px] sm:text-sm px-2 py-1 text-gray-200 hover:text-white"
                >
                  <FontAwesomeIcon
                    icon={category.icon}
                    className="text-[14px] sm:text-base"
                  />
                  <span>{category.name}</span>
                  <BiChevronDown className="text-sm sm:text-base" />
                </button>

                {openDropdown === category.name && (
                  <div
                    id={`dropdown-${category.name}`}
                    className="absolute left-1/2 -translate-x-1/2 mt-2 w-40 bg-white border rounded-md shadow-lg z-10"
                  >
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        to={sub.path}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setOpenDropdown(null)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default CategoryNavbar;
