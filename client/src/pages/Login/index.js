// React
import React from 'react'
// import { Grid, Row, Col } from 'react-bootstrap'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'

// App
import './index.css'

const Login = () => (
  <div className="Login">
    <Grid>
      <Row>
        <Col xs={12}>
          <h3>Login</h3>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>TODO</Col>
      </Row>
    </Grid>
  </div>
)

export default Login
