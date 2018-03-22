// React
import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

// Redux
import { Provider } from 'react-redux'
import store from '../../store'

// App
import About from '../About'
import Coins from '../Coins'
import Contact from '../Contact'
import Details from '../Details'
import Header from '../Header'
import Login from '../Login'
import Footer from '../Footer'
import Main from '../Main'
import Privacy from '../Privacy'
import Register from '../Register'
import './index.css'

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <Header />
            <Switch>
              <Route path="/about" component={About} />
              <Route path="/coins" component={Coins} />
              <Route path="/contact" component={Contact} />
              <Route path="/login" component={Login} />
              <Route path="/privacy" component={Privacy} />
              <Route path="/register" component={Register} />
              <Route path="/:coin" component={Details} />
              <Route path="/" component={Main} />
            </Switch>
            <Footer />
          </div>
        </BrowserRouter>
      </Provider>
    )
  }
}

export default App