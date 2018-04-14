import { COIN_FETCH } from '../actions'

function coin(state = {}, action) {
  switch (action.type) {
    case COIN_FETCH:
      return action.payload
    default:
      return state
  }
}

export default coin
