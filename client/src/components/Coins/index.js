// React
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Grid, Row, Col, Pager } from 'react-bootstrap'
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

class Coins extends Component {
  state = { loading: true }

  async componentDidMount() {
    const { match } = this.props

    const page =
      !Number.isNaN(match.params.page) &&
      parseInt(match.params.page, 10) > 0
        ? parseInt(match.params.page, 10)
        : 1

    try {
      await this.props.fetchCoins(page)
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

    if (Object.keys(coins.coins).length === 0) {
      return <Row>No coins to list.</Row>
    }

    const html = Object.keys(coins.coins).map((item, i) => {
      const counter = coins.begin + i + 1

      const name = coins.coins[item].FullName

      const icon =
        coins.coins[item].ImageUrl &&
        coins.baseImageUrl + coins.coins[item].ImageUrl

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
            counter={counter}
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
      <Row key="lastUpdated" className="last-updated">
        <Col xs={12}>
          <p>Last updated: { moment(this.props.coins.lastUpdated).fromNow() }</p>
        </Col>
      </Row>
    ))

    return html
  }

  renderPager = () => {
    const { coins } = this.props

    if (this.state.loading ||
      (!coins.coins || Object.keys(coins.coins).length === 0)) {
      return ''
    }

    const page = parseInt(coins.page, 10)
    const last = Math.ceil(parseInt(coins.total, 10) / 100)

    let pager = ''

    if (page === 1) {
      pager = (
        <Pager>
          <LinkContainer to={`/coins/${page + 1}`}>
            <Pager.Item next>Next 100 &rarr;</Pager.Item>
          </LinkContainer>
        </Pager>
      )
    } else if (page === last) {
      pager = (
        <Pager>
          <LinkContainer to={`/coins/${page - 1}`}>
            <Pager.Item previous>&larr; Previous 100</Pager.Item>
          </LinkContainer>
        </Pager>
      )
    } else if (page > 1 && page < last) {
      pager = (
        <Pager>
          <LinkContainer to={`/coins/${page - 1}`}>
            <Pager.Item previous>&larr; Previous 100</Pager.Item>
          </LinkContainer>
          <LinkContainer to={`/coins/${page + 1}`}>
            <Pager.Item next>Next 100 &rarr;</Pager.Item>
          </LinkContainer>
        </Pager>
      )
    }

    return pager
  }

  render() {
    const renderPager = this.renderPager()

    return (
      <div className="Coins">
        <Grid>
          <Metrics coins={this.props.coins} />
          {renderPager}
          {this.renderCoinList()}
          {renderPager}
        </Grid>
      </div>
    )
  }
}

Coins.propTypes = {
  match: PropTypes.object.isRequired,
  fetchCoins: PropTypes.func.isRequired,
  coins: PropTypes.object.isRequired,
}

function mapStateToProps({ coins }) {
  return {
    coins,
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
)(Coins)
