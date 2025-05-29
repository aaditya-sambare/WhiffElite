import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByFilters } from "../redux/slice/productSlice";

import OfferCarousel from "../component/OfferCarousel/OfferCarouselComponet";
import TopShopCardSlider from "../component/TopShop/TopShopCardComponent";
import GenderCollectionSection from "../component/Products/GenderCollectionSection";
import ProductGrid from "../component/Products/ProductGrid";
import BestSellerCard from "../component/Products/BestSellerCard";

import { SocketContext } from "../context/SocketContext";

// Fetch best seller product
const fetchBestSeller = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/products/best-seller`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching best seller product:", error);
    throw error;
  }
};

// Fetch men products
const fetchMenProducts = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/products?gender=Men&limit=8`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching men products:", error);
    throw error;
  }
};

const HomePage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);
  const [menProducts, setMenProducts] = useState([]);
  const [bestSellerLoading, setBestSellerLoading] = useState(true);
  const [menLoading, setMenLoading] = useState(true);
  const { user } = useSelector((state) => state.auth);
  const { sendMessage, receiveMessage } = useContext(SocketContext);

  useEffect(() => {
    // Check if 'userInfo' exists in localStorage and parse it if necessary
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo); // If it's a stringified object
      console.log(parsedUserInfo); // Log parsed user info for debugging

      // Send message to WebSocket
      sendMessage("join", {
        userType: "user",
        userId: parsedUserInfo._id, // Assuming _id is part of the user data
      });
    }
  }, []);

  useEffect(() => {
    dispatch(fetchProductByFilters({ gender: "Women", limit: 8 }));

    // Fetch men products
    const getMenProducts = async () => {
      try {
        const data = await fetchMenProducts();
        setMenProducts(data);
        setMenLoading(false);
      } catch (error) {
        setMenLoading(false);
      }
    };

    // Fetch best seller product
    const getBestSellerProduct = async () => {
      try {
        const data = await fetchBestSeller();
        setBestSellerProduct(data);
        setBestSellerLoading(false);
      } catch (error) {
        setBestSellerLoading(false);
      }
    };

    getMenProducts();
    getBestSellerProduct();
  }, [dispatch]);

  return (
    <>
      {/* Near by store */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <h1 className="text-3xl font-bold text-gray-800 sm:ml-3 ml-0 my-3">
          Popular Store
        </h1>
        <h6 className="font-bold text-gray-800 sm:ml-3 ml-0 my-3">
          Nearby popular store
        </h6>
        <TopShopCardSlider />
      </div>

      <hr className="border-t border-black my-4" />

      {/* Offer Slider */}
      <div className="container mx-auto px-4 md:px-12 my-8">
        <h1 className="text-3xl font-bold text-gray-800 sm:ml-3 ml-0 my-3">
          Offers
        </h1>
        <OfferCarousel />
      </div>

      <hr className="border-t border-black my-4" />

      {/* Gender Collection  */}
      <div className="container mx-auto px-4 md:px-12 my-8">
        <h1 className="text-3xl font-bold text-gray-800 sm:ml-3 ml-0 mt-3 mb-0">
          Collection
        </h1>
        <GenderCollectionSection />
      </div>

      <hr className="border-t border-black my-4" />

      {/* Best Seller Section */}
      <div className="container mx-auto px-4 md:px-12 my-8">
        <h1 className="text-3xl font-bold  text-gray-800 sm:ml-3 ml-0 mt-3 mb-0">
          Best Seller
        </h1>
        {bestSellerLoading ? (
          <p className="text-center mt-6">Loading best seller product...</p>
        ) : bestSellerProduct ? (
          <BestSellerCard product={bestSellerProduct} />
        ) : (
          <p className="text-center mt-6">No best seller product found.</p>
        )}
      </div>

      {/* Top Wears for Women Section */}
      <div className="container mx-auto px-4 md:px-12 my-8">
        <h1 className="text-3xl font-bold  text-gray-800 sm:ml-3 ml-0 mt-3 mb-0">
          COLLECTION FOR WOMEN
        </h1>
        <div className="flex justify-center items-center min-h-screen rounded-lg bg-gray-100 p-6">
          {loading ? (
            <p className="text-center mt-6">Loading women products...</p>
          ) : products.length > 0 ? (
            <ProductGrid products={products} loading={loading} error={error} />
          ) : (
            <p className="text-center mt-6">
              No products found for women top wears.
            </p>
          )}
        </div>
      </div>
      {/* Top Wears for Men Section */}
      <div className="container mx-auto px-4 md:px-12 my-8">
        <h1 className="text-3xl font-bold  text-gray-800 sm:ml-3 ml-0 mt-3 mb-0">
          COLLECTION FOR MEN
        </h1>
        <div className="flex justify-center items-center min-h-screen rounded-lg bg-gray-100 p-6">
          {menLoading ? (
            <p className="text-center mt-6">Loading men products...</p>
          ) : menProducts.length > 0 ? (
            <ProductGrid
              products={menProducts}
              loading={menLoading}
              error={error}
            />
          ) : (
            <p className="text-center mt-6">
              No products found for men top wears.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
