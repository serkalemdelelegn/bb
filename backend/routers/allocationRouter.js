const express = require("express");
const router = express.Router();
const allocationController = require("../controllers/allocationController");
const { protect, restrictTo } = require("../controllers/authController");
const auth = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");

router.post(
  "/",
  auth,
  checkPermission("createAllocation"),
  allocationController.createAllocation
);
router.get(
  "/",
  auth,
  checkPermission("getAllocations"),
  allocationController.getAllAllocations
);
router.get(
  "/:id",
  auth,
  checkPermission('getAllocation'),
  allocationController.getAllocation
)
router.get(
  "/to/:entityId",
  auth,
  checkPermission("getAllocationsTo"),
  allocationController.getAllocationsTo
);
router.get(
  "/woredaOffice/:woredaOfficeId",
  auth,
  // checkPermission("getAllocationsByWoredaOffice"),
  allocationController.getAllocationsByWoredaOffice
);
router.patch(
  "/:id",
  auth,
  checkPermission("updateAllocation"),
  allocationController.updateAllocation
);

module.exports = router;
