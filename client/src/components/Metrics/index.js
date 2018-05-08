// React
import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

// Redux
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

// App
import API from '../../utils'
import './index.css'

class Metrics extends Component {
  state = {}

  renderSearchBox = () => {
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
            this.setState({ selected })
            // this.props.history.push(`/${selected[0].id}`)
            this.props.dispatch(push(`/${selected[0].id}`))
          }}
          options={options}
          selected={this.state.selected}
        />
      </div>
    )
  }

  render() {
    const { coins } = this.props

    const btcDominance = coins.prices && coins.prices.BTC && coins.totalMarketCap &&
      API.formatPercent((coins.prices.BTC.MKTCAP / coins.totalMarketCap) * 100)

    const totalMarketCap = coins.totalMarketCap &&
      API.formatDollars(coins.totalMarketCap)

    const totalVolume24h = coins.totalVolume24h &&
      API.formatDollars(coins.totalVolume24h)

    return (
      <div className="metrics">
        <Row>
          <Col xs={12} md={3}>
            <Row>
              <Col className="header" xs={12}>Market Cap</Col>
              <Col className="value" xs={12}>
                {totalMarketCap}
              </Col>
            </Row>
          </Col>
          <Col xs={12} md={3}>
            <Row>
              <Col className="header" xs={12}>24H Volume</Col>
              <Col className="value" xs={12}>
                {totalVolume24h}
              </Col>
            </Row>
          </Col>
          <Col xs={12} md={3}>
            <Row>
              <Col className="header" xs={12}>BTC Dominance</Col>
              <Col className="value" xs={12}>
                {btcDominance}
              </Col>
            </Row>
          </Col>
          <Col xs={12} md={3}>
            {this.renderSearchBox()}
          </Col>
        </Row>
      </div>
    )
  }
}

Metrics.propTypes = {
  dispatch: PropTypes.func.isRequired,
  coins: PropTypes.object.isRequired,
}

export default connect()(withRouter(Metrics))
