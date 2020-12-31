// React
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

// Redux
import { useDispatch } from 'react-redux'
import { fetchUser } from '../../actions'

// App
import Header from '../Header'
import Footer from '../Footer'
import withTracker from '../withTracker'
import ScrollToTop from '../ScrollToTop'
import About from '../../pages/About'
import Coins from '../../pages/Coins'
import Contact from '../../pages/Contact'
import Exchanges from '../../pages/Exchanges'
import Home from '../../pages/Home'
import Login from '../../pages/Login'
import Overview from '../../pages/Overview'
import Privacy from '../../pages/Privacy'
import Register from '../../pages/Register'
import Wallets from '../../pages/Wallets'
import './index.module.scss'

// wrapping/composing
const withTrackerWrapper = (Page) => {
  const Wrapper = withTracker(Page)
  // eslint-disable-next-line react/display-name, react/jsx-props-no-spreading
  return (props) => <Wrapper {...props} />
}

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  return (
    <Router>
      <ScrollToTop>
        <div className="App">
          <Header />
          <div className="Content">
            <Switch>
              <Route exact path="/coins" render={(props) => withTrackerWrapper(Coins)({ ...props, key: 1 })} />
              <Route exact path="/coins/1" render={() => <Redirect to="/coins" />} />
              <Route
                path="/coins/:page"
                render={(props) => withTrackerWrapper(Coins)({ ...props, key: props.match.params.coin })}
              />
              <Route path="/about" component={withTracker(About)} />
              <Route path="/contact" component={withTracker(Contact)} />
              <Route path="/exchanges" component={withTracker(Exchanges)} />
              <Route path="/login" component={withTracker(Login)} />
              <Route path="/privacy" component={withTracker(Privacy)} />
              <Route path="/register" component={withTracker(Register)} />
              <Route path="/wallets" component={withTracker(Wallets)} />
              <Route
                path="/:coin"
                render={(props) => withTrackerWrapper(Overview)({ ...props, key: props.match.params.coin })}
              />
              <Route path="/" component={withTracker(Home)} />
            </Switch>
          </div>
          <Footer />
        </div>
      </ScrollToTop>
    </Router>
  )
}

export default App
