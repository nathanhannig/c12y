import express from 'express'
import {
  getWallets,
} from '../../controllers/wallets.js'

const router = express.Router()

router.route('/').get(getWallets)

export default router
