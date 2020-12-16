import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import format from 'date-fns/format/index.js'
import logger from 'loglevel'
import keys from './keys.js'
import User from '../models/User.js'

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id)

  done(null, user)
})

passport.use(new GoogleStrategy(
  {
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true,
  },
  async (accessToken, refreshToken, profile, done) => {
    // find existing user, sign in
    try {
      const existingUser = await User.findOne({ googleId: profile.id })

      if (existingUser) {
      // user exists
        return done(null, existingUser)
      }
    } catch (error) {
      logger.info(`${format(new Date())} - Failed to find User - ${error}`)

      return done(error)
    }

    // create user if none were found, sign up
    try {
      const user = await new User({
        googleId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        gender: profile.gender,
        provider: 'google',
      }).save()

      return done(null, user)
    } catch (error) {
      logger.info(`${format(new Date())} - Failed to create a new User - ${error}`)

      return done(error)
    }
  },
))
