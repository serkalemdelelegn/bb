const mongoose = require("mongoose");
const RolePermission = require("../models/rolePermissionModel");
const connectDB = require("../config/db");

const deleteRolePermissions = async () => {
  await connectDB();

  await RolePermission.deleteMany({})
    .then(() => {
      console.log("All RolePermissions deleted successfully.");
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error("Error deleting RolePermissions:", err);
      mongoose.connection.close();
    });
};

deleteRolePermissions();
