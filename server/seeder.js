import dotenv from 'dotenv'

dotenv.config()

import logger from 'loglevel'
import exchanges from './data/exchanges.js'
import wallets from './data/wallets.js'
import User from './models/User.js'
import Coin from './models/Coin.js'
import UserFavorite from './models/UserFavorite.js'
import Exchange from './models/Exchange.js'
import Wallet from './models/Wallet.js'

logger.setLevel('info')

import connectDB from './config/db.js'

connectDB()

const importData = async () => {
  try {
    await UserFavorite.deleteMany()
    await Coin.deleteMany()
    await User.deleteMany()
    await Exchange.deleteMany()
    await Wallet.deleteMany()

    await Exchange.insertMany(exchanges)
    await Wallet.insertMany(wallets)

    logger.info('Data Imported!')
    process.exit()
  } catch (error) {
    logger.error(`${error}`)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await UserFavorite.deleteMany()
    await Coin.deleteMany()
    await User.deleteMany()
    await Exchange.deleteMany()
    await Wallet.deleteMany()

    logger.info('Data Destroyed!')
    process.exit()
  } catch (error) {
    logger.error(`${error}`)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
