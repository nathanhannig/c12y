if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod') // eslint-disable-line
} else {
  // eslint-disable-line
  module.exports = require('./dev') // eslint-disable-line
}
