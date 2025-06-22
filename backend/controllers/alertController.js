const Alert = require("../models/alertModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

const alertPopOptions = [
  {
    path: "user",
    select: "name",
  },
  {
    path: "from",
    select: "name",
  },
  {
    path: "to",
    select: "name",
  },
];
exports.getAllAlerts = catchAsync(async (req, res, next) => {
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

  const alerts = await Alert.find(filter).populate(alertPopOptions);

  res.status(200).json({
    status: "success",
    length: alerts.length,
    data: alerts,
  });
});

exports.getAlertsTo = catchAsync(async (req, res, next) => {
  const { start, end } = req.query;

  const filter = {
    to: req.params.entityId,
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
  
  const alerts = await Alert.find(filter).populate(alertPopOptions);
  
  res.status(200).json({
    status: "success",
    results: alerts.length,
    data: {
      alerts,
    },
  });
});

exports.getAlertById = factory.getOne(Alert, alertPopOptions);
exports.createAlert = factory.createOne(Alert);
exports.updateAlert = factory.updateOne(Alert);
exports.deleteAlert = factory.deleteOne(Alert);
