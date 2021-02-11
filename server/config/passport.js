import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
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

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.getAuthenticated(email, password)

        if (user) {
          return done(null, user)
        }

        return done(null, false)
      } catch (error) {
        const reasons = User.failedLogin

        logger.info(`${format(new Date())} - Failed to find Local User - ${error}`)

        switch (error.message) {
          case reasons.NOT_FOUND:
          case reasons.PASSWORD_INCORRECT:
          default:
            return done(new Error('Invalid email or password'))
          case reasons.MAX_ATTEMPTS:
            return done(new Error('Max failed login attempts reached, please try again in 2 hours.'))
        }
      }
    }
  )
)

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      // find existing user, sign in
      try {
        const existingUser = await User.findOne({ 'google.id': profile.id })

        if (existingUser) {
          // user exists
          return done(null, existingUser)
        }
      } catch (error) {
        logger.info(`${format(new Date())} - Failed to find Google User - ${error}`)

        return done(error)
      }

      // find existing user from local strategy, add google strategy, sign in
      try {
        const existingUser = await User.findOne({ 'local.email': profile.emails[0].value.toLowerCase() })

        if (existingUser) {
          existingUser.google = {
            id: profile.id,
            email: profile.emails[0].value.toLowerCase(),
          }
          existingUser.updatedAt = Date.now()

          const updatedUser = await existingUser.save()

          return done(null, updatedUser)
        }
      } catch (error) {
        logger.info(`${format(new Date())} - Failed to find Local User - ${error}`)

        return done(error)
      }

      // create user if none were found, sign in
      try {
        const user = await new User({
          google: {
            id: profile.id,
            email: profile.emails[0].value.toLowerCase(),
          },
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
        }).save()

        return done(null, user)
      } catch (error) {
        logger.info(`${format(new Date())} - Failed to create a new User - ${error}`)

        return done(error)
      }
    }
  )
)
