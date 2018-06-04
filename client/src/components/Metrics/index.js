// React
import React from 'react'
// import { Row, Col } from 'react-bootstrap'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

// App
import API from '../../utils'
import './index.css'

const Metrics = (props) => {
  const { coins } = props

  const totalMarketCap = coins.totalMarketCap &&
      API.formatDollarsWholeNumber(coins.totalMarketCap)

  const totalVolume24h = coins.totalVolume24h &&
      API.formatDollarsWholeNumber(coins.totalVolume24h)

  const totalCoins = coins.coinList &&
  API.formatWholeNumber(coins.coinList.length)

  const btcDominance = coins.btcDominance &&
      API.formatPercent(coins.btcDominance)

  return (
    <div className="metrics">
      <Row>
        <Col xs={6} md={6}>
          <Row>
            <Col xs={12} md={6}>
              <Row>
                <Col className="header" xs={12}>Market Cap</Col>
                <Col className="value" xs={12}>
                  {totalMarketCap}
                </Col>
              </Row>
            </Col>
            <Col xs={12} md={6}>
              <Row>
                <Col className="header" xs={12}>24H Volume</Col>
                <Col className="value" xs={12}>
                  {totalVolume24h}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col xs={6} md={6}>
          <Row>
            <Col xs={12} md={6}>
              <Row>
                <Col className="header" xs={12}>Total Coins</Col>
                <Col className="value" xs={12}>
                  {totalCoins}
                </Col>
              </Row>
            </Col>
            <Col xs={12} md={6}>
              <Row>
                <Col className="header" xs={12}>BTC Dominance</Col>
                <Col className="value" xs={12}>
                  {btcDominance}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

Metrics.propTypes = {
  coins: PropTypes.object.isRequired,
}

export default withRouter(Metrics)
