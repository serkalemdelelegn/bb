const express = require("express");
const subCityOfficeController = require("../controllers/subCityOfficeController");
const router = express.Router();

const { protect } = require("../controllers/authController");
const checkPermission = require("../middleware/checkPermission");
const auth = require("../middleware/auth");


router.get(
  "/",
  auth,
  checkPermission("getAllSubCityOffices"),
  subCityOfficeController.getAllSubCityOffices
);
router.post(
  "/",
  auth,
  checkPermission("createSubCityOffice"),
  subCityOfficeController.createSubCityOffice
);
router.get(
  "/:id",
  auth,
  checkPermission("getSubCityOfficeById"),
  subCityOfficeController.getSubCityOfficeById
);
router.patch(
  "/:id",
  auth,
  checkPermission("updateSubCityOffice"),
  subCityOfficeController.updateSubCityOffice
);
router.delete(
  "/:id",
  auth,
  checkPermission("deleteSubCityOffice"),
  subCityOfficeController.deleteSubCityOffice
);

module.exports = router;
