const express = require("express");
const {
  createRetailerCooperativeShop,
  getAllRetailerCooperativeShops,
  getRetailerCooperativeShop,
  updateRetailerCooperativeShop,
  deleteRetailerCooperativeShop,
  getShopsByRetailerCooperativeId,
  getShopsByWoreda,
} = require("../controllers/retailerCooperativeShopController");

const router = express.Router();

const { protect } = require("../controllers/authController");
const auth = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");

router.post(
  "/",
  auth,
  checkPermission("createRetailerCooperativeShop"),
  createRetailerCooperativeShop
);

router.get(
  "/",
  auth,
  checkPermission("getAllRetailerCooperativeShops"),
  getAllRetailerCooperativeShops
);

router.get(
  "/:id",
  auth,
  checkPermission("getRetailerCooperativeShop"),
  getRetailerCooperativeShop
);

router.get(
  "/retailerCooperative/:retailerCooperativeId",
  auth,
  checkPermission("getRetailerCooperativeShop"),
  getShopsByRetailerCooperativeId
);
router.get(
  "/woredaOffice/:woredaOfficeId",
  auth,
  checkPermission("getRetailerCooperativeShop"),
  getShopsByWoreda
)

router.patch(
  "/:id",
  auth,
  checkPermission("updateRetailerCooperativeShop"),
  updateRetailerCooperativeShop
);
router.delete(
  "/:id",
  auth,
  checkPermission("deleteRetailerCooperativeShop"),
  deleteRetailerCooperativeShop
);

module.exports = router;
