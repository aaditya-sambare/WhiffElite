const dotenv = require("dotenv");
const mongoose = require("mongoose");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/Cart");
const Checkout = require("./models/Checkout");
const Ride = require("./models/ride");
const Order = require("./models/Order");

const products = require("./data/products");
const storesData = require("./data/stores");

const StoreOwner = require("./models/storeOwner");
const Store = require("./models/Store");
const Captian = require("./models/captain")

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
  try {
    // Clear collections
    await Cart.deleteMany();
    await Checkout.deleteMany();
    await Ride.deleteMany();
    await Order.deleteMany();
    // await User.deleteMany();
    await Captian.deleteMany();
    // await Product.deleteMany();

    // Captian.updateMany(
    //   { deliveries: { $type: "array" } },
    //   { $set: { deliveries: 0 } }
    // );
    // await Product.deleteMany();
    // await Store.deleteMany();

    // Find the store owner
    // const storeOwner = await StoreOwner.findOne({ email: "store@gmail.com" });
    // if (!storeOwner) throw new Error("Store owner not found");

    // // Insert stores with storeOwner
    // const storesWithOwner = storesData.map((store) => ({
    //   ...store,
    //   storeOwner: storeOwner._id,
    //   user: storeOwner._id, // If you want to keep the user field for compatibility
    // }));
    // const insertedStores = await Store.insertMany(storesWithOwner);

    // // Update the StoreOwner's stores array
    // const storeIds = insertedStores.map((store) => store._id);
    // await StoreOwner.findByIdAndUpdate(storeOwner._id, {
    //   $set: { stores: storeIds },
    // });

    // // Insert products, each assigned to a random store
    // const productsWithStore = products.map((product) => {
    //   const randomStore =
    //     insertedStores[Math.floor(Math.random() * insertedStores.length)];
    //   return {
    //     ...product,
    //     store: randomStore._id,
    //     user: storeOwner._id, // If your product schema requires a user field
    //   };
    // });
    // await Product.insertMany(productsWithStore);

    console.log("Stores and products seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding the data:", error);
    process.exit(1);
  }
};

seedData();
