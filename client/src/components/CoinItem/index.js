// React
import React from 'react'
import { Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'

// App
import './index.css'

const CoinItem = (props) => {
  let html

  // Check if header prop was passed
  if (props.header) {
    html = (
      <Row className="header vertical-align">
        <Col xs={12} md={1}>{props.counter}</Col>
        <Col xs={12} md={1} />
        <Col xs={12} md={3}>{props.name}</Col>
        <Col xs={12} md={2}>{props.price}</Col>
        <Col xs={12} md={2}>{props.supply}</Col>
        <Col xs={12} md={3}>{props.volume}</Col>
      </Row>
    )
  } else {
    html = (
      <Row className="list vertical-align">
        <Col xs={12} md={1} className="counter">{props.counter}</Col>
        <Col xs={12} md={1} className="icon">{props.icon ? <img src={props.icon} alt={props.name} /> : ''}</Col>
        <Col xs={12} md={3} className="name">{props.name}</Col>
        <Col xs={12} md={2} className="price">{props.price}</Col>
        <Col xs={12} md={2} className="supply">{props.supply}</Col>
        <Col xs={12} md={3} className="volume">{props.volume}</Col>
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
  supply: PropTypes.string.isRequired,
  volume: PropTypes.string.isRequired,
  icon: PropTypes.string,
}

CoinItem.defaultProps = {
  header: false,
  icon: undefined,
}

export default CoinItem
