
import React, { useState, useEffect } from 'react'
import './Hero.css'
import hand_icon from '../Assests/hand_icon.png'
import arrow_icon from '../Assests/arrow.png'
import hero1_image from '../Assests/hero1.png'

const Hero = () => {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(0);
  const phrases = [
    'Unleash your street style',
    'Define your fashion',
    'Express yourself boldly',
    'Own the streets'
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    
    if (index < currentPhrase.length) {
      const timeout = setTimeout(() => {
        setText(prev => prev + currentPhrase[index]);
        setIndex(prev => prev + 1);
      }, 100); // Typing speed
      
      return () => clearTimeout(timeout);
    } else {
      // Wait 2 seconds then move to next phrase
      const timeout = setTimeout(() => {
        setText('');
        setIndex(0);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [index, phraseIndex]);

  return (
    <div className='hero'>
      <div className="hero-left">
        <h2>NEW ARRIVALS ONLY</h2>
        <div>
          <div className="hero-hand-icon">
            <p className="animated-text">{text}<span className="cursor">|</span></p>
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