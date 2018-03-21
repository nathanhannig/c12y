// Redux
import { combineReducers } from 'redux'
// import { reducer as formReducer } from 'redux-form'
import coins from './coins'

export default combineReducers({
  coins,
  // form: formReducer
})