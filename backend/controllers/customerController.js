const Customer = require("../models/customerModel");
const RetailerCooperativeShop = require("../models/retailerCooperativeShopModel");
const RetailerCooperative = require("../models/retailerCooperativeModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const customerPopOptions = [
  {
    path: "retailerCooperativeShop",
    select: "name",
  },
  { path: "woreda", select: "name" },
];
exports.createCustomer = factory.createOne(Customer);
exports.getAllCustomers = factory.getAll(Customer, customerPopOptions);
exports.getCustomer = factory.getOne(Customer, customerPopOptions);
exports.updateCustomer = factory.updateOne(Customer);
exports.deleteCustomer = factory.deleteOne(Customer);

exports.getCustomerByShop = async (req, res) => {
  try {
    const customer = await Customer.find({
      retailerCooperativeShop: req.params.shopId,
    }).populate(customerPopOptions);
    if (!customer)
      return res
        .status(404)
        .json({ status: "fail", message: "Customer not found" });
    res.status(200).json({ status: "success", data: customer });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// verify customer
exports.verifyCustomer = async (req, res) => {
  try {
    const customer = await Customer.find({ fayda: req.params.fayda }).select(
      "-fayda"
    );
    if (!customer.length)
      return res
        .status(404)
        .json({ status: "fail", message: "Customer not found" });
    customer[0].status = "taken";
    await customer[0].save();
    res.status(200).json({ status: "success", data: { customer } });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

// Get customer by ID number
exports.getCustomerByIDNumber = catchAsync(async (req, res, next) => {
  const customer = await Customer.findOne({
    ID_No: req.params.IDNumber,
  }).populate(customerPopOptions);
  if (!customer) return next(new AppError("Customer not found", 404));

  res.status(200).json({ status: "success", data: { customer } });
});

// New controller to get customers by woredaOffice
exports.getCustomersByWoredaOffice = catchAsync(async (req, res, next) => {
  const woredaOfficeId = req.params.woredaOfficeId;

  const customers = await Customer.find({
    woreda: woredaOfficeId,
  }).populate(customerPopOptions);

  res.status(200).json({
    status: "success",
    results: customers.length,
    data: customers,
  });
});

exports.getCustomersByRetailerCooperative = catchAsync(
  async (req, res, next) => {
    const retailerCooperativeId = req.params.retailerCooperativeId;

    // Find retailerCooperativeShops belonging to the retailerCooperative
    const retailerCooperativeShops = await RetailerCooperativeShop.find({
      retailerCooperative: retailerCooperativeId,
    });

    const retailerCooperativeShopIds = retailerCooperativeShops.map(
      (rcs) => rcs._id
    );

    // Find customers belonging to these retailerCooperativeShops
    const customers = await Customer.find({
      retailerCooperativeShop: { $in: retailerCooperativeShopIds },
    }).populate(customerPopOptions);

    if (!customers.length)
      return next(new AppError("Customers not found", 404));

    res.status(200).json({
      status: "success",
      results: customers.length,
      data: customers,
    });
  }
);
