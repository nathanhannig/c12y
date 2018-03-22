// React
import React, { Component } from 'react'
import { Grid, Row } from 'react-bootstrap'

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchCoin } from '../actions'

// App
import CoinItem from './CoinItem'
import './Details.css'

class Details extends Component {
  state = { loading: true }

  componentDidMount() {
    this.props.fetchCoin(this.props.match.params.coin).then(() => {
      this.setState({ loading: false })
    })
  }

  renderCoinOverview = () => {
    let { coin } = this.props

    if (this.state.loading) {
      return (<div className="loader"></div>)
    }

    if (!coin.coin) {
      return (<Row>Coin information is not ready, please refresh the page.</Row>)
    }

    let name = coin.coin.FullName

    let icon = coin.coin.ImageUrl
      && coin.baseImageUrl + coin.coin.ImageUrl

    let price = 'N/A', supply = 'N/A', volume = 'N/A'

    // Check if RAW info is available
    if (coin.coin.price && coin.coin.price.RAW) {
      // Check if RAW price is available
      price = coin.coin.price.RAW[coin.coin.Symbol].USD.PRICE

      // Convert to $ with commas
      price = '$ ' + parseFloat(price).toFixed(2).replace(/./g, function (c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
      })

      // Check if RAW price is available
      supply = coin.coin.price.RAW[coin.coin.Symbol].USD.SUPPLY

      // Convert to whole number with commas
      supply = parseFloat(supply).toFixed(0).replace(/./g, function (c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
      })

      // Check if RAW voluume is available
      volume = coin.coin.price.RAW[coin.coin.Symbol].USD.TOTALVOLUME24HTO

      // Convert to $ with commas
      volume = '$ ' + parseFloat(volume).toFixed(2).replace(/./g, function (c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
      })
    }

    let html = [(
      <CoinItem key={'coin'} counter={1} icon={icon} name={name} price={price} volume={volume} supply={supply} />
    )]

    html.unshift((<CoinItem key={'header'} header counter={'#'} name={'Name'} price={'Price'} volume={'Volume'} supply={'Supply'} />))
    html.unshift((<h3>{this.props.coin.coin.FullName + ' Details'}</h3>))

    return html
  }

  render() {
    return (
      <div className="Details">
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
)(Details)