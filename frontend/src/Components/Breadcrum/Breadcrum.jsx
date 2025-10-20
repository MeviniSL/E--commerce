import React from 'react';
import './Breadcrum.css';
import arrow_icon from '../Assests/breadcrum_arrow.png';

const Breadcrum = ({ product }) => {
  if (!product) return null; // Prevent crash if product is undefined

  const category = product.category?.toUpperCase() || "UNKNOWN";

  return (
    <div className='breadcrum'>
      HOME <img src={arrow_icon} alt="" /> {category} <img src={arrow_icon} alt="" /> {product.name}
    </div>
  );
};

export default Breadcrum;
