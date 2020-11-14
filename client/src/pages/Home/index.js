// React
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import { Helmet } from 'react-helmet'
import { formatDistance } from 'date-fns'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { fetchCoins } from '../../actions'

// App
import Metrics from '../../components/Metrics'
import Search from '../../components/Search'
import CoinItem from '../../components/CoinItem'
import API from '../../utils'
import styles from './index.module.scss'

const Main = () => {
  const dispatch = useDispatch()

  const coinList = useSelector((state) => state.coins)
  const { loading, coins, prices, totalMarketCap, totalVolume24h, list, btcDominance, lastUpdated } = coinList

  useEffect(() => {
    dispatch(fetchCoins())
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
      <Grid>
        <Metrics
          totalMarketCap={totalMarketCap}
          totalVolume24h={totalVolume24h}
          totalCoins={list?.length}
          btcDominance={btcDominance}
        />
        <Search list={list} />
      </Grid>
      <Grid>
        <Row>
          <Col xs={12}>
            <h3>Featured Coins</h3>
          </Col>
        </Row>
        {renderCoinList()}
      </Grid>
    </div>
  )
}

export default Main
