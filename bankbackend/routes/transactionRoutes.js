import express from "express";
import {
  getTransactionById,
  getTransactions,
  checkTransactionById,
  getMyTransactions,
} from "../controllers/transactionController.js";
const router = express.Router();

router.route("/").get(getTransactions);
router.route("/:id").get(getTransactionById);
router.route("/:id/exists").get(checkTransactionById);
router.route("/myTransactions/:id").get(getMyTransactions);

export default router;
