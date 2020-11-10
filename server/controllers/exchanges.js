import asyncHandler from 'express-async-handler'
import Exchange from '../models/Exchange.js'

const getExchanges = asyncHandler(async (req, res) => {
  const exchanges = await Exchange.find(
    {},
    {
      _id: 0, name: 1, link: 1, description: 1,
    },
  )

  return res.send(exchanges)
})

export {
  getExchanges,
}
