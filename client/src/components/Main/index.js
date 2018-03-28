// React
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Grid, Row, Col } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchCoins } from '../../actions'

// App
import CoinItem from '../CoinItem'
import './index.css'

class Main extends Component {
  state = { loading: true }

  componentDidMount() {
    this.props.fetchCoins().then(() => {
      this.setState({ loading: false })
    })
  }

  renderSeachBox = () => {
    let { coins } = this.props
    let options = ['']

    if (coins && coins.coinList) {
      options = coins.coinList
    }

    return (
      <div className="search">
        Search
        <Typeahead
          onChange={(selected) => {
            this.props.history.push("/" + selected[0].id)
          }}
          options={options}
          selected={this.state.selected}
        />
      </div>
    )
  }

  renderCoinList = () => {
    let { coins } = this.props

    if (this.state.loading) {
      return (
        <div className="loader"></div>
      )
    }

    if (!coins.coins) {
      return (
        <Row>
          Coin information is not ready, please refresh the page.
        </Row>
      )
    }

    let html = Object.keys(coins.coins).map((item, i) => {
      let name = (
        <Link to={'/' + item.toLowerCase()}>
          {coins.coins[item].FullName}
        </Link>
      )

      let icon = coins.coins[item].ImageUrl
        && coins.baseImageUrl + coins.coins[item].ImageUrl

      let price = 'N/A',
        supply = 'N/A',
        volume = 'N/A'

      // Check if RAW USD info is available
      if (coins.coins[item].price
        && coins.coins[item].price.USD) {
        // Check if RAW price is available
        price = coins.coins[item].price.USD.PRICE

        // Convert to $ with commas
        price = '$ ' + parseFloat(price).toFixed(2).replace(/./g, function (c, i, a) {
          return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
        })

        // Check if RAW price is available
        supply = coins.coins[item].price.USD.SUPPLY

        // Convert to whole number with commas
        supply = parseFloat(supply).toFixed(0).replace(/./g, function (c, i, a) {
          return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
        })

        // Check if RAW voluume is available
        volume = coins.coins[item].price.USD.TOTALVOLUME24HTO

        // Convert to $ with commas
        volume = '$ ' + parseFloat(volume).toFixed(2).replace(/./g, function (c, i, a) {
          return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
        })
      }

      return (
        <CoinItem key={item} counter={i + 1} icon={icon} name={name} price={price} volume={volume} supply={supply} />
      )
    })

    html.unshift((<CoinItem key={'header'} header counter={'#'} name={'Name'} price={'Price'} volume={'Volume'} supply={'Circulating'} />))

    return html
  }

  render() {
    return (
      <div className="Main" >
        <Grid>
          <Row className="page-title">
            <Col xs={12} md={6}>
              <h3>Watch List</h3>
            </Col>
            <Col xs={12} md={6}>
              {this.renderSeachBox()}
            </Col>
          </Row>
          {this.renderCoinList()}
        </Grid>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    coins: state.coins
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
)(Main)