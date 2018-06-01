// React
import React, { Component } from 'react'
// import { Row, Col } from 'react-bootstrap'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

// Redux
import { bindActionCreators } from 'redux'
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
            this.props.push(`/${selected[0].id}`)
          }}
          options={options}
          selected={this.state.selected}
        />
      </div>
    )
  }

  render() {
    const { coins } = this.props

    const totalMarketCap = coins.totalMarketCap &&
      API.formatDollarsWholeNumber(coins.totalMarketCap)

    const totalVolume24h = coins.totalVolume24h &&
      API.formatDollarsWholeNumber(coins.totalVolume24h)

    const btcDominance = coins.btcDominance &&
      API.formatPercent(coins.btcDominance)


    return (
      <div className="metrics">
        <Row>
          <Col xs={6} md={6}>
            <Row>
              <Col xs={12} md={6}>
                <Row>
                  <Col className="header" xs={12}>Market Cap</Col>
                  <Col className="value" xs={12}>
                    {totalMarketCap}
                  </Col>
                </Row>
              </Col>
              <Col xs={12} md={6}>
                <Row>
                  <Col className="header" xs={12}>24H Volume</Col>
                  <Col className="value" xs={12}>
                    {totalVolume24h}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col xs={6} md={6}>
            <Row>
              <Col xs={12} md={6}>
                <Row>
                  <Col className="header" xs={12}>BTC Dominance</Col>
                  <Col className="value" xs={12}>
                    {btcDominance}
                  </Col>
                </Row>
              </Col>
              <Col xs={12} md={6}>
                {this.renderSearchBox()}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}

Metrics.propTypes = {
  push: PropTypes.func.isRequired,
  coins: PropTypes.object.isRequired,
}

function mapDispatchToProps(dispatch) {
  return {
    push: bindActionCreators(push, dispatch),
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(withRouter(Metrics))
