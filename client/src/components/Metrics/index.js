// React
import React from 'react'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import PropTypes from 'prop-types'

// App
import API from '../../utils'
import styles from './index.module.scss'

const Metrics = ({ totalMarketCap, totalVolume24h, totalCoins, btcDominance }) => {
  const formattedTotalMarketCap = (totalMarketCap && API.formatDollarsWholeNumber(totalMarketCap)) || '-'
  const formattedTotalVolume24h = (totalVolume24h && API.formatDollarsWholeNumber(totalVolume24h)) || '-'
  const formattedTotalCoins = (totalCoins && API.formatWholeNumber(totalCoins)) || '-'
  const formattedBtcDominance = (btcDominance && API.formatPercent(btcDominance)) || '-'

  return (
    <div className={styles.metrics}>
      <Row>
        <Col xs={6} md={6}>
          <Row>
            <Col xs={12} md={6}>
              <Row>
                <Col className={styles.header} xs={12}>
                  Market Cap
                </Col>
                <Col className={styles.value} xs={12}>
                  {formattedTotalMarketCap}
                </Col>
              </Row>
            </Col>
            <Col xs={12} md={6}>
              <Row>
                <Col className={styles.header} xs={12}>
                  24H Volume
                </Col>
                <Col className={styles.value} xs={12}>
                  {formattedTotalVolume24h}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col xs={6} md={6}>
          <Row>
            <Col xs={12} md={6}>
              <Row>
                <Col className={styles.header} xs={12}>
                  Total Coins
                </Col>
                <Col className={styles.value} xs={12}>
                  {formattedTotalCoins}
                </Col>
              </Row>
            </Col>
            <Col xs={12} md={6}>
              <Row>
                <Col className={styles.header} xs={12}>
                  BTC Dominance
                </Col>
                <Col className={styles.value} xs={12}>
                  {formattedBtcDominance}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

Metrics.defaultProps = {
  totalMarketCap: undefined,
  totalVolume24h: undefined,
  totalCoins: undefined,
  btcDominance: undefined,
}

Metrics.propTypes = {
  totalMarketCap: PropTypes.number,
  totalVolume24h: PropTypes.number,
  totalCoins: PropTypes.number,
  btcDominance: PropTypes.number,
}

export default Metrics
