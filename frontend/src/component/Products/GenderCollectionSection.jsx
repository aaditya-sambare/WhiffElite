import React from "react";
import womenCollectionImage from "../../assets/GenderSelection/women.png";
import menCollectionImage from "../../assets/GenderSelection/men.png";
import girlCollectionImage from "../../assets/GenderSelection/girl.png";
import boyCollectionImage from "../../assets/GenderSelection/boy.png"; 
import { Link } from "react-router-dom";

const collections = [
  { gender: "Women", image: womenCollectionImage },
  { gender: "Men", image: menCollectionImage },
  { gender: "Girl", image: girlCollectionImage },
  { gender: "Boy", image: boyCollectionImage },
];

const GenderCollectionSection = () => {
  return (
    <section className="pt-5 pb-16 px-4 lg:px-0">
      <div className="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {collections.map(({ gender, image }) => (
          <div
            key={gender}
            className="relative group overflow-hidden rounded-2xl"
          >
            <img
              src={image}
              alt={`${gender} Collection`}
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover transform transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 p-6 transition-all duration-300">
              <h2 className="text-lg md:text-xl font-semibold text-white mb-2 text-center">
                {gender}'s Collection
              </h2>
              <Link
                to={`/collections/all?gender=${gender}`}
                className="bg-white text-black font-medium px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-xs md:text-base rounded hover:bg-gray-200 transition"
              >
                Shop Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GenderCollectionSection;
