// React
import React from 'react'
import { Row, Col } from 'react-bootstrap'

// App
import './CoinItem.css'

const CoinItem = (props) => {
  let html

  // Check if header prop was passed
  if (props.header) {
    html = (
      <Row className="header">
        <Col xs={12} md={1}>{props.counter}</Col>
        <Col xs={12} md={4}>{props.name}</Col>
        <Col xs={12} md={2}>{props.price}</Col>
        <Col xs={12} md={2}>{props.supply}</Col>
        <Col xs={12} md={3}>{props.volume}</Col>
      </Row>
    )
  } else {
    html = (
      <Row className="list">
        <Col className="counter" xs={12} md={1}>{props.counter}</Col>
        <Col className="name" xs={12} md={4}>{props.icon ? <img className="icon" src={props.icon} alt={props.name} /> : ''}{props.name}</Col>
        <Col className="price" xs={12} md={2}>{props.price}</Col>
        <Col className="supply" xs={12} md={2}>{props.supply}</Col>
        <Col className="volume" xs={12} md={3}>{props.volume}</Col>
      </Row>
    )
  }

  return html
}

export default CoinItem