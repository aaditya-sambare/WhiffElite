const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const storeRoutes = require("./routes/storeRouter");
const adminRoutes = require("./routes/adminRoutes");
const productAdminRoutes = require("./routes/productAdmin");
const orderAdminRoutes = require("./routes/adminOrderRoutes");
const captainRoutes = require("./routes/captainRoutes");
const mapRoutes = require("./routes/mapsRoutes");
const rideRoutes = require("./routes/rideRoutes");
const storeOwnerRoutes = require("./routes/storeOwnerRoutes");
const adminStoreRoute = require("./routes/adminStoreRoute");

const connectDB = require("./config/db");
const { initializeSocket } = require("./socket");

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://whiffelite.vercel.app"
  ],
  credentials: true, // Allow credentials (cookies, HTTP authentication)
};

app.use(cors(corsOptions)); // Use CORS with options
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

// Connect to DB
connectDB();

app.get("/", (req, res) => {
  res.send("WELCOME");
});

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// User Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

// Store Routes
app.use("/api/stores", storeRoutes);
app.use("/api/store-owner", storeOwnerRoutes);

// Captain routes
app.use("/api/captains", captainRoutes);

// Admin routes
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", orderAdminRoutes);
app.use("/api/admin/stores", adminStoreRoute);

// Map routes
app.use("/api/maps", mapRoutes);
// Ride routes
app.use("/api/rides", rideRoutes);

// Create HTTP server and attach Express app
const server = http.createServer(app);

// Initialize Socket.io and pass the server instance
initializeSocket(server);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
