// React
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Helmet } from 'react-helmet'

const Privacy = () => (
  <div>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Privacy Policy| c12y.com</title>
      <link rel="canonical" href="https://c12y.com/privacy" />
      <meta name="description" content="Privacy Policy at c12y.com." />
    </Helmet>
    <Container>
      <Row>
        <Col xs={12}>
          <h3 className="mt-4 mb-2">Privacy Policy</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <ul>
            <li>
              Third party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to
              your website or other websites.
            </li>
            <li>
              Google&apos;s use of advertising cookies enables it and its partners to serve ads to your users based on
              their visit to your sites and/or other sites on the Internet.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting Ads Settings. (Alternatively, you can direct
              users to opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting
              www.aboutads.info.)
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  </div>
)

export default Privacy
