import httpStatus from 'http-status'
import asyncHandler from 'express-async-handler'
import * as Yup from 'yup'
import Wallet from '../models/Wallet.js'

const createWallet = asyncHandler(async (req, res) => {
  const wallet = await Wallet.create(req.body)

  return res.status(httpStatus.CREATED).send({
    data: wallet,
  })
})

const deleteWallet = asyncHandler(async (req, res) => {
  const wallet = await Wallet.findByIdAndRemove(req.params.walletId)

  if (wallet) {
    return res.send({
      data: wallet,
    })
  }

  res.status(httpStatus.NOT_FOUND)
  throw new Error('Wallet not found')
})

const updateWallet = asyncHandler(async (req, res) => {
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
    throw new Error('Invalid wallet data')
  }

  const wallet = await Wallet.findById(req.params.walletId)

  if (wallet) {
    wallet.name = name
    wallet.description = description
    wallet.link = link
    wallet.updatedAt = Date.now()

    const updatedWallet = await wallet.save()

    return res.send({
      data: updatedWallet,
    })
  }

  res.status(httpStatus.NOT_FOUND)
  throw new Error('Wallet not found')
})

const getWallet = asyncHandler(async (req, res) => {
  const wallet = await Wallet.findById(req.params.walletId)

  return res.send({
    data: wallet,
  })
})

const getWallets = asyncHandler(async (req, res) => {
  const start = parseInt(req.query._start, 10)
  const end = parseInt(req.query._end, 10)
  const sort = {}
  sort[req.query._sort] = req.query._order === 'DESC' ? -1 : 1

  const count = await Wallet.countDocuments()

  const wallets = await Wallet.find(
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
    data: wallets,
  })
})

export { createWallet, deleteWallet, getWallet, getWallets, updateWallet }
