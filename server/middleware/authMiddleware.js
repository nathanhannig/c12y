import httpStatus from 'http-status'

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(httpStatus.UNAUTHORIZED)
    throw new Error('Not authorized as an admin')
  }
}

const protect = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.status(httpStatus.UNAUTHORIZED)
    throw new Error('Not authorized, please log in.')
  }
}

export { admin, protect }
