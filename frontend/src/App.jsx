import React from "react";
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "sonner";

// CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Provider } from "react-redux";
import store from "./redux/store";
import SocketProvider from "./context/SocketContext";

// Pages
import HomePage from "./pages/Home.page";
import UserLayout from "./layout/UserLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

import CollectionPage from "./pages/CollectionPage";
import ProductDetails from "./component/Products/ProductDetails";
import Checkout from "./component/Cart/Checkout";
import PayemntPage from "./component/Cart/PaymentPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetails from "./pages/OrderDetails";
import AdminLayout from "./component/Admin/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";
import StoreManagement from "./component/Admin/StoreManagement";
import UserManagement from "./component/Admin/UserManagement";
import ProductManagement from "./component/Admin/ProductManagement";
import EditProductPage from "./component/Admin/EditProductPage";
import OrderManagement from "./component/Admin/OrderManagement";
import AddProductForm from "./component/Admin/AddProduct";
import OrderTracking from "./pages/OrderTracking.page";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainPersonalInfo from "./pages/CaptainInfoRegister";
import CaptainVehicleInfo from "./pages/CaptainVehicalRegister";
import CaptainHome from "./pages/CaptainHome";
import CaptainProfile from "./pages/CaptainProfile";
import CaptainRiding from "./pages/CaptainRiding";
import MyOrderPage from "./component/Profile/MyOrderPage";
import Wishlist from "./component/Profile/Wishlist";
import SavedDetails from "./component/Profile/SaveDetails";
import AccountSettings from "./component/Profile/AccountSettings";
import StoreLocator from "./component/Profile/StoreLocation";
import ContactUs from "./component/Profile/ContactUs";
import AboutUs from "./component/Profile/AboutUs";
import StoreOwnerRegister from "./pages/StoreOwnerRegister";
import StoreOwnerLogin from "./pages/StoreOwnerLogin";
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";
import StoreOwnerProfile from "./pages/StoreOwnerProfile";
import StoreProductsPage from "./component/Products/StoreProductsPage";
import StoreOrderDetails from "./component/StoreOwner/storeOrderDetails";
import StoreAddProduct from "./component/StoreOwner/storeAddProduct";
import StoreEditProduct from "./component/StoreOwner/storeEditProduct";
import AddStoreForm from "./component/StoreOwner/storeAddStore";
import Live from "./pages/live";

function App() {
  return (
    <Provider store={store}>
      <SocketProvider>
        {" "}
        {/* Wrap with SocketProvider */}
        <Router>
          <ToastContainer position="top-center" autoClose={3000} />
          <Toaster position="top-right" richColors expand={true} />
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Routes (with Navbar) */}
            <Route element={<UserLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="my-orders" element={<MyOrderPage />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="saved-details" element={<SavedDetails />} />
              <Route path="settings" element={<AccountSettings />} />
              <Route path="store-locator" element={<StoreLocator />} />
              <Route path="contact" element={<ContactUs />} />
              <Route path="about" element={<AboutUs />} />
              <Route
                path="collections/:collection"
                element={<CollectionPage />}
              />

              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="checkout" element={<Checkout />} />
              <Route
                path="order-confirmation"
                element={<OrderConfirmationPage />}
              />
              <Route path="order/:id" element={<OrderDetails />} />
              <Route path="track/:id" element={<OrderTracking />} />
              <Route path="payment" element={<PayemntPage />} />

              {/* Captain */}
              <Route path="captain-login" element={<CaptainLogin />} />
              <Route
                path="/captain-register"
                element={<CaptainPersonalInfo />}
              />
              <Route
                path="/captain-vehicle-info"
                element={<CaptainVehicleInfo />}
              />
              <Route path="/captain-profile" element={<CaptainProfile />} />

              <Route path="/captain-riding" element={<CaptainRiding />} />

              <Route path="/captain-home" element={<CaptainHome />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminHomePage />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="products/:id/edit" element={<EditProductPage />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="products/new" element={<AddProductForm />} />
              <Route path="store" element={<StoreManagement />} />
            </Route>

            {/* Store Owner Routes */}
            <Route
              path="/store-owner/register"
              element={<StoreOwnerRegister />}
            />
            <Route path="/store-owner/login" element={<StoreOwnerLogin />} />
            <Route
              path="/store-owner/dashboard"
              element={<StoreOwnerDashboard />}
            />
            <Route
              path="/store-owner/profile"
              element={<StoreOwnerProfile />}
            />
            <Route
              path="/store/:storeId/products"
              element={<StoreProductsPage />}
            />
            <Route
              path="/store/:storeId/add-product"
              element={<StoreAddProduct />}
            />
            <Route
              path="/store/:storeId/edit-product/:productId"
              element={<StoreEditProduct />}
            />

            <Route path="/store-orders/:id" element={<StoreOrderDetails />} />
            <Route path="/store-owner/addstore" element={<AddStoreForm />} />

            <Route path="/live" element={<Live />} />
          </Routes>
        </Router>
      </SocketProvider>
    </Provider>
  );
}

export default App;
