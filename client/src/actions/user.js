import axios from 'axios'
import { LOGIN_USER, USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, USER_DETAILS_FAIL } from '../constants/user'

export const fetchUser = () => async (dispatch) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST })

    const response = await axios.get('/auth/me')

    dispatch({
      type: USER_DETAILS_SUCCESS,
      payload: response.data,
    })
  } catch (error) {
    dispatch({
      type: USER_DETAILS_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    })
  }
}

export const loginUser = (user) => (dispatch) => {
  dispatch({
    type: LOGIN_USER,
    payload: user,
  })
}
