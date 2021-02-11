import { COIN_TOTALS_REQUEST, COIN_TOTALS_SUCCESS, COIN_TOTALS_FAIL } from '../constants/coin'

function totals(state = {}, action) {
  switch (action.type) {
    case COIN_TOTALS_REQUEST:
      return { loading: true }
    case COIN_TOTALS_SUCCESS:
      return { loading: false, ...action.payload }
    case COIN_TOTALS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export default totals
