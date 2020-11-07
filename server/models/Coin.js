import mongoose from 'mongoose'

const { Schema } = mongoose

const coinSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
})

const Coin = mongoose.model('coins', coinSchema)

export default Coin
