// React
import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

// App
import walletList from './data.json'
import './index.css'

const renderList = () => {
  const html = walletList.map((item, i) => (
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

const Wallets = () => (
  <div className="Wallets">
    <Grid>
      <Row>
        <Col xs={12}>
          <h3>Wallets</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <p>
            Wallets are a software program that stores private and
            public keys and interacts with various blockchain to
            allow users to send and receive cryptocurrencies and
            view their balance. If you want to use cryptocurrency,
            you will need to have a digital wallet to store your
            cryptocurrency off of exchanbge websites.
          </p>
        </Col>
      </Row>
      {renderList()}
    </Grid>
  </div>
)

export default Wallets
