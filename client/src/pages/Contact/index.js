// React
import React from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { Helmet } from 'react-helmet'
import { Formik } from 'formik'
import * as Yup from 'yup'

// App
import axios from 'axios'
import styles from './index.module.scss'

const Contact = () => {
  const onSubmit = async (values, actions) => {
    try {
      await axios.post('/email/contact', {
        name: values.name,
        email: values.email,
        message: values.message,
      })

      actions.resetForm()
      actions.setStatus({ message: 'Your message has been sent' })
    } catch (error) {
      actions.setStatus({ error: error.response.data.message })
    }
  }

  const validationSchema = Yup.object({
    name: Yup.string().label('Your Name').trim().required(),
    email: Yup.string().label('Email').required(),
    message: Yup.string().label('Message').trim().required(),
  })

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
            <p>Want to get in touch with us? Here is how you can reach us.</p>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Formik
              initialValues={{
                name: '',
                email: '',
                message: '',
              }}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              {({ handleSubmit, handleChange, isSubmitting, status, values, touched, errors }) => (
                <Form className="mt-4 mb-2" noValidate onSubmit={handleSubmit}>
                  {status?.message && <div className={styles.formSuccess}>{status.message}</div>}
                  {status?.error && <div className={styles.formErrors}>{status.error}</div>}

                  <Form.Group controlId="formName">
                    <Form.Label>Your Name *</Form.Label>
                    <Form.Control
                      required
                      name="name"
                      type="text"
                      value={values.name}
                      onChange={handleChange}
                      isInvalid={touched.name && errors.name}
                    />
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      required
                      name="email"
                      autoComplete="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      isInvalid={touched.email && errors.email}
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formMessage">
                    <Form.Label>Message *</Form.Label>
                    <Form.Control
                      required
                      name="message"
                      as="textarea"
                      rows={4}
                      value={values.message}
                      onChange={handleChange}
                      isInvalid={touched.message && errors.message}
                    />
                    <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
                  </Form.Group>

                  <Button variant="primary" disabled={isSubmitting} type="submit">
                    Send
                  </Button>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Contact
