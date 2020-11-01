// React
import React, { Component } from 'react'
// import { Navbar, Nav, NavItem } from 'react-bootstrap'
import Navbar from 'react-bootstrap/lib/Navbar'
import Nav from 'react-bootstrap/lib/Nav'
import NavItem from 'react-bootstrap/lib/NavItem'
import { LinkContainer } from 'react-router-bootstrap'
import PropTypes from 'prop-types'

// Redux
import { connect } from 'react-redux'

// App
import './index.css'

class Header extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return ''
      case false:
        return (
          <Nav pullRight>
            <NavItem href="/auth/google" eventKey={1}>
              Login with <span style={{ fontWeight: 'bold' }}>Google</span>
            </NavItem>
          </Nav>
        )
      default:
        return (
          <Nav pullRight>
            <NavItem href="/api/logout" eventKey={1}>
              Logout
            </NavItem>
          </Nav>
        )
    }
  }

  render() {
    return (
      <header>
        <Navbar collapseOnSelect>
          <Navbar.Header>
            <LinkContainer to="/">
              <Navbar.Brand>
                <span className="crypto">c</span>
                <span className="underline">
                  <span className="crypto">rypto</span>
                  <span className="currency">currenc</span>
                </span>
                <span className="currency">y</span>
              </Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to="/coins">
                <NavItem eventKey={1}>Coins</NavItem>
              </LinkContainer>
              <LinkContainer to="/exchanges">
                <NavItem eventKey={2}>Exchanges</NavItem>
              </LinkContainer>
              <LinkContainer to="/wallets">
                <NavItem eventKey={3}>Wallets</NavItem>
              </LinkContainer>
            </Nav>

            {this.renderContent()}
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
