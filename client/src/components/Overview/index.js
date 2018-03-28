// React
import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchCoin } from '../../actions'

// App
import './index.css'

class Overview extends Component {
  state = { loading: true }

  componentDidMount() {
    this.props.fetchCoin(this.props.match.params.coin).then(() => {
      this.setState({ loading: false })
    })
  }

  renderCoinOverviewItem = (item, title, value) => {
    return (
      <Col className={item} xs={12}>
        <Row>
          <Col className="title" xs={12}>{title}</Col>
          <Col xs={12}>{value}</Col>
        </Row>
      </Col>
    )
  }

  renderCoinOverview = () => {
    let { coin } = this.props

    if (this.state.loading) {
      return (<div className="loader"></div>)
    }

    if (!coin.coin) {
      return (<Row>Coin information is not ready, please refresh the page.</Row>)
    }

    let icon = coin.coin.ImageUrl
      && coin.baseImageUrl + coin.coin.ImageUrl
    let name = coin.coin.FullName
    let coinName = coin.coin.CoinName
    let symbol = coin.coin.Symbol
    let algorithm = coin.coin.Algorithm
    let proofType = coin.coin.ProofType
    let fullyPremined = coin.coin.FullyPremined
    let preMinedValue = coin.coin.PreMinedValue
    let totalCoinSupply = coin.coin.TotalCoinSupply

    // Convert to whole number with commas
    totalCoinSupply = parseFloat(totalCoinSupply).toFixed(0).replace(/./g, function (c, i, a) {
      return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
    })

    let price = 'N/A',
      supply = 'N/A',
      totalVolume24HTo = 'N/A',
      open24Hour = 'N/A',
      high24Hour = 'N/A',
      low24Hour = 'N/A',
      change24Hour = 'N/A',
      changePct24Hour = 'N/A',
      marketCap = 'N/A'

    // Check if RAW info is available
    if (coin.coin.price) {
      // Check if RAW price is available
      price = coin.coin.price.USD.PRICE

      // Convert to $ with commas
      price = '$ ' + parseFloat(price).toFixed(2).replace(/./g, function (c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
      })

      // Check if RAW price is available
      supply = coin.coin.price.USD.SUPPLY

      // Convert to whole number with commas
      supply = parseFloat(supply).toFixed(0).replace(/./g, function (c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
      })

      // Check if RAW voluume is available
      totalVolume24HTo = coin.coin.price.USD.TOTALVOLUME24HTO

      // Convert to $ with commas
      totalVolume24HTo = '$ ' + parseFloat(totalVolume24HTo).toFixed(2).replace(/./g, function (c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
      })

      // Check if RAW voluume is available
      open24Hour = coin.coin.price.USD.OPEN24HOUR

      // Convert to $ with commas
      open24Hour = '$ ' + parseFloat(open24Hour).toFixed(2).replace(/./g, function (c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
      })

      // Check if RAW voluume is available
      high24Hour = coin.coin.price.USD.HIGH24HOUR

      // Convert to $ with commas
      high24Hour = '$ ' + parseFloat(high24Hour).toFixed(2).replace(/./g, function (c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
      })

      // Check if RAW voluume is available
      low24Hour = coin.coin.price.USD.LOW24HOUR

      // Convert to $ with commas
      low24Hour = '$ ' + parseFloat(low24Hour).toFixed(2).replace(/./g, function (c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
      })

      // Check if RAW voluume is available
      change24Hour = coin.coin.price.USD.CHANGE24HOUR

      // Convert to $ with commas
      change24Hour = '$ ' + parseFloat(change24Hour).toFixed(2).replace(/./g, function (c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
      })

      // Check if RAW voluume is available
      changePct24Hour = coin.coin.price.USD.CHANGEPCT24HOUR

      // Convert to $ with commas
      changePct24Hour = parseFloat(changePct24Hour).toFixed(2).replace(/./g, function (c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
      }) + ' %'

      // Check if RAW voluume is available
      marketCap = coin.coin.price.USD.MKTCAP

      // Convert to $ with commas
      marketCap = '$ ' + parseFloat(marketCap).toFixed(2).replace(/./g, function (c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
      })
    }

    let html = [(
      <Row key="overview">
        <Col xs={12} md={2}>
          {icon ? <img className="icon" src={icon} alt={name} /> : ''}
        </Col>
        <Col xs={12} md={4}>
          <Row className="details">
            {this.renderCoinOverviewItem('name', 'Name', coinName)}
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
    )]

    html.unshift((<h3 key="details">{this.props.coin.coin.FullName + ' Details'}</h3>))

    return html
  }

  render() {
    return (
      <div className="Overview">
        <Grid>
          {this.renderCoinOverview()}
        </Grid>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    coin: state.coin
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchCoin: bindActionCreators(fetchCoin, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview)