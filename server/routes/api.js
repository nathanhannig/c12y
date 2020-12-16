import express from 'express'

const router = express.Router()

import coinRoutes from './api/coins.js'
import exchangeRoutes from './api/exchanges.js'
import listRoutes from './api/lists.js'
import userRoutes from './api/users.js'
import walletRoutes from './api/wallets.js'

router.use('/coins', coinRoutes)
router.use('/exchanges', exchangeRoutes)
router.use('/lists', listRoutes)
router.use('/users', userRoutes)
router.use('/wallets', walletRoutes)

export default router
