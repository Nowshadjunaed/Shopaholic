import express from "express";
import { getTransactions } from "../controllers/transactionController.js";
const router = express.Router();

router.route("/").get(getTransactions);

export default router;
