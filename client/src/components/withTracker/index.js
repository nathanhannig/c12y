import React, { useEffect } from 'react'
import ReactGA from 'react-ga'
import PropTypes from 'prop-types'

let DEFAULT_CONFIG = {}

if (process.env.NODE_ENV === 'development') {
  DEFAULT_CONFIG = {
    ...DEFAULT_CONFIG,
    ...{
      debug: true,
      gaOptions: {
        cookieDomain: 'none',
      },
    },
  }
}

if (process.env.NODE_ENV === 'test') {
  DEFAULT_CONFIG = {
    ...DEFAULT_CONFIG,
    ...{
      testMode: true,
    },
  }
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
