import asyncHandler from 'express-async-handler'
import Wallet from '../models/Wallet.js'

const getWallets = asyncHandler(async (req, res) => {
  const wallets = await Wallet.find(
    {},
    {
      _id: 0, name: 1, link: 1, description: 1,
    },
  )

  return res.send(wallets)
})

export {
  getWallets,
}
