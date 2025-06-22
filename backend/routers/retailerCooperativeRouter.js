const express = require("express");
const {
  createRetailerCooperative,
  getAllRetailerCooperatives,
  getRetailerCooperative,
  updateRetailerCooperative,
  deleteRetailerCooperative,
  getRetailerCooperativeDetails,
} = require("../controllers/retailerCooperativeController");

const { protect } = require("../controllers/authController");
const checkPermission = require("../middleware/checkPermission");
const auth = require("../middleware/auth");

const router = express.Router();


router.get(
  "/",
  auth,
  checkPermission("getAllRetailerCooperatives"),
  getAllRetailerCooperatives
);
router.post(
  "/",
  auth,
  checkPermission("createRetailerCooperative"),
  createRetailerCooperative
);
router.get(
  "/:id",
  auth,
  checkPermission("getRetailerCooperative"),
  getRetailerCooperative
);
router.patch(
  "/:id",
  auth,
  checkPermission("updateRetailerCooperative"),
  updateRetailerCooperative
);
router.delete(
  "/:id",
  auth,
  checkPermission("deleteRetailerCooperative"),
  deleteRetailerCooperative
);

// New route to get retailer cooperative details including shops and customer count
router.get(
  "/details/:id",
  auth,
  // checkPermission("getRetailerCooperativeDetails"),
  getRetailerCooperativeDetails
);

module.exports = router;
