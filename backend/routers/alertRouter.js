const express = require("express");
const alertController = require("../controllers/alertController");
const router = express.Router();
const { protect } = require("../controllers/authController");
const auth = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");

router.post(
  "/",
  auth,
  checkPermission("createAlert"),
  alertController.createAlert
);
router.get(
  "/",
  auth,
  checkPermission("getAllAlerts"),
  alertController.getAllAlerts
);
router.get(
  "/:id",
  auth,
  checkPermission("getAlertById"),
  alertController.getAlertById
);
router.get(
  "/to/:entityId",
  auth,
  checkPermission("getAlertsTo"),
  alertController.getAlertsTo
);

router.patch(
  "/:id",
  auth,
  checkPermission("updateAlert"),
  alertController.updateAlert
);
router.delete(
  "/:id",
  auth,
  checkPermission("deleteAlert"),
  alertController.deleteAlert
);

module.exports = router;
