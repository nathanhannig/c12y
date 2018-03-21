import axios from 'axios'

const baseURL = process.env.REACT_APP_API_URL

// const headers = new Headers()
// headers.append('Authorization', 'c12y')
// headers.append('Content-Type', 'application/json')

// const getHeaders = { method: 'GET', headers: headers }
// const postHeaders = { method: 'POST', headers: headers }
// const putHeaders = { method: 'PUT', headers: headers }
// const deleteHeaders = { method: 'DELETE', headers: headers }

function fetchWatchlist() {
  return axios.get(baseURL + '/watchlist')
}

export default {
  fetchWatchlist
}