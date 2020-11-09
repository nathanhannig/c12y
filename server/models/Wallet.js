import mongoose from 'mongoose'

const { Schema } = mongoose

const walletSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
})

const Wallet = mongoose.model('wallets', walletSchema)

export default Wallet
