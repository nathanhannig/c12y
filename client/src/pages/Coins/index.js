// React
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Container, Row, Col, Pagination } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { formatDistance } from 'date-fns'
import numberisNaN from 'number-is-nan'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { fetchCoins } from '../../actions'

// App
import Search from '../../components/Search'
import CoinItem from '../../components/CoinItem'
import API from '../../utils'

const Coins = ({ match, history }) => {
  const dispatch = useDispatch()

  const coinList = useSelector((state) => state.coins)
  const { loading, coins, prices, list, page = 0, begin = 0, end = 0, total = 0, lastUpdated } = coinList

  useEffect(() => {
    if (match.params.page) {
      // Check if page value is valid
      if (numberisNaN(Number(match.params.page)) || parseInt(match.params.page, 10) < 1) {
        history.replace('/coins')
      }

      dispatch(fetchCoins(parseInt(match.params.page, 10)))
    } else {
      // No page parameter provided, default to page 1
      dispatch(fetchCoins(1))
    }
  }, [dispatch, match, history])

  const renderCoinList = () => {
    if (loading) {
      return <div className="loader" />
    }

    if (!coins) {
      return (
        <Row>
          <Col xs={12}>
            <p>Coin information is not ready, please refresh the page.</p>
          </Col>
        </Row>
      )
    }

    if (Object.keys(coins).length === 0) {
      return (
        <Row>
          <Col xs={12}>No coins to list.</Col>
        </Row>
      )
    }

    const html = Object.keys(coins).map((item, i) => {
      const counter = begin + i + 1
      const { name } = coins[item]

      const icon = coins[item].image && coins[item].image.small

      let price = 'N/A'
      let change = 'N/A'
      let supply = 'N/A'
      let volume = 'N/A'
      let marketCap = 'N/A'

      if (prices[item]) {
        // Convert to $ with commas
        price = API.formatDollars(prices[item].price)

        // Convert to percent
        change = API.formatPercent(prices[item].change_percentage_24h)

        // Convert to whole number with commas
        supply = API.formatWholeNumber(prices[item].circulating_supply)

        // Convert to whole $ with commas
        volume = API.formatDollarsWholeNumber(prices[item].volume_24h)
        marketCap = API.formatDollarsWholeNumber(prices[item].market_cap)
      }

      return (
        <Link key={item} to={`/${item.toLowerCase()}`}>
          <CoinItem
            counter={counter}
            icon={icon}
            name={name}
            price={price}
            change={change}
            volume={volume}
            supply={supply}
            marketCap={marketCap}
          />
        </Link>
      )
    })

    html.unshift(
      <CoinItem
        key="header"
        header
        counter="#"
        name="Name"
        price="Price"
        change="Change"
        volume="24h Volume"
        marketCap="Market Cap"
      />
    )

    html.push(
      <Row key="lastUpdated" className="last-updated">
        <Col xs={12}>
          <p>Last updated {formatDistance(lastUpdated, new Date(), { addSuffix: true })}</p>
        </Col>
      </Row>
    )

    return html
  }

  const renderPager = () => {
    if (loading || !coins || Object.keys(coins).length === 0) {
      return ''
    }

    const currentPage = parseInt(page, 10)
    const lastPage = Math.ceil(parseInt(total, 10) / 100)

    let pager = ''

    if (currentPage === 1) {
      pager = (
        <Pagination className="flex-row-reverse justify-content-between">
          <LinkContainer to={`/coins/${currentPage + 1}`} exact>
            <Pagination.Item>Next 100 &rarr;</Pagination.Item>
          </LinkContainer>
        </Pagination>
      )
    } else if (currentPage === lastPage) {
      pager = (
        <Pagination>
          <LinkContainer to={`/coins/${currentPage - 1}`} exact>
            <Pagination.Item>&larr; Previous 100</Pagination.Item>
          </LinkContainer>
        </Pagination>
      )
    } else if (currentPage > 1 && currentPage < lastPage) {
      pager = (
        <Pagination className="justify-content-between">
          <LinkContainer to={`/coins${currentPage - 1 === 1 ? '' : `/${currentPage - 1}`}`} exact>
            <Pagination.Item>&larr; Previous 100</Pagination.Item>
          </LinkContainer>
          <LinkContainer to={`/coins/${currentPage + 1}`} exact>
            <Pagination.Item>Next 100 &rarr;</Pagination.Item>
          </LinkContainer>
        </Pagination>
      )
    }

    return pager
  }

  return (
    <div>
      {!loading ? (
        <Helmet>
          <meta charSet="utf-8" />
          <title>{`Coins (List ${begin + 1} - ${end + 1}) | c12y.com`}</title>
          <link rel="canonical" href={`https://c12y.com/coins${page === 1 ? '' : `/${page}`}`} />
          <meta name="description" content={`List of the top ${begin + 1} - ${end + 1} cryptocurrency coins.`} />
        </Helmet>
      ) : (
        ''
      )}
      <Container>
        <Search list={list} />
      </Container>
      <Container>
        <Row>
          <Col xs={12}>
            {!loading ? (
              <h3 className="mt-4 mb-2">
                Coins (List {begin + 1} - {end + 1})
              </h3>
            ) : (
              ''
            )}
          </Col>
        </Row>
        {renderPager()}
        {renderCoinList()}
        {renderPager()}
      </Container>
    </div>
  )
}

Coins.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
}

export default Coins
