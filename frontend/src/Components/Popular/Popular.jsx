import React, { useEffect, useState } from 'react'
import './Popular.css'
import Item from '../Item/Item' 

const Popular = () => {

  const [popularProducts,setPopularProducts]=useState([]);

  /*useEffect(()=>{
    fetch('http://localhost:4000/popularinwomen')
    .then((response)=>response.json)
    .then((data)=>setPopularProducts(data))  

  },[])*/

  useEffect(() => {
  fetch('http://localhost:4000/popularinwomen')
    .then((response) => response.json()) // Correct: Invoke response.json() as a function
    .then((data) => {
      if (Array.isArray(data)) {
        setPopularProducts(data); // Ensure data is an array before setting state
      } else {
        console.error('Expected an array but got:', data);
        setPopularProducts([]); // Fallback to an empty array
      }
    })
    .catch((error) => console.error('Error fetching popular products:', error));
}, []);




  return (
    <div className='popular'>
        <h1>POPULAR IN WOMEN</h1>

        <hr/>
        <div className="popular-item">
            {popularProducts.map((item, i) => {
                return<Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price}/>
            })}
        </div>
    </div>
  )
}

export default Popular
 

