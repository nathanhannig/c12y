import React, { useEffect } from 'react'
import ReactGA from 'react-ga'
import PropTypes from 'prop-types'

const DEFAULT_CONFIG = {
  // Un-comment below lines to use for development debugging
  // trackingId: '',
  // debug: true,
  // gaOptions: {
  //   cookieDomain: 'none',
  // },
}

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID, DEFAULT_CONFIG)

export default (WrappedComponent, options = {}) => {
  const trackPage = (page) => {
    ReactGA.set({
      page,
      ...options,
    })
    ReactGA.pageview(page)
  }

  const HOC = (props) => {
    useEffect(() => trackPage(props.location.pathname), [props.location.pathname])

    // eslint-disable-next-line
    return <WrappedComponent {...props} />
  }

  HOC.propTypes = {
    location: PropTypes.object.isRequired,
  }

  return HOC
}
