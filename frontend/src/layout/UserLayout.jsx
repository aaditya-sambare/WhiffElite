import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../component/Navbar/Navbar.Component";
import CategoryNavbar from "../component/Navbar/CategoryNavbar.Component";
import Footer from "../component/Common/Footer";

const UserLayout = () => {
  const location = useLocation();

  // Define routes where you DO NOT want to show navbars
  const hideNavbarRoutes = ["/login", "/register", "/admin"];
  const profilehideNavbarRoutes = ["/login", "/register", "/admin", "/profile"];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  const pshouldHideNavbar = profilehideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      {!pshouldHideNavbar && <CategoryNavbar />}
      <Outlet />
      {!shouldHideNavbar && <Footer />}
    </>
  );
};

export default UserLayout;
