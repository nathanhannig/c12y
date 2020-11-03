// React
import React, { Component } from 'react'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import InputGroup from 'react-bootstrap/lib/InputGroup'
import FormControl from 'react-bootstrap/lib/FormControl'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import PropTypes from 'prop-types'

// App
import { IoMdHappy as SmileyFace } from 'react-icons/io'
import styles from './index.module.scss'

class TipModal extends Component {
  state = {
    addressBTC: process.env.REACT_APP_BTC_ADDRESS,
    addressETH: process.env.REACT_APP_ETH_ADDRESS,
    addressLTC: process.env.REACT_APP_LTC_ADDRESS,
    copiedBTC: false,
    copiedETH: false,
    copiedLTC: false,
  }

  renderAddress = (title, copied, address, handleCopy) => (
    <>
      <h4>
        {title}
        {copied ? <span className={`green ${styles.copied}`}>Copied</span> : null}
      </h4>
      <FormGroup>
        <InputGroup>
          <FormControl type="text" readOnly defaultValue={address} />
          <InputGroup.Button>
            <CopyToClipboard text={address} onCopy={handleCopy}>
              <Button>Copy</Button>
            </CopyToClipboard>
          </InputGroup.Button>
        </InputGroup>
      </FormGroup>
    </>
  )

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Give A Tip Of Crypto!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col xs={12} sm={9}>
              <p className="center">
                Put a smile on our faces and support us by donating to our wallet addresses below. If you would like to
                donate a cryptocurrency not listed below, please contact us!
              </p>
            </Col>
            <Col xs={12} sm={3} className="center">
              <SmileyFace size={60} />
            </Col>
          </Row>
          {this.renderAddress('Bitcoin', this.state.copiedBTC, this.state.addressBTC, () =>
            this.setState({
              copiedBTC: true,
              copiedETH: false,
              copiedLTC: false,
            })
          )}
          <hr />
          {this.renderAddress('Ethereum', this.state.copiedETH, this.state.addressETH, () =>
            this.setState({
              copiedBTC: false,
              copiedETH: true,
              copiedLTC: false,
            })
          )}
          <hr />
          {this.renderAddress('Litecoin', this.state.copiedLTC, this.state.addressLTC, () =>
            this.setState({
              copiedBTC: false,
              copiedETH: false,
              copiedLTC: true,
            })
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
}

TipModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default TipModal
