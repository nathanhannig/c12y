// React
import React, { useState } from 'react'
import { Container, Row, Col, Modal, Button, InputGroup, FormControl } from 'react-bootstrap'
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
      <h5>
        {title}
        {wasCopied ? <span className={`green ${styles.copied}`}>Copied</span> : null}
      </h5>

      <InputGroup>
        <FormControl type="text" readOnly defaultValue={address} />
        <InputGroup.Append>
          <CopyToClipboard text={address} onCopy={handleCopy}>
            <Button variant="outline-primary">Copy</Button>
          </CopyToClipboard>
        </InputGroup.Append>
      </InputGroup>
    </>
  )

  return (
    <Modal size="lg" show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Give A Tip Of Crypto!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
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
        </Container>
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
