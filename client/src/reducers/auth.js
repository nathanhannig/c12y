import { USER_FETCH } from '../actions'

function auth(state = null, action) {
  switch (action.type) {
    case USER_FETCH:
      return action.payload || false
    default:
      return state
  }
}

export default auth
