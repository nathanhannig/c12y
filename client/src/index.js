// React
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { unregister } from './registerServiceWorker'

// Redux
import store from './store'

// App
import App from './components/App'
import './index.css'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

// https://github.com/ReactTraining/react-router/issues/5520
// registerServiceWorker() breaks direct calls to API in production
unregister()
