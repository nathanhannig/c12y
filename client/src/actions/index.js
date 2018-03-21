import API from '../utils'

export const FETCH_COINS = 'FETCH_COINS'

export function fetchCoins() {
  const request = API.fetchWatchlist()

  return (dispatch) => {
    request.then((response) => {
      dispatch({
        type: FETCH_COINS,
        payload: response.data
      })
    })
  }
}