// React
import React from 'react'

// App
import moment from 'moment'
import './Footer.css'

const Footer = () => {
  return (
    <footer>
      <p>Copyright &copy; {moment().year()} by c12y.com - Terms of Use - Privacy Policy</p>
    </footer>
  )
}

export default Footer