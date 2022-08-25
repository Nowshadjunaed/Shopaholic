import express from 'express'
import { payMoney } from '../controllers/paymentController.js'
const router = express.Router()

router.route('/')
    .post(payMoney)

export default router