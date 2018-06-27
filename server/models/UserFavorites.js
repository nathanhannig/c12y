const mongoose = require('mongoose')

const { Schema } = mongoose

const userFavoritesSchema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  _coin: { type: Schema.Types.ObjectId, ref: 'Coin' },
})

mongoose.model('userFavorites', userFavoritesSchema)
