const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MDB connected");
  } catch (err) {
    console.log("Failed",err);
    process.exit(1)
  }
};

module.exports = connectDB;
