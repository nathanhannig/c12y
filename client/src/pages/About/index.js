// React
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Helmet } from 'react-helmet'

const About = () => (
  <div>
    <Helmet>
      <meta charSet="utf-8" />
      <title>About Us | c12y.com</title>
      <link rel="canonical" href="https://c12y.com/about" />
      <meta name="description" content="About Us at c12y.com." />
    </Helmet>
    <Container>
      <Row>
        <Col xs={12}>
          <h3 className="mt-4 mb-2">About Us</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <p>c12y.com is a directory of information related to cryptocurrency coins, exchanges, and wallets.</p>
          <p>
            Knowledge is of key importance in cryptocurrency and we would like to bring as much useful information to
            all users.
          </p>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <h4>Not Investment Advice</h4>
          <p>
            The information provided on this website does not constitute investment advice, financial advice, trading
            advice, or any other sort of advice and you should not treat any of the website&apos;s content as such. c12y
            does not recommend that any cryptocurrency should be bought, sold, or held by you. Do conduct your own due
            diligence and consult your financial advisor before making any investment decisions.
          </p>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <h4>Accuracy of Information</h4>
          <p>
            c12y uses the{' '}
            <a href="https://www.coingecko.com/api/" rel="nofollow">
              CoinGecko.com
            </a>{' '}
            API and cannot guaranty the accuracy of the provided information.
          </p>
          <p>
            c12y will strive to ensure accuracy of information listed on this website although it will not hold any
            responsibility for any missing or wrong information. c12y provides all information as is. You understand
            that you are using any and all information available here at your own risk.
          </p>
        </Col>
      </Row>
    </Container>
  </div>
)

export default About
