const Distribution = require("../models/distributionModel");
const RetailerCooperative = require("../models/retailerCooperativeModel");
const RetailerCooperativeShop = require("../models/retailerCooperativeShopModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

const distributionPopOptions = [
  {
    path: "commodity",
    select: "name",
  },
  {
    path: "retailerCooperativeId",
    select: "name",
  },
  {
    path: "retailerCooperativeShopId",
    select: "name",
  },
];

exports.createDistribution = catchAsync(async (req, res, next) => {
  const distribution = new Distribution(req.body); // Create but don't save yet

  const retailerCooperative = await RetailerCooperative.findById(
    distribution.retailerCooperativeId
  );

  if (retailerCooperative) {
    const availableCommodity = retailerCooperative.availableCommodity.find(
      (item) =>
        item.commodity._id.toString() === distribution.commodity.toString()
    );

    if (availableCommodity) {
      if (availableCommodity.quantity < distribution.amount) {
        return next(new AppError("የተጠየቀው መጠን ካለው ይበልጣል!", 400));
      }
      availableCommodity.quantity -= distribution.amount; // Deduct the quantity
    }
  }

  await distribution.save();

  res.status(201).json({
    status: "success",
    data: {
      distribution,
    },
  });
});

exports.updateDistribution = catchAsync(async (req, res, next) => {
  const distributionId = req.params.id;
  const updateData = req.body;

  const distribution = await Distribution.findById(distributionId);
  if (!distribution) {
    return next(new AppError("Distribution not found", 404));
  }

  if (distribution.status === "approved") {
    return next(new AppError("Cannot update an approved distribution", 400));
  }

  if (distribution.status === "rejected") {
    return next(new AppError("Cannot update a rejected distribution", 400));
  }

  // Update distribution fields
  Object.assign(distribution, updateData);

  // If status is set to 'approved', update availableCommodity of retailerCooperative and shop
  if (updateData.status === "approved") {
    const retailerCooperative = await RetailerCooperative.findById(
      distribution.retailerCooperativeId
    );
    if (retailerCooperative) {
      let availableCommodity = retailerCooperative.availableCommodity.find(
        (item) =>
          item.commodity.toString() === distribution.commodity.toString()
      );
      if (availableCommodity) {
        availableCommodity.quantity -= distribution.amount;
      } else {
        availableCommodity = {
          commodity: distribution.commodity,
          quantity: distribution.amount,
        };
        retailerCooperative.availableCommodity.push(availableCommodity);
      }
      await retailerCooperative.save();
    }

    const shop = await RetailerCooperativeShop.findById(
      distribution.retailerCooperativeShopId
    );
    if (shop) {
      let availableCommodity = shop.availableCommodity.find(
        (item) =>
          item.commodity._id.toString() === distribution.commodity.toString()
      );
      if (availableCommodity) {
        availableCommodity.quantity += distribution.amount;
      } else {
        availableCommodity = {
          commodity: distribution.commodity,
          quantity: distribution.amount,
        };
        shop.availableCommodity.push(availableCommodity);
      }
      await shop.save();
    }
  }
  // If status is set to 'rejected', return deducted amount back to retailerCooperative
  else if (updateData.status === "rejected") {
    const retailerCooperative = await RetailerCooperative.findById(
      distribution.retailerCooperativeId
    );
    if (retailerCooperative) {
      let availableCommodity = retailerCooperative.availableCommodity.find(
        (item) =>
          item.commodity._id.toString() === distribution.commodity.toString()
      );
      if (availableCommodity) {
        availableCommodity.quantity += distribution.amount;
      } else {
        availableCommodity = {
          commodity: distribution.commodity,
          quantity: distribution.amount,
        };
        retailerCooperative.availableCommodity.push(availableCommodity);
      }
      await retailerCooperative.save();
    }
  }

  await distribution.save();

  const populatedDistribution = await Distribution.findById(distributionId)
    .populate("commodity", "name")
    .populate("retailerCooperativeId", "name")
    .populate("retailerCooperativeShopId", "name");

  res.status(200).json({
    status: "success",
    data: populatedDistribution,
  });
});

exports.getDistributionsTo = catchAsync(async (req, res, next) => {
  const { start, end } = req.query;

  const filter = {
    retailerCooperativeShopId: req.params.entityId,
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
  
  const distributions = await Distribution.find(filter).populate(distributionPopOptions);
  res.status(200).json({
    status: "success",
    results: distributions.length,
    data: {
      distributions,
    },
  });
});

exports.getDistributionsFrom = catchAsync(async (req, res, next) => {
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

  const distributions = await Distribution.find(filter).populate(distributionPopOptions);
  res.status(200).json({
    status: "success",
    results: distributions.length,
    data: {
      distributions,
    },
  });
});

exports.getAllDistributions = catchAsync(async (req, res, next) => {
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

  const distributions = await Distribution.find(filter)
    .sort({ createdAt: -1 })
    .populate(allocationPopOptions);

  res.status(200).json({
    status: "success",
    length: distributions.length,
    data: distributions,
  });
});

exports.getAllDistributions = factory.getAll(
  Distribution,
  distributionPopOptions
);
exports.deleteDistribution = factory.deleteOne(Distribution);
exports.getDistribution = factory.getOne(Distribution, distributionPopOptions);
