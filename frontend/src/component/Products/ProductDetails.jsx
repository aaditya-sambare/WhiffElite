import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slice/productSlice";
import { addToCart } from "../../redux/slice/cartSlice";
import colorList from "../Color/color";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productFetchId = productId || id;

  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart.cart);

  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const getColorHex = (name) => {
    const found = colorList.find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
    return found?.hex || "#ccc"; // fallback to gray if not found
  };

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      const firstImage = selectedProduct.images[0];
      const imageUrl =
        typeof firstImage === "string" ? firstImage : firstImage.url;
      setMainImage(imageUrl);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart", {
        duration: 1000,
      });
      return;
    }

    // --- Store check logic ---
    // if (
    //   cart.products.length > 0 &&
    //   cart.products[0].store &&
    //   selectedProduct.store &&
    //   cart.products[0].store !== selectedProduct.store
    // ) {
    //   toast.error(
    //     "You can only add products from the same store to your cart.",
    //     {
    //       duration: 2000,
    //     }
    //   );
    //   return;
    // }
    // --- End store check ---

    setIsButtonDisabled(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
        store: selectedProduct.store,
      })
    )
      .then(() => {
        toast.success("Product added to the cart!", { duration: 1000 });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  const handleGoToCart = () => {
    setIsButtonDisabled(true);
    setTimeout(() => {
      toggleCartDrawer();
      setIsButtonDisabled(false);
    }, 500);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-full p-6">
      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            {/* Left Thumbnails */}
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProduct.images?.map((image, index) => {
                const imageUrl = typeof image === "string" ? image : image.url;
                return (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`Thumbnail ${index}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                      mainImage === imageUrl
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                    onClick={() => setMainImage(imageUrl)}
                  />
                );
              })}
            </div>

            {/* Main Image */}
            <div className="md:w-[48%]">
              <div className="mb-4">
                {mainImage && (
                  <img
                    src={mainImage || "https://via.placeholder.com/500"}
                    alt="Main Product"
                    className="w-full h-auto object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Mobile Thumbnails */}
              <div className="md:hidden flex overflow-x-scroll space-x-4">
                {selectedProduct.images?.map((image, index) => {
                  const imageUrl =
                    typeof image === "string" ? image : image.url;
                  return (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Thumbnail ${index}`}
                      className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                        mainImage === imageUrl
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                      onClick={() => setMainImage(imageUrl)}
                    />
                  );
                })}
              </div>
            </div>

            {/* Product Info */}
            <div className="w-full md:w-[48%]">
              <h1 className="text-2xl font-bold mb-2">
                {selectedProduct.name}
              </h1>
              <p className="text-gray-600 mb-4">
                {selectedProduct.description}
              </p>

              {/* Price */}
              {selectedProduct.discountPrice &&
              selectedProduct.discountPrice < selectedProduct.price ? (
                <p className="text-lg font-semibold text-red-500">
                  ₹{selectedProduct.discountPrice}
                  <span className="line-through text-gray-400 ml-2">
                    ₹{selectedProduct.price}
                  </span>
                </p>
              ) : (
                <p className="text-lg font-semibold text-red-500">
                  ₹{selectedProduct.price}
                </p>
              )}

              {/* Save % badge */}
              {selectedProduct.discountPrice &&
                selectedProduct.price !== selectedProduct.discountPrice && (
                  <span className="text-green-600 bg-green-100 text-sm font-semibold px-2 py-1 rounded">
                    Save{" "}
                    {Math.round(
                      ((selectedProduct.price - selectedProduct.discountPrice) /
                        selectedProduct.price) *
                        100
                    )}
                    %
                  </span>
                )}

              {/* Color */}
              <div className="mb-4">
                <p className="text-gray-700">Color:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.colors?.map((colorName) => {
                    const colorHex = getColorHex(colorName);
                    return (
                      <button
                        key={colorName}
                        onClick={() => setSelectedColor(colorName)}
                        className={`w-8 h-8 rounded-full border ${
                          selectedColor === colorName
                            ? "border-4 border-black"
                            : "border-gray-300"
                        }`}
                        style={{
                          backgroundColor: colorHex,
                          filter: "brightness(0.9)",
                        }}
                        title={colorName}
                      ></button>
                    );
                  })}
                </div>
              </div>

              {/* Size */}
              <div className="mb-4">
                <p className="text-gray-700">Size:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-4 rounded border-2 ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <p className="text-gray-700">Quantity:</p>
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    onClick={() => handleQuantityChange("minus")}
                    disabled={quantity <= 1}
                    className="px-2 py-1 bg-gray-200 rounded text-lg"
                  >
                    -
                  </button>
                  <span className="text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("plus")}
                    className="px-2 py-1 bg-gray-200 rounded text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* ADD TO CART */}
              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className={`bg-black text-white py-2 px-6 rounded w-full mb-4 transition ${
                  isButtonDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-900"
                }`}
              >
                {isButtonDisabled ? "Adding..." : "ADD TO CART"}
              </button>

              {/* Go To Cart
              <button
                onClick={handleGoToCart}
                disabled={isButtonDisabled}
                className={`border border-black text-black py-2 px-6 rounded w-full mb-4 transition ${
                  isButtonDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-black hover:text-white"
                }`}
              >
                {isButtonDisabled ? "Going..." : "GO TO CART"}
              </button> */}

              {/* Product Details */}
              <div className="mt-10 text-gray-700">
                <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
                <table className="w-full text-left text-sm text-gray-600">
                  <tbody>
                    <tr>
                      <td className="py-1">Brand:</td>
                      <td className="py-1">{selectedProduct.brand}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Material:</td>
                      <td className="py-1">{selectedProduct.material}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <hr className="mt-7 shadow-sm border border-gray-200 rounded" />

          {/* Similar Products */}
          <div className="mt-7">
            <h2 className="text-2xl text-center font-medium mb-4">
              You may also like
            </h2>
            {similarProducts && similarProducts.length > 0 ? (
              <ProductGrid
                products={similarProducts}
                loading={loading}
                error={null}
              />
            ) : (
              <p className="text-center text-gray-500">
                No similar products found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
