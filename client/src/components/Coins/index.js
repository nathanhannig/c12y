// React
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Grid, Row, Col, Pager } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'

// Redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { fetchCoins } from '../../actions'

// App
import CoinItem from '../CoinItem'
import API from '../../utils'
import './index.css'

class Coins extends Component {
  state = { loading: true }

  componentDidMount() {
    const { match } = this.props

    const page =
      !Number.isNaN(match.params.page) &&
      parseInt(match.params.page, 10) > 0
        ? parseInt(match.params.page, 10)
        : 1

    this.props.fetchCoins(page).then(() => {
      this.setState({ loading: false })
    })
  }

  renderSeachBox = () => {
    const { coins, history } = this.props

    let options = ['']

    if (coins && coins.coinList) {
      options = coins.coinList
    }

    return (
      <div className="search">
        <Typeahead
          placeholder="Search"
          onChange={(selected) => {
            history.push(`/${selected[0].id}`)
          }}
          options={options}
          selected={this.state.selected}
        />
      </div>
    )
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

      // Check if RAW USD info is available
      if (coins.prices[item]) {
        // Convert to $ with commas
        price = API.formatToDollars(coins.prices[item].PRICE)

        // Convert to whole number with commas
        supply = API.formatToWholeNumber(coins.prices[item].SUPPLY)

        // Convert to $ with commas
        volume = API.formatToDollars(coins.prices[item].TOTALVOLUME24HTO)
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
          />
        </Link>
      )
    })

    html.unshift(<CoinItem
      key="header"
      header
      counter="#"
      name="Name"
      price="Price"
      volume="Volume"
      supply="Circulating"
    />)

    return html
  }

  renderPager = () => {
    const { coins } = this.props

    if (!coins.coins || Object.keys(coins.coins).length === 0) {
      return ''
    }

    const page = parseInt(coins.page, 10)
    const last = Math.ceil(parseInt(coins.total, 10) / 100)

    let pager
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
            <Pager.Item previous>&larr; Previos 100</Pager.Item>
          </LinkContainer>
        </Pager>
      )
    } else {
      pager = (
        <Pager>
          <LinkContainer to={`/coins/${page - 1}`}>
            <Pager.Item previous>&larr; Previos 100</Pager.Item>
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
    return (
      <div className="Coins">
        <Grid>
          <Row className="page-title">
            <Col xs={12} md={6}>
              <h3>Coins List</h3>
            </Col>
            <Col xs={12} md={6}>
              {this.renderSeachBox()}
            </Col>
          </Row>
          {this.renderPager()}
          {this.renderCoinList()}
          {this.renderPager()}
        </Grid>
      </div>
    )
  }
}

Coins.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
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
