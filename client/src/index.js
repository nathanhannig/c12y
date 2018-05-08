// React
import React from 'react'
import ReactDOM from 'react-dom'
import { unregister } from './registerServiceWorker'

// Redux
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import reducer from './reducers/'

// App
import App from './components/App'
import './index.css'

// https://github.com/zalmoxisus/redux-devtools-extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose // eslint-disable-line

const history = createHistory()

const store = createStore(
  reducer,
  composeEnhancers(applyMiddleware(
    // middleware for intercepting thunks
    ReduxThunk,
    // middleware for intercepting and dispatching navigation actions
    routerMiddleware(history),
  )),
)

ReactDOM.render(
  (
    <Provider store={store}>
      <App history={history} />
    </Provider>
  ),
  document.getElementById('root'),
)

// https://github.com/ReactTraining/react-router/issues/5520
// registerServiceWorker() breaks direct calls to API in production
unregister()
