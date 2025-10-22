import React, { useState,useContext,useRef } from 'react'
import './Navbar.css'
import logo from '../Assests/logo.png'
import cart_icomn from '../Assests/cart_icon.png'
import { Link } from 'react-router-dom'
import { ShopContext } from '../../Context/ShopContext'
import nav_dropdwon from '../Assests/nav_dropdown.png'
import new_logo from '../Assests/S&S.png'


const Navbar = () => {

  const[menu,setMenu]=useState("shop")
  const{getTotalCartItems} = useContext(ShopContext);
  const menuRef = useRef();

  const dropdwon_toggle =(e) =>{
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  }

  return (
      <div className='navbar'>
        <div className='nav-logo'>
          <img src={new_logo} alt =""></img>
          <p>StreetSoul</p>
      </div>
      <img className="nav-dropdown" onClick={dropdwon_toggle} src={nav_dropdwon} alt="" />
      <ul ref={menuRef} className='nav-menu'>
        <li onClick={()=>{setMenu("shop")}}><Link style={{textDecoration:'none', color:'inherit'}} to='/'>Shop{menu==="shop"?<hr />:<></>}</Link></li>
        <li onClick={()=>{setMenu("men")}}><Link style={{textDecoration:'none', color:'inherit'}} to='/mens'>Men{menu==="men"?<hr />:<></>}</Link></li>
        <li onClick={()=>{setMenu("women")}}><Link style={{textDecoration:'none', color:'inherit'}} to='/womens'>Women{menu==="women"?<hr />:<></>}</Link></li>
        <li onClick={()=>{setMenu("kids")}}><Link style={{textDecoration:'none', color:'inherit'}} to='/kids'>Kids{menu==="kids"?<hr />:<></>}</Link></li>
      </ul>
      <div className='nav-login-cart'>
        {localStorage.getItem('auth-token')
        ?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>
        :<Link to ='/login'><button>Login</button></Link>}
        <Link to='/cart'>
          <img src={cart_icomn} alt=""></img>
        </Link>
          <div className="nav-cart-count">{getTotalCartItems()}</div>
        
      </div>
    </div>
  )
}

export default Navbar
