const Allocation = require("../models/allocationModel");
const RetailerCooperative = require("../models/retailerCooperativeModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

const allocationPopOptions = [
  {
    path: "commodity",
    select: "name",
  },
  {
    path: "retailerCooperativeId",
    select: "name",
  },
  {
    path: "tradeBureauId",
    select: "name",
  },
];

// Create a new allocation
exports.createAllocation = catchAsync(async (req, res, next) => {
  const { tradeBureauId, retailerCooperativeId, amount, commodity } = req.body;

  const allocation = new Allocation({
    tradeBureauId,
    retailerCooperativeId,
    amount,
    commodity,
  });

  // const retailerCooperative = await RetailerCooperative.findById(
  //   retailerCooperativeId
  // );
  // let availableCommodity = retailerCooperative.availableCommodity.find(
  //   (item) => item.commodity._id.toString() === allocation.commodity.toString()
  // );
  // if (availableCommodity) {
  //   availableCommodity.quantity += allocation.amount; // Add the quantity
  // } else {
  //   // If the commodity does not exist, create a new entry
  //   availableCommodity = {
  //     commodity: transaction.commodity,
  //     quantity: transaction.amount,
  //   };
  //   retailerCooperative.availableCommodity.push(availableCommodity);
  // }
  // await retailerCooperative.save();
  // }
  await allocation.save();

  res.status(201).json(allocation);
});

exports.updateAllocation = catchAsync(async (req, res, next) => {
  const allocationId = req.params.id;
  const updateData = req.body;

  const allocation = await Allocation.findById(allocationId);
  if (!allocation) {
    return res
      .status(404)
      .json({ status: "fail", message: "Allocation not found" });
  }

  // Update allocation fields
  Object.assign(allocation, updateData);

  // If status is set to 'approved', update availableCommodity of retailerCooperative
  if (updateData.status === "approved") {
    const retailerCooperative = await RetailerCooperative.findById(
      allocation.retailerCooperativeId
    );
    if (retailerCooperative) {
      let availableCommodity = retailerCooperative.availableCommodity.find(
        (item) => item.commodity.toString() === allocation.commodity.toString()
      );
      if (availableCommodity) {
        availableCommodity.quantity += allocation.amount;
      } else {
        availableCommodity = {
          commodity: allocation.commodity,
          quantity: allocation.amount,
        };
        retailerCooperative.availableCommodity.push(availableCommodity);
      }
      await retailerCooperative.save();
    }
  }

  await allocation.save();

  const populatedAllocation = await Allocation.findById(allocationId)
    .populate("commodity", "name")
    .populate("retailerCooperativeId", "name")
    .populate("tradeBureauId", "name");

  res.status(200).json({
    status: "success",
    data: populatedAllocation,
  });
});

exports.getAllocationsTo = catchAsync(async (req, res, next) => {
  const { start, end } = req.query;

  const filter = {
    retailerCooperativeId: req.params.entityId,
  };

  if (start) {
    filter.createdAt = { ...filter.createdAt, $gte: new Date(start) };
  }

  if (end) {
    const endDate = new Date(end);
    endDate.setDate(endDate.getDate() + 1);
    filter.createdAt = { ...filter.createdAt, $lt: endDate };
  }

  if (!start && !end) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    filter.createdAt = { $gte: thirtyDaysAgo };
  }

  const allocations = await Allocation.find(filter).populate(
    allocationPopOptions
  );
  res.status(200).json({
    status: "success",
    results: allocations.length,
    data: allocations,
  });
});

exports.getAllocationsByWoredaOffice = catchAsync(async (req, res, next) => {
  const woredaOfficeId = req.params.woredaOfficeId;
  const { start, end } = req.query;

  // Find retailerCooperatives in the woredaOffice
  const retailerCooperatives = await RetailerCooperative.find({
    woredaOffice: woredaOfficeId,
  });
  console.log({retailerCooperatives})

  // Get retailerCooperative IDs
  const retailerCoopIds = retailerCooperatives.map((rc) => rc._id);

  const filter = {
    retailerCooperativeId: { $in: retailerCoopIds },
  };

  if (start) {
    filter.createdAt = { ...filter.createdAt, $gte: new Date(start) };
  }

  if (end) {
    const endDate = new Date(end);
    endDate.setDate(endDate.getDate() + 1);
    filter.createdAt = { ...filter.createdAt, $lt: endDate };
  }

  if (!start && !end) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    filter.createdAt = { $gte: thirtyDaysAgo };
  }

  const allocations = await Allocation.find(filter)
    .populate("commodity", "name")
    .populate("retailerCooperativeId", "name")
    .populate("tradeBureauId", "name");

  res.status(200).json({
    status: "success",
    results: allocations.length,
    data: allocations,
  });
});

exports.getAllAllocations = catchAsync(async (req, res, next) => {
  const { start, end } = req.query;
  console.log({ start, end });

  const filter = {};

  if (start) {
    filter.createdAt = { ...filter.createdAt, $gte: new Date(start) };
  }

  if (end) {
    const endDate = new Date(end);
    endDate.setDate(endDate.getDate() + 1);
    filter.createdAt = { ...filter.createdAt, $lt: endDate };
  }

  if (!start && !end) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    filter.createdAt = { $gte: thirtyDaysAgo };
  }

  const allocations = await Allocation.find(filter)
    .sort({ createdAt: -1 })
    .populate(allocationPopOptions);

  res.status(200).json({
    status: "success",
    length: allocations.length,
    data: allocations,
  });
});

exports.getAllocationsByDate = catchAsync(async (req, res, next) => {
  const { start, end } = req.query;

  const filter = {};

  if (start) {
    filter.createdAt = { ...filter.createdAt, $gte: new Date(start) };
  }

  if (end) {
    const endDate = new Date(end);
    endDate.setDate(endDate.getDate() + 1);
    filter.createdAt = { ...filter.createdAt, $lt: endDate };
  }

  if (!start && !end) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    filter.createdAt = { $gte: thirtyDaysAgo };
  }

  const allocations = await Allocation.find(filter)
    .sort({ createdAt: -1 })
    .populate(allocationPopOptions);

  res.status(200).json({
    status: "success",
    length: allocations.length,
    data: allocations,
  });
});

// exports.getAllAllocations = factory.getAll(Allocation, allocationPopOptions);
exports.getAllocation = factory.getOne(Allocation, allocationPopOptions);
exports.deleteAllocation = factory.deleteOne(Allocation);
