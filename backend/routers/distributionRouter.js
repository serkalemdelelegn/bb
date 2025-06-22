const express = require("express");
const {
  getAllDistributions,
  getDistribution,
  createDistribution,
  updateDistribution,
  deleteDistribution,
  getDistributionsTo,
  getDistributionsFrom,
} = require("../controllers/distributionController");
const auth = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");
const router = express.Router();

router.get(
  "/",
  auth,
  checkPermission("getAllDistributions"),
  getAllDistributions
);
router.post(
  "/",
  auth,
  checkPermission("createDistribution"),
  createDistribution
);
router.get("/:id", auth, checkPermission("getDistribution"), getDistribution);
router.patch(
  "/:id",
  auth,
  checkPermission("updateDistribution"),
  updateDistribution
);
router.delete(
  "/:id",
  auth,
  checkPermission("deleteDistribution"),
  deleteDistribution
);
router.get(
  "/to/:entityId",
  auth,
  // checkPermission("getDistributionsTo"),
  getDistributionsTo
);
router.get(
  "/from/:entityId",
  auth,
  // checkPermission("getDistributionsFrom"),
  getDistributionsFrom
)

module.exports = router;
