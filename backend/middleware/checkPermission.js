const RolePermission = require("../models/rolePermissionModel");
const Permission = require("../models/permissionModel");
const mongoose = require("mongoose");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const checkPermission = (permissionName) => {
  return catchAsync(async (req, res, next) => {
    const permission = await Permission.findOne({ name: permissionName });
    if (!permission) return next(new AppError("Permission not found", 404));

    const hasPermission = await RolePermission.findOne({
      role: new mongoose.Types.ObjectId(req.user.role),
      permission: permission._id,
    });
    // console.log("Role from req.user:", req.user.role);
    // console.log("permission id", permission._id);

    if (!hasPermission)
      return next(new AppError("Forbidden: Insufficent permissions", 401));
    next();
  });
};

module.exports = checkPermission;
