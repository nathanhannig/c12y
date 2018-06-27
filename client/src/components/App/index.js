// React
import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

// Redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { fetchUser } from '../../actions'

// App
import withTracker from '../withTracker'
import ScrollToTop from '../ScrollToTop'
import About from '../About'
import Coins from '../Coins'
import Contact from '../Contact'
import Exchanges from '../Exchanges'
import Header from '../Header'
import Login from '../Login'
import Footer from '../Footer'
import Main from '../Main'
import Overview from '../Overview'
import Privacy from '../Privacy'
import Register from '../Register'
import Wallets from '../Wallets'
import './index.css'

// wrapping/composing
const withTrackerWrapper = (Page) => {
  const Wrapper = withTracker(Page)
  return props => <Wrapper {...props} />
}

class App extends Component {
  componentDidMount() {
    this.props.fetchUser()
  }

  render() {
    return (
      <Router>
        <ScrollToTop>
          <div className="App">
            <Header />
            <div className="Content">
              <Switch>
                <Route exact path="/coins" render={props => withTrackerWrapper(Coins)({ ...props, key: 1 })} />
                <Route exact path="/coins/1" render={() => (<Redirect to="/coins" />)} />
                <Route path="/coins/:page" render={props => withTrackerWrapper(Coins)({ ...props, key: props.match.params.coin })} />
                <Route path="/about" component={withTracker(About)} />
                <Route path="/contact" component={withTracker(Contact)} />
                <Route path="/exchanges" component={withTracker(Exchanges)} />
                <Route path="/login" component={withTracker(Login)} />
                <Route path="/privacy" component={withTracker(Privacy)} />
                <Route path="/register" component={withTracker(Register)} />
                <Route path="/wallets" component={withTracker(Wallets)} />
                <Route path="/:coin" render={props => withTrackerWrapper(Overview)({ ...props, key: props.match.params.coin })} />
                <Route path="/" component={withTracker(Main)} />
              </Switch>
            </div>
            <Footer />
          </div>
        </ScrollToTop>
      </Router>
    )
  }
}

App.propTypes = {
  fetchUser: PropTypes.func.isRequired,
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUser: bindActionCreators(fetchUser, dispatch),
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(App)
