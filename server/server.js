import dotenv from 'dotenv'

dotenv.config()

import path from 'path'
import express from 'express'
import format from 'date-fns/format/index.js'
import logger from 'loglevel'
import cookieSession from 'cookie-session'
import passport from 'passport'
import cors from 'cors'
import bodyParser from 'body-parser'
import keys from './config/keys.js'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import './config/passport.js'
import coinGeckoSetup from './scripts/coingecko.js'

import apiRoutes from './routes/api.js'
import authRoutes from './routes/auth.js'
import emailRoutes from './routes/email.js'

logger.setLevel('info')

connectDB()

const app = express()

// https://nodejs.org/api/esm.html#esm_no_require_exports_module_exports_filename_dirname
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.resolve()

app.use(cookieSession({ maxAge: 30 * 24 * 60 * 60 * 1000, keys: [keys.cookieKey] }))

// Used to parse POST form requests to req.body
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(passport.initialize())
app.use(passport.session())

// Used to allow CORS
const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}
app.use(cors(corsOption))


// ROUTES --
app.use('/api', apiRoutes)
app.use('/auth', authRoutes)
app.use('/email', emailRoutes)

if (process.env.NODE_ENV === 'production') {
  // Serves the React app assets in production
  app.use(express.static(path.join(__dirname, '../client/build')))

  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/build/index.html')))
}

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 3001
const server = app.listen(port, () => {
  logger.info(`${format(new Date())} - Server is running in ${process.env.NODE_ENV} mode \
on port ${server.address().port}`)
})

coinGeckoSetup(app)
