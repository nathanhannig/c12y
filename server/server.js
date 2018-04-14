/* eslint-disable no-console */

const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require('passport')
const cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios')
const moment = require('moment')
const util = require('util')
const fs = require('fs')
const keys = require('./config/keys')
require('./models/User')
require('./services/passport')

mongoose.connect(keys.mongoURI)

const app = express()

app.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000,
  keys: [keys.cookieKey],
}))
app.use(passport.initialize())
app.use(passport.session())

const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}
app.use(cors(corsOption))

// Rest API requirements
app.use(bodyParser.urlencoded({
  extended: true,
}))
app.use(bodyParser.json())

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

const writeFileAsync = util.promisify(fs.writeFile)
const readFileAsync = util.promisify(fs.readFile)

const data = {}
let baseImageUrl
let baseLinkUrl
let lastUpdated
let coinList
let watchList
let chunkCounter = 0
let newCoins = []

// Gets the details of a coins
const getCoinInfo = (id, item) => {
  const coinInfoUrl = `https://www.cryptocompare.com/api/data/coinsnapshotfullbyid/?id=${id}`

  return axios.get(coinInfoUrl)
    .then((response) => {
      // Regex used to strip empty tags, source must use WYSIWG
      const reBadSyntax = /<p>\s*[<strong>\s*</strong>]*<\/p>|<strong>\s*<\/strong>/gi
      const reRelativeURL = /"\//gi
      if (response.data.Data.General) {
        data.coins[item].Description = response.data.Data.General.Description
          .replace(reBadSyntax, '').replace(reRelativeURL, '"https://www.cryptocompare.com/')
        data.coins[item].Features = response.data.Data.General.Features
          .replace(reBadSyntax, '').replace(reRelativeURL, '"https://www.cryptocompare.com/')
        data.coins[item].Technology = response.data.Data.General.Technology
          .replace(reBadSyntax, '').replace(reRelativeURL, '"https://www.cryptocompare.com/')
        data.coins[item].WebsiteUrl = response.data.Data.General.WebsiteUrl
        data.coins[item].Twitter = response.data.Data.General.Twitter
        data.coins[item].StartDate = response.data.Data.General.StartDate
      }
    })
    .catch((response) => {
      console.error(response)
    })
}

// Gets the list of all coins
const getCoinList = () => {
  const coinListUrl = 'https://min-api.cryptocompare.com/data/all/coinlist'

  return axios.get(coinListUrl)
    .then((response) => {
      baseImageUrl = response.data.BaseImageUrl
      baseLinkUrl = response.data.BaseLinkUrl
      lastUpdated = moment().format('MMMM Do YYYY, h:mm:ss a')

      if (response.data.Data) {
        Object.keys(response.data.Data).forEach((item) => {
          if (data.coins[item]) {
            // Update existing coin
            if (data.coins[item].Name !== response.data.Data[item].Name) {
              data.coins[item].Name = response.data.Data[item].Name
            }
            if (data.coins[item].Symbol !== response.data.Data[item].Symbol) {
              data.coins[item].Symbol = response.data.Data[item].Symbol
            }
            if (data.coins[item].FullName !== response.data.Data[item].FullName) {
              data.coins[item].FullName = response.data.Data[item].FullName
            }
          } else {
            // Add new coin
            data.coins[item] = {}
            data.coins[item].Id = response.data.Data[item].Id
            data.coins[item].ImageUrl = response.data.Data[item].ImageUrl
            data.coins[item].Name = response.data.Data[item].Name
            data.coins[item].Symbol = response.data.Data[item].Symbol
            data.coins[item].CoinName = response.data.Data[item].CoinName
            data.coins[item].FullName = response.data.Data[item].FullName
            data.coins[item].Algorithm = response.data.Data[item].Algorithm
            data.coins[item].ProofType = response.data.Data[item].ProofType
            data.coins[item].FullyPremined = response.data.Data[item].FullyPremined
            data.coins[item].TotalCoinSupply = response.data.Data[item].TotalCoinSupply
            data.coins[item].PreMinedValue = response.data.Data[item].PreMinedValue
            data.coins[item].IsTrading = response.data.Data[item].IsTrading

            newCoins.push(item)
          }
        })
      }

      // Build the coinList
      coinList = Object.keys(data.coins).map(item => ({
        id: item,
        coinId: data.coins[item].Id,
        label: data.coins[item].FullName,
      }))

      // Build the watchlist
      const defaultWatchList = response.data.DefaultWatchlist.CoinIs.split(',')
      watchList = Object.keys(data.coins).map((item) => {
        if (defaultWatchList.includes(data.coins[item].Id)) {
          return {
            id: item,
            coinId: data.coins[item].Id,
            label: data.coins[item].FullName,
          }
        }

        return null
      }).filter(item =>
        // Filter out nulls that are present from the previous Map
        item)

      console.log(`${moment().format('MMMM Do YYYY, h:mm:ss a')} - Coin list processed`)

      if (newCoins.length > 0) {
        // coinList gets sorted, so we must create a clone
        // otherwise the order will be messed up
        let counterCoinInfo = 0

        const getCoinInfoTimer = setInterval(() => {
          const id = data.coins[newCoins[counterCoinInfo]].Id
          const sym = newCoins[counterCoinInfo]

          getCoinInfo(id, sym)

          counterCoinInfo += 1

          if (counterCoinInfo === newCoins.length) {
            clearInterval(getCoinInfoTimer)
            writeFileAsync('./json/coins.json', JSON.stringify(data.coins))
            console.log(`${moment().format('MMMM Do YYYY, h:mm:ss a')} - Coin info processed (${newCoins.length} new coins)`)
            newCoins = []
          }
        }, 25) // 45 calls per second
      } else {
        console.log(`${moment().format('MMMM Do YYYY, h:mm:ss a')} - Coin info processed (${newCoins.length} new coins)`)
      }
    })
    .catch((response) => {
      console.error(response)
    })
}

