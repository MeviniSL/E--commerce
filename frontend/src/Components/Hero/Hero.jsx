import React from 'react'
import './Hero.css'
import hand_icon from '../Assests/hand_icon.png'
import arrow_icon from '../Assests/arrow.png'
//import hero_image from '../Assests/hero_image.png'

import hero1_image from '../Assests/hero1.png'

const Hero = () => {
  return (
    <div className='hero'>
      <div className="hero-left">
            <h2>NEW ARRIVALS ONLY</h2>
            <div>
                <div className="hero-hand-icon">
                <p>Unleash your street style</p>
            </div>
        </div>  
        <div className="hero-lastest-btn">
            <div>Latest collection</div>
            <img src={arrow_icon} alt=" " />
        </div>
      </div>
    <div className="hero-right">  
        <img src={hero1_image} alt=" " />
    </div>
    </div>
  )
}

export default Hero
