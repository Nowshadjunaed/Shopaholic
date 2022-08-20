import express from 'express'
import { authUser, getUserProfile, registerUser, updateUserProfile } from '../controllers/userController.js'
const router = express.Router()

router.route('/')
    .post(registerUser)
router.post('/login', authUser)
router.route('/profile')
    .get(getUserProfile)
    .put(updateUserProfile)

export default router