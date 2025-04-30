import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";

//images
import levislogo from "../../assets/levis.jpg";
import westsidelogo from "../../assets/westside.jpg";
import maxFashionLogo from "../../assets/max-fashion.jpg";
import snitchLogo from "../../assets/Snitch.jpg";
import peterEnglandlogo from "../../assets/PeterEngland.jpg";
import nikelogo from "../../assets/Nike.jpg";
import cklogo from "../../assets/cK.jpg";
import poloassnlogo from "../../assets/PoloAssn.jpg";
import spykarlogo from "../../assets/Spykar.jpg";

const TopShopCard = (props) => {
  return (
    <div className="w-full h-30 px-2">
      <Link to={props.url}>
        {" "}
        <img className="w-full h-full rounded-lg" src={props.src} alt="SHOP" />
      </Link>
    </div>
  );
};

const TopShopCardSlider = () => {
  const TopShopImage = [
    { src: snitchLogo, url: "/collections/all?brand=Snitch" },
    { src: maxFashionLogo, url: "/collections/all?brand=Max" },
    { src: westsidelogo, url: "/collections/all?brand=Westside" },
    { src: levislogo, url: "/collections/all?brand=Levi's" },
    { src: peterEnglandlogo, url: "/collections/all?brand=Peter England" },
    { src: nikelogo, url: "/collections/all?brand=Nike" },
    { src: cklogo, url: "/collections/all?brand=Calvin Klien" },
    { src: poloassnlogo, url: "/collections/all?brand=US Polo Assn" },
    { src: spykarlogo, url: "/collections/all?brand=Spykar" },
  ];

  const settings = {
    infinite: false,
    autoplay: false,
    slidesToShow: 8,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      <Slider {...settings}>
        {TopShopImage.map((image, index) => (
          <TopShopCard src={image.src} url={image.url} key={index} />
        ))}
      </Slider>
    </>
  );
};
export default TopShopCardSlider;
