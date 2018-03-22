// React
import React from 'react'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import { LinkContainer  } from 'react-router-bootstrap'

// App
import './index.css'

const Header = () => (
  <header>
    <Navbar collapseOnSelect>
      <Navbar.Header>
        <LinkContainer to="/">
          <Navbar.Brand>
            c12y - Cryptocurrency Info
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <LinkContainer to="/coins/1">
            <NavItem eventKey={1}>Coins</NavItem>
          </LinkContainer>
          <LinkContainer to="/about">
            <NavItem eventKey={2}>About</NavItem>
          </LinkContainer>
          <NavDropdown eventKey={3} title="Social" id="basic-nav-dropdown">
            <MenuItem eventKey={3.1} href="http://www.facebook.com">Facebook</MenuItem>
            <MenuItem eventKey={3.2} href="http://www.twitter.com">Twitter</MenuItem>
            <MenuItem eventKey={3.3} href="http://www.instagram.com">Instagram</MenuItem>
            <MenuItem divider />
            <LinkContainer to="/contact">
              <MenuItem eventKey={3.3}>Contact Us</MenuItem>
            </LinkContainer>
          </NavDropdown>
        </Nav>
        <Nav pullRight>
          <LinkContainer to="/login">
            <NavItem eventKey={1}>Login </NavItem>
          </LinkContainer>
          <LinkContainer to="/register">
            <NavItem eventKey={2}>Sign Up</NavItem>
          </LinkContainer>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  </header>
)

export default Header