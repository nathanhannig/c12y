// React
import React from 'react'
// import { Row, Col } from 'react-bootstrap'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import PropTypes from 'prop-types'

// App
import './index.css'

const CoinItem = (props) => {
  let html

  // Check if header prop was passed
  if (props.header) {
    html = (
      <Row className="header vertical-align">
        <Col sm={12} md={1}>{props.counter}</Col>
        <Col smHidden md={1} />
        <Col sm={12} md={2}>{props.name}</Col>
        <Col sm={12} md={2}>{props.price}</Col>
        <Col sm={12} md={2}>{props.change}</Col>
        <Col sm={12} md={2}>{props.supply}</Col>
        <Col sm={12} md={2}>{props.volume}</Col>
      </Row>
    )
  } else {
    let changeStyle = 'green'

    if (props.change[0] === '-') {
      changeStyle = 'red'
    } else if (props.change === '0.00%' || props.change === 'N/A') {
      changeStyle = ''
    }

    html = (
      <Row className="list vertical-align">
        <Col xs={2} sm={1} md={1} className="counter">{props.counter}</Col>
        <Col xs={4} sm={2} md={1} className="icon">{props.icon ? <img src={props.icon} alt={props.name} /> : ''}</Col>
        <Col xs={6} sm={9} md={2} className="name">{props.name}</Col>
        <Col xs={12} sm={12} md={2} data-title="Price:" className="price">{props.price}</Col>
        <Col xs={12} sm={12} md={2} data-title="Change:" className="price">
          <span className={changeStyle}>{props.change}</span>
        </Col>
        <Col xs={12} sm={12} md={2} data-title="Circulating:" className="supply">{props.supply}</Col>
        <Col xs={12} sm={12} md={2} data-title="Volume:" className="volume">{props.volume}</Col>
        <Col xs={12} sm={12} mdHidden lgHidden data-title="Market Cap:" className="market">{props.marketCap}</Col>
      </Row>
    )
  }

  return (
    <div className="CoinItem">
      {html}
    </div>
  )
}

CoinItem.propTypes = {
  header: PropTypes.bool,
  counter: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  change: PropTypes.string.isRequired,
  supply: PropTypes.string.isRequired,
  volume: PropTypes.string.isRequired,
  marketCap: PropTypes.string,
  icon: PropTypes.string,
}

CoinItem.defaultProps = {
  header: false,
  icon: undefined,
  marketCap: undefined,
}

export default CoinItem
