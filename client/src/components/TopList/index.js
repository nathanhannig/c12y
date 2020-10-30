// React
import React from 'react'
import { Link } from 'react-router-dom'
// import { Row, Col } from 'react-bootstrap'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import PropTypes from 'prop-types'

// App
import './index.css'

const TopList = (props) => {
  const { name, list } = props

  const listItems = list.map((item) => {
    let valueStyle = 'green'

    if (item.value[0] === '-') {
      valueStyle = 'red'
    } else if (item.value === '0.00%' || item.value === 'N/A') {
      valueStyle = ''
    }

    return (
      <Link key={item.id} to={item.id}>
        <Row className="item">
          <Col xs={6}>{item.name}</Col>
          <Col className={`right ${valueStyle}`} xs={6}>{item.value}</Col>
        </Row>
      </Link>
    )
  })

  return (
    <div className="TopList">
      <Row>
        <Col xs={12}>
          <p className="title">{name}</p>
        </Col>
      </Row>
      {listItems}
    </div>
  )
}

TopList.propTypes = {
  name: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
}

export default TopList
