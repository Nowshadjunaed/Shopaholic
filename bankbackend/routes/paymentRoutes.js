import express from "express";
import { payMoney, paymentPossible } from "../controllers/paymentController.js";
const router = express.Router();

router.route("/").post(payMoney);

router.route("/possible").get(paymentPossible);
export default router;
