import passport from 'passport'
import express from 'express'

const router = express.Router()

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}))

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect('/')
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

router.get('/current_user', (req, res) => {
  res.send(req.user)
})

export default router
