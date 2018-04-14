import axios from 'axios'

// const headers = new Headers()
// headers.append('Authorization', 'c12y')
// headers.append('Content-Type', 'application/json')

// const getHeaders = { method: 'GET', headers: headers }
// const postHeaders = { method: 'POST', headers: headers }
// const putHeaders = { method: 'PUT', headers: headers }
// const deleteHeaders = { method: 'DELETE', headers: headers }

const fetchUser = () => axios.get('/api/current_user')

const fetchWatchlist = () => axios.get('/api/watchlist')

const fetchCoinlist = page => axios.get(`/api/all/${page}`)

const fetchCoin = coin => axios.get(`/api/coin/${coin}`)

// Format large numbers with commas at every thousandth decimal spot
const formatNumberToString = value =>
  value.replace(/./g, (match, offset, string) => (offset && match !== '.' && (string.length - offset) % 3 === 0
    ? `,${match}`
    : match))

const formatToDollars = value =>
  `$ ${formatNumberToString(parseFloat(value).toFixed(2))}`

const formatToPercent = value =>
  `${formatNumberToString(parseFloat(value).toFixed(2))} %`

const formatToWholeNumber = value =>
  formatNumberToString(parseFloat(value).toFixed(0))

export default {
  fetchUser,
  fetchWatchlist,
  fetchCoinlist,
  fetchCoin,
  formatNumberToString,
  formatToDollars,
  formatToWholeNumber,
  formatToPercent,
}
