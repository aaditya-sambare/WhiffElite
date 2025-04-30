import React, { useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import CartContent from "../component/Cart/CartContent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();

  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;

  // Create a reference for the drawer element
  const drawerRef = useRef(null);

  // Close the drawer if clicked outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close the drawer if it's open
      if (
        drawerOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target)
      ) {
        toggleCartDrawer(); // Close the cart drawer if clicked outside
      }
    };

    // Add event listener to detect clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [drawerOpen, toggleCartDrawer]); // Depend on drawerOpen to check if the drawer is open

  const handleCheckout = () => {
    toggleCartDrawer(); // Close the cart drawer

    if (!user) {
      navigate("/login?redirect=checkout"); // Navigate to login if not logged in
    } else {
      navigate("/checkout"); // Navigate to checkout if logged in
    }
  };

  return (
    <div
      ref={drawerRef} // Attach ref to the drawer
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Close Button */}
      <div className="flex justify-end p-4">
        <button onClick={toggleCartDrawer}>
          <IoMdClose className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Cart Content */}
      <div className="flex-grow p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        {cart && cart?.products?.length > 0 ? (
          <CartContent cart={cart} userId={userId} guestId={guestId} />
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      {/* Checkout Button */}
      <div className="p-4 bg-white sticky bottom-0">
        {cart && cart?.products?.length > 0 && (
          <>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Checkout
            </button>
            <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center ">
              Shipping charges, taxes, and discount will be calculated at the
              checkout time.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
