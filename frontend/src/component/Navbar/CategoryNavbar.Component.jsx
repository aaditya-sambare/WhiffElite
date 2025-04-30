import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BiChevronDown } from "react-icons/bi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPerson,
  faPersonDress,
  faChild,
  faChildDress,
} from "@fortawesome/free-solid-svg-icons";

// Define categories
const categories = [
  {
    name: "Men",
    path: "/collections/all?gender=Men",
    subcategories: [
      { name: "Shirts", path: "/collections/all?gender=Men&category=Shirt" },
      {
        name: "Trousers",
        path: "/collections/all?gender=Men&category=Trouser",
      },
      {
        name: "Jackets",
        path: "/collections/all?gender=Men&category=Jacket",
      },
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

  const toggleDropdown = (categoryName) => {
    setOpenDropdown((prev) => (prev === categoryName ? null : categoryName));
  };

  return (
    <>
      <div className="bg-white h-1 w-full"></div>

      <nav className="bg-black shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center h-16 space-x-8 ">
            {categories.map((category) => (
              <div key={category.name} className="relative">
                <button
                  onClick={() => toggleDropdown(category.name)}
                  className="flex items-center text-gray-200 hover:text-white focus:outline-none"
                >
                  <FontAwesomeIcon icon={category.icon} className="mr-2" />
                  {category.name}
                  <BiChevronDown className="ml-1" />
                </button>

                {openDropdown === category.name && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10 focus:outline-none">
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
