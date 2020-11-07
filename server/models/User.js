import mongoose from 'mongoose'

const { Schema } = mongoose

const userSchema = new Schema({
  googleId: {
    type: String,
    default: '',

  },
  firstName: {
    type: String,
    default: '',
  },
  lastName: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  provider: {
    type: String,
    default: '',
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true,
})

const User = mongoose.model('users', userSchema)

export default User
