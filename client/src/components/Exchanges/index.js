// React
import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

// App
import './index.css'

const renderList = () => {
  const list = [
    {
      name: 'Coinbase.com',
      link: 'https://www.coinbase.com/join/5293e1d049fb865aef000030',
      description: 'An exchange used by new comers to buy Bitcoin, Ethereum, Litecoin and Bitcoin Cash.',
    },
    {
      name: 'GDAX.com',
      link: 'https://www.gdax.com/',
      description: 'An exchange used by new comers to buy Bitcoin, Ethereum, Litecoin and Bitcoin Cash.',
    },
    {
      name: 'Binance.com',
      link: 'https://www.binance.com/',
      description: 'An exchange used by new comers to buy Bitcoin, Ethereum, Litecoin and Bitcoin Cash.',
    },
    {
      name: 'Bittrex.com',
      link: 'https://bittrex.com/',
      description: 'An exchange used by new comers to buy Bitcoin, Ethereum, Litecoin and Bitcoin Cash.',
    },
    {
      name: 'Poloniex.com',
      link: 'https://poloniex.com/',
      description: 'An exchange used by new comers to buy Bitcoin, Ethereum, Litecoin and Bitcoin Cash.',
    },
    {
      name: 'Kraken.com',
      link: 'https://www.kraken.com/',
      description: 'An exchange used by new comers to buy Bitcoin, Ethereum, Litecoin and Bitcoin Cash.',
    },
    {
      name: 'Bitfinex.com',
      link: 'https://www.bitfinex.com/',
      description: 'An exchange used by new comers to buy Bitcoin, Ethereum, Litecoin and Bitcoin Cash.',
    },
    {
      name: 'Cryptopia.co.nz',
      link: 'https://www.cryptopia.co.nz/',
      description: 'An exchange used by new comers to buy Bitcoin, Ethereum, Litecoin and Bitcoin Cash.',
    },
    {
      name: 'KuCoin.com',
      link: 'https://www.kucoin.com/',
      description: 'An exchange used by new comers to buy Bitcoin, Ethereum, Litecoin and Bitcoin Cash.',
    },
    {
      name: 'CoinExchange.io',
      link: 'https://www.coinexchange.io/',
      description: 'An exchange used by new comers to buy Bitcoin, Ethereum, Litecoin and Bitcoin Cash.',
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

const Exchanges = () => (
  <div className="Exchanges">
    <Grid>
      <Row className="page-title">
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
