// React
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Grid, Row, Pager } from 'react-bootstrap'

// Redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchCoins } from '../../actions'

// App
import CoinItem from '../CoinItem'
import './index.css'

class Coins extends Component {
  state = { loading: true }

  componentDidMount() {
    const page = !isNaN(this.props.match.params.page) && parseInt(this.props.match.params.page, 10) > 0
      ? parseInt(this.props.match.params.page, 10)
      : 1

    this.props.fetchCoins(page).then(() => {
      this.setState({ loading: false })
    })
  }

  renderCoinList = () => {
    let { coins } = this.props

    if (this.state.loading) {
      return (<div className="loader"></div>)
    }

    if (!coins.coins) {
      return (<Row>Coin information is not ready, please refresh the page.</Row>)
    }

    if (Object.keys(coins.coins).length === 0) {
      return (<Row>No coins to list.</Row>)
    }

    let html = Object.keys(coins.coins).map((item, i) => {
      let counter = coins.begin + i + 1

      let name = (
        <Link to={'/' + item.toLowerCase()}>
          {coins.coins[item].FullName}
        </Link>
      )

      let icon = coins.coins[item].ImageUrl
        && coins.baseImageUrl + coins.coins[item].ImageUrl

      let price = 'N/A', supply = 'N/A', volume = 'N/A'

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
        <CoinItem key={item} counter={counter} icon={icon} name={name} price={price} volume={volume} supply={supply} />
      )
    })

    html.unshift((<CoinItem key={'header'} header counter={'#'} name={'Name'} price={'Price'} volume={'Volume'} supply={'Circulating'} />))

    return html
  }

  renderPager = () => {
    let { coins } = this.props

    if (!coins.coins || Object.keys(coins.coins).length === 0) {
      return ''
    }

    const page = parseInt(coins.page, 10)
    let last = Math.ceil(parseInt(coins.total, 10) / 100)

    let pager
    if (page === 1) {
      pager = (
        <Pager>
          <LinkContainer to={"/coins/" + (page + 1)}>
            <Pager.Item next>
              Next 100 &rarr;
            </Pager.Item>
          </LinkContainer>
        </Pager>
      )
    } else if (page === last) {
      pager = (
        <Pager>
          <LinkContainer to={"/coins/" + (page - 1)}>
            <Pager.Item previous>&larr; Previos 100</Pager.Item>
          </LinkContainer>
        </Pager>
      )
    } else {
      pager = (
        <Pager>
          <LinkContainer to={"/coins/" + (page - 1)}>
            <Pager.Item previous>&larr; Previos 100</Pager.Item>
          </LinkContainer>
          <LinkContainer to={"/coins/" + (page + 1)}>
            <Pager.Item next>Next 100 &rarr;</Pager.Item>
          </LinkContainer>
        </Pager>
      )
    }

    return pager
  }

  render() {
    return (
      <div className="Coins" >
        <Grid>
          <h3>Coin List</h3>
          {this.renderPager()}
          {this.renderCoinList()}
          {this.renderPager()}
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
)(Coins)