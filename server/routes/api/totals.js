import express from 'express'
import { getTotals } from '../../controllers/totals.js'

const router = express.Router()

router.route('/').get(getTotals)

export default router
