// React
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// import { Grid, Row, Col, Modal, Button, FormGroup, InputGroup, FormControl } from 'react-bootstrap'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import InputGroup from 'react-bootstrap/lib/InputGroup'
import FormControl from 'react-bootstrap/lib/FormControl'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { IoAndroidHappy as SmileyFace } from 'react-icons/lib/io'
import PropTypes from 'prop-types'

// Redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { fetchGainers, fetchLosers } from '../../actions'

// App
import moment from 'moment/min/moment.min'
import TopList from '../TopList'
import API from '../../utils'
import './index.css'

class Footer extends Component {
  state = {
    showModal: false,
    addressBTC: process.env.REACT_APP_BTC_ADDRESS,
    addressETH: process.env.REACT_APP_ETH_ADDRESS,
    addressLTC: process.env.REACT_APP_LTC_ADDRESS,
    copiedBTC: false,
    copiedETH: false,
    copiedLTC: false,
  }

  async componentDidMount() {
    await this.props.fetchGainers()
    await this.props.fetchLosers()
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

  renderTipModal = () => (
    <Modal show={this.state.showModal} onHide={this.handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Give A Tip Of Crypto!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xs={12} sm={9}>
            <p style={{ textAlign: 'center' }}>
              Put a smile on our faces and support us by donating to our wallet
              addresses below. If you would like to donate a cryptocurrency not
              listed below, please contact us!
            </p>
          </Col>
          <Col xs={12} sm={3} style={{ textAlign: 'center' }}>
            <SmileyFace size={60} />
          </Col>
        </Row>

        <h4>Bitcoin {this.state.copiedBTC ? <span style={{ display: 'inline-block', float: 'right' }} className="green">Copied</span> : null}</h4>
        <FormGroup>
          <InputGroup>
            <FormControl type="text" readOnly defaultValue={this.state.addressBTC} />
            <InputGroup.Button>
              <CopyToClipboard
                text={this.state.addressBTC}
                onCopy={() => this.setState({
                    copiedBTC: true,
                    copiedETH: false,
                    copiedLTC: false,
                  })}
              >
                <Button>Copy</Button>
              </CopyToClipboard>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>

        <hr />

        <h4>Ethereum {this.state.copiedETH ? <span style={{ display: 'inline-block', float: 'right' }} className="green">Copied</span> : null}</h4>
        <FormGroup>
          <InputGroup>
            <FormControl type="text" readOnly defaultValue={this.state.addressETH} />
            <InputGroup.Button>
              <CopyToClipboard
                text={this.state.addressETH}
                onCopy={() => this.setState({
                    copiedBTC: false,
                    copiedETH: true,
                    copiedLTC: false,
                  })}
              >
                <Button>Copy</Button>
              </CopyToClipboard>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>

        <hr />

        <h4>Litecoin {this.state.copiedLTC ? <span style={{ display: 'inline-block', float: 'right' }} className="green">Copied</span> : null}</h4>
        <FormGroup>
          <InputGroup>
            <FormControl type="text" readOnly defaultValue={this.state.addressLTC} />
            <InputGroup.Button>
              <CopyToClipboard
                text={this.state.addressLTC}
                onCopy={() => this.setState({
                    copiedBTC: false,
                    copiedETH: false,
                    copiedLTC: true,
                  })}
              >
                <Button>Copy</Button>
              </CopyToClipboard>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this.handleModalClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  )

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
                <li>Copyright &copy; {moment().year()} by c12y.com</li>
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

        {this.renderTipModal()}
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
