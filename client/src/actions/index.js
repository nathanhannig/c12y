import API from '../utils'

export const COINS_FETCH = 'COINS_FETCH'

export const COIN_FETCH = 'COIN_FETCH'

export function fetchCoins(page) {
  let request

  if (page) {
    request = API.fetchCoinlist(page)
  } else {
    request = API.fetchWatchlist()
  }

  return (dispatch) => {
    return request.then((response) => {
      dispatch({
        type: COINS_FETCH,
        payload: response.data
      })
    })
  }
}

export function fetchCoin(coin) {
  const request = API.fetchCoin(coin)

  return (dispatch) => {
    return request.then((response) => {
      dispatch({
        type: COIN_FETCH,
        payload: response.data
      })
    })
  }
}