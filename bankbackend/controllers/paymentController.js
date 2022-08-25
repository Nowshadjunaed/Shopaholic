import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'



// @desc    payment
// @route   PUT /bankapi/payment/
// @access  Private
const payMoney = asyncHandler(async (req, res) => {
  const { email, amount } = req.body

  const user = await User.findOne({ email })

  
  if (user) {
    user.balance = user.balance-amount
    const updatedUser = await user.save()

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    res.json({
      id: "123456789",
      status: "COMPLETED",
      update_time: dateTime,
      email: email,

    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})



export { payMoney }
