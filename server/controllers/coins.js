import httpStatus from 'http-status'

const getCoins = (req, res) => {
  const { data } = req.app.locals

  if (!data?.coins) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR)
    throw new Error('Coin list not yet ready, please try again in a few moments.')
  }

  // Check that page is a number and greater than 0, else default it to 1
  const page =
    !Number.isNaN(Number(req.query.page)) && parseInt(req.query.page, 10) > 0 ? parseInt(req.query.page, 10) : 1
  const limit = 100
  const end = page * limit - 1
  const begin = end - (limit - 1)
  const total = Object.keys(data.coins).length

  const coinsList = Object.values(data.coins).map(({ id, name }) => ({ id, label: name }))
  const coins = {}

  for (let i = begin; i <= end && i < total; i += 1) {
    coins[coinsList[i].id] = data.coins[coinsList[i].id]

    if (data.prices?.[coinsList[i].id]) {
      coins[coinsList[i].id].prices = data.prices[coinsList[i].id]
    }
  }

  return res.send({
    data: coins,
    list: coinsList,
    lastUpdated: data.lastUpdated,
    page,
    begin,
    end,
    total,
  })
}

const getCoinById = (req, res) => {
  const { data } = req.app.locals

  const name = req.params.coin.toLowerCase()

  if (!data?.coins) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR)
    throw new Error('Coin list not yet ready, please try again in a few moments.')
  }

  if (data.coins?.[name]) {
    const coin = { ...data.coins[name] }

    if (data.prices?.[name]) {
      coin.prices = data.prices?.[name]
    }

    return res.send({
      data: coin,
    })
  }

  res.status(httpStatus.NOT_FOUND)
  throw new Error('Coin not found.')
}

export { getCoins, getCoinById }
