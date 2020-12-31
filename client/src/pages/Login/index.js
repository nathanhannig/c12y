// React
import React from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import axios from 'axios'
import { Formik } from 'formik'
import * as Yup from 'yup'

// Redux
import { useDispatch } from 'react-redux'
import { loginUser } from '../../actions'

// App
import styles from './index.module.scss'

const Login = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const onSubmit = async (values, actions) => {
    try {
      const response = await axios.post('/auth/login', {
        email: values.email,
        password: values.password,
      })

      await dispatch(loginUser(response.data))

      history.replace('/')
    } catch (error) {
      actions.setStatus({ error: error.response.data.message })
    }
  }

  const validationSchema = Yup.object({
    email: Yup.string().label('Email').required(),
    password: Yup.string().label('Password').required(),
  })

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Login | c12y.com</title>
        <link rel="canonical" href="https://c12y.com/login" />
        <meta name="description" content="Login at c12y.com." />
      </Helmet>
      <Container>
        <Row>
          <Col xs={12}>
            <h3 className="mt-4 mb-2">Login</h3>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <div className="mb-4 center">
              <a href="/auth/google">
                <img src="google_signin.png" alt="Sign in with Google" />
              </a>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <hr className={styles.divider} />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              onSubmit={onSubmit}
              validationSchema={validationSchema}
            >
              {({ handleSubmit, handleChange, isSubmitting, status, values, touched, errors }) => (
                <Form className="mt-4 mb-2" noValidate onSubmit={handleSubmit}>
                  {status?.error && <div className={styles.formErrors}>{status.error}</div>}

                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
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
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      required
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      isInvalid={touched.password && errors.password}
                    />
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                  </Form.Group>

                  <Button variant="primary" disabled={isSubmitting} type="submit">
                    Login
                  </Button>
                </Form>
              )}
            </Formik>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <p className="mt-2 center">
              Need an account? <Link to="/register">Register now</Link>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login
