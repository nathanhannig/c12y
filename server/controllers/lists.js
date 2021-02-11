import httpStatus from 'http-status'

const getWatchlist = (req, res) => {
  const { data } = req.app.locals

  if (!data.coins || !data.watchList) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR)
    throw new Error('Watch list not yet ready, please try again in a few moments.')
  }

  // Build watch list
  const coins = {}
  const coinsList = Object.values(data.coins).map(({ id, name }) => ({ id, label: name }))

  data.watchList.map((item) => {
    coins[item.id] = data.coins[item.id]

    if (data.prices?.[item.id]) {
      coins[item.id].prices = data.prices[item.id]
    }

    return null
  })

  return res.send({
    data: coins,
    watchList: data.watchList,
    list: coinsList,
    lastUpdated: data.lastUpdated,
  })
}

const getGainers = (req, res) => {
  const { data } = req.app.locals

  if (!data.topGainers) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR)
    throw new Error('Gainers not yet ready, please try again in a few moments.')
  }

  const gainers = []
  data.topGainers.forEach((item) => {
    gainers.push({
      id: item.id,
      name: data.coins[item.id].name,
      value: item.value,
    })
  })

  return res.send({
    data: gainers,
    lastUpdated: data.lastUpdated,
  })
}

const getLosers = (req, res) => {
  const { data } = req.app.locals

  if (!data.topLosers) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR)
    throw new Error('Losers not yet ready, please try again in a few moments.')
  }

  const losers = []
  data.topLosers.forEach((item) => {
    losers.push({
      id: item.id,
      name: data.coins[item.id].name,
      value: item.value,
    })
  })

  return res.send({
    data: losers,
    lastUpdated: data.lastUpdated,
  })
}

export { getWatchlist, getGainers, getLosers }
