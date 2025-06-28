import React from "react";
import { Outlet, useLocation, matchPath } from "react-router-dom";

import Navbar from "../component/Navbar/Navbar.Component";
import CategoryNavbar from "../component/Navbar/CategoryNavbar.Component";
import Footer from "../component/Common/Footer";

const UserLayout = () => {
  const location = useLocation();

  // Exact paths where we want to hide Navbar/Footer
  const hideNavbarExactRoutes = [
    "/login",
    "/register",
    "/admin",
    "/captain-login",
    "/captain-register",
    "/captain-profile",
    "/captain-home",
  ];

  // All paths (exact + dynamic) where we want to hide the CategoryNavbar
  const hideCategoryNavbarRoutes = [
    ...hideNavbarExactRoutes,
    "/profile",
    "/payment",
    "/my-orders",
    "/wishlist",
    "/saved-details",
    "/settings",
    "/store-locator",
    "/contact",
    "/about",
    "/checkout",
    "/order-confirmation",
    "/product/:id",
    "/order/:id",
    "/track/:id",
  ];

  // Function to match current location against a list of patterns (including dynamic routes)
  const matchRoutes = (routes) => {
    return routes.some((route) =>
      matchPath({ path: route, end: true }, location.pathname)
    );
  };

  const shouldHideNavbar = matchRoutes(hideNavbarExactRoutes);
  const shouldHideCategoryNavbar = matchRoutes(hideCategoryNavbarRoutes);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {!shouldHideCategoryNavbar && <CategoryNavbar />}
      <Outlet />
      {!shouldHideNavbar && <Footer />}
    </>
  );
};

export default UserLayout;
