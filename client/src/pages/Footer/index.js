// React
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// import { Grid, Row, Col, Button } from 'react-bootstrap'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Button from 'react-bootstrap/lib/Button'
import { IoAndroidHappy as SmileyFace } from 'react-icons/lib/io'
import PropTypes from 'prop-types'

// Redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { fetchGainers, fetchLosers } from '../../actions'

// App
import format from 'date-fns/format'
import TopList from '../../components/TopList'
import TipModal from '../../components/TipModal'
import API from '../../utils'
import './index.css'

class Footer extends Component {
  state = {
    showModal: false,
  }

  componentDidMount() {
    this.props.fetchGainers()
    this.props.fetchLosers()
  }

  handleModalShow = () => {
    this.setState({
      showModal: true,
    })
  }

  handleModalClose = () => {
    this.setState({
      showModal: false,
    })
  }

  render() {
    return (
      <footer>
        <Grid>
          <Row className="topLists">
            <Col xsHidden sm={1} />
            <Col xs={12} sm={4}>
              { this.props.gainers.list !== undefined ?
                <TopList
                  name="Top Gainers"
                  list={this.props.gainers.list.map((item) => {
                    const newValue = API.formatPercent(item.value)

                    return { name: item.name, value: newValue }
                  })}
                /> :
              ''
            }
            </Col>
            <Col xsHidden sm={2} />
            <Col xs={12} sm={4}>
              { this.props.losers.list !== undefined ?
                <TopList
                  name="Top Losers"
                  list={this.props.losers.list.map((item) => {
                    const newValue = API.formatPercent(item.value)

                    return { name: item.name, value: newValue }
                  })}
                /> :
              ''
            }
            </Col>
            <Col xsHidden sm={1} />
          </Row>
          <Row className="nav">
            <Col xs={12}>
              <ul>
                <li>Copyright &copy; { format(new Date(), 'yyyy') } by c12y.com</li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
              </ul>
            </Col>
          </Row>
          <Row className="tip">
            <Col xs={12}>
              <Button bsStyle="success" onClick={this.handleModalShow}>
                <SmileyFace size={40} /> Give A Tip!
              </Button>
            </Col>
          </Row>
        </Grid>

        <TipModal show={this.state.showModal} onHide={this.handleModalClose} />
      </footer >
    )
  }
}

Footer.propTypes = {
  fetchGainers: PropTypes.func.isRequired,
  fetchLosers: PropTypes.func.isRequired,
  gainers: PropTypes.object.isRequired,
  losers: PropTypes.object.isRequired,
}

function mapStateToProps(state) {
  return {
    gainers: state.gainers,
    losers: state.losers,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchGainers: bindActionCreators(fetchGainers, dispatch),
    fetchLosers: bindActionCreators(fetchLosers, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Footer)
