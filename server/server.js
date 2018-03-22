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

//rest API requirements
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

// Gets the list of all coins
function getCoinList() {
  const coinListUrl = 'https://min-api.cryptocompare.com/data/all/coinlist'

  return axios.get(coinListUrl)
    .then(function (response) {
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
    .catch(function (response) {
      console.error(response)
    })
}

// Get the price of a coin
function getPrices(fsym) {
  let pricesUrl = 'https://min-api.cryptocompare.com/data/pricemultifull?fsyms=' + fsym + '&tsyms=BTC,USD,EUR'

  return axios.get(pricesUrl)
    .then(function (response) {
      data['coinList']['coins'][fsym]['price'] = response['data']
      data['coinList']['coins'][fsym]['price']['lastUpdated'] = moment().format('MMMM Do YYYY, h:mm:ss a')

      if (watchList.includes(data['coinList']['coins'][fsym]['Id'])) {
        data['watchList']['coins'][fsym] = data['coinList']['coins'][fsym]
      }

    })
    .catch(function (response) {
      console.log(response)
    })
}

// ROUTES

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'));
})

app.get('/watchlist', function (req, res) {

  res.send({
    coins: data['watchList']['coins'],
    defaultWatchlist: data['watchList']['defaultWatchlist'],
    baseImageUrl,
    baseLinkUrl,
    lastUpdated
  })
})

app.get('/all/:page', function (req, res) {
  // Check that page is a number and greater than 0, else default it to 1
  const page = !isNaN(req.params.page) && parseInt(req.params.page) > 0
    ? parseInt(req.params.page)
    : 1

  // Return 100 results
  const end = (page * 100) - 1
  const begin = end - 99

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
    end
  })
})

app.get('/coin/:coin', function (req, res) {
  const coin = req.params.coin.toUpperCase()

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
  } else if (data['coinList']
    && data['coinList']["coins"]) {

    res.status(404).send({ error: 'coin doesn\'t exist' })
  } else {

    res.status(500).send({ error: 'coin list not yet ready' })
  }

})

app.listen(3001)