import React from 'react'
import './Hero.css'
import hand_icon from '../Assests/hand_icon.png'
import arrow_icon from '../Assests/arrow.png'
import hero_image from '../Assests/hero_image.png'

const Hero = () => {
  return (
    <div className='hero'>
      <div className="hero-left">
            <h2>NEW ARRIVALS ONLY</h2>
            <div>
                <div className="hero-hand-icon">
                <p>Effortless</p>
                <img src={hand_icon} alt=" " />
            </div>
            <p>Elegance</p>
            <p>for every Moment</p>
        </div>  
        <div className="hero-lastest-btn">
            <div>Latest collection</div>
            <img src={arrow_icon} alt=" " />
        </div>
      </div>
    <div className="hero-right">  
        <img src={hero_image} alt=" " />
    </div>
    </div>
  )
}

export default Hero
