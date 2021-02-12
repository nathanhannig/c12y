// React
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import { formatDistance } from 'date-fns'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { fetchCoins, fetchTotals } from '../../actions'

// App
import Metrics from '../../components/Metrics'
import Search from '../../components/Search'
import CoinItem from '../../components/CoinItem'
import API from '../../utils'
import styles from './index.module.scss'

const Main = () => {
  const dispatch = useDispatch()

  const coinList = useSelector((state) => state.coins)
  const totals = useSelector((state) => state.totals)

  const { loading, data: coins, list, lastUpdated } = coinList
  const { data: { totalMarketCap, totalVolume24h, totalCoins, btcDominance } = {} } = totals

  useEffect(() => {
    dispatch(fetchCoins())
    dispatch(fetchTotals())
  }, [dispatch])

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

    const html = Object.keys(coins).map((item, i) => {
      const { name } = coins[item]

      const icon = coins[item].image && coins[item].image.small

      let price = 'N/A'
      let change = 'N/A'
      let supply = 'N/A'
      let volume = 'N/A'
      let marketCap = 'N/A'

      if (coins[item].prices) {
        // Convert to $ with commas
        price = API.formatDollars(coins[item].prices.price)

        // Convert to percent
        change = API.formatPercent(coins[item].prices.change_percentage_24h)

        // Convert to whole number with commas
        supply = API.formatWholeNumber(coins[item].prices.circulating_supply)

        // Convert to whole $ with commas
        volume = API.formatDollarsWholeNumber(coins[item].prices.volume_24h)
        marketCap = API.formatDollarsWholeNumber(coins[item].prices.market_cap)
      }

      return (
        <Link key={item} to={`/${item.toLowerCase()}`}>
          <CoinItem
            counter={i + 1}
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
          <p>
            Last updated{' '}
            {formatDistance(lastUpdated, new Date(), {
              addSuffix: true,
            })}
          </p>
        </Col>
      </Row>
    )

    html.push(
      <Link key="viewTopCoins" to="/coins">
        <Row className={styles.viewTopCoins}>
          <Col xs={12}>
            <p>View Top 100 Coins</p>
          </Col>
        </Row>
      </Link>
    )

    return html
  }

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Cryptocurrency Prices | c12y.com</title>
        <link rel="canonical" href="https://c12y.com/" />
        <meta
          name="description"
          content="The latest cryptocurrency prices of you favorite coins (BTC, ETH, LTC, EOS, BCH, DASH)."
        />
      </Helmet>
      <Container>
        <Metrics
          totalMarketCap={totalMarketCap}
          totalVolume24h={totalVolume24h}
          totalCoins={totalCoins}
          btcDominance={btcDominance}
        />
        <Search list={list} />
      </Container>
      <Container>
        <Row>
          <Col xs={12}>
            <h3 className="mt-4 mb-2">Featured Coins</h3>
          </Col>
        </Row>
        {renderCoinList()}
      </Container>
    </div>
  )
}

export default Main
