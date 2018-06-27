/* eslint-disable no-console */

require('dotenv').config()
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require('passport')
const cors = require('cors')
const bodyParser = require('body-parser')
const keys = require('./config/keys')
require('./services/passport')

const app = express()

// Connect to database
mongoose.connect(keys.mongoURI)

// http://expressjs.com/en/starter/static-files.html
// Serves the help page CSS
app.use(express.static(path.join(__dirname, 'views/public')))

app.use(cookieSession({
  maxAge: 30 * 24 * 60 * 60 * 1000,
  keys: [keys.cookieKey],
}))
app.use(passport.initialize())
app.use(passport.session())

// Used to allow CORS
const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}
app.use(cors(corsOption))

// Used to parse POST form requests to req.body
app.use(bodyParser.urlencoded({
  extended: true,
}))
app.use(bodyParser.json())

console.log(`Server is running in ${process.env.NODE_ENV} mode`)

require('./scripts/cryptocompare')(app).setup()

// ROUTES --
require('./routes/apiRoutes')(app)
require('./routes/authRoutes')(app)
require('./routes/emailRoutes')(app)
require('./routes/productionRoutes')(app)

const PORT = process.env.PORT || 3001
app.listen(PORT)