// Get the price of a chunk of coin
const getChunkPrices = (fsyms) => {
  const pricesUrl = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${fsyms.join()}&tsyms=USD`

  return axios.get(pricesUrl)
    .then((response) => {
      if (response.data.RAW) {
        Object.keys(response.data.RAW).forEach((item) => {
          if (response.data.RAW[item].USD) {
            data.prices[item] = {}
            data.prices[item].PRICE = response.data.RAW[item].USD.PRICE
            data.prices[item].SUPPLY = response.data.RAW[item].USD.SUPPLY
            data.prices[item].TOTALVOLUME24HTO = response.data.RAW[item].USD.TOTALVOLUME24HTO
            data.prices[item].OPEN24HOUR = response.data.RAW[item].USD.OPEN24HOUR
            data.prices[item].HIGH24HOUR = response.data.RAW[item].USD.HIGH24HOUR
            data.prices[item].LOW24HOUR = response.data.RAW[item].USD.LOW24HOUR
            data.prices[item].CHANGE24HOUR = response.data.RAW[item].USD.CHANGE24HOUR
            data.prices[item].CHANGEPCT24HOUR = response.data.RAW[item].USD.CHANGEPCT24HOUR
            data.prices[item].MKTCAP = response.data.RAW[item].USD.MKTCAP

            data.prices[item].lastUpdated = moment().format('MMMM Do YYYY, h:mm:ss a')
          }
        })
      }
    })
    .catch((response) => {
      console.error(response)
    })
}

const sortByMktCap = (list) => {
  const { prices } = data

  list.sort((a, b) => {
    let aMktCap = 0
    let bMktCap = 0

    if (prices[a.id]) {
      aMktCap = prices[a.id].MKTCAP
    }

    if (prices[b.id]) {
      bMktCap = prices[b.id].MKTCAP
    }

    return bMktCap - aMktCap
  })
}

const sortByVolume = (list) => { // eslint-disable-line
  const { prices } = data

  list.sort((a, b) => {
    let aVolume = 0
    let bVolume = 0

    if (prices[a.id]) {
      aVolume = prices[a.id].TOTALVOLUME24HTO
    }

    if (prices[b.id]) {
      bVolume = prices[b.id].TOTALVOLUME24HTO
    }

    return bVolume - aVolume
  })
}


// SETUP --
console.log(`${moment().format('MMMM Do YYYY, h:mm:ss a')} - Server setup starting`)

// Set a timer to update coin list
setInterval(() => {
  getCoinList()
}, 30 * 60 * 1000) // Calls every 30 minutes

// Get initial coin list
readFileAsync('./json/coins.json')
  .then((content) => {
    data.coins = JSON.parse(content)
  })
  .catch((err) => {
    data.coins = {}
    console.log(`${moment().format('MMMM Do YYYY, h:mm:ss a')} - No JSON file loaded`, err)
  })
  .then(() => {
    getCoinList()
      .then(() => {
        // TODO - Refactor getCoinList to handle getPriceTimer
        // setup and cancelling, remove from initial call.
        // This should handle updates to coin list

        // Set timer to update coin prices
        data.prices = {}

        setInterval(() => {
          const array = Object.keys(data.coins)
          const chunk = 50
          const fsyms = array.slice(chunkCounter, chunkCounter + chunk)


          if (chunkCounter + chunk < array.length) {
            getChunkPrices(fsyms)

            chunkCounter += chunk
          } else {
            getChunkPrices(fsyms).then(() => {
              // Provide a default sort once all coin prices loaded
              sortByMktCap(coinList)
              sortByMktCap(watchList)
              console.log(`${moment().format('MMMM Do YYYY, h:mm:ss a')} - Coin prices processed`)
            })

            chunkCounter = 0
          }
        }, 750) // Recieves all coin prices within ~30 seconds
      })
  })


// ROUTES --
app.get('/api/help', (req, res) => {
  res.sendFile(path.join(__dirname, '/views/index.html'))
})

app.get('/api/watchlist', (req, res) => {
  if (!data.coins) {
    res.status(500).send({ error: 'watch list not yet ready' })
    return
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

  res.send({
    coins,
    prices,
    watchList,
    coinList,
    baseImageUrl,
    baseLinkUrl,
    lastUpdated,
  })
})

app.get('/api/all/:page', (req, res) => {
  if (!data) {
    res.status(500).send({ error: 'coin list not yet ready' })
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

  res.send({
    coins,
    prices,
    coinList,
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
  const coin = req.params.coin.toUpperCase()

  if (!data) {
    res.status(500).send({ error: 'coin list not yet ready' })
  }

  if (data.coins
    && data.coins[coin]
    && data.prices
    && data.prices[coin]) {
    res.send({
      coin: data.coins[coin],
      price: data.prices[coin],
      baseImageUrl,
      baseLinkUrl,
      lastUpdated,
    })
  } else {
    res.status(404).send({ error: 'coin doesn\'t exist' })
  }
})

app.post('/email/contact', (req, res) => {
  console.log(req.body)

  res.send('Sent email')
})

require('./routes/authRoutes')(app)

const PORT = process.env.PORT || 3001
app.listen(PORT)
