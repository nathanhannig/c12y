// React
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Grid, Row } from 'react-bootstrap'

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchCoins } from '../actions'

// App
import CoinItem from './CoinItem'
import './App.css'

class App extends Component {

  componentDidMount() {
    this.props.fetchCoins()
  }

  renderCoinList = () => {
    if (this.props.data.loading) {
      return (<div className="loader"></div>)
    }

    let data = this.props.data.coins

    if (!data) {
      return (<Row>Coin information is not ready, please refresh the page.</Row>)
    }

    let html = Object.keys(data.coins).map((item, i) => {
      let name = (
        <Link to={'/' + item.toLowerCase()}>
          {data.coins[item].FullName}
        </Link>
      )

      let icon = data.coins[item].ImageUrl
        && data.baseImageUrl + data.coins[item].ImageUrl

      let price = 'N/A', supply = 'N/A', volume = 'N/A'

      // Check if RAW info is available
      if (data.coins[item].price && data.coins[item].price.RAW) {
        // Check if RAW price is available
        price = data.coins[item].price.RAW[item].USD.PRICE

        // Convert to $ with commas
        price = '$ ' + parseFloat(price).toFixed(2).replace(/./g, function (c, i, a) {
          return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
        })

        // Check if RAW price is available
        supply = data.coins[item].price.RAW[item].USD.SUPPLY

        // Convert to whole number with commas
        supply = parseFloat(supply).toFixed(0).replace(/./g, function (c, i, a) {
          return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
        })

        // Check if RAW voluume is available
        volume = data.coins[item].price.RAW[item].USD.TOTALVOLUME24HTO

        // Convert to $ with commas
        volume = '$ ' + parseFloat(volume).toFixed(2).replace(/./g, function (c, i, a) {
          return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
        })
      }

      return (
        <CoinItem key={item} counter={i + 1} icon={icon} name={name} price={price} volume={volume} supply={supply} />
      )
    })

    html.unshift((<CoinItem key={'header'} header counter={'#'} name={'Name'} price={'Price'} volume={'Volume'} supply={'Supply'} />))

    return html
  }

  render() {

    return (
      <div className="App" >
        <Grid>
          {this.renderCoinList()}
        </Grid>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    data: state.coins
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchCoins: bindActionCreators(fetchCoins, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)