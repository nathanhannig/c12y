import { LOSERS_FETCH } from '../actions'

function losers(state = {}, action) {
  switch (action.type) {
    case LOSERS_FETCH:
      return action.payload
    default:
      return state
  }
}

export default losers
