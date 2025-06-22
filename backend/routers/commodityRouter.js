const express = require("express");
const {
  createCommodity,
  getAllCommodities,
  getCommodity,
  updateCommodity,
  deleteCommodity,
} = require("../controllers/commodityController");
const { protect } = require("../controllers/authController");
const checkPermission = require("../middleware/checkPermission");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, checkPermission("createCommodity"), createCommodity);
router.get("/", auth, checkPermission("getAllCommodities"), getAllCommodities);
router.get("/:id", auth, checkPermission("getCommodity"), getCommodity);
router.patch("/:id", auth, checkPermission("updateCommodity"), updateCommodity);
router.delete(
  "/:id",
  auth,
  checkPermission("deleteCommodity"),
  deleteCommodity
);

module.exports = router;
