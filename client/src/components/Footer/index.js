// React
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Button from 'react-bootstrap/lib/Button'

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
      <Grid>
        <Row className={styles.topLists}>
          <Col xsHidden sm={1} />
          <Col xs={12} sm={4}>
            {gainers.list !== undefined ? (
              <TopList
                name="Top Gainers"
                list={gainers.list.map((item) => {
                  const newValue = API.formatPercent(item.value)

                  return { id: item.id, name: item.name, value: newValue }
                })}
              />
            ) : (
              ''
            )}
          </Col>
          <Col xsHidden sm={2} />
          <Col xs={12} sm={4}>
            {losers.list !== undefined ? (
              <TopList
                name="Top Losers"
                list={losers.list.map((item) => {
                  const newValue = API.formatPercent(item.value)

                  return { id: item.id, name: item.name, value: newValue }
                })}
              />
            ) : (
              ''
            )}
          </Col>
          <Col xsHidden sm={1} />
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
            <Button bsStyle="success" onClick={handleModalShow}>
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
      </Grid>

      <TipModal show={showModal} onHide={handleModalClose} />
    </footer>
  )
}

export default Footer
