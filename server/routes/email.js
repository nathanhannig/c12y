import express from 'express'
import { sendEmail } from '../controllers/email.js'

const router = express.Router()

router.route('/contact').post(sendEmail)

export default router
