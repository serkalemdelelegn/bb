const express = require("express");
const { getAllUsers, getUser, getMe, updateMe } = require("../controllers/userController");
const { signUp, login, logout, updatePassword } = require("../controllers/authController");

const router = express.Router();

const checkPermission = require("../middleware/checkPermission");
const auth = require("../middleware/auth");

router.post("/signup", signUp);
router.post("/login", login);
router.get('/logout', logout);

router.get("/me", auth, getMe, getUser)
router.patch('/updateMe', auth, updateMe);
router.patch('/updateMyPassword', auth, updatePassword);
router.get("/", auth, checkPermission("getAllUsers"), getAllUsers);
router.get("/:id", auth, checkPermission("getUser"), getUser);


module.exports = router;
