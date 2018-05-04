const mongoose = require('mongoose')

const { Schema } = mongoose

const coinsSchema = new Schema({
  id: String,
  name: String,
  symbol: String,
})

mongoose.model('coins', coinsSchema)
