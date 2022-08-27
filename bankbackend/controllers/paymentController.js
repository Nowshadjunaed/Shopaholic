import asyncHandler from "express-async-handler";
import Transaction from "../models/transactionModel.js";
import User from "../models/userModel.js";

// @desc    payment
// @route   PUT /bankapi/payment/
// @access  Private
const payMoney = asyncHandler(async (req, res) => {
  const { email, account_number, amount, receiver_email } = req.body;

  const user = await User.findOne({ account_number });

  if (user) {
    user.balance = user.balance - amount;

    const receiver = await User.findOne({ receiver_email });
    const transaction = new Transaction({
      sender: user._id,
      receiver: receiver._id,
      transactionAmount: amount,
    });
    const createdTransaction = await transaction.save();

    const updatedUser = await user.save();

    var today = new Date();
    var date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;

    res.json({
      id: createdTransaction._id,
      status: "COMPLETED",
      update_time: dateTime,
      email: email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    checks if payment is possible
// @route   POST /bankapi/payment/possible
const paymentPossible = asyncHandler(async (req, res) => {
  const { account_number, amount } = req.body;

  const user = await User.findOne({ account_number });

  if (user) {
    let isPaymentPossible;
    if (user.balance < amount) {
      isPaymentPossible = false;
    } else {
      isPaymentPossible = true;
    }
    res.json({
      isPaymentPossible,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export { payMoney, paymentPossible };
