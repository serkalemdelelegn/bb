const express = require("express");
const woredaOfficeController = require("../controllers/woredaOfficeController");
const { protect } = require("../controllers/authController");
const checkPermission = require("../middleware/checkPermission");
const auth = require("../middleware/auth");
const router = express.Router();


router.get(
  "/",
  auth,
  checkPermission("getAllWoredaOffices"),
  woredaOfficeController.getAllWoredaOffices
);
router.post(
  "/",
  auth,
  checkPermission("createWoredaOffice"),
  woredaOfficeController.createWoredaOffice
);

router.get(
  "/:id",
  auth,
  checkPermission("getWoredaOfficeById"),
  woredaOfficeController.getWoredaOfficeById
);
router.patch(
  "/:id",
  auth,
  checkPermission("updateWoredaOffice"),
  woredaOfficeController.updateWoredaOffice
);
router.delete(
  "/:id",
  auth,
  checkPermission("deleteWoredaOffice"),
  woredaOfficeController.deleteWoredaOffice
);

module.exports = router;
