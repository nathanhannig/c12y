// React
import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'

// Redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { fetchCoin } from '../../actions'

// App
import API from '../../utils'
import './index.css'

class Overview extends Component {
  state = { loading: true }

  componentDidMount() {
    const { match } = this.props

    this.props.fetchCoin(match.params.coin).then(() => {
      this.setState({ loading: false })
    })
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
      return (<Row>Coin information is not ready, please refresh the page.</Row>)
    }

    const icon = coin.coin.ImageUrl
      && coin.baseImageUrl + coin.coin.ImageUrl
    const name = coin.coin.FullName
    const coinName = coin.coin.CoinName
    const symbol = coin.coin.Symbol
    const algorithm = coin.coin.Algorithm
    const proofType = coin.coin.ProofType
    const fullyPremined = coin.coin.FullyPremined
    const preMinedValue = coin.coin.PreMinedValue
    let totalCoinSupply = coin.coin.TotalCoinSupply

    // Convert to whole number with commas
    totalCoinSupply = parseFloat(totalCoinSupply).toFixed(0).replace(/./g, (c, i, a) => (i && c !== '.' && ((a.length - i) % 3 === 0) ? `,${c}` : c))

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
      price = API.formatToDollars(coin.price.PRICE)

      // Convert to whole number with commas
      supply = API.formatToWholeNumber(coin.price.SUPPLY)

      // Convert to $ with commas
      totalVolume24HTo = API.formatToDollars(coin.price.TOTALVOLUME24HTO)

      // Convert to $ with commas
      open24Hour = API.formatToDollars(coin.price.OPEN24HOUR)

      // Convert to $ with commas
      high24Hour = API.formatToDollars(coin.price.HIGH24HOUR)

      // Convert to $ with commas
      low24Hour = API.formatToDollars(coin.price.LOW24HOUR)

      // Convert to $ with commas
      change24Hour = API.formatToDollars(coin.price.CHANGE24HOUR)

      // Convert to % with commas
      changePct24Hour = API.formatToPercent(coin.price.CHANGEPCT24HOUR)

      // Convert to $ with commas
      marketCap = API.formatToDollars(coin.price.MKTCAP)
    }

    const html = [(
      <div key="overview">
        <Row>
          <Col xs={12} md={2}>
            {icon ? <img className="icon" src={icon} alt={name} /> : ''}
          </Col>
          <Col xs={12} md={4}>
            <Row className="details">
              {this.renderCoinOverviewItem('coin.name', 'Name', (<span>{coinName} (<a href={coin.coin.WebsiteUrl} target="_blank">Website</a>)</span>))}
              {this.renderCoinOverviewItem('symbol', 'Symbol', symbol)}
              {this.renderCoinOverviewItem('supply', 'Circulating Supply', supply)}
              {this.renderCoinOverviewItem('totalCoinSupply', 'Total Coin Supply', totalCoinSupply)}
              {this.renderCoinOverviewItem('algorithm', 'Algorithm', algorithm)}
              {this.renderCoinOverviewItem('proofType', 'Proof Type', proofType)}
              {this.renderCoinOverviewItem('fullyPremined', 'Fully Pre-Mined', fullyPremined)}
              {this.renderCoinOverviewItem('preMinedValue', 'Pre-Mined Value', preMinedValue)}
            </Row>
          </Col>
          <Col xs={12} md={6}>
            <Row className="details">
              {this.renderCoinOverviewItem('price', 'Price', price)}
              {this.renderCoinOverviewItem('volume', 'Volume', totalVolume24HTo)}
              {this.renderCoinOverviewItem('marketCap', 'Market Cap', marketCap)}
              {this.renderCoinOverviewItem('open24Hour', 'Open', open24Hour)}
              {this.renderCoinOverviewItem('high24Hour', 'High', high24Hour)}
              {this.renderCoinOverviewItem('low24Hour', 'Low', low24Hour)}
              {this.renderCoinOverviewItem('change24Hour', 'Change', change24Hour)}
              {this.renderCoinOverviewItem('changePct24Hour', 'Change %', changePct24Hour)}
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

    return (
      <div className="Overview">
        <Grid>
          {coin.coin ?
            (
              <Row className="page-title">
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