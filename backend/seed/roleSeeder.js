const mongoose = require("mongoose");
const Role = require("../models/roleModel");
const connectDB = require("../config/db");

const seedRoles = async () => {
  // await connectDB();

  const roles = [
    { name: "RetailerCooperativeShop" },
    { name: "RetailerCooperative" },
    { name: "WoredaOffice" },
    { name: "SubCityOffice" },
    { name: "TradeBureau" },
  ];

  try {
    // await Role.deleteMany(); // optional: clear existing roles if needed
    await Role.insertMany(roles);
    console.log(" Roles seeded successfully");
  } catch (err) {
    console.error(" Role seeding error", err);
  } finally {
    // mongoose.connection.close();
  }
};

module.exports = seedRoles;
