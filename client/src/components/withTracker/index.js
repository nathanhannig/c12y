import React, { Component } from 'react'
import GoogleAnalytics from 'react-ga'
import PropTypes from 'prop-types'

const DEFAULT_CONFIG = {
  // // Un-comment below lines to use for development debugging
  // trackingId: '',
  // debug: true,
  // gaOptions: {
  //   cookieDomain: 'none',
  // },
}

GoogleAnalytics.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID, DEFAULT_CONFIG)

const withTracker = (ChildComponent, options = {}) => {
  const trackPage = (page) => {
    GoogleAnalytics.set({
      page,
      ...options,
    })
    GoogleAnalytics.pageview(page)
  }

  class ComposedComponent extends Component {
    componentDidMount() {
      const page = this.props.location.pathname
      trackPage(page)
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      const currentPage = this.props.location.pathname
      const nextPage = nextProps.location.pathname

      if (currentPage !== nextPage) {
        trackPage(nextPage)
      }
    }

    render() {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <ChildComponent {...this.props} />
    }
  }

  ComposedComponent.propTypes = {
    location: PropTypes.object.isRequired,
  }

  return ComposedComponent
}

export default withTracker
