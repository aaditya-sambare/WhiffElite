import React from "react";
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "sonner";

// CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Pages
import HomePage from "./pages/Home.page";
import UserLayout from "./layout/UserLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import MyOrderPage from "./pages/MyOrderPage";
import CollectionPage from "./pages/CollectionPage";
import ProductDetails from "./component/Products/ProductDetails";
import Checkout from "./component/Cart/Checkout";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderDetails from "./pages/OrderDetails";
import AdminLayout from "./component/Admin/AdminLayout";
import AdminHomePage from "./pages/AdminHomePage";
import UserManagement from "./component/Admin/UserManagement";
import ProductManagement from "./component/Admin/ProductManagement";
import EditProductPage from "./component/Admin/EditProductPage";
import OrderManagement from "./component/Admin/OrderManagement";
import AddProductForm from "./component/Admin/AddProduct";
import OrderTracking from "./pages/OrderTracking.page";

import { Provider } from "react-redux";
import store from "./redux/store";



function App() {
  return (
    <Provider store={store}>
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
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHomePage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/:id/edit" element={<EditProductPage />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="products/new" element={<AddProductForm />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
