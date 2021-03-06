import httpStatus from 'http-status'
import asyncHandler from 'express-async-handler'
import * as Yup from 'yup'
import Exchange from '../models/Exchange.js'

const createExchange = asyncHandler(async (req, res) => {
  const exchange = await Exchange.create(req.body)

  return res.status(httpStatus.CREATED).send({
    data: exchange,
  })
})

const deleteExchange = asyncHandler(async (req, res) => {
  const exchange = await Exchange.findByIdAndRemove(req.params.exchangeId)

  if (exchange) {
    return res.send({
      data: exchange,
    })
  }

  res.status(httpStatus.NOT_FOUND)
  throw new Error('Exchange not found')
})

const updateExchange = asyncHandler(async (req, res) => {
  const { name, description, link } = req.body

  const schema = Yup.object({
    name: Yup.string().min(1).max(20),
    description: Yup.string(),
    link: Yup.string().url(),
  })

  const isValid = await schema.isValid({
    name,
    description,
    link,
  })

  if (!isValid) {
    res.status(httpStatus.BAD_REQUEST)
    throw new Error('Invalid exchange data')
  }

  const exchange = await Exchange.findById(req.params.exchangeId)

  if (exchange) {
    exchange.name = name
    exchange.description = description
    exchange.link = link
    exchange.updatedAt = Date.now()

    const updatedExchange = await exchange.save()

    return res.send({
      data: updatedExchange,
    })
  }

  res.status(httpStatus.NOT_FOUND)
  throw new Error('Exchange not found')
})

const getExchange = asyncHandler(async (req, res) => {
  const exchange = await Exchange.findById(req.params.exchangeId)

  if (!exchange) {
    res.status(httpStatus.NOT_FOUND)
    throw new Error('Exchange not found')
  }

  return res.send({
    data: exchange,
  })
})

const getExchanges = asyncHandler(async (req, res) => {
  const start = parseInt(req.query._start, 10)
  const end = parseInt(req.query._end, 10)
  const sort = {}
  sort[req.query._sort] = req.query._order === 'DESC' ? -1 : 1

  const count = await Exchange.countDocuments()

  const exchanges = await Exchange.find(
    {},
    {
      _id: 1,
      name: 1,
      link: 1,
      description: 1,
    }
  )
    .sort(sort)
    .skip(start)
    .limit(end - start)

  res.set('X-Total-Count', count)

  return res.send({
    data: exchanges,
  })
})

export { createExchange, deleteExchange, getExchange, getExchanges, updateExchange }
