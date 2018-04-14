// React
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Grid, Row, Col } from 'react-bootstrap'
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

class Main extends Component {
  state = { loading: true }

  componentDidMount() {
    this.props.fetchCoins().then(() => {
      this.setState({ loading: false })
    })
  }

  renderSeachBox = () => {
    const { coins } = this.props
    let options = ['']

    if (coins && coins.coinList) {
      options = coins.coinList
    }

    return (
      <div className="search">
        <Typeahead
          placeholder="Search"
          onChange={(selected) => {
            this.props.history.push(`/${selected[0].id}`)
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
      return (
        <div className="loader" />
      )
    }

    if (!coins.coins) {
      return (
        <Row>
          Coin information is not ready, please refresh the page.
        </Row>
      )
    }

    const html = Object.keys(coins.coins).map((item, i) => {
      const name = coins.coins[item].FullName

      const icon = coins.coins[item].ImageUrl
        && coins.baseImageUrl + coins.coins[item].ImageUrl

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
            counter={i + 1}
            icon={icon}
            name={name}
            price={price}
            volume={volume}
            supply={supply}
          />
        </Link>
      )
    })

    html.unshift((<CoinItem key="header" header counter="#" name="Name" price="Price" volume="Volume" supply="Circulating" />))

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

Main.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
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
