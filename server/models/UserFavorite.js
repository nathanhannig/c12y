import mongoose from 'mongoose'

const { Schema } = mongoose

const userFavoriteSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  _coin: {
    type: Schema.Types.ObjectId,
    ref: 'Coin',
    required: true,
  },
}, {
  timestamps: true,
})

const UserFavorite = mongoose.model('userFavorites', userFavoriteSchema)

export default UserFavorite
