import express from "express";
import { deliveryRequest } from "../controllers/deliveryRequestController.js";
import {
  authUser,
  registerUser,
  getUsers,
  getUserById,
  getUserByBankAccount,
} from "../controllers/userController.js";
const router = express.Router();

router.route("/").post(registerUser).get(getUsers);
router.route("/:id").get(getUserById);
router.route("/:id/deliveryRequest").post(deliveryRequest);
router.route("/bankAccount/:account_number").get(getUserByBankAccount);
router.post("/login", authUser);

export default router;
