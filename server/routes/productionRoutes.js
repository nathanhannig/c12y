const path = require('path')
const express = require('express')

module.exports = (app) => {
  if (process.env.NODE_ENV === 'production') {
    // Serves the React app assets in production
    app.use(express.static(path.join(__dirname, '/../client/build')))

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build/index.html'))
    })
  }
}
