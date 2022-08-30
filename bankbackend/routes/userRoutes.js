import express from "express";
import {
  authUser,
  getUserBalance,
  registerUser,
  balanceDeposit,
  getUsers,
} from "../controllers/userController.js";
const router = express.Router();

router.route("/").post(registerUser).get(getUsers);
router.post("/login", authUser);
router.route("/profile").post(getUserBalance).put(balanceDeposit);

export default router;
