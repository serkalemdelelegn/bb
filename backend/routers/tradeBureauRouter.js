const express = require("express");
const tradeBureauController = require("../controllers/tradeBureauController");
const router = express.Router();

const { protect } = require("../controllers/authController");
const auth = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");


router.get(
  "/",
  auth,
  checkPermission("getAllTradeBureaus"),
  tradeBureauController.getAllTradeBureaus
);
router.post(
  "/",
  auth,
  checkPermission("createTradeBureau"),
  tradeBureauController.createTradeBureau
);

router.get(
  "/:id",
  auth,
  checkPermission("getTradeBureauById"),
  tradeBureauController.getTradeBureauById
);
router.patch(
  "/:id",
  auth,
  checkPermission("updateTradeBureau"),
  tradeBureauController.updateTradeBureau
);
router.delete(
  "/:id",
  auth,
  checkPermission("deleteTradeBureau"),
  tradeBureauController.deleteTradeBureau
);

module.exports = router;
