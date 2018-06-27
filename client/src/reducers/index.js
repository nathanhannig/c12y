// Redux
import { combineReducers } from 'redux'
// import { reducer as formReducer } from 'redux-form'
import auth from './auth'
import coins from './coins'
import coin from './coin'
import gainers from './gainers'
import losers from './losers'

export default combineReducers({
  auth,
  coins,
  coin,
  gainers,
  losers,
  // form: formReducer
})
