const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: "./config.env" });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE);
    console.log(" MongoDB connected for seeding");
  } catch (err) {
    console.error(" MongoDB connection error", err);
    process.exit(1);
  }
};

module.exports = connectDB;
