const RetailerCooperativeShop = require("../models/retailerCooperativeShopModel");
const RetailerCooperative = require("../models/retailerCooperativeModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const retailerCooperativeShopPopOptions = [
  {
    path: "availableCommodity.commodity",
    select: "name price unit", // Populating a nested path without specific field selection here
  },
];

exports.createRetailerCooperativeShop = factory.createOne(
  RetailerCooperativeShop
);
exports.getAllRetailerCooperativeShops = factory.getAll(
  RetailerCooperativeShop,
  retailerCooperativeShopPopOptions
);
exports.getRetailerCooperativeShop = factory.getOne(
  RetailerCooperativeShop,
  retailerCooperativeShopPopOptions
);
exports.updateRetailerCooperativeShop = factory.updateOne(
  RetailerCooperativeShop
);
exports.deleteRetailerCooperativeShop = factory.deleteOne(
  RetailerCooperativeShop
);

// New controller function to get shops by retailerCooperative id
exports.getShopsByRetailerCooperativeId = catchAsync(async (req, res, next) => {
  const { retailerCooperativeId } = req.params;
  if (!retailerCooperativeId) {
    return next(new AppError("Retailer Cooperative ID is required", 400));
  }
  const shops = await RetailerCooperativeShop.find({
    retailerCooperative: retailerCooperativeId,
  });
  return res.status(200).json({ status: "success", length: shops.length, data: shops });
});

exports.getShopsByWoreda = catchAsync(async (req, res, next) => {
  const { woredaOfficeId } = req.params;
  if (!woredaOfficeId) {
    return next(new AppError("Woreda Office ID is required", 400));
  }
  // Find retailerCooperatives with the given woredaOfficeId
  const retailerCooperatives = await RetailerCooperative.find({
    woredaOffice: woredaOfficeId,
  }).select("_id");
  if (!retailerCooperatives.length) {
    return next(
      new AppError("No retailer cooperatives found for this woreda", 404)
    );
  }
  const retailerCooperativeIds = retailerCooperatives.map((rc) => rc._id);
  // Find shops with retailerCooperative in the found ids
  const shops = await RetailerCooperativeShop.find({
    retailerCooperative: { $in: retailerCooperativeIds },
  });
  return res
    .status(200)
    .json({ status: "success", length: shops.length, data: shops });
});
