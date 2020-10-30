// React
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Pager from 'react-bootstrap/lib/Pager'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet';
import { formatDistance } from 'date-fns'

// Redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { fetchCoins } from '../../actions'

// App
import Search from '../../components/Search'
import CoinItem from '../../components/CoinItem'
import API from '../../utils'
import './index.css'

Number.isNaN = require('number-is-nan')

class Coins extends Component {
  state = { loading: true }

  async componentDidMount() {
    const { match } = this.props

    let page = 1

    if (match.params.page) {
      if (Number.isNaN(Number(match.params.page))
        || parseInt(match.params.page, 10) < 1) {
        this.props.history.replace('/coins')
      }

      page = parseInt(match.params.page, 10)
    }

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
      return (
        <Row>
          <Col xs={12}>
            <p>Coin information is not ready, please refresh the page.</p>
          </Col>
        </Row>
      )
    }

    if (Object.keys(coins.coins).length === 0) {
      return (
        <Row>
          <Col xs={12}>


            No coins to list.
          </Col>
        </Row>
      )
    }

    const html = Object.keys(coins.coins).map((item, i) => {
      const counter = coins.begin + i + 1

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
            counter={counter}
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

    return html
  }

  renderPager = () => {
    const { coins } = this.props

    if (this.state.loading
      || (!coins.coins || Object.keys(coins.coins).length === 0)) {
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
          <LinkContainer to={`/coins${page - 1 === 1 ? '' : `/${page - 1}`}`}>
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
    const { coins } = this.props
    const renderPager = this.renderPager()

    return (
      <div className="Coins">
        {!this.state.loading
          ? (
            <Helmet>
              <meta charSet="utf-8" />
              <title>{`Coins (List ${coins.begin + 1} - ${coins.end + 1}) - c12y.com`}</title>
              <link rel="canonical" href={`https://c12y.com/coins${coins.page === 1 ? '' : `/${coins.page}`}`} />
              <meta name="description" content={`List of the top ${coins.begin + 1} - ${coins.end + 1} cryptocurrency coins. - c12y.com.`} />
            </Helmet>
          )
          : ''}
        <Grid>
          <Search coins={this.props.coins} />
        </Grid>
        <Grid>
          <Row>
            <Col xs={12}>
              {!this.state.loading
                ? (
                  <h3>


Coins (List
                    {' '}
                    {coins.begin + 1}
                    {' '}


-
                    {' '}
                    {coins.end + 1}


)
                  </h3>
                )
                : ''}
            </Col>
          </Row>
          {renderPager}
          {this.renderCoinList()}
          {renderPager}
        </Grid>
      </div>
    )
  }
}

Coins.propTypes = {
  history: PropTypes.object.isRequired,
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
