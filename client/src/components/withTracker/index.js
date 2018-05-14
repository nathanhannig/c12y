import React, { Component } from 'react'
import GoogleAnalytics from 'react-ga'
import PropTypes from 'prop-types'

const DEFAULT_CONFIG = {
  // Un-comment below lines to use for development debugging
  // trackingId: '',
  // debug: true,
  // gaOptions: {
  //   cookieDomain: 'none',
  // },
}

GoogleAnalytics.initialize(
  process.env.REACT_APP_GOOGLE_ANALYTICS_ID,
  DEFAULT_CONFIG,
)

const withTracker = (WrappedComponent, options = {}) => {
  const trackPage = (page) => {
    GoogleAnalytics.set({
      page,
      ...options,
    })
    GoogleAnalytics.pageview(page)
  }

  const HOC = class extends Component {
    componentDidMount() {
      const page = this.props.location.pathname
      trackPage(page)
    }

    componentWillReceiveProps(nextProps) {
      const currentPage = this.props.location.pathname
      const nextPage = nextProps.location.pathname

      if (currentPage !== nextPage) {
        trackPage(nextPage)
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  HOC.propTypes = {
    location: PropTypes.object.isRequired,
  }

  return HOC
}

export default withTracker
