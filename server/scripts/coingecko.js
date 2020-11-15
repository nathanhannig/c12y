/* eslint no-param-reassign: ["error", {
  "props": true,
  "ignorePropertyModificationsFor": ["app"]
}] */

import CoinGecko from 'coingecko-api'
import logger from 'loglevel'
import format from 'date-fns/format/index.js'
import util from 'util'
import fs from 'fs'
import Coin from '../models/Coin.js'

const writeFileAsync = util.promisify(fs.writeFile)
const readFileAsync = util.promisify(fs.readFile)
const CoinGeckoClient = new CoinGecko()

// Gets the details of a coins
const getCoinInfo = async (app, id) => {
  const { data } = app.locals

  try {
    logger.info(`${format(new Date())} - Getting coin info for ${id}`)

    const response = await CoinGeckoClient.coins.fetch(
      id,
      {
        market_data: true,
        localization: false,
        developer_data: false,
        community_data: false,
        tickers: false,
        sparkline: false,
      },
    )

    // Regex used to strip empty tags, source must use WYSIWYG
    const reBadSyntax = /<p>\s*[<strong>\s*</strong>]*<\/p>|<strong>\s*<\/strong>/gi
    const reRelativeURL = /"\//gi

    if (response.data) {
      data.coins[id].image = {
        thumb: response.data.image.thumb,
        small: response.data.image.small,
        large: response.data.image.large,
      }
      data.coins[id].description = response.data.description?.en
        .replace(reBadSyntax, '').replace(reRelativeURL, '"https://www.coingecko.com/')
      data.coins[id].facebook = response.data.links?.facebook_username
      data.coins[id].twitter = response.data.links?.twitter_screen_name
      data.coins[id].startDate = response.data.genesis_date

      // ESLint hates destructuring directly into the object property, so this is the work around
      const [websiteUrl] = response.data.links?.homepage
      data.coins[id].websiteUrl = websiteUrl

      data.coins[id].algorithm = response.data.hashing_algorithm
      data.coins[id].categories = response.data.categories
      data.coins[id].lastUpdated = response.data.last_updated
    }
  } catch (error) {
    logger.error(`${format(new Date())} - ${error}`)
  }
}

// Gets the list of all coins
const getCoinList = async (app) => {
  const { data } = app.locals

  try {
    const response = await CoinGeckoClient.coins.list()

    if (response.data) {
      data.lastUpdated = Date.now()

      const newCoins = response.data.filter((item) => {
        if (data.coins[item.id] && data.coins[item.id].lastUpdated) {
          // Update existing coin
          if (data.coins[item.id].symbol !== item.symbol
            || data.coins[item.id].name !== item.name) {
            data.coins[item.id].symbol = item.symbol
            data.coins[item.id].mame = item.name

            Coin.findOneAndUpdate(
              { id: item.id },
              {
                id: item.id,
                name: item.name,
                symbol: item.symbol,
              },
              // callback function
              (error) => {
                if (error) { logger.error(`${format(new Date())} - ${error}`) }
              },
            )
          }
        } else {
          // Add new coin
          data.coins[item.id] = {}
          data.coins[item.id].id = item.id
          data.coins[item.id].name = item.name
          data.coins[item.id].symbol = item.symbol

          // Create coin through Upsert
          Coin.findOneAndUpdate(
            { id: item.id },
            {
              id: item.id,
              name: item.name,
              symbol: item.symbol,
            },
            { upsert: true },
            // callback function
            (error) => {
              if (error) { logger.error(`${format(new Date())} - ${error}`) }
            },
          )

          return true
        }

        return false
      })

      // Build the coin list
      data.list = Object.keys(data.coins).map(item => ({
        id: item,
        label: data.coins[item].name,
      }))

      const defaultWatchList = [
        'bitcoin',
        'ethereum',
        'litecoin',
        'ripple',
        'bitcoin-cash',
        'monero',
        'dash',
        'ethereum-classic',
        'zcash',
        'waves',
      ]

      // Build the watch list
      data.watchList = Object.keys(data.coins)
        .filter(item => defaultWatchList.includes(data.coins[item].id))
        .map(item => ({
          id: item,
          label: data.coins[item].name,
        }))

      // Fetch coin information for new coins
      if (newCoins.length > 0) {
        let counterCoinInfo = 0

        const getCoinInfoTimer = setInterval(async () => {
          const { id } = data.coins[newCoins[counterCoinInfo].id]

          await getCoinInfo(app, id)

          counterCoinInfo += 1

          if (counterCoinInfo === newCoins.length) {
            clearInterval(getCoinInfoTimer)
            await writeFileAsync('./data/coins.json', JSON.stringify(data.coins, null, 2))
            logger.info(`${format(new Date())} - Coin info processed (${newCoins.length} new coins)`)
          }
        }, 2 * 1000) // 2 call per second
      } else {
        logger.info(`${format(new Date())} - Coin info processed (${newCoins.length} new coins)`)
      }
    }
  } catch (error) {
    logger.error(`${format(new Date())} - ${error}`)
  }
}

