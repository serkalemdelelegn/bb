// reportController.js
const Report = require("../models/reportModel");
const Customer = require("../models/customerModel");
const RetailerCooperativeShop = require("../models/retailerCooperativeShopModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./handlerFactory");

// ... (your existing createReport remains the same) ...
exports.createReport = catchAsync(async (req, res, next) => {
  const { retailerCooperativeShopId } = req.body;

  const retailerCooperativeShop = await RetailerCooperativeShop.findById(
    retailerCooperativeShopId
  ).populate("availableCommodity.commodity");
  if (!retailerCooperativeShop) {
    return next(new AppError("Retailer Cooperative Shop not found", 404));
  }

  const customers = await Customer.find({
    retailerCooperativeShop: { $eq: retailerCooperativeShopId },
  });
  if (!customers.length) {
    return next(new AppError("No customers found!", 404));
  }

  const customerIds = customers.map((c) => c._id);

  const transactionIds = retailerCooperativeShop.transactions;

  const commodityIds = retailerCooperativeShop.availableCommodity
    .map((item) => item.commodity?._id || item.commodity)
    .filter(Boolean);

  const currentDate = new Date().toISOString().split("T")[0];
  let report = await Report.findOne({
    retailerCooperativeShop: retailerCooperativeShopId,
    date: currentDate,
  });

  if (report) {
    report.customers.push(...customerIds);
    report.transactions.push(...transactionIds);
    report.commodities.push(...commodityIds);
    await report.save();
  } else {
    report = new Report({
      retailerCooperativeShop: retailerCooperativeShopId,
      date: currentDate,
      customers: customerIds,
      transactions: transactionIds,
      commodities: commodityIds,
    });
    await report.save();
  }

  res.status(201).json({
    message: "Report created successfully",
    data: { report },
  });
});


// Existing getReports (filtered by shop ID)
exports.getReports = catchAsync(async (req, res, next) => {
  const { retailerCooperativeShopId } = req.params;

  const retailerCooperativeShop = await RetailerCooperativeShop.findById(
    retailerCooperativeShopId
  );
  if (!retailerCooperativeShop) {
    return next(new AppError("RetailerCooperativeShop not found", 404));
  }

  const reports = await Report.find({
    retailerCooperativeShop: retailerCooperativeShopId,
  })
    .populate("retailerCooperativeShop", "name")
    .populate("customers", "name phone status")
    .populate("transactions", "amount")
    .populate("commodities", "name")
    .lean();

  if (!reports.length) {
    return next(
      new AppError("No reports found for this Retailer Cooperative Shop", 404)
    );
  }

  const modifiedReports = reports.map((report) => ({
    _id: report._id,
    retailerCooperativeShop: report.retailerCooperativeShop?.name || null,
    date: report.date,
    customers: report.customers.map((customer) => ({
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      status: customer.status,
    })),
    transactions: report.transactions.map((transaction) => ({
      _id: transaction._id,
      amount: transaction.amount,
    })),
    commodities: report.commodities.map((commodity) => ({
      _id: commodity._id,
      name: commodity.name,
    })),
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
    __v: report.__v,
  }));

  const groupedReports = modifiedReports.reduce((acc, report) => {
    const date = report.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(report);
    return acc;
  }, {});

  res.status(200).json({ groupedReports });
});

// --- NEW CONTROLLER FUNCTION to get ALL grouped reports ---
exports.getAllGroupedReports = catchAsync(async (req, res, next) => {
  const reports = await Report.find({}) // Find all reports
    .populate("retailerCooperativeShop", "name")
    .populate("customers", "name phone status")
    .populate("transactions", "amount")
    .populate("commodities", "name")
    .lean();

  // If no reports found at all, return an empty object or specific message
  if (!reports.length) {
    return res.status(200).json({ groupedReports: {} }); // Return empty object if no reports
  }

  const modifiedReports = reports.map((report) => ({
    _id: report._id,
    retailerCooperativeShop: report.retailerCooperativeShop?.name || null,
    date: report.date,
    customers: report.customers.map((customer) => ({
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      status: customer.status,
    })),
    transactions: report.transactions.map((transaction) => ({
      _id: transaction._id,
      amount: transaction.amount,
    })),
    commodities: report.commodities.map((commodity) => ({
      _id: commodity._id,
      name: commodity.name,
    })),
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
    __v: report.__v,
  }));

  const groupedReports = modifiedReports.reduce((acc, report) => {
    const date = report.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(report);
    return acc;
  }, {});

  res.status(200).json({ groupedReports });
});


exports.getAllReports = factory.getAll(Report); // This still returns a flat list
exports.getReport = factory.getOne(Report);