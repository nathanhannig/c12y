// React
import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

// Redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { fetchUser } from '../../actions'

// App
import withTracker from '../../pages/withTracker'
import ScrollToTop from '../../pages/ScrollToTop'
import About from '../../pages/About'
import Coins from '../../pages/Coins'
import Contact from '../../pages/Contact'
import Exchanges from '../../pages/Exchanges'
import Header from '../../pages/Header'
import Footer from '../../pages/Footer'
import Main from '../../pages/Main'
import Overview from '../../pages/Overview'
import Privacy from '../../pages/Privacy'
import Wallets from '../../pages/Wallets'
import './index.module.scss'

// wrapping/composing
const withTrackerWrapper = (Page) => {
  const Wrapper = withTracker(Page)
  // eslint-disable-next-line react/display-name, react/jsx-props-no-spreading
  return (props) => <Wrapper {...props} />
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
                <Route exact path="/coins" render={(props) => withTrackerWrapper(Coins)({ ...props, key: 1 })} />
                <Route exact path="/coins/1" render={() => <Redirect to="/coins" />} />
                <Route
                  path="/coins/:page"
                  render={(props) => withTrackerWrapper(Coins)({ ...props, key: props.match.params.coin })}
                />
                <Route path="/about" component={withTracker(About)} />
                <Route path="/contact" component={withTracker(Contact)} />
                <Route path="/exchanges" component={withTracker(Exchanges)} />
                <Route path="/privacy" component={withTracker(Privacy)} />
                <Route path="/wallets" component={withTracker(Wallets)} />
                <Route
                  path="/:coin"
                  render={(props) => withTrackerWrapper(Overview)({ ...props, key: props.match.params.coin })}
                />
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

export default connect(null, mapDispatchToProps)(App)
