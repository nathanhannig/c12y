// React
import React from 'react'
// import { Grid, Row, Col } from 'react-bootstrap'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import { Helmet } from 'react-helmet';

// App
import exchangeList from './data.json'
import './index.css'

const renderList = () => {
  const html = exchangeList.map((item, i) => (
    <Row key={item.name} className="list vertical-align">
      <Col className="counter" xs={12} md={1}>
        {i + 1}
      </Col>
      <Col className="name" xs={12} md={2}>
        <a href={item.link}>{item.name}</a>
      </Col>
      <Col className="description" xs={12} md={9}>
        {item.description}
      </Col>
    </Row>
  ))

  html.unshift((
    <Row key="header" className="header vertical-align">
      <Col xs={12} md={1}>#</Col>
      <Col xs={12} md={2}>Name</Col>
      <Col xs={12} md={9}>Description</Col>
    </Row>
  ))

  return html
}

const Exchanges = () => (
  <div className="Exchanges">
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
            Exchanges are websites that allow users to buy, sell, and
            trade cryptocurrencies for other assets, such as conventional
            fiat money, or different digital currencies. Below is a list
            of different cryptocurrecy exchanges that may be available
            for you to use.
          </p>
        </Col>
      </Row>
      {renderList()}
    </Grid>
  </div>
)

export default Exchanges
