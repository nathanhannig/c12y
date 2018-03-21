import { FETCH_COINS } from '../actions'

function coins(state = { loading: true, coins: {} }, action) {
  let loading, coins

  switch (action.type) {
    case FETCH_COINS:
      loading = false
      coins = action.payload

      return { ...state, loading, coins }
    default:
      return state
  }
}

export default coins