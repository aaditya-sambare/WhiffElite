import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProducts } from "../redux/slice/adminProductSlice";
import { fetchAllOrders } from "../redux/slice/adminOrderSlice";
import { fetchAdminStats } from "../redux/slice/adminStatsSlice";
import { FiLoader } from "react-icons/fi"; // Loading spinner icon
import {
  IndianRupee,
  Package,
  Truck,
  Wallet,
  Users,
  UserCheck,
  Store,
  LayoutGrid,
  Bike,
  Briefcase,
  CreditCard,
  ShoppingCart,
  CheckCircle,
  ClockFading,
  ClockAlert,
  AlarmClockCheck,
  Earth,
  BaggageClaim,
  CircleX,
  Sigma,
} from "lucide-react";

const AdminHomePage = () => {
  const dispatch = useDispatch();

  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.adminProducts);

  const {
    orders,
    totalOrders,
    totalSales,
    productSales,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.adminOrders);

  const {
    customerCount,
    captainCount,
    storeOwnerCount,
    rideCount,
    loading: statsLoading,
    error: statsError,
  } = useSelector((state) => state.adminStats);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const StatCard = ({ title, value, icon: Icon, link, color }) => (
    <motion.div
      className="p-6 shadow-md rounded-2xl bg-white hover:shadow-xl transition-shadow"
      whileHover={{ scale: 1.05 }}
      tabIndex={0}
      role="button"
    >
      <div className="flex items-center gap-3 mb-4">
        <Icon className={color} size={28} aria-label={`${title} icon`} />

        <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {link && (
        <Link
          to={link.href}
          className="text-sm text-blue-600 hover:underline mt-3 inline-block"
        >
          {link.label}
        </Link>
      )}
    </motion.div>
  );

  const totalUsers = customerCount + captainCount + storeOwnerCount;

  const totalOrdersProcessing = orders.filter(
    (order) => order.status === "Processing"
  ).length;

  const totalOrdersDelivered = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const totalOrdersCancelled = orders.filter(
    (order) => order.status === "Cancelled"
  ).length;

  const totalOrdersPendingCaptain = orders.filter(
    (order) => order.ride.status === "pending-captain"
  ).length;

  const totalOrdersWaitingForStore = orders.filter(
    (order) => order.ride.status === "pending-store-owner"
  ).length;

  const totalOrdersAcceptedByCaptain = orders.filter(
    (order) => order.ride.status === "accepted"
  ).length;

  const totalOrdersEnroute = orders.filter(
    (order) => order.ride.status === "enroute"
  ).length;

  const totalRideFare = orders.reduce((acc, order) => {
    if (order.ride && order.ride.fare) {
      return acc + order.ride.fare;
    }
    return acc;
  }, 0);

  const totalProfit = totalSales - productSales - totalRideFare;

  console.log("orders", orders);

  return (
    <div className="w-full px-4 py-6 bg-gray-50 rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Admin Dashboard
      </h1>

      {/* Loading State */}
      {productsLoading || ordersLoading || statsLoading ? (
        <div className="flex justify-center items-center py-12">
          <FiLoader className="animate-spin text-4xl text-blue-500" />
        </div>
      ) : productsError ? (
        <div className="text-center text-red-500 py-4">
          <p>Error fetching products: {productsError}</p>
        </div>
      ) : ordersError ? (
        <div className="text-center text-red-500 py-4">
          <p>Error fetching orders: {ordersError}</p>
        </div>
      ) : statsError ? (
        <div className="text-center text-red-500 py-4">
          <p>Error fetching stats: {statsError}</p>
        </div>
      ) : (
        <>
          {/* Sales and profite */}
          <h3 className="text-2xl font-semibold text-gray-800">
            Sales and Profit
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Sales"
              value={totalSales?.toFixed(2)}
              icon={IndianRupee}
              color="text-emerald-600"
            />
            <StatCard
              title="Product Sales"
              value={productSales?.toFixed(2)}
              icon={Package}
              color="text-fuchsia-600"
            />
            <StatCard
              title="Ride Fare"
              value={totalRideFare?.toFixed(2)}
              icon={Truck}
              color="text-cyan-600"
            />
            <StatCard
              title="Total Profit"
              value={totalProfit?.toFixed(2)}
              icon={Wallet}
              color="text-pink-600"
            />
          </div>
          {/* Users */}
          <h3 className="text-2xl font-semibold text-gray-800 mt-6">Users</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Customers"
              value={customerCount}
              icon={Users}
              color="text-indigo-600"
            />
            <StatCard
              title="Captains"
              value={captainCount}
              icon={UserCheck}
              color="text-green-600"
            />
            <StatCard
              title="Store Owners"
              value={storeOwnerCount}
              icon={Store}
              color="text-amber-600"
            />
            <StatCard
              title="Total Users"
              value={totalUsers}
              icon={LayoutGrid}
              color="text-sky-600"
              link={{ href: "/admin/users", label: "Manage Users" }}
            />
          </div>
          {/* Ride */}
          <h3 className="text-2xl font-semibold text-gray-800 mt-6">Rides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Rides"
              value={rideCount}
              icon={Bike}
              color="text-orange-600"
            />
            <StatCard
              title="Ride Fare"
              value={totalRideFare}
              icon={CheckCircle}
              color="text-green-600"
            />
            <StatCard
              title="Ride Commission"
              value={0}
              icon={Briefcase}
              color="text-gray-600"
            />
            <StatCard
              title="Rides Profite"
              value={0}
              icon={CreditCard}
              color="text-yellow-500"
            />
          </div>
          {/* Orders in way*/}
          <h3 className="text-2xl font-semibold text-gray-800 mt-6">
            Orders in Way
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title=" Orders Waiting for Store"
              value={totalOrdersWaitingForStore}
              icon={ClockAlert}
              color="text-red-500"
            />
            <StatCard
              title="Orders Waiting for Captain"
              value={totalOrdersPendingCaptain}
              icon={ClockFading}
              color="text-blue-600"
            />
            <StatCard
              title="Orders Accepted by Captain"
              value={totalOrdersAcceptedByCaptain}
              icon={AlarmClockCheck}
              color="text-yellow-600"
            />
            <StatCard
              title="Orders Enroute"
              value={totalOrdersEnroute}
              icon={Earth}
              color="text-green-600"
            />
          </div>

          {/* Orders */}
          <h3 className="text-2xl font-semibold text-gray-800 mt-6">Orders</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Order Processing"
              value={totalOrdersProcessing}
              icon={ShoppingCart}
              color="text-pink-600"
            />
            <StatCard
              title="Order Delivered"
              value={totalOrdersDelivered}
              icon={BaggageClaim}
              color="text-orange-600"
            />
            <StatCard
              title="Order Cancelled"
              value={totalOrdersCancelled}
              icon={CircleX}
              color="text-red-600"
            />
            <StatCard
              title="Total Orders"
              value={totalOrders}
              icon={Sigma}
              color="text-green-600"
              link={{ href: "/admin/orders", label: "Manage Orders" }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminHomePage;
