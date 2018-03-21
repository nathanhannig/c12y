// React
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import registerServiceWorker from './registerServiceWorker'

// Redux
import { Provider } from 'react-redux'
import store from './store'

// App
import Header from './components/Header'
import Footer from './components/Footer'
import App from './components/App'
import Details from './components/Details'
import './index.css'

ReactDOM.render((
  <Provider store={store}>
    <div>
      <Header />
      <BrowserRouter>
        <Switch>
          <Route path="/:coin" component={Details} />
          <Route path="/" component={App} />
        </Switch>
      </BrowserRouter>
      <Footer />
    </div>
  </Provider>
), document.getElementById('root'))

registerServiceWorker()
