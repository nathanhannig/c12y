import httpStatus from 'http-status'
import asyncHandler from 'express-async-handler'
import * as Yup from 'yup'
import User from '../models/User.js'

const authGoogleCallback = (req, res) => {
  res.redirect('/')
}

const registerUser = asyncHandler(async (req, res) => {
  const {
    email, password, firstName, lastName,
  } = req.body

  const schema = Yup.object({
    email: Yup.string().label('Email').required().email(),
    firstName: Yup.string().label('First name').required().trim()
      .max(20),
    lastName: Yup.string().label('Last name').trim().max(20),
    password: Yup.string().label('Password').trim().required()
      .min(8)
      .max(20),
  })

  const isValid = await schema.isValid({
    email, firstName, lastName, password,
  })

  if (!isValid) {
    res.status(httpStatus.BAD_REQUEST)
    throw new Error('Invalid user data')
  }

  const userExists = await User.findOne({ 'local.email': email.toLowerCase() })

  if (userExists) {
    // User already registered, for security reasons we
    // don't return that it previously existed
    return res.status(httpStatus.CREATED).send({
      email,
    })
  }

  const existingUser = await User.findOne({ 'google.email': email.toLowerCase() })

  if (existingUser) {
    existingUser.local = {
      email: email.toLowerCase(),
      password,
    }
    existingUser.firstName = firstName
    existingUser.lastName = lastName
    existingUser.updatedAt = Date.now()

    const updatedUser = await existingUser.save()

    if (updatedUser) {
      return res.status(httpStatus.CREATED).send({
        email: updatedUser.local.email,
      })
    }

    res.status(httpStatus.BAD_REQUEST)
    throw new Error('Unable to create user')
  }

  const user = await User.create({
    local: {
      email: email.toLowerCase(),
      password,
    },
    firstName,
    lastName,
  })

  if (user) {
    return res.status(httpStatus.CREATED).send({
      email: user.local.email,
    })
  }

  res.status(httpStatus.BAD_REQUEST)
  throw new Error('Unable to create user')
})

const getCurrentUser = (req, res) => {
  const user = {
    isLoggedIn: false,
  }

  if (req.user) {
    user.isLoggedIn = true
    user.id = req.user._id
    user.firstName = req.user.firstName
    user.lastName = req.user.lastName
    user.isAdmin = req.user.isAdmin
  }

  res.send(user)
}

const logoutCurrentUser = (req, res) => {
  req.logout()

  res.redirect('/')
}

export {
  authGoogleCallback,
  getCurrentUser,
  logoutCurrentUser,
  registerUser,
}
