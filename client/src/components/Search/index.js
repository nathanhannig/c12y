// React
import React, { Component } from 'react'
// import { Row, Col } from 'react-bootstrap'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

// App
import { IoAndroidSearch as SearchIcon } from 'react-icons/lib/io'
import './index.css'

class Search extends Component {
  state = {}

  handleChange = (selected) => {
    this.setState({ selected })
    this.props.history.push(`/${selected[0].id}`)
  }

  render() {
    const { coins } = this.props
    let options = ['']

    if (coins && coins.coinList) {
      options = coins.coinList
    }

    return (
      <Row>
        <Col xs={12}>
          <div className="search">
            <div className="search-input">
              <Typeahead
                placeholder="Find a coin"
                bsSize="large"
                onChange={this.handleChange}
                options={options}
                selected={this.state.selected}
              />
            </div>
            <div className="search-icon">
              <SearchIcon />
            </div>
          </div>
        </Col>
      </Row>
    )
  }
}

Search.propTypes = {
  history: PropTypes.object.isRequired,
  coins: PropTypes.object.isRequired,
}

export default withRouter(Search)
