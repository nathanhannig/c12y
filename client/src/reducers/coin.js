import { COIN_DETAILS_REQUEST, COIN_DETAILS_SUCCESS, COIN_DETAILS_FAIL } from '../constants/coin'

function coin(state = {}, action) {
  switch (action.type) {
    case COIN_DETAILS_REQUEST:
      return { loading: true }
    case COIN_DETAILS_SUCCESS:
      return { loading: false, ...action.payload }
    case COIN_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export default coin
