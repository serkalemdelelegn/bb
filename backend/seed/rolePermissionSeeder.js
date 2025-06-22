const mongoose = require("mongoose");
const Role = require("../models/roleModel");
const Permission = require("../models/permissionModel");
const RolePermission = require("../models/rolePermissionModel");
const connectDB = require("../config/db");

const seedRolePermissions = async () => {
  await connectDB();
  try {
    const tradeBureauRole = await Role.findOne({ name: "TradeBureau" });
    const subCityOfficeRole = await Role.findOne({ name: "SubCityOffice" });
    const woredaOfficeRole = await Role.findOne({ name: "WoredaOffice" });
    const retailerCooperativeRole = await Role.findOne({
      name: "RetailerCooperative",
    });
    const retailerCooperativeShopRole = await Role.findOne({
      name: "RetailerCooperativeShop",
    });

    const allPermissions = await Permission.find();
    const tradeBureauPermissions = await Permission.find({
      name: {
        $in: [
          "createAlert",
          "getAllAlerts",
          "getAlertById",
          "updateAlert",
          "deleteAlert",
          "createAllocation",
          "getAllocations",
          "getAllocation",
          "updateAllocation",
          "uploadFile",
          "login",
          "getAllCommodities",
          "createCommodity",
          "getCommodity",
          "updateCommodity",
          // "createCustomer",
          "getCustomer",
          "getAllCustomers",
          // "updateCustomer",
          // "deleteCustomer",
          "getAllDistributions",
          "getDistribution",
          "getDistributionsTo",
          "getDistributionsFrom",
          "createReport",
          "getAllReports",
          "getReports",
          "getAllRetailerCooperatives",
          "createRetailerCooperative",
          "getRetailerCooperative",
          "updateRetailerCooperative",
          "deleteRetailerCooperative",
          "getRetailerCooperativeDetails",
          "createRetailerCooperativeShop",
          "getAllRetailerCooperativeShops",
          "getRetailerCooperativeShop",
          "updateRetailerCooperativeShop",
          "deleteRetailerCooperativeShop",
          "getAllSubCityOffices",
          "createSubCityOffice",
          "getSubCityOfficeById",
          "updateSubCityOffice",
          "deleteSubCityOffice",
          "getAllWoredaOffices",
          "createWoredaOffice",
          "getWoredaOfficeById",
          "updateWoredaOffice",
          "deleteWoredaOffice",
          "getAllTradeBureaus",
          "createTradeBureau",
          "getTradeBureauById",
          "updateTradeBureau",
          "deleteTradeBureau",

          "getAllTransactions",
          "getTransaction",
        ],
      },
    });
    const woredaOfficePermissions = await Permission.find({
      name: {
        $in: [
          "createAlert",
          "getAllAlerts",
          "getAlertById",
          "updateAlert",
          "getAlertsTo",
          "deleteAlert",
          "getAllocations",
          "getAllocation",
          "updateAllocation",
          "uploadFile",
          "login",
          "getAllCommodities",
          "getCommodity",
          "createCustomer",
          "getCustomer",
          "getAllCustomers",
          "getCustomersByShop",
          "getCustomerByIDNumber",
          "updateCustomer",
          "deleteCustomer",
          "verifyCustomer",
          "getCustomersByWoredaOffice",
          "getCustomersByRetailerCooperative",

          "getAllDistributions",
          "getDistribution",
          "getDistributionsTo",
          "getDistributionsFrom",
          "createReport",
          "getAllReports",
          "getReports",
          "getAllRetailerCooperatives",
          "createRetailerCooperative",
          "getRetailerCooperative",
          "updateRetailerCooperative",
          "deleteRetailerCooperative",
          "getRetailerCooperativeDetails",
          "createRetailerCooperativeShop",
          "getAllRetailerCooperativeShops",
          "getRetailerCooperativeShop",
          "updateRetailerCooperativeShop",
          "deleteRetailerCooperativeShop",
          "getAllWoredaOffices",
          "getWoredaOfficeById",
          "updateWoredaOffice",
          "deleteWoredaOffice",
          "getAllTransactions",
          "getTransaction",
          "getTransactionsByShop",
          "getTransactionsByDate",
        ],
      },
    });
    const retailerCooperativePermissions = await Permission.find({
      name: {
        $in: [
          "createAlert",
          "getAllAlerts",
          "getAlertById",
          "updateAlert",
          "deleteAlert",
          "getAlertsTo",
          "getAllocationsByWoredaOffice",
          "getAllocationsTo",
          "getAllocations",
          "getAllocation",
          "updateAllocation",
          "createDistribution",
          "getAllDistributions",
          "getDistribution",
          "updateDistribution",
          "deleteDistribution",
          "getDistributionsTo",
          "getDistributionsFrom",

          "getAllCommodities",
          "getCommodity",
          "getRetailerCooperativeDetails",
          "getRetailerCooperative",
          "getAllRetailerCooperatives",
          "createRetailerCooperativeShop",
          "getAllRetailerCooperativeShops",
          "getRetailerCooperativeShop",
          "updateRetailerCooperativeShop",
          "deleteRetailerCooperativeShop",
          "createReport",
          "getReport",
          "getAllReports",
          "uploadFile",
          "login",
          "getCustomersByShop",
          "getCustomersByRetailerCooperative",
          "getCustomerByIDNumber",
          "getAllTransactions",
          "getTransaction",
          "getTransactionsByShop",
          "getTransactionsByDate",
        ],
      },
    });
    const retailerCooperativeShopPermissions = await Permission.find({
      name: {
        $in: [
          "getDistribution",
          "updateDistribution",
          "getDistributionsTo",

          "getAllCommodities",
          "getCommodity",
          "getRetailerCooperative",
          "getAllRetailerCooperativeShops",
          "getRetailerCooperativeShop",
          "updateRetailerCooperativeShop",
          "createReport",
          "getReport",
          "getAllReports",
          "login",
          "getCustomersByShop",
          "getCustomerByIDNumber",
          "getAllTransactions",
          "createTransaction",
          "getTransaction",
          "getTransactionsByShop",
          "getTransactionsByDate",
          "getCustomer"
        ],
      },
    });

    //Grant Permission
    const subCityRolePermission = allPermissions.map((permission) => ({
      role: subCityOfficeRole._id,
      permission: permission._id,
    }));

    const tradeBureauRolePermission = allPermissions.map((permission) => ({
      role: tradeBureauRole._id,
      permission: permission._id,
    }));

    const woredaOfficeRolePermission = woredaOfficePermissions.map(
      (permission) => ({
        role: woredaOfficeRole._id,
        permission: permission._id,
      })
    );

    const retailerCooperativeRolePermission =
      retailerCooperativePermissions.map((permission) => ({
        role: retailerCooperativeRole._id,
        permission: permission._id,
      }));

    const retailerCooperativeShopRolePermission =
      retailerCooperativeShopPermissions.map((permission) => ({
        role: retailerCooperativeShopRole._id,
        permission: permission._id,
      }));
    await RolePermission.insertMany([
      ...subCityRolePermission,
      ...tradeBureauRolePermission,
      ...woredaOfficeRolePermission,
      ...retailerCooperativeRolePermission,
      ...retailerCooperativeShopRolePermission,
    ]);
    console.log("RolePermissions seeded successfully");
    // mongoose.connection.close();
  } catch (error) {
    console.log("RolePermission seeding error", error);
    mongoose.connection.close();
  }
};

module.exports = seedRolePermissions;
