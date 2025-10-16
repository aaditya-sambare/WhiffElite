import React, { useEffect, useState } from "react";
import HeroSlider from "react-slick";
import { NextArrow, PrevArrow } from "./Arrows.Components";
import axios from "axios";

const OfferCarousel = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/admin/offers`
      );
      setOffers(data);
    };
    fetchOffers();
  }, []);

  const settingsLG = {
    arrows: true,
    slidesToShow: 1,
    infinite: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    speed: 5000,
    autoplaySpeed: 5000,
    cssEase: "linear",
  };

  const settings = {
    arrows: true,
    slidesToShow: 1,
    infinite: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    autoplay: true,
    speed: 5000,
    autoplaySpeed: 5000,
    cssEase: "linear",
  };

  return (
    <>
      <div className="lg:hidden">
        <HeroSlider {...settings}>
          {offers.map((offer, index) => (
            <div className="w-full h-56 md:h-80 py-3 px-2" key={index}>
              <img
                src={offer.imageUrl}
                alt={offer.title}
                className="w-full h-full rounded-md object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                {offer.title}
              </div>
            </div>
          ))}
        </HeroSlider>
      </div>
      <div className="hidden lg:block">
        <HeroSlider {...settingsLG}>
          {offers.map((offer, index) => (
            <div className="w-full h-96 px-2 py-3" key={index}>
              <img
                src={offer.imageUrl}
                alt={offer.title}
                className="w-full h-90 rounded-md object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                {offer.title}
              </div>
            </div>
          ))}
        </HeroSlider>
      </div>
    </>
  );
};

export default OfferCarousel;
