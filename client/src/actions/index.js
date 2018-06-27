import API from '../utils'

export const USER_FETCH = 'USER_FETCH'
export const COINS_FETCH = 'COINS_FETCH'
export const COIN_FETCH = 'COIN_FETCH'
export const GAINERS_FETCH = 'GAINERS_FETCH'
export const LOSERS_FETCH = 'LOSERS_FETCH'

export const fetchUser = () => async (dispatch) => {
  const response = await API.fetchUser()

  dispatch({
    type: USER_FETCH,
    payload: response.data,
  })
}

export const fetchCoins = page => async (dispatch) => {
  let response

  if (page) {
    response = await API.fetchCoinlist(page)
  } else {
    response = await API.fetchWatchlist()
  }

  dispatch({
    type: COINS_FETCH,
    payload: response.data,
  })
}

export const fetchCoin = coin => async (dispatch) => {
  const response = await API.fetchCoin(coin)

  dispatch({
    type: COIN_FETCH,
    payload: response.data,
  })
}

export const fetchGainers = () => async (dispatch) => {
  const response = await API.fetchGainers()

  dispatch({
    type: GAINERS_FETCH,
    payload: response.data,
  })
}

export const fetchLosers = () => async (dispatch) => {
  const response = await API.fetchLosers()

  dispatch({
    type: LOSERS_FETCH,
    payload: response.data,
  })
}
