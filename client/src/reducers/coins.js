import { COINS_FETCH } from '../actions'

function coins(state = {}, action) {
  switch (action.type) {
    case COINS_FETCH:
      return action.payload
    default:
      return state
  }
}

export default coins
