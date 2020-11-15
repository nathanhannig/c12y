// React
import React, { useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet'

// App
import axios from 'axios'
import styles from './index.module.scss'

const Contact = () => {
  const [formValues, setFormValues] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState({})
  const [validated, setValidated] = useState(false)

  const handleChange = (event) => {
    const eventName = event.target.name
    const eventValue = event.target.type === 'checkbox' ? event.target.checked : event.target.value

    setFormValues({ ...formValues, [eventName]: eventValue })
  }

  const handleSubmit = async (event) => {
    const form = event.currentTarget

    if (form.checkValidity() === true) {
      event.preventDefault()
      event.stopPropagation()

      setSubmitted(true)
      setErrors({})

      try {
        await axios.post('/email/contact', {
          name: formValues.name,
          email: formValues.email,
          message: formValues.message,
        })

        setValidated(true)
        setSent(true)
      } catch (error) {
        setSubmitted(false)
        setErrors(error.response.data)
      }
    } else {
      setSubmitted(false)
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
      <Container>
        <Row>
          <Col xs={12}>
            <h3 className="mt-4 mb-2">Contact Us</h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Form validated={validated} onSubmit={handleSubmit}>
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

              <Form.Group controlId="formName">
                <Form.Label>Your Name</Form.Label>
                <Form.Control
                  required
                  name="name"
                  autoComplete="name"
                  type="text"
                  value={formValues.name}
                  placeholder="Enter Name"
                  onChange={handleChange}
                />
                <Form.Control.Feedback />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  required
                  name="email"
                  autoComplete="email"
                  type="email"
                  value={formValues.email}
                  placeholder="Enter Email"
                  onChange={handleChange}
                />
                <Form.Control.Feedback />
              </Form.Group>
              <Form.Group controlId="formMessage">
                <Form.Label>Message</Form.Label>
                <Form.Control
                  required
                  name="message"
                  as="textarea"
                  rows={3}
                  value={formValues.message}
                  placeholder="Enter Message"
                  onChange={handleChange}
                />
                <Form.Control.Feedback />
              </Form.Group>
              <p>
                {submitted ? (
                  <Button variant="primary" disabled type="submit">
                    Submit
                  </Button>
                ) : (
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                )}
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Contact
