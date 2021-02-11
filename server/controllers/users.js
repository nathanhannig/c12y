import httpStatus from 'http-status'
import asyncHandler from 'express-async-handler'
import * as Yup from 'yup'
import User from '../models/User.js'

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.userId)

  if (user) {
    return res.send({
      data: user,
    })
  }

  res.status(httpStatus.NOT_FOUND)
  throw new Error('User not found')
})

const updateUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, isAdmin } = req.body

  const schema = Yup.object({
    firstName: Yup.string().trim().min(1).max(20),
    lastName: Yup.string().trim().max(20).nullable(),
    isAdmin: Yup.boolean(),
  })

  const isValid = await schema.isValid({
    firstName,
    lastName,
    isAdmin,
  })

  if (!isValid) {
    res.status(httpStatus.BAD_REQUEST)
    throw new Error('Invalid user data')
  }

  const user = await User.findById(req.params.userId)

  if (user) {
    user.firstName = firstName
    user.lastName = lastName
    user.isAdmin = isAdmin
    user.updatedAt = Date.now()

    const updatedUser = await user.save()

    return res.send({
      date: updatedUser,
    })
  }

  res.status(httpStatus.NOT_FOUND)
  throw new Error('User not found')
})

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId)

  return res.send({
    data: user,
  })
})

const getUsers = asyncHandler(async (req, res) => {
  const start = parseInt(req.query._start, 10)
  const end = parseInt(req.query._end, 10)
  const sort = {}
  sort[req.query._sort] = req.query._order === 'DESC' ? -1 : 1

  const count = await User.countDocuments()

  const users = await User.find(
    {},
    {
      _id: 1,
      firstName: 1,
      lastName: 1,
      'google.id': 1,
      'google.email': 1,
      'local.email': 1,
      isAdmin: 1,
    }
  )
    .sort(sort)
    .skip(start)
    .limit(end - start)

  res.set('X-Total-Count', count)

  return res.send({
    data: users,
  })
})

export { deleteUser, getUser, getUsers, updateUser }
