const Permission = require("../models/permissionModel");
const mongoose = require("mongoose");
const connectDB = require("../config/db");

// connectDB();

async function seedPermissions() {
  await connectDB();

  const permissions = [
    // alert
    { name: "createAlert" },
    { name: "getAllAlerts" },
    { name: "getAlertById" },
    { name: "updateAlert" },
    { name: "deleteAlert" },
    { name: "getAlertsTo" },

    // Allocation
    { name: "createAllocation" },
    { name: "getAllocations" },
    { name: "getAllocation" },
    { name: "updateAllocation" },
    { name: "deleteAllocation" },
    { name: "getAllocationsByWoredaOffice"},
    { name: "getAllocationsTo"},

    // commodity
    { name: "createCommodity" },
    { name: "getAllCommodities" },
    { name: "getCommodity" },
    { name: "updateCommodity" },
    { name: "deleteCommodity" },

    // customer
    { name: "createCustomer" },
    { name: "getAllCustomers" },
    { name: "getCustomer" },
    { name: "updateCustomer" },
    { name: "deleteCustomer" },
    { name: "getCustomersByShop" },
    { name: "verifyCustomer" },
    { name: "getCustomerByIDNumber" },
    { name: "getCustomersByWoredaOffice"},
    { name: "getCustomersByRetailerCooperative"},

    // distribution
    { name: "createDistribution" },
    { name: "getAllDistributions" },
    { name: "getDistribution" },
    { name: "updateDistribution" },
    { name: "deleteDistribution" },
    { name: "getDistributionsTo"},
    { name: "getDistributionsFrom"},

    // report
    { name: "createReport" },
    { name: "getAllReports" },
    { name: "getReport" },

    // retailer cooperative
    { name: "createRetailerCooperative" },
    { name: "getAllRetailerCooperatives" },
    { name: "getRetailerCooperative" },
    { name: "updateRetailerCooperative" },
    { name: "deleteRetailerCooperative" },
    { name: "getRetailerCooperativeDetails" },

    // retailer cooperative shop
    { name: "createRetailerCooperativeShop" },
    { name: "getAllRetailerCooperativeShops" },
    { name: "getRetailerCooperativeShop" },
    { name: "updateRetailerCooperativeShop" },
    { name: "deleteRetailerCooperativeShop" },

    // subcity office
    { name: "createSubCityOffice" },
    { name: "getAllSubCityOffices" },
    { name: "getSubCityOfficeById" },
    { name: "updateSubCityOffice" },
    { name: "deleteSubCityOffice" },

    // trade bureau
    { name: "createTradeBureau" },
    { name: "getAllTradeBureaus" },
    { name: "getTradeBureauById" },
    { name: "updateTradeBureau" },
    { name: "deleteTradeBureau" },

    // transaction
    { name: "createTransaction" },
    { name: "getAllTransactions" },
    { name: "getTransaction" },
    { name: "updateTransaction" },
    { name: "deleteTransaction" },
    { name: "getTransactionsByShop" },
    { name: "getTransactionsByDate"},

    // upload
    { name: "uploadFile" },

    // user
    { name: "signUp" },
    { name: "login" },
    { name: "getAllUsers" },
    { name: "getUser" },

    // woreda office
    { name: "createWoredaOffice" },
    { name: "getAllWoredaOffices" },
    { name: "getWoredaOfficeById" },
    { name: "updateWoredaOffice" },
    { name: "deleteWoredaOffice" },
  ];

  try {
    await Permission.insertMany(permissions);
    console.log(" Permissions seeded successfully");
  } catch (err) {
    console.error(" Permissions seeding error:", err);
  } finally {
    // mongoose.connection.close();
  }
}

// call the function
module.exports = seedPermissions;
