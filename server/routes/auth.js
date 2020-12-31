import passport from 'passport'
import express from 'express'
import {
  authGoogleCallback,
  getCurrentUser,
  logoutCurrentUser,
  registerUser,
} from '../controllers/auth.js'

const router = express.Router()

router.route('/google').get(passport.authenticate('google', {
  scope: ['profile', 'email'],
}))

router.route('/google/callback').get(passport.authenticate('google'), authGoogleCallback)

router.route('/current_user').get(getCurrentUser)

router.route('/login').post(passport.authenticate('local'), getCurrentUser)

router.route('/logout').get(logoutCurrentUser)

router.route('/register').post(registerUser)

export default router
