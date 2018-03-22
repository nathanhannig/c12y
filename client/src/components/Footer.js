// React
import React from 'react'
import { Link } from 'react-router-dom'

// App
import moment from 'moment'
import './Footer.css'

const Footer = () => (
  <footer>
    <p>Copyright &copy; {moment().year()} by c12y.com - <Link to='/privacy'>Privacy Policy</Link></p>
  </footer>
)

export default Footer