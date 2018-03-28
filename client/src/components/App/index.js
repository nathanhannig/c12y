// React
import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

// Redux
import { Provider } from 'react-redux'
import store from '../../store'

// App
import About from '../About'
import Coins from '../Coins'
import Contact from '../Contact'
import Overview from '../Overview'
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
              <Route exact key="1" path="/coins" component={Coins} />
              <Route exact path="/coins/1" render={() => (<Redirect to="/coins" />)} />
              <Route path="/coins/:page" render={(props) => (<Coins key={props.match.params.page} {...props} />)} />
              <Route path="/contact" component={Contact} />
              <Route path="/login" component={Login} />
              <Route path="/privacy" component={Privacy} />
              <Route path="/register" component={Register} />
              <Route path="/:coin" component={Overview} />
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