import { GAINERS_FETCH } from '../actions'

function gainers(state = {}, action) {
  switch (action.type) {
    case GAINERS_FETCH:
      return action.payload
    default:
      return state
  }
}

export default gainers
