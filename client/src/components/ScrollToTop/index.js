import { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'

const ScrollToTop = ({ children, location }) => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return children
}

ScrollToTop.propTypes = {
  children: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default withRouter(ScrollToTop)
