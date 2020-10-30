require('dotenv').config()
const path = require('path')
const express = require('express')
const logger = require('loglevel')
const mongoose = require('mongoose')
const cookieSession = require('cookie-session')
const passport = require('passport')
const cors = require('cors')
const bodyParser = require('body-parser')
const keys = require('./config/keys')
require('./services/passport')

const app = express()
logger.setLevel('info')

// Connect to database
mongoose.connect(keys.mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
}).then(
  () => logger.info('MongoDB successfully connected'),
).catch((err) => {
  logger.error(`DB Connection Error: ${err.message}`)
  process.exit(-1)
});

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

logger.info(`Server is running in ${process.env.NODE_ENV} mode`)

require('./scripts/coingecko')(app).setup()

// ROUTES --
require('./routes/apiRoutes')(app)
require('./routes/authRoutes')(app)
require('./routes/emailRoutes')(app)
require('./routes/productionRoutes')(app)

const port = process.env.PORT || 3001
const server = app.listen(port, () => {
  logger.info(`Listening on port ${server.address().port}`)
})
