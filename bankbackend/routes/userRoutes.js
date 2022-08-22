import express from 'express'
import { authUser, getUserBalance, registerUser, balanceDeposit } from '../controllers/userController.js'
const router = express.Router()

router.route('/')
    .post(registerUser)
router.post('/login', authUser)
router.route('/profile')
    .get(getUserBalance)
    .put(balanceDeposit)

export default router