import { COIN_GAINERS_REQUEST, COIN_GAINERS_SUCCESS, COIN_GAINERS_FAIL } from '../constants/coin'

function gainers(state = {}, action) {
  switch (action.type) {
    case COIN_GAINERS_REQUEST:
      return { loading: true }
    case COIN_GAINERS_SUCCESS:
      return { loading: false, ...action.payload }
    case COIN_GAINERS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export default gainers
