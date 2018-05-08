// React
import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

// Redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { fetchUser } from '../../actions'

// App
import withTracker from '../withTracker'
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

class App extends Component {
  componentDidMount() {
    this.props.fetchUser()
  }

  render() {
    return (
      <ConnectedRouter history={this.props.history}>
        <div className="App">
          <Header />
          <div className="Content">
            <Switch>
              <Route exact key="1" path="/coins" component={withTracker(Coins)} />
              <Route exact path="/coins/1" render={() => (<Redirect to="/coins" />)} />
              <Route path="/coins/:page" render={props => (<withTracker><Coins key={props.match.params.page} {...props} /></withTracker>)} />
              <Route path="/about" component={withTracker(About)} />
              <Route path="/contact" component={withTracker(Contact)} />
              <Route path="/exchanges" component={withTracker(Exchanges)} />
              <Route path="/login" component={withTracker(Login)} />
              <Route path="/privacy" component={withTracker(Privacy)} />
              <Route path="/register" component={withTracker(Register)} />
              <Route path="/wallets" component={withTracker(Wallets)} />
              <Route path="/:coin" component={withTracker(Overview)} />
              <Route path="/" component={withTracker(Main)} />
            </Switch>
          </div>
          <Footer />
        </div>
      </ConnectedRouter>
    )
  }
}

App.propTypes = {
  fetchUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
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
