const express = require("express");
const {
  createTransaction,
  getAllTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByShop,
  getTransactionsByDate,
} = require("../controllers/transactionController");

const router = express.Router();

const { protect } = require("../controllers/authController");
const auth = require("../middleware/auth");
const checkPermission = require("../middleware/checkPermission");

router.get(
  "/",
  auth,
  checkPermission("getAllTransactions"),
  getAllTransactions
);
router.get("/:id", auth, checkPermission("getTransaction"), getTransaction);

router.post("/", auth, checkPermission("createTransaction"), createTransaction);
router.patch(
  "/:id",
  auth,
  checkPermission("updateTransaction"),
  updateTransaction
);
router.delete(
  "/:id",
  auth,
  checkPermission("deleteTransaction"),
  deleteTransaction
);
router.get(
  '/shop/:shopId',
  auth,
  checkPermission('getTransactionsByShop'),
  getTransactionsByShop
);
router.get(
  '/date',
  auth,
  checkPermission('getTransactionsByDate'),
  getTransactionsByDate
);


module.exports = router;
