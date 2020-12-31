import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const { Schema } = mongoose

const SALT_WORK_FACTOR = 10
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 2 * 60 * 60 * 1000 // 2 hours

const userSchema = new Schema({
  local: {
    email: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      default: '',
    },
  },
  google: {
    id: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
  },
  firstName: {
    type: String,
    default: '',
  },
  lastName: {
    type: String,
    default: '',
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0,
  },
  lockUntil: {
    type: Number,
  },
}, {
  timestamps: true,
})

/* eslint-disable func-names */
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})

userSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.local.password)

  return isMatch
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('local.password')) {
    next()
  }

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
  this.local.password = await bcrypt.hash(this.local.password, salt)
})

userSchema.methods.incrementLoginAttempts = function () {
  // if we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    })
  }

  // otherwise we're incrementing
  const updates = { $inc: { loginAttempts: 1 } }
  // lock the account if we've reached max attempts and it's not locked already
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + LOCK_TIME }
  }
  return this.updateOne(updates)
}

userSchema.statics.failedLogin = {
  NOT_FOUND: 'User not found',
  PASSWORD_INCORRECT: 'Incorrect password provided',
  MAX_ATTEMPTS: 'Max login attempts reached',
}

userSchema.statics.getAuthenticated = async function (email, password) {
  const reasons = userSchema.statics.failedLogin

  const user = await this.findOne({ 'local.email': email.toLowerCase() })

  if (!user) {
    throw new Error(reasons.NOT_FOUND)
  }

  // check if the account is currently locked
  if (user.isLocked) {
    // just increment login attempts if account is already locked
    await user.incrementLoginAttempts()
    throw new Error(reasons.MAX_ATTEMPTS)
  }

  // test for a matching password
  const isMatch = await user.comparePassword(password)

  // check if the password was a match
  if (isMatch) {
    // if there's no lock or failed attempts, just return the user
    if (!user.loginAttempts && !user.lockUntil) {
      return user
    }

    // reset attempts and lock info
    const updates = {
      $set: { loginAttempts: 0 },
      $unset: { lockUntil: 1 },
    }
    return user.updateOne(updates)
  }

  // password is incorrect, so increment login attempts before responding
  await user.incrementLoginAttempts()
  throw new Error(reasons.PASSWORD_INCORRECT)
}

const User = mongoose.model('users', userSchema)

export default User
