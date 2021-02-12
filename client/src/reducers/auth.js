import { LOGIN_USER, USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, USER_DETAILS_FAIL } from '../constants/user'

function auth(state = null, action) {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return { loading: true }
    case LOGIN_USER:
    case USER_DETAILS_SUCCESS:
      return action.payload ? { loading: false, ...action.payload } : false
    case USER_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export default auth
