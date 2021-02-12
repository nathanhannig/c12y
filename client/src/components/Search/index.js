// React
import React, { useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

// App
import { IoMdSearch as SearchIcon } from 'react-icons/io'
import styles from './index.module.scss'

const Search = ({ history, list }) => {
  const [selections, setSelections] = useState([])

  const handleChange = (selected) => {
    setSelections(selected)
    history.push(`/${selected[0].id}`)
  }

  return (
    <Row>
      <Col xs={12}>
        <div className={styles.search}>
          <div className={styles['search-input']}>
            <Typeahead
              id="search-coins-typeahead"
              placeholder="Find a coin"
              bsSize="large"
              onChange={handleChange}
              options={list}
              selected={selections}
            />
          </div>
          <div className={styles['search-icon']}>
            <SearchIcon />
          </div>
        </div>
      </Col>
    </Row>
  )
}

Search.defaultProps = {
  list: [''],
}

Search.propTypes = {
  history: PropTypes.object.isRequired,
  list: PropTypes.array,
}

export default withRouter(Search)
