// React
import React, { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import axios from 'axios'

// App
import styles from './index.module.scss'

const renderList = (wallets) => {
  const html = wallets.map((item, i) => (
    <Row key={item.name} className={`${styles.list} vertical-align`}>
      <Col className={styles.counter} xs={12} md={1}>
        {i + 1}
      </Col>
      <Col className={styles.name} xs={12} md={2}>
        <a href={item.link}>{item.name}</a>
      </Col>
      <Col className={styles.description} xs={12} md={9}>
        {item.description}
      </Col>
    </Row>
  ))

  html.unshift(
    <Row key="header" className={`${styles.header} vertical-align`}>
      <Col xs={12} md={1}>
        #
      </Col>
      <Col xs={12} md={2}>
        Name
      </Col>
      <Col xs={12} md={9}>
        Description
      </Col>
    </Row>
  )

  return html
}

const Wallets = () => {
  const [loading, setLoading] = useState(true)
  const [wallets, setWallets] = useState([])

  useEffect(() => {
    async function fetchWallets() {
      const result = await axios('/api/wallets')

      setWallets(result.data.data)
      setLoading(false)
    }

    fetchWallets()
  }, [])

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Wallets | c12y.com</title>
        <link rel="canonical" href="https://c12y.com/wallets" />
        <meta name="description" content="List of the best cryptocurrency wallets." />
      </Helmet>
      <Container>
        <Row>
          <Col xs={12}>
            <h3 className="mt-4 mb-2">Wallets</h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <p>
              Wallets are a software program that stores private and public keys and interacts with various blockchain
              to allow users to send and receive cryptocurrencies and view their balance. If you want to use
              cryptocurrency, you will need to have a digital wallet to store your cryptocurrency off of exchange
              websites.
            </p>
          </Col>
        </Row>
        {loading ? <div className="loader" /> : renderList(wallets)}
      </Container>
    </div>
  )
}

export default Wallets
