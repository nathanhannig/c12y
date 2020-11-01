// React
import React, { Component } from 'react'
// import {
//   Grid,
//   Row,
//   Col,
//   FormGroup,
//   FormControl,
//   ControlLabel,
//   Button,
// } from 'react-bootstrap'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import FormControl from 'react-bootstrap/lib/FormControl'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import Button from 'react-bootstrap/lib/Button'
import { Helmet } from 'react-helmet'

// App
import axios from 'axios'
import './index.css'

class Contact extends Component {
  state = {
    name: '',
    email: '',
    message: '',
    touched: new Set([]),
    submitted: false,
    sent: false,
    errors: {},
  }

  getValidationState(item) {
    const { touched } = this.state
    const value = this.state[item]

    if (touched.has(item)) {
      if (item === 'name') {
        if (value.length > 0) return 'success'
        return 'error'
      }

      if (item === 'email') {
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (regex.test(value)) return 'success'
        return 'error'
      }

      if (item === 'message') {
        if (value.length) return 'success'
        return 'error'
      }
    }

    return null
  }

  handleChange = (event) => {
    const { target } = event
    const value = target.type === 'checkbox' ? target.checked : target.value
    const { name } = target

    this.setState((prevState) => ({
      [name]: value,
      touched: new Set([...prevState.touched, name]),
    }))
  }

  handleSubmit = async (event) => {
    const { name, email, message } = this.state

    event.preventDefault()

    this.setState({
      submitted: true,
      errors: {},
    })

    if (
      this.getValidationState('name') === 'success' &&
      this.getValidationState('email') === 'success' &&
      this.getValidationState('message') === 'success'
    ) {
      try {
        await axios.post('/email/contact', {
          name,
          email,
          message,
        })

        this.setState({
          sent: true,
        })
      } catch (error) {
        this.setState({
          submitted: false,
          errors: error.response.data,
        })
      }
    } else {
      this.setState({
        submitted: false,
        touched: new Set(['name', 'email', 'message']),
      })
    }
  }

  render() {
    const { submitted, sent, errors } = this.state

    return (
      <div className="Contact">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Contact Us - c12y.com</title>
          <link rel="canonical" href="https://c12y.com/contact" />
          <meta name="description" content="Contact Us at c12y.com." />
        </Helmet>
        <Grid>
          <Row>
            <Col xs={12}>
              <h3>Contact Us</h3>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <form onSubmit={this.handleSubmit}>
                {sent ? (
                  <div className="formSuccess">
                    <p>Email Sent</p>
                  </div>
                ) : (
                  ''
                )}

                {Object.keys(errors).length ? (
                  <div className="formErrors">
                    {Object.keys(errors).map((item) => {
                      if (errors[item].length > 0) {
                        return <p key={item}>{errors[item]}</p>
                      }

                      return ''
                    })}
                  </div>
                ) : (
                  ''
                )}

                <FormGroup controlId="formBasicText" validationState={this.getValidationState('name')}>
                  <ControlLabel>Your Name</ControlLabel>
                  <FormControl
                    name="name"
                    autoComplete="name"
                    type="text"
                    value={this.state.name}
                    placeholder="Enter Name"
                    onChange={this.handleChange}
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup controlId="formBasicText" validationState={this.getValidationState('email')}>
                  <ControlLabel>Email Address</ControlLabel>
                  <FormControl
                    name="email"
                    autoComplete="email"
                    type="email"
                    value={this.state.email}
                    placeholder="Enter Email"
                    onChange={this.handleChange}
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <FormGroup controlId="formControlsTextarea" validationState={this.getValidationState('message')}>
                  <ControlLabel>Message</ControlLabel>
                  <FormControl
                    name="message"
                    componentClass="textarea"
                    value={this.state.message}
                    placeholder="Enter Message"
                    onChange={this.handleChange}
                  />
                  <FormControl.Feedback />
                </FormGroup>
                <p>
                  {submitted ? (
                    <Button disabled type="submit">
                      Submit
                    </Button>
                  ) : (
                    <Button type="submit">Submit</Button>
                  )}
                </p>
              </form>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default Contact