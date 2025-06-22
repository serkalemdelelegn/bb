const SubCityOffice = require("../models/subCityOfficeModel");
const factory = require("./handlerFactory");

exports.createSubCityOffice = factory.createOne(SubCityOffice);
exports.getAllSubCityOffices = factory.getAll(SubCityOffice);
exports.getSubCityOfficeById = factory.getOne(SubCityOffice);
exports.updateSubCityOffice = factory.updateOne(SubCityOffice);
exports.deleteSubCityOffice = factory.deleteOne(SubCityOffice);
