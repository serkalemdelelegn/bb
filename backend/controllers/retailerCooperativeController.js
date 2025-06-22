const RetailerCooperative = require("../models/retailerCooperativeModel");
const RetailerCooperativeShop = require("../models/retailerCooperativeShopModel");
const Customer = require("../models/customerModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

const retailerCooperativePopOptions = [
  {
    path: 'availableCommodity.commodity', // Populating a nested path
    select: 'name unit price'
  },
  {
    path: 'woredaOffice',
    select: 'name _id'
  }
];

exports.createRetailerCooperative = factory.createOne(RetailerCooperative);
exports.getAllRetailerCooperatives = factory.getAll(RetailerCooperative,retailerCooperativePopOptions);
exports.getRetailerCooperative = factory.getOne(RetailerCooperative,retailerCooperativePopOptions);
exports.updateRetailerCooperative = factory.updateOne(RetailerCooperative);
exports.deleteRetailerCooperative = factory.deleteOne(RetailerCooperative);

exports.getRetailerCooperativeDetails = catchAsync(async (req, res, next) => {
  const retailerCooperativeId = req.params.id;

  // Find retailer cooperative with shops populated
  const retailerCooperative = await RetailerCooperative.findById(retailerCooperativeId)
    .populate({
      path: "allocations",
      select: "commodity amount status date",
      populate: { path: "commodity", select: "name" }
    })
    .populate({
      path: "distributions",
      select: "commodity amount status date",
      populate: { path: "commodity", select: "name" }
    })
    .populate({
      path: "woredaOffice",
      select: "name _id"
    })
    .lean();

  if (!retailerCooperative) {
    return res.status(404).json({ status: "fail", message: "Retailer Cooperative not found" });
  }

  // Find shops belonging to this retailer cooperative with additional details
  const shops = await RetailerCooperativeShop.find({ retailerCooperative: retailerCooperativeId })
    .select("name availableCommodity distributions")
    .populate({
      path: "distributions",
      select: "commodity amount status date",
      populate: { path: "commodity", select: "name" }
    })
    .populate({
      path: "availableCommodity.commodity",
      select: "name quantity"
    })
    .lean();

  // Get shop IDs
  const shopIds = shops.map(shop => shop._id);

  // Count customers assigned to these shops
  const customerCount = await Customer.countDocuments({ retailerCooperativeShop: { $in: shopIds } });

  res.status(200).json({
    status: "success",
    data: {
      retailerCooperative,
      shops,
      customerCount,
    },
  });
});