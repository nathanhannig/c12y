const authGoogleCallback = (req, res) => {
  res.redirect('/')
}

const getCurrentUser = (req, res) => {
  const user = {
    isLoggedIn: false,
  }

  if (req.user) {
    user.isLoggedIn = true
    user.id = req.user._id
    user.email = req.user.email
    user.firstName = req.user.firstName
    user.lastName = req.user.lastName
    user.isAdmin = req.user.isAdmin
  }

  res.send(user)
}

const logoutCurrentUser = (req, res) => {
  req.logout()

  res.redirect('/')
}

export {
  authGoogleCallback,
  getCurrentUser,
  logoutCurrentUser,
}
