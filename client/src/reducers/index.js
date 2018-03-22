// Redux
import { combineReducers } from 'redux'
// import { reducer as formReducer } from 'redux-form'
import coins from './coins'
import coin from './coin'

export default combineReducers({
  coins,
  coin,
  // form: formReducer
})