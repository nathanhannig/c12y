// React
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet';

// Redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { formatDistance } from 'date-fns'
import { fetchCoins } from '../../actions'

// App
import Metrics from '../../components/Metrics'
import Search from '../../components/Search'
import CoinItem from '../../components/CoinItem'
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
      return (
        <Row>
          <Col xs={12}>
            <p>Coin information is not ready, please refresh the page.</p>
          </Col>
        </Row>
      )
    }

    const html = Object.keys(coins.coins).map((item, i) => {
      const { name } = coins.coins[item]

      const icon = coins.coins[item].image && coins.coins[item].image.small

      let price = 'N/A'
      let change = 'N/A'
      let supply = 'N/A'
      let volume = 'N/A'
      let marketCap = 'N/A'

      if (coins.prices[item]) {
        // Convert to $ with commas
        price = API.formatDollars(coins.prices[item].price)

        // Convert to percent
        change = API.formatPercent(coins.prices[item].change_percentage_24h)

        // Convert to whole number with commas
        supply = API.formatWholeNumber(coins.prices[item].circulating_supply)

        // Convert to whole $ with commas
        volume = API.formatDollarsWholeNumber(coins.prices[item].volume_24h)
        marketCap = API.formatDollarsWholeNumber(coins.prices[item].market_cap)
      }

      return (
        <Link key={item} to={`/${item.toLowerCase()}`}>
          <CoinItem
            counter={i + 1}
            icon={icon}
            name={name}
            price={price}
            change={change}
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
        change="Change"
        volume="Volume"
        supply="Circulating"
      />
    ))

    html.push((
      <Row key="lastUpdated" className="last-updated">
        <Col xs={12}>
          <p>


Last updated
            {' '}
            { formatDistance(this.props.coins.lastUpdated, new Date(), { addSuffix: true }) }
          </p>
        </Col>
      </Row>
    ))

    html.push((
      <Link key="viewTopCoins" to="/coins">
        <Row className="viewTopCoins">
          <Col xs={12}>
            <p>View Top 100 Coins</p>
          </Col>
        </Row>
      </Link>
    ))

    return html
  }

  render() {
    return (
      <div className="Main">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Cryptocurrency Prices - c12y.com</title>
          <link rel="canonical" href="https://c12y.com/" />
          <meta name="description" content="The latest cryptocurrency prices of you favorite coins (BTC, ETH, LTC, EOS, BCH, DASH)." />
        </Helmet>
        <Grid>
          <Metrics coins={this.props.coins} />
          <Search coins={this.props.coins} />
        </Grid>
        <Grid>
          <Row>
            <Col xs={12}>
              <h3>Featured Coins</h3>
            </Col>
          </Row>
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
