// React
import React, { useState } from 'react'
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
import styles from './index.module.scss'

const Contact = () => {
  const [formValues, setFormValues] = useState({ name: '', email: '', message: '' })
  const [touched, setTouched] = useState(new Set([]))
  const [submitted, setSubmitted] = useState(false)
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState({})

  const getValidationState = (item, itemValue) => {
    if (touched.has(item)) {
      if (item === 'name') {
        if (itemValue.length > 0) return 'success'
        return 'error'
      }

      if (item === 'email') {
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (regex.test(itemValue)) return 'success'
        return 'error'
      }

      if (item === 'message') {
        if (itemValue.length) return 'success'
        return 'error'
      }
    }

    return null
  }

  const handleChange = (event) => {
    const eventName = event.target.name
    const eventValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value

    setFormValues({ ...formValues, [eventName]: eventValue })
    setTouched((prevState) => new Set([...prevState, eventName]))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setSubmitted(true)
    setErrors({})

    if (
      getValidationState('name', formValues.name) === 'success' &&
      getValidationState('email', formValues.email) === 'success' &&
      getValidationState('message', formValues.message) === 'success'
    ) {
      try {
        await axios.post('/email/contact', {
          name: formValues.name,
          email: formValues.email,
          message: formValues.message,
        })

        setSent(true)
      } catch (error) {
        setSubmitted(false)
        setErrors(error.response.data)
      }
    } else {
      setSubmitted(false)
      setTouched(new Set(['name', 'email', 'message']))
    }
  }

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Contact Us | c12y.com</title>
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
            <form onSubmit={handleSubmit}>
              {sent ? (
                <div className={styles.formSuccess}>
                  <p>Email Sent</p>
                </div>
              ) : (
                ''
              )}

              {Object.keys(errors).length ? (
                <div className={styles.formErrors}>
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

              <FormGroup controlId="formBasicText" validationState={getValidationState('name', formValues.name)}>
                <ControlLabel>Your Name</ControlLabel>
                <FormControl
                  name="name"
                  autoComplete="name"
                  type="text"
                  value={formValues.name}
                  placeholder="Enter Name"
                  onChange={handleChange}
                />
                <FormControl.Feedback />
              </FormGroup>
              <FormGroup controlId="formBasicText" validationState={getValidationState('email', formValues.email)}>
                <ControlLabel>Email Address</ControlLabel>
                <FormControl
                  name="email"
                  autoComplete="email"
                  type="email"
                  value={formValues.email}
                  placeholder="Enter Email"
                  onChange={handleChange}
                />
                <FormControl.Feedback />
              </FormGroup>
              <FormGroup
                controlId="formControlsTextarea"
                validationState={getValidationState('message', formValues.message)}
              >
                <ControlLabel>Message</ControlLabel>
                <FormControl
                  name="message"
                  componentClass="textarea"
                  value={formValues.message}
                  placeholder="Enter Message"
                  onChange={handleChange}
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

export default Contact
