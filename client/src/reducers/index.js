// Redux
import { combineReducers } from 'redux'
// import { reducer as formReducer } from 'redux-form'
import auth from './auth'
import coins from './coins'
import coin from './coin'

export default combineReducers({
  auth,
  coins,
  coin,
  // form: formReducer
})
