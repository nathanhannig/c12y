// React
import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

// App
import './index.css'

const About = () => (
  <div className="About">
    <Grid>
      <Row className="page-title">
        <Col xs={12}>
          <h3>About Us</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <p>
            c12y.com is a directory of information related to cryptocurrency
            coins, exchanges, and wallets.
          </p>
          <p>
            Knowledge is of key importance in cryptocurrency and we would
            like to bring as much useful information to all users.
          </p>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <h4>Not Investment Advice</h4>
          <p>
            The information provided on this website does not constitute
            investment advice, financial advice, trading advice, or any
            other sort of advice and you should not treat any of the
            website&apos;s content as such. C12Y does not recommend that any
            cryptocurrency should be bought, sold, or held by you. Do
            conduct your own due diligence and consult your financial
            advisor before making any investment decisions.
          </p>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <h4>Accuracy of Information</h4>
          <p>
            C12Y uses the <a href="https://www.cryptocompare.com/api/" rel="nofollow">CryptoCompare.com</a> API and cannot guaranty
            the accuracy of the provided information.
          </p>
          <p>
            C12Y will strive to ensure accuracy of information listed on
            this website although it will not hold any responsibility for
            any missing or wrong information. C12Y provides all
            information as is. You understand that you are using any and
            all information available here at your own risk.
          </p>
        </Col>
      </Row>
    </Grid >
  </div >
)

export default About
