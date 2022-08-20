import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      
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


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
  
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
})
  

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      if(req.body.password) {
        user.password = req.body.password
      }

      const updatedUser = await user.save()

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
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

export { authUser, registerUser, getUserProfile, updateUserProfile, getUsers }
