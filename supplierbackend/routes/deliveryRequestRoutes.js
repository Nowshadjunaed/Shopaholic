import express from "express";
import { deliveryRequest } from "../controllers/deliveryRequestController.js";
const router = express.Router();

router.route("/").post(deliveryRequest);

export default router;
