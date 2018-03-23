const express = require('express')
const cors = require('cors')
const path = require('path');
const bodyParser = require('body-parser')
const axios = require('axios')
const moment = require('moment')

const app = express()

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

      data['watchList'] = {}
      data['watchList']['coins'] = {}
      data['watchList']['defaultWatchlist'] = response['data']['DefaultWatchlist']['CoinIs']

      baseImageUrl = response['data']['BaseImageUrl']
      baseLinkUrl = response['data']['BaseLinkUrl']
      lastUpdated = moment().format('MMMM Do YYYY, h:mm:ss a')

      coinList = Object.keys(data['coinList']['coins'])
      watchList = response['data']['DefaultWatchlist']['CoinIs'].split(',')
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
      data['coinList']['coins'][fsym]['price'] = response['data']
      data['coinList']['coins'][fsym]['price']['lastUpdated'] = moment().format('MMMM Do YYYY, h:mm:ss a')

      if (watchList.includes(data['coinList']['coins'][fsym]['Id'])) {
        data['watchList']['coins'][fsym] = data['coinList']['coins'][fsym]
      }

    })
    .catch((response) => {
      console.log(response)
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
    if (data['coinList']['coins'][fsym]['IsTrading']) {
      getPrices(fsym)
    }

    // Set next coin to perform price check on
    if (priceCounter === Object.keys(data['coinList']['coins']).length - 1) {
      priceCounter = 0
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

  if (!data['watchList']) {
    res.status(500).send({ error: 'watch list not yet ready' })
  }

  res.send({
    coins: data['watchList']['coins'],
    defaultWatchlist: data['watchList']['defaultWatchlist'],
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

  for (let i = begin; i <= end; i++) {
    coins[coinList[i]] = data['coinList']['coins'][coinList[i]]
  }

  res.send({
    coins,
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

app.listen(3001)