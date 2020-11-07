// React
import React, { Component } from 'react'
import Navbar from 'react-bootstrap/lib/Navbar'
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
import { LinkContainer } from 'react-router-bootstrap'
import PropTypes from 'prop-types'

// Redux
import { connect } from 'react-redux'

// App
import styles from './index.module.scss'

class Header extends Component {
  renderLogin() {
    switch (this.props.auth) {
      case null:
        return ''
      case false:
        return (
          <Nav pullRight>
            <NavItem href="/auth/google" eventKey={1}>
              Sign in with <span className={styles.google}>Google</span>
            </NavItem>
          </Nav>
        )
      default:
        return (
          <Nav pullRight>
            <NavItem href="/auth/logout" eventKey={1}>
              Logout
            </NavItem>
          </Nav>
        )
    }
  }

  render() {
    return (
      <header className={styles.header}>
        <Navbar collapseOnSelect>
          <Navbar.Header>
            <LinkContainer to="/">
              <Navbar.Brand className={styles.logo}>
                <span className={styles.crypto}>c</span>
                <span className={styles.underline}>
                  <span className={styles.crypto}>rypto</span>
                  <span className={styles.currency}>currenc</span>
                </span>
                <span className={styles.currency}>y</span>
              </Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to="/coins">
                <NavItem eventKey={1} className={styles.link}>
                  Coins
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/exchanges">
                <NavItem eventKey={2} className={styles.link}>
                  Exchanges
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/wallets">
                <NavItem eventKey={3} className={styles.link}>
                  Wallets
                </NavItem>
              </LinkContainer>
            </Nav>

            {this.renderLogin()}
          </Navbar.Collapse>
        </Navbar>
      </header>
    )
  }
}

Header.propTypes = {
  auth: PropTypes.any,
}

Header.defaultProps = {
  auth: null,
}

function mapStateToProps({ auth }) {
  return { auth }
}

// React Router updates active class in Navbar outside Redux
// 'My views aren’t updating when something changes outside of Redux'
// https://github.com/reactjs/react-redux/blob/master/docs/troubleshooting.md
export default connect(mapStateToProps, null, null, {
  pure: false,
})(Header)
