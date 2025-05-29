import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice.js";
import productReducer from "./slice/productSlice.js";
import cartReducer from "./slice/cartSlice.js";
import checkoutReducer from "./slice/checkoutSlice.js";
import orderReducer from "./slice/orderSlice.js";
import adminReducer from "./slice/adminSlice.js";
import adminProductReducer from "./slice/adminProductSlice.js";
import adminOrdersReducer from "./slice/adminOrderSlice.js";
import storeOwnerAuthReducer from "./slice/storeOwnerAuthSlice.js";
import storeOwnerOrderReducer from "./slice/storeOwnerOrderSlice.js";
import adminStatsReducer from "./slice/adminStatsSlice.js";

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
  orders: orderReducer,
  admin: adminReducer,
  adminProducts: adminProductReducer,
  adminOrders: adminOrdersReducer,
  storeOwnerAuth: storeOwnerAuthReducer,
  storeOwnerOrders: storeOwnerOrderReducer,
  adminStats: adminStatsReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