// Get the price of a chunk of coin
const getPricesByChunk = async (page, limit) => {
  const prices = {}

  try {
    const response = await CoinGeckoClient.coins.all({
      per_page: limit,
      page,
      localization: false,
      sparkline: false,
    })

    if (response.data) {
      response.data.forEach((item) => {
        prices[item.id] = {}
        prices[item.id].price = item.market_data?.current_price?.usd
        prices[item.id].volume_24h = item.market_data?.total_volume?.usd
        prices[item.id].volume_high_24h = item.market_data?.high_24h?.usd
        prices[item.id].volume_low_24h = item.market_data?.low_24h?.usd
        prices[item.id].change_24h = item.market_data?.price_change_24h
        prices[item.id].change_percentage_1h = item.market_data?.price_change_percentage_1h_in_currency?.usd
        prices[item.id].change_percentage_24h = item.market_data?.price_change_percentage_24h_in_currency?.usd
        prices[item.id].change_percentage_7d = item.market_data?.price_change_percentage_7d_in_currency?.usd
        prices[item.id].change_percentage_14d = item.market_data?.price_change_percentage_14d_in_currency?.usd
        prices[item.id].change_percentage_30d = item.market_data?.price_change_percentage_30d_in_currency?.usd
        prices[item.id].change_percentage_60d = item.market_data?.price_change_percentage_60d_in_currency?.usd
        prices[item.id].change_percentage_200d = item.market_data?.price_change_percentage_200d_in_currency?.usd
        prices[item.id].change_percentage_1y = item.market_data?.price_change_percentage_1y_in_currency?.usd
        prices[item.id].market_cap = item.market_data?.market_cap?.usd
        prices[item.id].market_cap_rank = item.market_data?.market_cap_rank
        prices[item.id].total_supply = item.market_data?.total_supply
        prices[item.id].circulating_supply = item.market_data?.circulating_supply
        prices[item.id].lastUpdated = item.last_updated
      })
    }
  } catch (error) {
    logger.error(`${format(new Date())} - ${error}`)
  }

  return prices
}

