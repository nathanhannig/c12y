import httpStatus from 'http-status'

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(httpStatus.NOT_FOUND)
  next(error)
}

const errorHandler = (err, req, res) => {
  const statusCode = res.statusCode === httpStatus.OK ? httpStatus.INTERNAL_SERVER_ERROR : res.statusCode
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
}

export { notFound, errorHandler }
