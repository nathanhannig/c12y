const authGoogleCallback = (req, res) => {
  res.redirect('/')
}

const getUser = (req, res) => {
  res.send(req.user)
}

const logoutUser = (req, res) => {
  req.logout()
  res.redirect('/')
}

export {
  authGoogleCallback,
  getUser,
  logoutUser,
}
