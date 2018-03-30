const path = require('path');
const express = require('express')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require('passport')
const cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios')
const moment = require('moment')
const keys = require('./config/keys')
require('./models/User')
require('./services/passport')

mongoose.connect(keys.mongoURI)

const app = express()

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
)
app.use(passport.initialize())
app.use(passport.session())

let corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}
app.use(cors(corsOption))

// Rest API requirements
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

let data = {}

let baseImageUrl
let baseLinkUrl
let lastUpdated
let coinList
let watchList
let priceCounter = 0
let fsym

// Gets the list of all coins
const getCoinList = () => {
  const coinListUrl = 'https://min-api.cryptocompare.com/data/all/coinlist'

  return axios.get(coinListUrl)
    .then((response) => {
      data['coinList'] = {}
      data['coinList']['coins'] = response['data']['Data']

      baseImageUrl = response['data']['BaseImageUrl']
      baseLinkUrl = response['data']['BaseLinkUrl']
      lastUpdated = moment().format('MMMM Do YYYY, h:mm:ss a')

      coinList = Object.keys(data['coinList']['coins']).map((item) => {
        return { id: item, label: response['data']['Data'][item]["FullName"] }
      })

      const defaultWatchList = response['data']['DefaultWatchlist']['CoinIs'].split(',')

      data['watchList'] = {}
      data['watchList']['coins'] = {}

      watchList = Object.keys(data['coinList']['coins']).map((item) => {
        if (defaultWatchList.includes(data['coinList']['coins'][item]['Id'])) {
          data['watchList']['coins'][item] = data['coinList']['coins'][item]

          return { id: item, label: response['data']['Data'][item]["FullName"] }
        }
      }).filter((item) => {
        // Filter out nulls that are present from the previous Map
        return item
      })
    })
    .catch((response) => {
      console.error(response)
    })
}

// Get the price of a coin
const getPrices = (fsym) => {
  let pricesUrl = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=' + fsym + '&tsyms=BTC,USD,EUR'

  return axios.get(pricesUrl)
    .then((response) => {
      if (response['data']['RAW']
        && response['data']['RAW'][fsym]['USD']) {
        data['coinList']['coins'][fsym]['price'] = { USD: {} }
        data['coinList']['coins'][fsym]['price']['USD'] = response['data']['RAW'][fsym]['USD']
        data['coinList']['coins'][fsym]['price']['lastUpdated'] = moment().format('MMMM Do YYYY, h:mm:ss a')
      }

    })
    .catch((response) => {
      console.log(response)
    })
}

const sortByMktCap = (list) => {

  const coins = data['coinList']['coins']

  list.sort((a, b) => {
    let aMktCap = 0
    let bMktCap = 0

    if (coins[a.id].price
      && coins[a.id].price.USD) {

      aMktCap = coins[a.id].price.USD.MKTCAP
    }

    if (coins[b.id].price
      && coins[b.id].price.USD) {

      bMktCap = coins[b.id].price.USD.MKTCAP
    }

    return bMktCap - aMktCap
  })
}

const sortByVolume = (list) => {

  const coins = data['coinList']['coins']

  list.sort((a, b) => {
    let aVolume = 0
    let bVolume = 0

    if (coins[a.id].price
      && coins[a.id].price.USD) {

      aVolume = coins[a.id].price.USD.TOTALVOLUME24HTO
    }

    if (coins[b.id].price
      && coins[b.id].price.USD) {

      bVolume = coins[b.id].price.USD.TOTALVOLUME24HTO
    }

    return bVolume - aVolume
  })
}
// SETUP

// Set a timer to update coin list
const getCoinListTimer = setInterval(() => {
  getCoinList()
}, 30 * 60 * 1000); // Calls every 30 minutes

// Get initial coin list
getCoinList().then(() => {
  // TODO - Refactor getCoinList to handle getPriceTimer
  // setup and cancelling, remove from initial call.
  // This should handle updates to coin list

  // Set timer to update coin prices
  const getPricesTimer = setInterval(() => {
    fsym = Object.keys(data['coinList']['coins'])[priceCounter]

    // Check if coin is trading, if not then skip getting price
    // since it will only return an error
    if (data['coinList']['coins'][fsym]
      && data['coinList']['coins'][fsym]['IsTrading']) {
      getPrices(fsym)
    }

    // Set next coin to perform price check on
    if (priceCounter === Object.keys(data['coinList']['coins']).length - 1) {
      priceCounter = 0

      // Provide a default sort
      sortByMktCap(coinList)
      sortByMktCap(watchList)
    } else {
      priceCounter++
    }
  }, 25); // Calls 45 times per second
})

// ROUTES

app.get('/', (req, res) => {

  res.sendFile(path.join(__dirname, '/views/index.html'));
})

app.get('/watchlist', (req, res) => {

  if (!data['watchList'] || !data['coinList']
    || !data['watchList']['coins'] || !data['coinList']['coins']) {
    res.status(500).send({ error: 'watch list not yet ready' })
    return
  }

  // Build watchlist
  let coins = {}
  watchList.map((item) => {
    coins[item.id] = data['coinList']['coins'][item.id]
  })

  res.send({
    coins,
    watchList,
    coinList,
    baseImageUrl,
    baseLinkUrl,
    lastUpdated
  })
})

app.get('/all/:page', (req, res) => {

  if (!data['coinList']) {
    res.status(500).send({ error: 'coin list not yet ready' })
  }

  // Check that page is a number and greater than 0, else default it to 1
  const page = !isNaN(req.params.page) && parseInt(req.params.page) > 0
    ? parseInt(req.params.page)
    : 1

  // Return 100 results
  const end = (page * 100) - 1
  const begin = end - 99
  const total = coinList.length

  const coins = {}

  for (let i = begin; i <= end && i < total; i++) {
    coins[coinList[i]["id"]] = data['coinList']['coins'][coinList[i]["id"]]
  }

  res.send({
    coins,
    coinList,
    baseImageUrl,
    baseLinkUrl,
    lastUpdated,
    page,
    begin,
    end,
    total
  })
})

app.get('/coin/:coin', (req, res) => {
  const coin = req.params.coin.toUpperCase()

  if (!data['coinList']) {
    res.status(500).send({ error: 'coin list not yet ready' })
  }

  if (data['coinList']
    && data['coinList']["coins"][coin]) {

    res.send(
      {
        coin: data['coinList']["coins"][coin],
        baseImageUrl,
        baseLinkUrl,
        lastUpdated
      }
    )
  } else {

    res.status(404).send({ error: 'coin doesn\'t exist' })
  }
})

require('./routes/authRoutes')(app)

const PORT = process.env.PORT || 3001
app.listen(PORT)