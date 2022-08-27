import Transaction from "../models/transactionModel.js";
import asyncHandler from "express-async-handler";

// @desc    Get all transactions
// @route   GET /bankapi/transactions
// @access  public
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({});
  res.json(transactions);
});

export { getTransactions };
