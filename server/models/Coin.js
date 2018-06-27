const mongoose = require('mongoose')

const { Schema } = mongoose

const coinSchema = new Schema({
  id: String,
  name: String,
  symbol: String,
})

mongoose.model('coins', coinSchema)
