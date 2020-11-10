import axios from 'axios'

export const USER_FETCH = 'USER_FETCH'
export const COINS_FETCH = 'COINS_FETCH'
export const COIN_FETCH = 'COIN_FETCH'
export const GAINERS_FETCH = 'GAINERS_FETCH'
export const LOSERS_FETCH = 'LOSERS_FETCH'

export const fetchUser = () => async (dispatch) => {
  const response = await axios.get('/auth/current_user')

  dispatch({
    type: USER_FETCH,
    payload: response.data,
  })
}

export const fetchCoins = (page) => async (dispatch) => {
  let response

  if (page) {
    response = await axios.get(`/api/coins?page=${page}`)
  } else {
    response = await axios.get('/api/lists/watchlist')
  }

  dispatch({
    type: COINS_FETCH,
    payload: response.data,
  })
}

export const fetchCoin = (coin) => async (dispatch) => {
  const response = await axios.get(`/api/coins/${coin}`)

  dispatch({
    type: COIN_FETCH,
    payload: response.data,
  })
}

export const fetchGainers = () => async (dispatch) => {
  const response = await axios.get('/api/lists/gainers')

  dispatch({
    type: GAINERS_FETCH,
    payload: response.data,
  })
}

export const fetchLosers = () => async (dispatch) => {
  const response = await axios.get('/api/lists/losers')

  dispatch({
    type: LOSERS_FETCH,
    payload: response.data,
  })
}
