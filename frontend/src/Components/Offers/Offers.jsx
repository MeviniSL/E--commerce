import React from 'react'
import './Offers.css' 
import exclusive_image from '../Assests/exclusive_image.png'


const Offers = () => {
  return (
    <div className='offers'>
        <div className="offers-left">
            <h1>Handpicked </h1>
            <h1>dEALS fOR yOU</h1>
            <p>ONLY ON BEST SELLERS PRODUCTS</p>
            <button>Stay Tuned</button>

        </div>
        <div className="offers-right">
            <img src={exclusive_image} alt="" />

        </div>
    </div>
  )
}

export default Offers
