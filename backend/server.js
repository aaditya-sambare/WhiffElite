const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const cors = require("cors");

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

const connectDB = require("./config/db");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

//connect to DB
connectDB();

app.get("/", (req, res) => {
  res.send("WELCOME");
});

//API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/stores", storeRoutes);

//admin routes
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", orderAdminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
