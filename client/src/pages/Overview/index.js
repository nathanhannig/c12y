// React
import React, { Component } from 'react'
// import { Grid, Row, Col, Button } from 'react-bootstrap'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Button from 'react-bootstrap/lib/Button'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet';

// Redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { fetchCoin } from '../../actions'

// App
import API from '../../utils'
import './index.css'

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
    <Col className={item} xs={12}>
      <Row>
        <Col xs={12} className="title">{title}</Col>
        <Col xs={12} className="value">{value}</Col>
      </Row>
    </Col>
  )

  renderCoinOverviewItemHTML = (item, title, value) => (
    <Col className={item} xs={12}>
      <Row>
        <Col xs={12} className="title">{title}</Col>
        <Col xs={12} className="value" dangerouslySetInnerHTML={{ __html: value }} />
      </Row>
    </Col>
  )

  renderCoinOverview = () => {
    const { coin } = this.props

    if (this.state.loading) {
      return (<div className="loader" />)
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

    const name = coin.coin.FullName

    const icon =
      coin.coin.ImageUrl
      && `${coin.baseImageUrl + coin.coin.ImageUrl}?width=200`

    const algorithm = coin.coin.Algorithm
    const proofType = coin.coin.ProofType
    const fullyPremined = coin.coin.FullyPremined
    const preMinedValue = coin.coin.PreMinedValue
    const totalCoinSupply = Number.isNaN(Number(coin.coin.TotalCoinSupply)) ?
      coin.coin.TotalCoinSupply :
      API.formatWholeNumber(coin.coin.TotalCoinSupply)

    const twitter = coin.coin.Twitter
    const twitterUrl = coin.coin.Twitter[0] === '@' ?
      `http://www.twitter.com/${coin.coin.Twitter.substr(1)}` :
      `http://www.twitter.com/${coin.coin.Twitter}`

    let price = 'N/A'
    let supply = 'N/A'
    let totalVolume24HTo = 'N/A'
    let open24Hour = 'N/A'
    let high24Hour = 'N/A'
    let low24Hour = 'N/A'
    let change24Hour = 'N/A'
    let changePct24Hour = 'N/A'
    let marketCap = 'N/A'

    // Check if RAW info is available
    if (coin.price) {
      // Convert to $ with commas
      price = API.formatDollars(coin.price.PRICE)

      // Convert to whole number with commas
      supply = API.formatWholeNumber(coin.price.SUPPLY)

      // Convert to $ with commas
      totalVolume24HTo = API.formatDollars(coin.price.TOTALVOLUME24HTO)

      // Convert to $ with commas
      open24Hour = API.formatDollars(coin.price.OPEN24HOUR)

      // Convert to $ with commas
      high24Hour = API.formatDollars(coin.price.HIGH24HOUR)

      // Convert to $ with commas
      low24Hour = API.formatDollars(coin.price.LOW24HOUR)

      // Convert to $ with commas
      change24Hour = API.formatDollars(coin.price.CHANGE24HOUR)

      // Convert to % with commas
      changePct24Hour = API.formatPercent(coin.price.CHANGEPCT24HOUR)

      // Convert to $ with commas
      marketCap = API.formatDollars(coin.price.MKTCAP)
    }

    let changeStyle

    if (changePct24Hour[0] === '-') {
      changeStyle = 'change red'
    } else if (changePct24Hour === '0.00%') {
      changeStyle = 'change'
    }

    const html = [(
      <div key="overview">
        <Row>
          <Col xs={12} sm={4} md={3} className="meta">
            {icon ? <img className="icon" src={icon} alt={name} /> : ''}

            {coin.coin.WebsiteUrl ?
              <a href={coin.coin.WebsiteUrl} target="_blank">
                <Button bsSize="small" bsStyle="primary" className="coin-urls">Website</Button>
              </a> : ''}

            {twitter ?
              <a href={twitterUrl} target="_blank">
                <Button bsSize="small" bsStyle="info" className="coin-urls">Twitter - {twitter}</Button>
              </a> : ''}
          </Col>
          <Col xs={12} sm={4} md={4} className="details">
            <Row>
              {this.renderCoinOverviewItem('price', 'Price', price)}
              {this.renderCoinOverviewItemHTML(
                'change24HourCombined',
                'Change',
                `${change24Hour} <span class="${changeStyle}">(${changePct24Hour})</span>`,
              )}
              {this.renderCoinOverviewItem('volume', 'Volume', totalVolume24HTo)}
              {this.renderCoinOverviewItem('marketCap', 'Market Cap', marketCap)}
              {this.renderCoinOverviewItem('open24Hour', 'Open', open24Hour)}
              {this.renderCoinOverviewItem('high24Hour', 'High', high24Hour)}
              {this.renderCoinOverviewItem('low24Hour', 'Low', low24Hour)}
            </Row>
          </Col>
          <Col xs={12} sm={4} md={5} className="details">
            <Row>
              {this.renderCoinOverviewItem('supply', 'Circulating Supply', supply)}
              {this.renderCoinOverviewItem('totalCoinSupply', 'Total Coin Supply', totalCoinSupply)}
              {this.renderCoinOverviewItem('algorithm', 'Algorithm', algorithm)}
              {this.renderCoinOverviewItem('proofType', 'Proof Type', proofType)}
              {this.renderCoinOverviewItem('fullyPremined', 'Fully Pre-Mined', fullyPremined)}
              {this.renderCoinOverviewItem('preMinedValue', 'Pre-Mined Value', preMinedValue)}
            </Row>
          </Col>
        </Row>
        <Row className="details">
          {coin.coin.Description
            ? <Col xs={12}>{this.renderCoinOverviewItemHTML('description', 'Description', coin.coin.Description)}</Col>
            : ''
          }
          {coin.coin.Features
            ? <Col xs={12}>{this.renderCoinOverviewItemHTML('features', 'Features', coin.coin.Features)}</Col>
            : ''
          }
          {coin.coin.Technology
            ? <Col xs={12}>{this.renderCoinOverviewItemHTML('technology', 'Technology', coin.coin.Technology)}</Col>
            : ''
          }
        </Row>
      </div>
    )]

    return html
  }

  render() {
    const { coin } = this.props

    const name = coin.coin ? coin.coin.FullName : ''
    const symbol = coin.coin ? coin.coin.Symbol : ''
    const price = coin.price ? API.formatDollars(coin.price.PRICE) : 'N/A'

    return (
      <div className="Overview">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{`${name} ${price} - c12y.com`}</title>
          <link rel="canonical" href={`https://c12y.com/${symbol.toLowerCase()}`} />
          <meta name="description" content={`${name}`} />
        </Helmet>
        <Grid>
          {coin.coin ?
            (
              <Row>
                <Col xs={12}>
                  <h3>{`${coin.coin.FullName} Details`}</h3>
                </Col>
              </Row>
            ) : ''}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Overview)
