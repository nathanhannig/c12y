// React
import React, { useEffect } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { fetchCoin } from '../../actions'

// App
import API from '../../utils'
import styles from './index.module.scss'

const Overview = ({ match, history }) => {
  const dispatch = useDispatch()

  const coinDetails = useSelector((state) => state.coin)
  const { loading, error, data: coin } = coinDetails

  useEffect(() => {
    dispatch(fetchCoin(match.params.coin))
  }, [dispatch, history, match])

  if (error) {
    history.replace('/')
  }

  const renderCoinOverviewItem = (item, title, value) => (
    <Col id={item} xs={12}>
      <Row>
        <Col xs={12} className={styles.title}>
          {title}
        </Col>
        <Col xs={12} className={styles.value}>
          {value}
        </Col>
      </Row>
    </Col>
  )

  const renderCoinOverviewItemHTML = (item, title, value) => (
    <Col id={item} xs={12}>
      <Row>
        <Col xs={12} className={styles.title}>
          {title}
        </Col>
        <Col xs={12} className={styles.value} dangerouslySetInnerHTML={{ __html: value }} />
      </Row>
    </Col>
  )

  const renderCoinOverview = () => {
    if (loading) {
      return <div className="loader" />
    }

    if (!coin) {
      return (
        <Row>
          <Col xs={12}>
            <p>Coin information is not ready, please refresh the page.</p>
          </Col>
        </Row>
      )
    }

    const algorithm = coin.algorithm ? coin.algorithm : 'N/A'
    const icon = coin.image && coin.image.large
    const twitterUrl = `http://www.twitter.com/${coin.twitter}`

    let formattedPrice = 'N/A'
    let formattedVolume24Hour = 'N/A'
    let formattedHigh24Hour = 'N/A'
    let formattedLow24Hour = 'N/A'
    let formattedChange24Hour = 'N/A'
    let formattedChangePct24Hour = 'N/A'
    let formattedMarketCap = 'N/A'
    let formattedCirculatingSupply = 'N/A'

    if (coin.prices?.price) {
      // Convert to $ with commas
      formattedPrice = API.formatDollars(coin.prices.price)

      // Convert to $ with commas
      formattedVolume24Hour = API.formatDollars(coin.prices.volume_24h)

      // Convert to $ with commas
      formattedHigh24Hour = API.formatDollars(coin.prices.volume_high_24h)

      // Convert to $ with commas
      formattedLow24Hour = API.formatDollars(coin.prices.volume_low_24h)

      // Convert to $ with commas
      formattedChange24Hour = API.formatDollars(coin.prices.change_24h)

      // Convert to % with commas
      formattedChangePct24Hour = API.formatPercent(coin.prices.change_percentage_24h)

      // Convert to $ with commas
      formattedMarketCap = API.formatDollars(coin.prices.market_cap)

      formattedCirculatingSupply = API.formatWholeNumber(coin.prices.circulating_supply)
    }

    let changeStyle

    if (formattedChangePct24Hour[0] === '-') {
      changeStyle = 'change red'
    } else if (formattedChangePct24Hour === '0.00%') {
      changeStyle = 'change'
    }

    const html = [
      <div key="overview">
        <Row>
          <Col xs={12} sm={4} md={3} className={styles.meta}>
            {icon ? <img className={styles.icon} src={icon} alt={coin.name} /> : ''}

            {coin.websiteUrl ? (
              <a href={coin.websiteUrl} rel="noopener noreferrer" target="_blank">
                <Button variant="primary" className={styles['coin-urls']}>
                  Website
                </Button>
              </a>
            ) : (
              ''
            )}

            {coin.twitter ? (
              <a href={twitterUrl} rel="noopener noreferrer" target="_blank">
                <Button variant="info" className={styles['coin-urls']}>
                  Twitter - @{coin.twitter}
                </Button>
              </a>
            ) : (
              ''
            )}
          </Col>
          <Col xs={12} sm={4} md={4} className={styles.details}>
            <Row>
              {renderCoinOverviewItem('price', 'Price', formattedPrice)}
              {renderCoinOverviewItemHTML(
                'change24HourCombined',
                'Change',
                `${formattedChange24Hour} <span class="${changeStyle}">(${formattedChangePct24Hour})</span>`
              )}
              {renderCoinOverviewItem('high24Hour', 'High', formattedHigh24Hour)}
              {renderCoinOverviewItem('low24Hour', 'Low', formattedLow24Hour)}
            </Row>
          </Col>
          <Col xs={12} sm={4} md={5} className={styles.details}>
            <Row>
              {renderCoinOverviewItem('volume', 'Volume', formattedVolume24Hour)}
              {renderCoinOverviewItem('marketCap', 'Market Cap', formattedMarketCap)}
              {renderCoinOverviewItem('circulatingSupply', 'Circulating Supply', formattedCirculatingSupply)}
              {renderCoinOverviewItem('algorithm', 'Algorithm', algorithm)}
            </Row>
          </Col>
        </Row>
        <Row className={styles.details}>
          {coin.description ? (
            <Col xs={12}>{renderCoinOverviewItemHTML('description', 'Description', coin.description)}</Col>
          ) : (
            ''
          )}
        </Row>
      </div>,
    ]

    return html
  }

  const id = coin ? coin.id : ''
  const name = coin ? coin.name : ''
  const symbol = coin ? coin.symbol : ''

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{`${name} (${symbol.toUpperCase()}) price, volume, market cap, and info | c12y.com`}</title>
        <link rel="canonical" href={`https://c12y.com/${id.toLowerCase()}`} />
        <meta name="description" content={`${name}`} />
      </Helmet>
      <Container>
        {coin ? (
          <Row>
            <Col xs={12}>
              <h3 className="mt-4 mb-2">{`${name} (${symbol.toUpperCase()}) Details`}</h3>
            </Col>
          </Row>
        ) : (
          ''
        )}
        {renderCoinOverview()}
      </Container>
    </div>
  )
}

Overview.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
}

export default Overview
