const createProxyMiddleware = require('http-proxy-middleware')

module.exports = (app) => {
    app.use('/auth', createProxyMiddleware({ target: 'http://server:8080' }))
    app.use('/api', createProxyMiddleware({ target: 'http://server:8080' }))
}