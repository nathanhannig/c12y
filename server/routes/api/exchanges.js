import express from 'express'
import { admin, protect } from '../../middleware/authMiddleware.js'
import {
  createExchange,
  deleteExchange,
  getExchange,
  getExchanges,
  updateExchange,
} from '../../controllers/exchanges.js'

const router = express.Router()

router.route('/:exchangeId')
  .get(getExchange)
  .put(protect, admin, updateExchange)
  .delete(protect, admin, deleteExchange)

router.route('/')
  .get(getExchanges)
  .post(protect, admin, createExchange)

export default router
