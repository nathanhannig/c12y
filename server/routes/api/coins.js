import express from 'express'
import {
  getCoins,
  getCoinById,
} from '../../controllers/coins.js'

const router = express.Router()

router.route('/').get(getCoins)
router.route('/:coin').get(getCoinById)

export default router
