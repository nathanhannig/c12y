// React
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Button } from 'react-bootstrap'

// Redux
import { useDispatch, useSelector } from 'react-redux'
// App
import { IoMdHappy as SmileyFace } from 'react-icons/io'
import format from 'date-fns/format'
import { fetchGainers, fetchLosers } from '../../actions'
import TopList from '../TopList'
import TipModal from '../TipModal'
import API from '../../utils'
import styles from './index.module.scss'

const Footer = () => {
  const [showModal, setShowModal] = useState(false)

  const dispatch = useDispatch()

  const gainers = useSelector((state) => state.gainers)
  const losers = useSelector((state) => state.losers)

  useEffect(() => {
    dispatch(fetchGainers())
    dispatch(fetchLosers())
  }, [dispatch])

  const handleModalShow = () => {
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
  }

  return (
    <footer className={styles.footer}>
      <Container>
        <Row className={styles.topLists}>
          <Col md={1} className="d-none d-md-block" />
          <Col sm={12} md={4}>
            {gainers.data && (
              <TopList
                name="Top Gainers"
                list={gainers.data.map((item) => {
                  const newValue = API.formatPercent(item.value)

                  return { id: item.id, name: item.name, value: newValue }
                })}
              />
            )}
          </Col>
          <Col md={2} className="d-none d-md-block" />
          <Col sm={12} md={4}>
            {losers.data && (
              <TopList
                name="Top Losers"
                list={losers.data.map((item) => {
                  const newValue = API.formatPercent(item.value)

                  return { id: item.id, name: item.name, value: newValue }
                })}
              />
            )}
          </Col>
          <Col md={1} className="d-none d-md-block" />
        </Row>
        <Row className={styles.nav}>
          <Col xs={12}>
            <ul>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
            </ul>
          </Col>
        </Row>
        <Row className={styles.tip}>
          <Col xs={12}>
            <Button variant="success" onClick={handleModalShow}>
              <SmileyFace className={styles.smiley} size={40} /> Give A Tip!
            </Button>
          </Col>
        </Row>
        <Row className={styles.nav}>
          <Col xs={12}>
            <ul>
              <li>Copyright &copy; {format(new Date(), 'yyyy')} by c12y.com</li>
            </ul>
          </Col>
          <Col xs={12}>
            <ul>
              <li>Powered by CoinGecko API</li>
            </ul>
          </Col>
        </Row>
      </Container>

      <TipModal show={showModal} onHide={handleModalClose} />
    </footer>
  )
}

export default Footer
