import axios from 'axios'
import numeral from 'numeral'

// const headers = new Headers()
// headers.append('Authorization', 'c12y')
// headers.append('Content-Type', 'application/json')

// const getHeaders = { method: 'GET', headers: headers }
// const postHeaders = { method: 'POST', headers: headers }
// const putHeaders = { method: 'PUT', headers: headers }
// const deleteHeaders = { method: 'DELETE', headers: headers }

const fetchUser = () => axios.get('/auth/current_user')

const fetchWatchlist = () => axios.get('/api/watchlist')

const fetchCoinlist = (page) => axios.get(`/api/all/${page}`)

const fetchCoin = (coin) => axios.get(`/api/coin/${coin}`)

const fetchGainers = () => axios.get('/api/gainers')

const fetchLosers = () => axios.get('/api/losers')

const formatDollars = (value) => {
  if (value >= 0.01 || value <= -0.01 || value === 0) {
    return numeral(value).format('$0,0.00')
  }

  return numeral(value).format('$0.0000000000')
}

const formatDollarsWholeNumber = (value) => numeral(value).format('$0,0')

const formatPercent = (value) => numeral(value / 100).format('0,0.00%')

const formatWholeNumber = (value) => numeral(value).format('0,0')

export default {
  fetchUser,
  fetchWatchlist,
  fetchCoinlist,
  fetchCoin,
  fetchGainers,
  fetchLosers,
  formatDollars,
  formatDollarsWholeNumber,
  formatWholeNumber,
  formatPercent,
}
