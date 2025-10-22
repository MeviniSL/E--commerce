import React from 'react'
import './Navbar.css'
import navlogo from '../../assets/nav-logo.svg'
import new_logo from '../../assets/S&S.png'

const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={new_logo} alt="" className='nav-logo' />
      <h1>Admin Panel</h1>
      
    </div>
  )
}

export default Navbar
