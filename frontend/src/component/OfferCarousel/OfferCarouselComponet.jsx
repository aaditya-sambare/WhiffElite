import React, { useState } from "react";
import HeroSlider from "react-slick";
import { NextArrow, PrevArrow } from "./Arrows.Components";

import offer1 from "../../assets/banner1.jpeg";
import offer2 from "../../assets/banner2.jpeg";
import offer3 from "../../assets/banner3.jpeg";

const OfferCarousel = () => {
  const images = [
    {
      backdrop_path: offer2,
      title: "offer name",
    },
    {
      backdrop_path: offer1,
      title: "offer name",
    },
    {
      backdrop_path: offer3,
      title: "offer name",
    },
  ];

  const settingsLG = {
    arrows: true,
    slidesToShow: 1,
    infinite: true,
    slidesToShow: 1,
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
    slidesToShow: 1,
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
          {images.map((image, index) => (
            <div className="w-full h-56 md:h-80 py-3 px-2" key={index}>
              <img
                src={image.backdrop_path}
                alt="Hero Banner"
                className="w-full h-full rounded-md object-cover"
              />
            </div>
          ))}
        </HeroSlider>
      </div>
      <div className="hidden lg:block">
        <HeroSlider {...settingsLG}>
          {images.map((image, index) => (
            <div className="w-full h-96 px-2 py-3" key={index}>
              <img
                src={image.backdrop_path}
                alt="Hero Banner"
                className="w-full h-90 rounded-md object-cover"
              />
            </div>
          ))}
        </HeroSlider>
      </div>
    </>
  );
};

export default OfferCarousel;
