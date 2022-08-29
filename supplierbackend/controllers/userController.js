import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// @desc    Auth user
// @route   POST /supplierapi/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      account_number: user.account_number,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /supplierapi/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone_number, account_number, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    phone_number,
    account_number,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone_number: user.phhone_number,
      account_number: user.account_number,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Get all users
// @route   GET /supplierapi/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /bankapi/users/:id
// @access
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by Bank Account Number
// @route   GET /supplierapi/users/bankAccount/:account_number
// @access
const getUserByBankAccount = asyncHandler(async (req, res) => {
  const user = await User.find({
    account_number: req.params.account_number,
  }).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export { authUser, registerUser, getUsers, getUserById, getUserByBankAccount };
