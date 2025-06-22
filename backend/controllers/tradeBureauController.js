const TradeBureau = require("../models/tradeBureauModel");
const factory = require("./handlerFactory");

exports.createTradeBureau = factory.createOne(TradeBureau);
exports.getAllTradeBureaus = factory.getAll(TradeBureau);
exports.getTradeBureauById = factory.getOne(TradeBureau);
exports.updateTradeBureau = factory.updateOne(TradeBureau);
exports.deleteTradeBureau = factory.deleteOne(TradeBureau);
