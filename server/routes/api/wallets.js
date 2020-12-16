import express from 'express'
import { admin, protect } from '../../middleware/authMiddleware.js'
import {
  createWallet,
  deleteWallet,
  getWallet,
  getWallets,
  updateWallet,
} from '../../controllers/wallets.js'

const router = express.Router()

router.route('/:walletId')
  .get(getWallet)
  .put(protect, admin, updateWallet)
  .delete(protect, admin, deleteWallet)

router.route('/')
  .get(getWallets)
  .post(protect, admin, createWallet)

export default router
