// React
import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

// Redux
import { Provider } from 'react-redux'
import store from '../store'

// App
import About from './About'
import Contact from './Contact'
import Details from './Details'
import Header from './Header'
import Footer from './Footer'
import Main from './Main'
import Privacy from './Privacy'
import './App.css'

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <Header />
            <Switch>
              <Route path="/about" component={About} />
              <Route path="/contact" component={Contact} />
              <Route path="/privacy" component={Privacy} />
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