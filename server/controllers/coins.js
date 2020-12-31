import httpStatus from 'http-status'

const getCoins = (req, res) => {
  const { data } = req.app.locals

  if (!data || !data.list) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR)
    throw new Error('Coin list not yet ready, please try again in a few moments.')
  }

  // Check that page is a number and greater than 0, else default it to 1
  const page = !Number.isNaN(Number(req.query.page)) && parseInt(req.query.page, 10) > 0
    ? parseInt(req.query.page, 10)
    : 1
  const limit = 100
  const end = (page * limit) - 1
  const begin = end - (limit - 1)
  const total = data.list.length

  const coins = {}
  const prices = {}
  for (let i = begin; i <= end && i < total; i += 1) {
    coins[data.list[i].id] = data.coins[data.list[i].id]

    if (data.prices
          && data.prices[data.list[i].id]) {
      prices[data.list[i].id] = data.prices[data.list[i].id]
    }
  }

  return res.send({
    coins,
    prices,
    list: data.list,
    totalMarketCap: data.totalMarketCap,
    totalVolume24h: data.totalVolume24h,
    btcDominance: data.btcDominance,
    lastUpdated: data.lastUpdated,
    page,
    begin,
    end,
    total,
  })
}

const getCoinById = (req, res) => {
  const { data } = req.app.locals

  const coin = req.params.coin.toLowerCase()

  if (!data) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR)
    throw new Error('Coin list not yet ready, please try again in a few moments.')
  }

  if (data.coins
        && data.coins[coin]
        && data.prices
        && data.prices[coin]) {
    return res.send({
      coin: data.coins[coin],
      price: data.prices[coin],
      lastUpdated: data.lastUpdated,
    })
  }

  if (data.coins
        && data.coins[coin]) {
    return res.send({
      coin: data.coins[coin],
      lastUpdated: data.lastUpdated,
    })
  }

  res.status(httpStatus.NOT_FOUND)
  throw new Error('Coin not found.')
}

export {
  getCoins,
  getCoinById,
}
