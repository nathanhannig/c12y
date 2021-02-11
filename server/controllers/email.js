import httpStatus from 'http-status'

import sendgridMail from '@sendgrid/mail'
import asyncHandler from 'express-async-handler'
import keys from '../config/keys.js'

const sendEmail = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body
  const errors = {}

  if (!name.length) {
    errors.name = 'Name cannot be empty'
  }

  // eslint-disable-next-line max-len
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (!regex.test(email)) {
    errors.email = 'Email address is not valid.'
  }

  if (!message.length) {
    errors.message = 'Message cannot be empty'
  }

  if (Object.keys(errors).length) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR)
    throw new Error(JSON.stringify(Object.values(errors).join(', ')))
  }

  // using SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs
  sendgridMail.setApiKey(keys.sendgridApiKey)

  const msgSendgrid = {
    to: keys.contactFormEmail,
    from: keys.contactFormEmail,
    subject: `Contact Form - ${name}`,
    text: `${email} - ${message}`,
    // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  }
  try {
    await sendgridMail.send(msgSendgrid)
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR)
    throw new Error('Error sending email.')
  }

  return res.send({
    data: { message: 'Sent email' },
  })
})

export { sendEmail }
