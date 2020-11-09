import mongoose from 'mongoose'

const { Schema } = mongoose

const exchangeSchema = new Schema({
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

const Exchange = mongoose.model('exchanges', exchangeSchema)

export default Exchange
