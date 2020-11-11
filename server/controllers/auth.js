const authGoogleCallback = (req, res) => {
  res.redirect('/')
}

const getUser = (req, res) => {
  const user = {
    isLoggedIn: false,
  }

  if (req.user) {
    user.isLoggedIn = true
    user.email = req.user.email
    user.firstName = req.user.firstName
    user.lastName = req.user.lastName
    user.isAdmin = req.user.isAdmin
  }

  res.send(user)
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
