const getWatchlist = (req, res) => {
  const { data } = req.app.locals

  if (!data.coins || !data.watchList) {
    res.status(500)
    throw new Error('Watch list not yet ready, please try again in a few moments.')
  }

  // Build watch list
  const coins = {}
  const prices = {}

  data.watchList.map((item) => {
    coins[item.id] = data.coins[item.id]

    if (data.prices
          && data.prices[item.id]) {
      prices[item.id] = data.prices[item.id]
    }

    return null
  })

  return res.send({
    coins,
    prices,
    watchList: data.watchList,
    list: data.list,
    totalMarketCap: data.totalMarketCap,
    totalVolume24h: data.totalVolume24h,
    btcDominance: data.btcDominance,
    lastUpdated: data.lastUpdated,
  })
}

const getGainers = (req, res) => {
  const { data } = req.app.locals

  if (!data.topGainers) {
    res.status(500)
    throw new Error('Gainers not yet ready, please try again in a few moments.')
  }

  const list = []
  data.topGainers.forEach((item) => {
    list.push({
      id: item.id,
      name: data.coins[item.id].name,
      value: item.value,
    })
  })

  return res.send({
    list,
    lastUpdated: data.lastUpdated,
  })
}

const getLosers = (req, res) => {
  const { data } = req.app.locals

  if (!data.topLosers) {
    res.status(500)
    throw new Error('Losers not yet ready, please try again in a few moments.')
  }

  const list = []
  data.topLosers.forEach((item) => {
    list.push({
      id: item.id,
      name: data.coins[item.id].name,
      value: item.value,
    })
  })

  return res.send({
    list,
    lastUpdated: data.lastUpdated,
  })
}

export {
  getWatchlist,
  getGainers,
  getLosers,
}
