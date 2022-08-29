import express from "express";
import {
  getTransactionById,
  getTransactions,
  checkTransactionById,
} from "../controllers/transactionController.js";
const router = express.Router();

router.route("/").get(getTransactions);
router.route("/:id").get(getTransactionById);
router.route("/:id/exists").get(checkTransactionById);

export default router;
