import express from 'express'
import {
  getExchanges,
} from '../../controllers/exchanges.js'

const router = express.Router()

router.route('/').get(getExchanges)

export default router
