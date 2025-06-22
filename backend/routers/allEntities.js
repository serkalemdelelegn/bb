const express = require("express");
const SubCityOffice = require("../models/subCityOfficeModel");
const WoredaOffice = require("../models/woredaOfficeModel");
const RetailerCooperative = require("../models/retailerCooperativeModel");
const RetailerCooperativeShop = require("../models/retailerCooperativeShopModel");
const TradeBureau = require("../models/tradeBureauModel");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [tradeBureaus, subcities, woredas, retailerCooperatives, retailerCooperativeShops] = await Promise.all([
      TradeBureau.find(),
      SubCityOffice.find(),
      WoredaOffice.find(),
      RetailerCooperative.find(),
      RetailerCooperativeShop.find(),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        tradeBureaus,
        subcities,
        woredas,
        retailerCooperatives,
        retailerCooperativeShops,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
});

module.exports = router;