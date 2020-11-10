// React
import React, { Component } from 'react'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Button from 'react-bootstrap/lib/Button'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

// Redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { fetchCoin } from '../../actions'

// App
import API from '../../utils'
import styles from './index.module.scss'

Number.isNaN = require('number-is-nan')

class Overview extends Component {
  state = { loading: true }

  async componentDidMount() {
    const { match } = this.props

    try {
      await this.props.fetchCoin(match.params.coin)
      this.setState({ loading: false })
    } catch (error) {
      this.props.history.replace('/')
    }
  }

  renderCoinOverviewItem = (item, title, value) => (
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

  renderCoinOverviewItemHTML = (item, title, value) => (
    <Col id={item} xs={12}>
      <Row>
        <Col xs={12} className={styles.title}>
          {title}
        </Col>
        <Col xs={12} className={styles.value} dangerouslySetInnerHTML={{ __html: value }} />
      </Row>
    </Col>
  )

  renderCoinOverview = () => {
    const { coin } = this.props

    if (this.state.loading) {
      return <div className="loader" />
    }

    if (!coin.coin) {
      return (
        <Row>
          <Col xs={12}>
            <p>Coin information is not ready, please refresh the page.</p>
          </Col>
        </Row>
      )
    }

    const { name } = coin.coin
    const algorithm = coin.coin.algorithm ? coin.coin.algorithm : 'N/A'
    const icon = coin.coin.image && coin.coin.image.large
    const { twitter } = coin.coin
    const twitterUrl = `http://www.twitter.com/${coin.coin.twitter}`

    let price = 'N/A'
    let volume24Hour = 'N/A'
    let high24Hour = 'N/A'
    let low24Hour = 'N/A'
    let change24Hour = 'N/A'
    let changePct24Hour = 'N/A'
    let marketCap = 'N/A'
    let circulatingSupply = 'N/A'

    if (coin.price) {
      // Convert to $ with commas
      price = API.formatDollars(coin.price.price)

      // Convert to $ with commas
      volume24Hour = API.formatDollars(coin.price.volume_24h)

      // Convert to $ with commas
      high24Hour = API.formatDollars(coin.price.volume_high_24h)

      // Convert to $ with commas
      low24Hour = API.formatDollars(coin.price.volume_low_24h)

      // Convert to $ with commas
      change24Hour = API.formatDollars(coin.price.change_24h)

      // Convert to % with commas
      changePct24Hour = API.formatPercent(coin.price.change_percentage_24h)

      // Convert to $ with commas
      marketCap = API.formatDollars(coin.price.market_cap)

      circulatingSupply = API.formatWholeNumber(coin.price.circulating_supply)
    }

    let changeStyle

    if (changePct24Hour[0] === '-') {
      changeStyle = 'change red'
    } else if (changePct24Hour === '0.00%') {
      changeStyle = 'change'
    }

    const html = [
      <div key="overview">
        <Row>
          <Col xs={12} sm={4} md={3} className={styles.meta}>
            {icon ? <img className={styles.icon} src={icon} alt={name} /> : ''}

            {coin.coin.websiteUrl ? (
              <a href={coin.coin.websiteUrl} rel="noopener noreferrer" target="_blank">
                <Button bsSize="medium" bsStyle="primary" className={styles['coin-urls']}>
                  Website
                </Button>
              </a>
            ) : (
              ''
            )}

            {twitter ? (
              <a href={twitterUrl} rel="noopener noreferrer" target="_blank">
                <Button bsSize="medium" bsStyle="info" className={styles['coin-urls']}>
                  Twitter - @{twitter}
                </Button>
              </a>
            ) : (
              ''
            )}
          </Col>
          <Col xs={12} sm={4} md={4} className={styles.details}>
            <Row>
              {this.renderCoinOverviewItem('price', 'Price', price)}
              {this.renderCoinOverviewItemHTML(
                'change24HourCombined',
                'Change',
                `${change24Hour} <span class="${changeStyle}">(${changePct24Hour})</span>`
              )}
              {this.renderCoinOverviewItem('high24Hour', 'High', high24Hour)}
              {this.renderCoinOverviewItem('low24Hour', 'Low', low24Hour)}
            </Row>
          </Col>
          <Col xs={12} sm={4} md={5} className={styles.details}>
            <Row>
              {this.renderCoinOverviewItem('volume', 'Volume', volume24Hour)}
              {this.renderCoinOverviewItem('marketCap', 'Market Cap', marketCap)}
              {this.renderCoinOverviewItem('circulatingSupply', 'Circulating Supply', circulatingSupply)}
              {this.renderCoinOverviewItem('algorithm', 'Algorithm', algorithm)}
            </Row>
          </Col>
        </Row>
        <Row className={styles.details}>
          {coin.coin.description ? (
            <Col xs={12}>{this.renderCoinOverviewItemHTML('description', 'Description', coin.coin.description)}</Col>
          ) : (
            ''
          )}
        </Row>
      </div>,
    ]

    return html
  }

  render() {
    const { coin } = this.props

    const id = coin.coin ? coin.coin.id : ''
    const name = coin.coin ? coin.coin.name : ''
    const symbol = coin.coin ? coin.coin.symbol : ''

    return (
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{`${name} (${symbol.toUpperCase()}) price, volume, market cap, and info | c12y.com`}</title>
          <link rel="canonical" href={`https://c12y.com/${id.toLowerCase()}`} />
          <meta name="description" content={`${name}`} />
        </Helmet>
        <Grid>
          {coin.coin ? (
            <Row>
              <Col xs={12}>
                <h3>{`${coin.coin.name} (${coin.coin.symbol.toUpperCase()}) Details`}</h3>
              </Col>
            </Row>
          ) : (
            ''
          )}
          {this.renderCoinOverview()}
        </Grid>
      </div>
    )
  }
}

Overview.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  fetchCoin: PropTypes.func.isRequired,
  coin: PropTypes.object.isRequired,
}

function mapStateToProps({ coin }) {
  return {
    coin,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchCoin: bindActionCreators(fetchCoin, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Overview)
