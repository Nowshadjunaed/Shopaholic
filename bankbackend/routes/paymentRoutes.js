import express from 'express'
import { payMoney } from '../controllers/paymentController.js'
const router = express.Router()

router.route('/')
    .put(payMoney)

export default router