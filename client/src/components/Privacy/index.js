// React
import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'

// App
import './index.css'

const Privacy = () => (
  <div className="Privacy">
    <Grid>
      <h3>Privacy Policy</h3>
      <Row>
        <Col xs={12}>
          <ul>
            <li>Third party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
            <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting Ads Settings. (Alternatively, you can direct users to opt out of a third-party vendor's use of cookies for personalized advertising by visiting www.aboutads.info.)</li>
          </ul>
        </Col>
      </Row>
    </Grid>
  </div>
)

export default Privacy