// React
import React, { useState, useEffect } from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import { Helmet } from 'react-helmet'
import axios from 'axios'

// App
import styles from './index.module.scss'

const renderList = (exchanges) => {
  const html = exchanges.map((item, i) => (
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

const Exchanges = () => {
  const [loading, setLoading] = useState(true)
  const [exchanges, setExchanges] = useState([])

  useEffect(() => {
    async function fetchExchanges() {
      const result = await axios('/api/exchanges')

      setExchanges(result.data)
      setLoading(false)
    }

    fetchExchanges()
  }, [])

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Exchanges - c12y.com</title>
        <link rel="canonical" href="https://c12y.com/exchanges" />
        <meta name="description" content="List of the best cryptocurrency exchanges. - c12y.com." />
      </Helmet>
      <Grid>
        <Row>
          <Col xs={12}>
            <h3>Exchanges</h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <p>
              Exchanges are websites that allow users to buy, sell, and trade cryptocurrencies for other assets, such as
              conventional fiat money, or different digital currencies. Below is a list of different cryptocurrecy
              exchanges that may be available for you to use.
            </p>
          </Col>
        </Row>
        {loading ? <div className="loader" /> : renderList(exchanges)}
      </Grid>
    </div>
  )
}

export default Exchanges
