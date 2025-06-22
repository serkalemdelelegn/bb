const express = require("express");
const upload = require("../utils/multer");
const { uploadFile } = require("../controllers/uploadController");
const router = express.Router();

const { protect } = require("../controllers/authController");
const checkPermission = require("../middleware/checkPermission");
const auth = require("../middleware/auth");


router.post(
  "/uploadFile",
  upload.array("files"),
  auth,
  checkPermission("uploadFile"),
  uploadFile
);

module.exports = router;
