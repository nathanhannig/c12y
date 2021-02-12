// React
import React from 'react'
import { Container, Navbar, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

// Redux
import { useSelector } from 'react-redux'

// App
import styles from './index.module.scss'

const Header = () => {
  const auth = useSelector((state) => state.auth)

  const renderLogin = () => {
    if (!auth || auth.loading) {
      return ''
    }

    switch (auth.data?.isLoggedIn) {
      case true:
        return (
          <Nav className="justify-content-end">
            <Nav.Item className={styles.link}>
              <a href="/auth/logout">Logout</a>
            </Nav.Item>
          </Nav>
        )
      default:
        return (
          <Nav className="justify-content-end">
            <LinkContainer to="/login">
              <Nav.Item className={styles.link}>Login</Nav.Item>
            </LinkContainer>
          </Nav>
        )
    }
  }

  return (
    <header className={styles.header}>
      <Navbar bg="light" expand="lg" collapseOnSelect>
        <Container>
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
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <LinkContainer to="/coins">
                <Nav.Item className={styles.link}>Coins</Nav.Item>
              </LinkContainer>
              <LinkContainer to="/exchanges">
                <Nav.Item className={styles.link}>Exchanges</Nav.Item>
              </LinkContainer>
              <LinkContainer to="/wallets">
                <Nav.Item className={styles.link}>Wallets</Nav.Item>
              </LinkContainer>
            </Nav>
            {renderLogin()}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
