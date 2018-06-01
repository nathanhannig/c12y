/* eslint-disable no-console */

require('dotenv').config()
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require('passport')
const cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios')
const moment = require('moment/min/moment.min')
const util = require('util')
const fs = require('fs')
const keys = require('./config/keys')
require('./models/User')
require('./models/Coins')
require('./services/passport')

console.log(`Server is running in ${process.env.NODE_ENV} mode`)

const app = express()

// Connect to database
mongoose.connect(keys.mongoURI)

// http://expressjs.com/en/starter/static-files.html
// Serves the help page CSS
app.use(express.static(path.join(__dirname, 'public')))

app.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000,
  keys: [keys.cookieKey],
}))
app.use(passport.initialize())
app.use(passport.session())

// Used to allow CORS
const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}
app.use(cors(corsOption))

// Used to parse POST form requests to req.body
app.use(bodyParser.urlencoded({
  extended: true,
}))
app.use(bodyParser.json())

const writeFileAsync = util.promisify(fs.writeFile)
const readFileAsync = util.promisify(fs.readFile)

app.locals.data = {}
const { data } = app.locals

// Gets the details of a coins
const getCoinInfo = async (id, item) => {
  const coinInfoUrl = `https://www.cryptocompare.com/api/data/coinsnapshotfullbyid/?id=${id}`

  try {
    const response = await axios.get(coinInfoUrl)

    // Regex used to strip empty tags, source must use WYSIWYG
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
  } catch (error) {
    console.error(error)
  }
}

// Gets the list of all coins
const getCoinList = async () => {
  const coinListUrl = 'https://min-api.cryptocompare.com/data/all/coinlist'

  try {
    const response = await axios.get(coinListUrl)

    if (response.data.Data) {
      const defaultWatchList = response.data.DefaultWatchlist.CoinIs.split(',')

      app.locals.baseImageUrl = response.data.BaseImageUrl
      app.locals.baseLinkUrl = response.data.BaseLinkUrl
      app.locals.lastUpdated = Date.now()

      const newCoins = Object.keys(response.data.Data).filter((item) => {
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

          return true
        }

        return false
      })

      // Build the coinList
      app.locals.coinList = Object.keys(data.coins).map(item => ({
        id: item,
        coinId: data.coins[item].Id,
        label: data.coins[item].FullName,
      }))

      // Build the watchlist
      app.locals.watchList = Object.keys(data.coins)
        .filter(item =>
          defaultWatchList.includes(data.coins[item].Id))
        .map(item => ({
          id: item,
          coinId: data.coins[item].Id,
          label: data.coins[item].FullName,
        }))

      console.log(`${moment().format('MMMM Do YYYY, h:mm:ss a')} - Coin list processed`)

      // Fetch coin information for new coins
      if (newCoins.length > 0) {
        let counterCoinInfo = 0

        const getCoinInfoTimer = setInterval(async () => {
          const id = data.coins[newCoins[counterCoinInfo]].Id
          const sym = newCoins[counterCoinInfo]

          getCoinInfo(id, sym)

          counterCoinInfo += 1

          if (counterCoinInfo === newCoins.length) {
            clearInterval(getCoinInfoTimer)
            await writeFileAsync('./json/coins.json', JSON.stringify(data.coins))
            console.log(`${moment().format('MMMM Do YYYY, h:mm:ss a')} - Coin info processed (${newCoins.length} new coins)`)
          }
        }, 25) // 45 calls per second
      } else {
        console.log(`${moment().format('MMMM Do YYYY, h:mm:ss a')} - Coin info processed (${newCoins.length} new coins)`)
      }
    }
  } catch (error) {
    console.error(error)
  }
}

// Get the price of a chunk of coin
const getPricesByChunk = async (fsyms) => {
  const pricesUrl = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${fsyms.join()}&tsyms=USD`

  try {
    const response = await axios.get(pricesUrl)

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
          data.prices[item].lastUpdated = Date.now()
        }
      })
    }
  } catch (error) {
    console.error(error)
  }
}

const sortByMktCap = (list) => {
  const { prices } = data

  list.sort((a, b) => {
    let aMktCap = 0
    let bMktCap = 0

    // API data is very inaccurate for small market coins so we attempt to filter
    // out small coins with the below filters, usually market cap is too high
    if (prices[a.id] &&
      prices[a.id].PRICE > 0 &&
      prices[a.id].TOTALVOLUME24HTO >= 1000000) {
      aMktCap = prices[a.id].MKTCAP
    }

    if (prices[b.id] &&
      prices[b.id].PRICE > 0 &&
      prices[b.id].TOTALVOLUME24HTO >= 1000000) {
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
const setup = async () => {
  console.log(`${moment().format('MMMM Do YYYY, h:mm:ss a')} - Server setup starting`)

  try {
    // Get initial coin list
    const content = await readFileAsync('./json/coins.json')
    data.coins = JSON.parse(content)
  } catch (error) {
    data.coins = {}
    console.log(`${moment().format('MMMM Do YYYY, h:mm:ss a')} - No JSON file loaded`, error)
  }

  await getCoinList()
  // Set a timer to update coin list
  setInterval(() => {
    getCoinList()
  }, 30 * 60 * 1000) // Calls every 30 minutes


  let chunkCounter = 0
  data.prices = {}

  // Set a timer to update coin prices
  setInterval(async () => {
    const chunk = Object.keys(data.coins)
    const chunkSize = 50
    const fsyms = chunk.slice(chunkCounter, chunkCounter + chunkSize)

    if (chunkCounter + chunkSize < chunk.length) {
      chunkCounter += chunkSize
      getPricesByChunk(fsyms)
    } else {
      chunkCounter = 0
      await getPricesByChunk(fsyms)

      // Provide a default sort once all coin prices loaded
      sortByMktCap(app.locals.coinList)
      sortByMktCap(app.locals.watchList)

      // Calculate total market cap
      // Only include top 100 coins due to inaccurate CryptoCompare API info
      // for small market coins
      app.locals.totalMarketCap = app.locals.coinList.slice(0, 100).reduce((acc, cur) => {
        if (data.prices[cur.id]) {
          return acc + data.prices[cur.id].MKTCAP
        }

        return acc
      }, 0)

      // Calculate total 24h volume
      // Only include top 100 coins due to inaccurate CryptoCompare API info
      // for small market coins
      app.locals.totalVolume24h = app.locals.coinList.slice(0, 100).reduce((acc, cur) => {
        if (data.prices[cur.id]) {
          return acc + data.prices[cur.id].TOTALVOLUME24HTO
        }

        return acc
      }, 0)

      // Calculate BTC Dominance
      app.locals.btcDominance = data.prices.BTC && data.prices.BTC.MKTCAP &&
        ((data.prices.BTC.MKTCAP / app.locals.totalMarketCap) * 100)

      console.log(`${moment().format('MMMM Do YYYY, h:mm:ss a')} - Coin prices processed`)
    }
  }, 750) // Receives all coin prices within ~30 seconds
}

// Run the setup
setup()


// ROUTES --
require('./routes/apiRoutes')(app)
require('./routes/authRoutes')(app)
require('./routes/emailRoutes')(app)
require('./routes/productionRoutes')(app)

const PORT = process.env.PORT || 3001
app.listen(PORT)
