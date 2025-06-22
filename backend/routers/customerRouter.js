const express = require("express");
const {
  createCustomer,
  getAllCustomers,
  getCustomer,
  getCustomerByFinalRetailer,
  updateCustomer,
  deleteCustomer,
  verifyCustomer,
  getCustomerByIDNumber,
  getCustomersByWoredaOffice,
  getCustomerByShop,
  getCustomersByRetailerCooperative,
} = require("../controllers/customerController");
const checkPermission = require("../middleware/checkPermission");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, checkPermission("createCustomer"), createCustomer);
router.get("/", auth, checkPermission("getAllCustomers"), getAllCustomers);
router.get("/:id", auth, checkPermission("getCustomer"), getCustomer);
router.get(
  "/shop/:shopId",
  auth,
  checkPermission("getCustomersByShop"),
  getCustomerByShop
);
// router.get('/id/:IDNumber', auth, checkPermission('getCustomerByIDNumber'), getCustomerByIDNumber);// ADD THE PERMISSION
router.get('/id/:IDNumber', auth,checkPermission('getCustomerByIDNumber'), getCustomerByIDNumber);// ADD THE PERMISSION
router.patch("/:id", auth, checkPermission("updateCustomer"), updateCustomer);
router.delete("/:id", auth, checkPermission("deleteCustomer"), deleteCustomer);
router.patch(
  "/verify/:fayda",
  auth,
  checkPermission("verifyCustomer"),
  verifyCustomer
);

// New route to get customers by woredaOffice
router.get(
  "/woredaOffice/:woredaOfficeId",
  auth,
  // checkPermission("getCustomersByWoredaOffice"),
  getCustomersByWoredaOffice
);
router.get(
  "/retailerCooperative/:retailerCooperativeId",
  auth,
  // checkPermission("getCustomersByWoredaOffice"),
  getCustomersByRetailerCooperative
);

module.exports = router;
