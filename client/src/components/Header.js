// React
import React from 'react'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'

// App
import './Header.css'

const Header = () => {
  return (
    <header>
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">c12y - Cryptocurrency Info</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} href="#">
              Coins
            </NavItem>
            <NavItem eventKey={2} href="#">
              About
            </NavItem>
            <NavDropdown eventKey={3} title="Social" id="basic-nav-dropdown">
              <MenuItem eventKey={3.1}>Facebook</MenuItem>
              <MenuItem eventKey={3.2}>Twitter</MenuItem>
              <MenuItem eventKey={3.3}>Instagram</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={3.3}>Contact Us</MenuItem>
            </NavDropdown>
          </Nav>
          <Nav pullRight>
            <NavItem eventKey={1} href="#">
              Login
            </NavItem>
            <NavItem eventKey={2} href="#">
              Sign Up
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  )
}

export default Header