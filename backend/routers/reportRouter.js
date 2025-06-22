const express = require("express");
const {
  createReport,

  getReports,
  getAllReports,
  getAllGroupedReports,
} = require("../controllers/reportController");

const { protect } = require("../controllers/authController");
const checkPermission = require("../middleware/checkPermission");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, checkPermission("createReport"), createReport);
router.get("/", auth, checkPermission("getAllReports"), getAllGroupedReports);
router.get(
  "/:retailerCooperativeShopId",
  auth,
  checkPermission("getReports"),
  getReports
);

module.exports = router;
