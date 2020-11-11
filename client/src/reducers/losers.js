import { COIN_LOSERS_REQUEST, COIN_LOSERS_SUCCESS, COIN_LOSERS_FAIL } from '../constants/coin'

function losers(state = {}, action) {
  switch (action.type) {
    case COIN_LOSERS_REQUEST:
      return { loading: true }
    case COIN_LOSERS_SUCCESS:
      return { loading: false, ...action.payload }
    case COIN_LOSERS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export default losers
