import express from 'express'
import {
  getWatchlist,
  getGainers,
  getLosers,
} from '../../controllers/lists.js'

const router = express.Router()

router.route('/watchlist').get(getWatchlist)
router.route('/gainers').get(getGainers)
router.route('/losers').get(getLosers)

export default router
