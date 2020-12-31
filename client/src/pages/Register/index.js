// React
import React from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import axios from 'axios'
import { Formik } from 'formik'
import * as Yup from 'yup'

// App
import styles from './index.module.scss'

const Register = () => {
  const history = useHistory()

  const onSubmit = async (values, actions) => {
    try {
      await axios.post('/auth/register', {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      })

      history.replace('/login')
    } catch (error) {
      actions.setStatus({ error: error.response.data.message })
    }
  }

  const validationSchema = Yup.object({
    email: Yup.string().label('Email').required().email(),
    firstName: Yup.string().label('First name').trim().required().max(20),
    lastName: Yup.string().label('Last name').trim().max(20),
    password: Yup.string().label('Password').required().trim().min(8).max(20),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
  })

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Register | c12y.com</title>
        <link rel="canonical" href="https://c12y.com/register" />
        <meta name="description" content="Register at c12y.com." />
      </Helmet>
      <Container>
        <Row>
          <Col xs={12}>
            <h3 className="mt-4 mb-2">Register</h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Formik
              initialValues={{
                email: '',
                firstName: '',
                lastName: '',
                password: '',
                confirmPassword: '',
              }}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              {({ handleSubmit, handleChange, isSubmitting, status, values, touched, errors }) => (
                <Form className="mt-4 mb-2" noValidate onSubmit={handleSubmit}>
                  {status?.eroor && <div className={styles.formErrors}>{status.error}</div>}

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
                  <Form.Group controlId="formPassword">
                    <Form.Label>Password *</Form.Label>
                    <Form.Control
                      required
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      isInvalid={touched.password && errors.password}
                      aria-describedby="passwordHelpBlock"
                    />
                    <Form.Text id="passwordHelpBlock" muted>
                      Must be 8-20 characters long.
                    </Form.Text>
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formConfirmPassword">
                    <Form.Label>Confirm Password *</Form.Label>
                    <Form.Control
                      required
                      name="confirmPassword"
                      type="password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      isInvalid={touched.confirmPassword && errors.confirmPassword}
                    />
                    <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formFirstName">
                    <Form.Label>First name *</Form.Label>
                    <Form.Control
                      required
                      name="firstName"
                      autoComplete="first name"
                      type="text"
                      value={values.firstName}
                      onChange={handleChange}
                      isInvalid={touched.firstName && errors.firstName}
                    />
                    <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="formLastName">
                    <Form.Label>Last name</Form.Label>
                    <Form.Control
                      name="lastName"
                      autoComplete="last name"
                      type="text"
                      value={values.lastName}
                      onChange={handleChange}
                      isInvalid={errors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
                  </Form.Group>

                  <Button variant="primary" disabled={isSubmitting} type="submit">
                    Register
                  </Button>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <p className="mt-2 center">
              Have an account? <Link to="/login">Login now</Link>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Register
