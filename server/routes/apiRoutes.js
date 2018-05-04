const path = require('path')

module.exports = (app) => {
  app.get('/api/help', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'))
  })

  app.get('/api/watchlist', (req, res) => {
    const {
      data,
      watchList,
      coinList,
      totalMarketCap,
      totalVolume24h,
      baseImageUrl,
      baseLinkUrl,
      lastUpdated,
    } = app.locals

    if (!data.coins || !watchList) {
      return res.status(500).send({ error: 'watch list not yet ready' })
    }

    // Build watchlist
    const coins = {}
    const prices = {}

    watchList.map((item) => {
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
      watchList,
      coinList,
      totalMarketCap,
      totalVolume24h,
      baseImageUrl,
      baseLinkUrl,
      lastUpdated,
    })
  })

  app.get('/api/all/:page', (req, res) => {
    const {
      data,
      coinList,
      totalMarketCap,
      totalVolume24h,
      baseImageUrl,
      baseLinkUrl,
      lastUpdated,
    } = app.locals

    if (!data || !coinList) {
      return res.status(500).send({ error: 'coin list not yet ready' })
    }

    // Check that page is a number and greater than 0, else default it to 1
    const page = !Number.isNaN(req.params.page) && parseInt(req.params.page, 10) > 0
      ? parseInt(req.params.page, 10)
      : 1

    // Return 100 results
    const end = (page * 100) - 1
    const begin = end - 99
    const total = coinList.length

    const coins = {}
    const prices = {}
    for (let i = begin; i <= end && i < total; i += 1) {
      coins[coinList[i].id] = data.coins[coinList[i].id]

      if (data.prices
        && data.prices[coinList[i].id]) {
        prices[coinList[i].id] = data.prices[coinList[i].id]
      }
    }

    return res.send({
      coins,
      prices,
      coinList,
      totalMarketCap,
      totalVolume24h,
      baseImageUrl,
      baseLinkUrl,
      lastUpdated,
      page,
      begin,
      end,
      total,
    })
  })

  app.get('/api/coin/:coin', (req, res) => {
    const {
      data,
      baseImageUrl,
      baseLinkUrl,
      lastUpdated,
    } = app.locals

    const coin = req.params.coin.toUpperCase()

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
        baseImageUrl,
        baseLinkUrl,
        lastUpdated,
      })
    }

    return res.status(404).send({ error: 'coin doesn\'t exist' })
  })
}
