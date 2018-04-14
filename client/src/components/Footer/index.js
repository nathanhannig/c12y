// React
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Modal, Button, FormGroup, InputGroup, FormControl } from 'react-bootstrap'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { IoAndroidHappy as SmileyFace } from 'react-icons/lib/io'

// App
import moment from 'moment'
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
        <Modal.Title>Give A Tip Of Crypto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p style={{ textAlign: 'center' }}>
            Put a smile on our faces and support us by donating to our Wallet addresses below. <span style={{ fontSize: '300%' }}><SmileyFace /></span>
        </p>

        <h4>Bitcoin {this.state.copiedBTC ? <span style={{ color: 'green' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Copied</span> : null}</h4>
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

        <h4>Ethereum {this.state.copiedETH ? <span style={{ color: 'green' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Copied</span> : null}</h4>
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

        <h4>Litecoin {this.state.copiedLTC ? <span style={{ color: 'green' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Copied</span> : null}</h4>
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
        <div className="row">
          <div className="col-xs-12">
            <ul>
              <li>Copyright &copy; {moment().year()} by c12y.com</li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <Button bsStyle="link" onClick={this.handleModalShow}>
              <span style={{ fontSize: '180%' }}><SmileyFace /></span> Give A Tip!
            </Button>
          </div>
        </div>

        {this.renderTipModal()}
      </footer >
    )
  }
}
export default Footer
