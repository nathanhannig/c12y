import { COIN_LIST_REQUEST, COIN_LIST_SUCCESS, COIN_LIST_FAIL } from '../constants/coin'

function coins(state = {}, action) {
  switch (action.type) {
    case COIN_LIST_REQUEST:
      return { loading: true }
    case COIN_LIST_SUCCESS:
      return { loading: false, ...action.payload }
    case COIN_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export default coins
