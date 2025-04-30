const dotenv = require("dotenv");
const mongoose = require("mongoose");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/Cart");
const Store = require("./models/Store");

const products = require("./data/products");
const stores = require("./data/stores");

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    // Clear collections
    await User.deleteMany();
    await Cart.deleteMany();
    await Product.deleteMany();
    await Store.deleteMany();

    // Create default admin user
    const createdUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "12345678",
      role: "admin",
    });

    const userID = createdUser._id;

    // Add user field to all products
    const sampleProducts = products.map((product) => ({
      ...product,
      user: userID,
    }));

    const insertedProducts = await Product.insertMany(sampleProducts);

    // Create stores and link products where brand === store.name
    const sampleStores = stores.map((store) => {
      const matchingProducts = insertedProducts
        .filter((product) => product.brand === store.name)
        .map((p) => p._id);

      return {
        ...store,
        user: userID,
        products: matchingProducts,
      };
    });

    await Store.insertMany(sampleStores);

    console.log("Stores and products seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding the data:", error);
    process.exit(1);
  }
};

seedData();
