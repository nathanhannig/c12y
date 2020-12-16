import passport from 'passport'
import express from 'express'
import {
  authGoogleCallback,
  getCurrentUser,
  logoutCurrentUser,
} from '../controllers/auth.js'

const router = express.Router()

router.route('/google').get(passport.authenticate('google', {
  scope: ['profile', 'email'],
}))

router.route('/google/callback').get(passport.authenticate('google'), authGoogleCallback)

router.route('/current_user').get(getCurrentUser)

router.route('/logout').get(logoutCurrentUser)

export default router
