/* eslint no-param-reassign: ["error", {
  "props": true,
  "ignorePropertyModificationsFor": ["app"]
}] */
/* eslint-disable no-console */

const axios = require('axios')
const format = require('date-fns/format')
const util = require('util')
const fs = require('fs')
const mongoose = require('mongoose')
require('../models/Coin')

const Coin = mongoose.model('coins')
const writeFileAsync = util.promisify(fs.writeFile)
const readFileAsync = util.promisify(fs.readFile)

// Gets the details of a coins
const getCoinInfo = async (app, id, item) => {
  const { data } = app.locals

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
        .replace('-', '')
      data.coins[item].Twitter = response.data.Data.General.Twitter
      data.coins[item].StartDate = response.data.Data.General.StartDate
    }
  } catch (error) {
    console.error(error)
  }
}

// Gets the list of all coins
const getCoinList = async (app) => {
  const { data } = app.locals

  const coinListUrl = 'https://min-api.cryptocompare.com/data/all/coinlist'
  const defaultWatchList = [
    '1182', // BTC
    '7605', // ETH
    '3808', // LTC
    '5031', // XRP
    '202330', // BCH
    '5038', // XMR
    '3807', // DASH
    '5324', // ETC
    '24854', // ZEC
    '20131', // WAVES
  ]

  try {
    const response = await axios.get(coinListUrl)

    if (response.data.Data) {
      data.baseImageUrl = response.data.BaseImageUrl
      data.baseLinkUrl = response.data.BaseLinkUrl
      data.lastUpdated = Date.now()

      const newCoins = Object.keys(response.data.Data).filter((item) => {
        if (data.coins[item]) {
          // Update existing coin
          if (data.coins[item].Id !== response.data.Data[item].Id ||
            data.coins[item].Name !== response.data.Data[item].Name ||
            data.coins[item].Symbol !== response.data.Data[item].Symbol ||
            data.coins[item].FullName !== response.data.Data[item].FullName) {
            data.coins[item].Id = response.data.Data[item].Id
            data.coins[item].Name = response.data.Data[item].Name
            data.coins[item].Symbol = response.data.Data[item].Symbol
            data.coins[item].FullName = response.data.Data[item].FullName

            Coin.findOneAndUpdate(
              { symbol: item },
              {
                id: data.coins[item].Id,
                name: data.coins[item].CoinName,
                symbol: data.coins[item].Symbol,
              },
              // callback function
              (err) => {
                if (err) { console.error(err) }
              },
            )
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

          // Create coin, Add to database
          new Coin({
            id: data.coins[item].Id,
            name: data.coins[item].CoinName,
            symbol: data.coins[item].Symbol,
          }).save()

          return true
        }

        return false
      })

      // Build the coin list
      data.coinList = Object.keys(data.coins).map(item => ({
        id: item,
        coinId: data.coins[item].Id,
        label: data.coins[item].FullName,
      }))

      // Build the watch list
      data.watchList = Object.keys(data.coins)
        .filter(item =>
          defaultWatchList.includes(data.coins[item].Id))
        .map(item => ({
          id: item,
          coinId: data.coins[item].Id,
          label: data.coins[item].FullName,
        }))

      // Fetch coin information for new coins
      if (newCoins.length > 0) {
        let counterCoinInfo = 0

        const getCoinInfoTimer = setInterval(async () => {
          const id = data.coins[newCoins[counterCoinInfo]].Id
          const sym = newCoins[counterCoinInfo]

          getCoinInfo(app, id, sym)

          counterCoinInfo += 1

          if (counterCoinInfo === newCoins.length) {
            clearInterval(getCoinInfoTimer)
            await writeFileAsync('./json/coins.json', JSON.stringify(data.coins, null, 2))
            console.log(`${format(new Date())} - Coin info processed (${newCoins.length} new coins)`)
          }
        }, 25) // 45 calls per second
      } else {
        console.log(`${format(new Date())} - Coin info processed (${newCoins.length} new coins)`)
      }
    }
  } catch (error) {
    console.error(error)
  }
}

// Get the price of a chunk of coin
const getPricesByChunk = async (app, fsyms) => {
  const { data } = app.locals

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

const sortByMktCap = (app, list) => {
  const { data } = app.locals
  const { prices } = data
  const sortedList = [...list]

  sortedList.sort((a, b) => {
    let aValue = 0
    let bValue = 0

    // API data is very inaccurate for small market coins so we attempt to filter
    // out small coins with the below filters, usually market cap is too high
    if (prices[a.id] &&
      prices[a.id].PRICE > 0 &&
      prices[a.id].TOTALVOLUME24HTO >= 10000) {
      aValue = prices[a.id].MKTCAP
    }

    if (prices[b.id] &&
      prices[b.id].PRICE > 0 &&
      prices[b.id].TOTALVOLUME24HTO >= 10000) {
      bValue = prices[b.id].MKTCAP
    }

    return bValue - aValue
  })

  return sortedList
}


const topGainers = (app, list) => {
  const { prices } = app.locals.data
  const gainers = [...list]

  gainers.sort((a, b) => {
    let aValue = 0
    let bValue = 0

    if (prices[a.id] &&
      prices[a.id].PRICE > 0 &&
      prices[a.id].TOTALVOLUME24HTO >= 10000) {
      aValue = prices[a.id].CHANGEPCT24HOUR
    }

    if (prices[b.id] &&
      prices[b.id].PRICE > 0 &&
      prices[b.id].TOTALVOLUME24HTO >= 10000) {
      bValue = prices[b.id].CHANGEPCT24HOUR
    }

    return bValue - aValue
  })

  const top5 = gainers.slice(0, 5)

  return top5.map(item => ({
    name: item.id,
    value: prices[item.id].CHANGEPCT24HOUR,
  }))
}

const topLosers = (app, list) => {
  const { prices } = app.locals.data
  const losers = [...list]

  losers.sort((a, b) => {
    let aValue = 0
    let bValue = 0

    if (prices[a.id] &&
      prices[a.id].PRICE > 0 &&
      prices[a.id].TOTALVOLUME24HTO >= 10000) {
      aValue = prices[a.id].CHANGEPCT24HOUR
    }

    if (prices[b.id] &&
      prices[b.id].PRICE > 0 &&
      prices[b.id].TOTALVOLUME24HTO >= 10000) {
      bValue = prices[b.id].CHANGEPCT24HOUR
    }

    return aValue - bValue
  })

  const top5 = losers.slice(0, 5)

  return top5.map(item => ({
    name: item.id,
    value: prices[item.id].CHANGEPCT24HOUR,
  }))
}

const calculateTotalMarketCap = (app, list) => {
  const { data } = app.locals

  // Only include top 100 coins due to inaccurate CryptoCompare API info
  // for small market coins
  const totalMarketCap = list.slice(0, 100).reduce((acc, cur) => {
    if (data.prices[cur.id]) {
      return acc + data.prices[cur.id].MKTCAP
    }

    return acc
  }, 0)

  return totalMarketCap
}

const calculateTotal24hVolume = (app, list) => {
  const { data } = app.locals

  // Only include top 100 coins due to inaccurate CryptoCompare API info
  // for small market coins
  const total24hVolume = list.slice(0, 100).reduce((acc, cur) => {
    if (data.prices[cur.id]) {
      return acc + data.prices[cur.id].TOTALVOLUME24HTO
    }

    return acc
  }, 0)

  return total24hVolume
}

const calculateBTCDominance = (app) => {
  const { data } = app.locals

  return data.prices.BTC
    && data.prices.BTC.MKTCAP
    && ((data.prices.BTC.MKTCAP / data.totalMarketCap) * 100)
}

module.exports = (app) => {
  // initialize the object we will be storing all data
  app.locals.data = {}

  const setup = async () => {
    const { data } = app.locals
    console.log(`${format(new Date())} - Server setup starting`)

    try {
      // Get initial coin list
      const content = await readFileAsync('./json/coins.json')
      data.coins = JSON.parse(content)
    } catch (error) {
      data.coins = {}
      console.log(`${format(new Date())} - No JSON file loaded`, error)
    }

    await getCoinList(app)

    // Set a timer to update coin list
    setInterval(() => {
      getCoinList(app)
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
        getPricesByChunk(app, fsyms)
      } else {
        chunkCounter = 0
        await getPricesByChunk(app, fsyms)

        // Provide a default sort after all coin prices obtained
        data.coinList = sortByMktCap(app, data.coinList)
        data.watchList = sortByMktCap(app, data.watchList)

        // Find top 5 Gainers / Losers
        data.topGainers = topGainers(app, data.coinList)
        data.topLosers = topLosers(app, data.coinList)

        // Calculate Total Market Cap
        data.totalMarketCap = calculateTotalMarketCap(app, data.coinList)

        // Calculate Total 24h Volume
        data.totalVolume24h = calculateTotal24hVolume(app, data.coinList)

        // Calculate BTC Dominance
        data.btcDominance = calculateBTCDominance(app)
      }
    }, 1000)
  }

  return {
    setup,
  }
}
