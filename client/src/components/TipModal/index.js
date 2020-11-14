// React
import React, { useState } from 'react'
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

const TipModal = ({ show, onHide }) => {
  const [addresses] = useState({
    BTC: process.env.REACT_APP_BTC_ADDRESS,
    ETH: process.env.REACT_APP_ETH_ADDRESS,
    LTC: process.env.REACT_APP_LTC_ADDRESS,
  })
  const [copied, setCopied] = useState({
    BTC: false,
    ETH: false,
    LTC: false,
  })

  const renderAddress = (title, wasCopied, address, handleCopy) => (
    <>
      <h4>
        {title}
        {wasCopied ? <span className={`green ${styles.copied}`}>Copied</span> : null}
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

  return (
    <Modal show={show} onHide={onHide}>
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
        {renderAddress('Bitcoin', copied.BTC, addresses.BTC, () =>
          setCopied({
            BTC: true,
            ETH: false,
            LTC: false,
          })
        )}
        <hr />
        {renderAddress('Ethereum', copied.ETH, addresses.ETH, () =>
          setCopied({
            BTC: false,
            ETH: true,
            LTC: false,
          })
        )}
        <hr />
        {renderAddress('Litecoin', copied.LTC, addresses.LTC, () =>
          setCopied({
            BTC: false,
            ETH: false,
            LTC: true,
          })
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

TipModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default TipModal
