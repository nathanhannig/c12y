import path from 'path'
import express from 'express'

const router = express.Router()

router.get('/help', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'))
})


router.get('/watchlist', (req, res) => {
  const { data } = req.app.locals

  if (!data.coins || !data.watchList) {
    return res.status(500).send({ error: 'watch list not yet ready' })
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
    coinList: data.coinList,
    totalMarketCap: data.totalMarketCap,
    totalVolume24h: data.totalVolume24h,
    btcDominance: data.btcDominance,
    lastUpdated: data.lastUpdated,
  })
})

router.get('/all/:page', (req, res) => {
  const { data } = req.app.locals

  if (!data || !data.coinList) {
    return res.status(500).send({ error: 'coin list not yet ready' })
  }

  // Check that page is a number and greater than 0, else default it to 1
  const page = !Number.isNaN(Number(req.params.page)) && parseInt(req.params.page, 10) > 0
    ? parseInt(req.params.page, 10)
    : 1

  // Return 100 results
  const end = (page * 100) - 1
  const begin = end - 99
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
})

router.get('/coin/:coin', (req, res) => {
  const { data } = req.app.locals

  const coin = req.params.coin.toLowerCase()

  if (!data) {
    return res.status(500).send({ error: 'coin list not yet ready' })
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

  return res.status(404).send({ error: 'coin doesn\'t exist' })
})

router.get('/gainers', (req, res) => {
  const { data } = req.app.locals

  if (!data.topGainers) {
    return res.status(500).send({ error: 'gainers not yet ready' })
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
})

router.get('/losers', (req, res) => {
  const { data } = req.app.locals

  if (!data.topLosers) {
    return res.status(500).send({ error: 'losers not yet ready' })
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
})

export default router
