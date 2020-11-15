// React
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { unregister } from './registerServiceWorker'

// Redux
import store from './store'

// App
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.module.scss'
import App from './components/App'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)

// https://github.com/ReactTraining/react-router/issues/5520
// registerServiceWorker() breaks direct calls to API in production
unregister()
