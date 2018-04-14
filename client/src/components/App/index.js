// React
import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

// Redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { fetchUser } from '../../actions'

// App
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
      <BrowserRouter>
        <div className="App">
          <Header />
          <div className="Content">
            <Switch>
              <Route exact key="1" path="/coins" component={Coins} />
              <Route exact path="/coins/1" render={() => (<Redirect to="/coins" />)} />
              <Route path="/coins/:page" render={props => (<Coins key={props.match.params.page} {...props} />)} />
              <Route path="/about" component={About} />
              <Route path="/contact" component={Contact} />
              <Route path="/exchanges" component={Exchanges} />
              <Route path="/login" component={Login} />
              <Route path="/privacy" component={Privacy} />
              <Route path="/register" component={Register} />
              <Route path="/wallets" component={Wallets} />
              <Route path="/:coin" component={Overview} />
              <Route path="/" component={Main} />
            </Switch>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
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
