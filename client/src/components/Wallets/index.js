// React
import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

// App
import './index.css'

const renderList = () => {
  const list = [
    {
      name: 'MyEtherWallet.com',
      link: 'https://www.myetherwallet.com/',
      description: 'A wallet used for Ethereum and other ERC-20 tokens.',
    },
    {
      name: 'Exodus.io',
      link: 'https://www.exodus.io/',
      description: 'A desktop multi-asset wallet with ShapeShift built in.',
    },
  ]
  const html = []
  let counter = 1

  list.forEach((item) => {
    html.push((
      <Row key={item.name} className="list vertical-align">
        <Col className="counter" xs={12} md={1}>
          {counter}
        </Col>
        <Col className="name" xs={12} md={4}>
          <a href={item.link}>{item.name}</a>
        </Col>
        <Col className="description" xs={12} md={7}>
          {item.description}
        </Col>
      </Row>
    ))

    counter += 1
  })

  html.unshift((
    <Row key="header" className="header vertical-align">
      <Col xs={12} md={1}>#</Col>
      <Col xs={12} md={4}>Name</Col>
      <Col xs={12} md={7}>Description</Col>
    </Row>
  ))

  return html
}

const Wallets = () => (
  <div className="Wallets">
    <Grid>
      <Row className="page-title">
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
