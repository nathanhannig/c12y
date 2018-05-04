const sendgridMail = require('@sendgrid/mail')
const keys = require('../config/keys')

module.exports = (app) => {
  app.post('/email/contact', async (req, res) => {
    const { name, email, message } = req.body
    const errors = {}

    if (!name.length) {
      errors.name = 'Name cannot be empty'
    }

    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (!regex.test(email)) {
      errors.email = 'Email address is not valid.'
    }

    if (!message.length) {
      errors.message = 'Message cannot be empty'
    }

    if (Object.keys(errors).length) {
      return res.status(500).send(errors)
    }

    // using SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs
    sendgridMail.setApiKey(keys.sendgridApiKey)

    const msgSendgrid = {
      to: keys.contactFormEmail,
      from: email,
      subject: `Contact Form - ${name}`,
      text: message,
      // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }

    try {
      await sendgridMail.send(msgSendgrid)
    } catch (error) {
      errors.submitted = 'Error sending email'
      return res.status(500).send(errors)
    }

    return res.send('Sent email')
  })
}
