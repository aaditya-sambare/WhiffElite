import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import axios from "axios";

// Haversine formula to calculate distance between lat/lng points
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const TopShopCard = ({ src, url, name }) => (
  <div className="px-2">
    <Link
      to={url}
      className="group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <img
        src={src}
        alt={name}
        className="w-full h-[120px] object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="text-center py-2 bg-gray-50">
        <h1 className="text-sm font-medium text-black truncate">{name}</h1>
      </div>
    </Link>
  </div>
);

const TopShopCardSlider = () => {
  const [nearbyStores, setNearbyStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: userLat, longitude: userLng } = position.coords;
        try {
          const { data: stores } = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/stores`
          );

          const filtered = stores.filter((store) => {
            const coords = store?.location?.coordinates;
            if (coords?.length === 2) {
              const [lng, lat] = coords;
              return (
                getDistanceFromLatLonInKm(userLat, userLng, lat, lng) <= 35
              );
            }
            return false;
          });

          setNearbyStores(filtered);
        } catch (error) {
          setNearbyStores([]);
        }
        setLoading(false);
      },
      () => {
        setNearbyStores([]);
        setLoading(false);
      }
    );
  }, []);

  console.log("nearbyStores", nearbyStores);

  const settings = {
    infinite: false,
    autoplay: false,
    slidesToShow: 6,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 4, slidesToScroll: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 3, slidesToScroll: 1 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
    ],
  };

  if (loading) {
    return (
      <div className="px-4 py-1">
        <div className="flex space-x-2 overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="px-2 bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
            >
              <div className="w-[160px] h-[120px] bg-gray-300" />
              <div className="text-center py-2 bg-gray-50">
                <div className="h-4 bg-gray-300 w-24 mx-auto rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (nearbyStores.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 text-base">
        No shops found within 35km of your location.
      </div>
    );
  }

  return (
    <div className="px-4 py-1">
      <Slider {...settings}>
        {nearbyStores.map((store) => (
          <TopShopCard
            key={store._id}
            src={store.image}
            url={`/collections/all?store=${store._id}`}
            name={store.name}
          />
        ))}
      </Slider>
    </div>
  );
};

export default TopShopCardSlider;
