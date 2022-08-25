import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

// @desc    Auth user
// @route   POST /bankapi/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      account_number: user.account_number,
      balance: user.balance,
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  res.send({
      email,
      password,
  })
})

// @desc    Register a new user
// @route   POST /bankapi/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
  
    const userExists = await User.findOne({ email })
  
    if (userExists) {
      res.status(400)
      throw new Error('User already exists')
    }
    let account_number = ""
    console.log(req.body.email)
    for(let i=0;i<email.length;i++)
    {
      let asci = email.charCodeAt(i);
      if(asci>=48 && asci<=57)
      {
        account_number+='0'
        account_number+=asci.toString()
      }
      else if(asci>=97 && asci<=122)
      {
        asci -= 96
        asci += 10
        account_number+=asci.toString()
      }
      else if(asci>=65 && asci<=90)
      {
        asci -= 64
        asci += 40
        account_number+=asci.toString()
      }
      else if(email[i]=='@')
      {
        account_number+='91'
      }
      else if(email[i]=='.')
      {
        account_number+='92'
      }
      else if(email[i]=='_')
      {
        account_number+='93'
      }
    }
  
    const user = await User.create({
      name,
      email,
      account_number,
      password,
    })
  
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        account_number: user.account_number,
      })
    } else {
      res.status(400)
      throw new Error('Invalid user data')
    }
})


// @desc    Get user Balance
// @route   GET /bankapi/users/profile
// @access  Private
const getUserBalance = asyncHandler(async (req, res) => {
  const { account_number } = req.body

  const user = await User.findOne({ account_number })

  if (user) {
    res.json({
      account_number: user.account_number,
      your_current_balance: user.balance,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }

})
  

// @desc    Deposit Balance
// @route   PUT /bankapi/users/profile
// @access  Private
const balanceDeposit = asyncHandler(async (req, res) => {
  const { account_number, amount } = req.body

  const user = await User.findOne({ account_number })

  
  if (user) {
    user.balance = user.balance+amount
    const updatedUser = await user.save()

    res.json({
      account_number: updatedUser.account_number,
      your_current_balance: updatedUser.balance,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})


// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

export { authUser, registerUser, getUserBalance, balanceDeposit, getUsers }
