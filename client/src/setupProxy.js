const proxy = require('http-proxy-middleware')

module.exports = (app) => {
  app.use(proxy('/auth', { target: 'http://server:8080' }))
  app.use(proxy('/api', { target: 'http://server:8080' }))
  app.use(proxy('/email', { target: 'http://server:8080' }))
}
