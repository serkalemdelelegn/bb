const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");
const seedRoles = require("./seed/roleSeeder");
const seedPermissions = require("./seed/permissionSeeder");
const seedRolePermissions = require("./seed/rolePermissionSeeder");

const DB = process.env.DATABASE;

mongoose.connect(DB, {}).then(() => console.log("DB connection successful"));
// seedRoles();
// seedPermissions();
// seedRolePermissions();

app.listen(process.env.PORT, () => {
  console.log("Listening on port: ", process.env.PORT);
});
