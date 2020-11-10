const getCoins = (req, res) => {
  const { data } = req.app.locals

  if (!data || !data.coinList) {
    res.status(500)
    throw new Error('Coin list not yet ready, please try again in a few moments.')
  }

  // Check that page is a number and greater than 0, else default it to 1
  const page = !Number.isNaN(Number(req.query.page)) && parseInt(req.query.page, 10) > 0
    ? parseInt(req.query.page, 10)
    : 1
  const limit = 100
  const end = (page * limit) - 1
  const begin = end - (limit - 1)
  const total = data.coinList.length

  const coins = {}
  const prices = {}
  for (let i = begin; i <= end && i < total; i += 1) {
    coins[data.coinList[i].id] = data.coins[data.coinList[i].id]

    if (data.prices
          && data.prices[data.coinList[i].id]) {
      prices[data.coinList[i].id] = data.prices[data.coinList[i].id]
    }
  }

  return res.send({
    coins,
    prices,
    coinList: data.coinList,
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
    res.status(500)
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

  res.status(404)
  throw new Error('Coin not found.')
}

export {
  getCoins,
  getCoinById,
}
