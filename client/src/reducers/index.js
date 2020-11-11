// Redux
import { combineReducers } from 'redux'

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
})
