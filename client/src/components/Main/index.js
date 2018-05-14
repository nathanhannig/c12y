// React
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Grid, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'

// Redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { fetchCoins } from '../../actions'

// App
import moment from 'moment'
import Metrics from '../Metrics'
import CoinItem from '../CoinItem'
import API from '../../utils'
import './index.css'

class Main extends Component {
  state = { loading: true }

  async componentDidMount() {
    try {
      await this.props.fetchCoins()
    } finally {
      this.setState({ loading: false })
    }
  }

  renderCoinList = () => {
    const { coins } = this.props

    if (this.state.loading) {
      return <div className="loader" />
    }

    if (!coins.coins) {
      return <Row>Coin information is not ready, please refresh the page.</Row>
    }

    const html = Object.keys(coins.coins).map((item, i) => {
      const name = coins.coins[item].FullName

      const icon = coins.coins[item].ImageUrl
        && coins.baseImageUrl + coins.coins[item].ImageUrl

      let price = 'N/A'
      let supply = 'N/A'
      let volume = 'N/A'
      let marketCap = 'N/A'

      // Check if RAW USD info is available
      if (coins.prices[item]) {
        // Convert to $ with commas
        price = API.formatDollars(coins.prices[item].PRICE)

        // Convert to whole number with commas
        supply = API.formatWholeNumber(coins.prices[item].SUPPLY)

        // Convert to whole $ with commas
        volume = API.formatDollarsWholeNumber(coins.prices[item].TOTALVOLUME24HTO)
        marketCap = API.formatDollarsWholeNumber(coins.prices[item].MKTCAP)
      }

      return (
        <Link key={item} to={`/${item.toLowerCase()}`}>
          <CoinItem
            counter={i + 1}
            icon={icon}
            name={name}
            price={price}
            volume={volume}
            supply={supply}
            marketCap={marketCap}
          />
        </Link>
      )
    })

    html.unshift((
      <CoinItem
        key="header"
        header
        counter="#"
        name="Name"
        price="Price"
        volume="Volume"
        supply="Circulating"
      />
    ))

    html.push((
      <Link key="viewAllCoins" to="/coins">
        <Row className="viewAllCoins">
          <Col xs={12}>
            <p>View Top 100 Coins</p>
          </Col>
        </Row>
      </Link>
    ))

    html.push((
      <Row key="lastUpdated" className="last-updated">
        <Col xs={12}>
          <p>Last updated: { moment(this.props.coins.lastUpdated).fromNow() }</p>
        </Col>
      </Row>
    ))

    return html
  }

  render() {
    return (
      <div className="Main" >
        <Grid>
          <Metrics coins={this.props.coins} />
          {this.renderCoinList()}
        </Grid>
      </div>
    )
  }
}

Main.propTypes = {
  fetchCoins: PropTypes.func.isRequired,
  coins: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    coins: state.coins,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchCoins: bindActionCreators(fetchCoins, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main)
