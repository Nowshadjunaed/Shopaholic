import Transaction from "../models/transactionModel.js";
import asyncHandler from "express-async-handler";

// @desc    Get all transactions
// @route   GET /bankapi/transactions
// @access  public
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({});
  res.json(transactions);
});

// @desc    Get logged in user transactions
// @route   GET /bankapi/transactions/mytransactions/:id
// @access
const getMyTransactions = asyncHandler(async (req, res) => {
  console.log("eta req.user");
  // const transactions = await Transaction.find({ sender: req.params.id });
  const transactions = await Transaction.find().or([
    { sender: req.params.id },
    { receiver: req.params.id },
  ]);
  res.json(transactions);
});

// @desc    Get transaction by ID
// @route   GET /bankapi/transactions/:id
// @access
const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id).select(
    "-password"
  );
  if (transaction) {
    res.json(transaction);
  } else {
    res.status(404);
    throw new Error("Transaction not found");
  }
});

// @desc    Check transaction by ID
// @route   GET /bankapi/transactions/:id/exists
// @access
const checkTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);
  console.log("transactoin exists api is called");
  if (transaction) {
    res.json({
      isExists: true,
    });
  } else {
    res.json({
      isExists: false,
    });
  }
});

export {
  getTransactions,
  getTransactionById,
  checkTransactionById,
  getMyTransactions,
};