const sortByMktCap = (app, list) => {
  const { prices } = app.locals.data

  const sortedList = [...list].sort((a, b) => {
    let aValue = 0
    let bValue = 0

    // API data is very inaccurate for small market coins so we attempt to filter
    // out small coins with the below filters, usually market cap is too high
    if (prices[a.id]?.price > 0
      && prices[a.id]?.volume_24h >= 10000
      && prices[a.id]?.market_cap) {
      aValue = prices[a.id].market_cap
    }

    if (prices[b.id]?.price > 0
      && prices[b.id]?.volume_24h >= 10000
      && prices[b.id]?.market_cap) {
      bValue = prices[b.id].market_cap
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

    if (prices[a.id]?.price > 0
      && prices[a.id]?.volume_24h >= 100000
      && prices[a.id]?.change_percentage_24h) {
      aValue = prices[a.id].change_percentage_24h
    }

    if (prices[b.id]?.price > 0
      && prices[b.id]?.volume_24h >= 100000
      && prices[b.id]?.change_percentage_24h) {
      bValue = prices[b.id].change_percentage_24h
    }

    return bValue - aValue
  })

  const top5 = gainers.slice(0, 5)

  return top5.map(item => ({
    id: item.id,
    name: item.name,
    value: prices[item.id]?.change_percentage_24h,
  }))
}

const topLosers = (app, list) => {
  const { prices } = app.locals.data

  const losers = [...list].sort((a, b) => {
    let aValue = 0
    let bValue = 0

    if (prices[a.id]?.price > 0
      && prices[a.id]?.volume_24h >= 100000
      && prices[a.id]?.change_percentage_24h) {
      aValue = prices[a.id].change_percentage_24h
    }

    if (prices[b.id]?.price > 0
      && prices[b.id]?.volume_24h >= 100000
      && prices[b.id]?.change_percentage_24h) {
      bValue = prices[b.id].change_percentage_24h
    }

    return aValue - bValue
  })

  const top5 = losers.slice(0, 5)

  return top5.map(item => ({
    id: item.id,
    name: item.name,
    value: prices[item.id]?.change_percentage_24h,
  }))
}

const calculateTotalMarketCap = (app, list) => {
  const { prices } = app.locals.data

  // Only include top 100 coins due to inaccurate API info
  // for small market coins
  const totalMarketCap = list.slice(0, 100).reduce((acc, cur) => {
    if (prices[cur.id]?.market_cap) {
      return acc + prices[cur.id].market_cap
    }

    return acc
  }, 0)

  return totalMarketCap
}

const calculateTotal24hVolume = (app, list) => {
  const { prices } = app.locals.data

  // Only include top 500 coins due to inaccuracies for small market coins
  const total24hVolume = list.slice(0, 500).reduce((acc, cur) => {
    if (prices[cur.id]?.volume_24h) {
      return acc + prices[cur.id].volume_24h
    }

    return acc
  }, 0)

  return total24hVolume
}

const calculateBTCDominance = (app) => {
  const { data } = app.locals

  return ((data.prices?.bitcoin?.market_cap / data.totalMarketCap) * 100)
}

const setup = async (app) => {
  // initialize the object we will be storing all data
  app.locals.data = {}
  const { data } = app.locals
  logger.info(`${format(new Date())} - Server setup starting`)

  try {
    // Load initial coin list
    const content = await readFileAsync('./data/coins.json')
    data.coins = JSON.parse(content)
  } catch (error) {
    data.coins = {}
    logger.warn(`${format(new Date())} - No JSON file loaded`, error)
  }

  await getCoinList(app)

  // Set a timer to update coin list
  setInterval(async () => {
    await getCoinList(app)
  }, 3 * 60 * 60 * 1000) // Calls every 3 hours

  let chunkCounter = 0
  let page = 1

  // Set a timer to update coin prices
  setInterval(async () => {
    logger.info(`${format(new Date())} - Fetching coin prices for page ${page}`)

    const chunk = Object.keys(data.coins)
    const chunkSize = 250

    if (chunkCounter + chunkSize < chunk.length) {
      chunkCounter += chunkSize
      page += 1
      data.prices = { ...data.prices, ...await getPricesByChunk(page, chunkSize) }
    } else {
      chunkCounter = 0
      page = 1
      data.prices = { ...data.prices, ...await getPricesByChunk(page, chunkSize) }
      // await writeFileAsync('./data/prices.json', JSON.stringify(data.prices, null, 2))

      // Provide a default sort after all coin prices obtained
      data.list = sortByMktCap(app, data.list)
      data.watchList = sortByMktCap(app, data.watchList)

      // Find top 5 Gainers / Losers
      data.topGainers = topGainers(app, data.list)
      data.topLosers = topLosers(app, data.list)

      // Calculate Total Market Cap
      data.totalMarketCap = calculateTotalMarketCap(app, data.list)

      // Calculate Total 24h Volume
      data.totalVolume24h = calculateTotal24hVolume(app, data.list)

      // Calculate BTC Dominance
      data.btcDominance = calculateBTCDominance(app)

      data.lastUpdated = Date.now()
    }
  }, 2 * 1000)
}

export default setup
