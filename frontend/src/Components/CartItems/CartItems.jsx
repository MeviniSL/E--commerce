/*import React, { useContext } from 'react'
import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext'
import remove_icon from '../Assests/cart_cross_icon.png'
import Cart from '../../Pages/Cart'

const CartItems = () => {
    const {getTotalCartAmount,all_product,cartItems,removeFromCart}= useContext(ShopContext);
  return (
    <div className='cartitems'>
      <div className="cartitem-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
        {all_product.map((e)=>{
        
            if(cartItems[e.id]>0)  {
              return(
                <div className="cartitems-format cartitem-format-main">
                  <img src={e.image} alt="" className='carticon-product-icon' />
                  <p>{e.name}</p> 
                  <p>${e.new_price}</p>
                  <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                  <p>${e.new_price*cartItems[e.id]}</p>
                  <img className='cartitems-remove-icon' src={remove_icon} onClick={() =>{removeFromCart(e.id)}} alt="" />
        </div>
        );
      } return null;

        })}
        <div className="cartitems-down">
          <div className="cartitems-total">
            <h1>cart Totals</h1>
            <div>
              <div className="cartitems-total-item">
                <p>Subtotal</p>
                <p>${getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <p>shipping fee</p>
                <p>free</p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <h3>Total</h3>
                <h3>${getTotalCartAmount()}</h3>
              </div>
            </div>
            <button>PROCEED TO CHECKOUT</button>
          </div>
          <div className="cartitems-promocode">
            <p>
              If you have a promo code, enter it here
            </p>
            <div className="cartitems-promobox">
              <input type="text" placeholder='promo code' />
              <button>submit</button>

            </div>
          </div>
        </div>
      </div>
  )
}

export default CartItems*/ 


import React, { useContext } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assests/cart_cross_icon.png';

const CartItems = () => {
  const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);

  const handleProceedToPayment = async () => {
    // Get cart details
    const orderItems = [];
    let subtotal = 0;

    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find((product) => product.id === Number(item));
        if (itemInfo) {
          orderItems.push({
            productId: itemInfo.id,
            name: itemInfo.name,
            quantity: cartItems[item],
            price: itemInfo.new_price,
            total: itemInfo.new_price * cartItems[item]
          });
          subtotal += itemInfo.new_price * cartItems[item];
        }
      }
    }

    // Create order
    const orderData = {
      items: orderItems,
      subtotal: subtotal,
      total: subtotal, // You can add shipping, tax, etc. here
      orderDate: new Date().toISOString()
    };

    try {
      const response = await fetch('http://localhost:4000/createorder', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Order created successfully! Downloading invoice...');
        // Download the PDF invoice
        window.open(`http://localhost:4000/invoice/${data.orderId}`, '_blank');
        // Redirect to payment upload page
        window.location.href = `/payment/${data.orderId}`;
      } else {
        alert('Error creating order: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating order');
    }
  };

  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {all_product.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className="cartitems-format cartitems-format-main">
                <img src={e.image} alt="" className='carticon-product-icon' />
                <p>{e.name}</p>
                <p>Rs {e.new_price}</p>
                <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                <p>Rs {e.new_price * cartItems[e.id]}</p>
                <img className='cartitems-remove-icon' src={remove_icon} onClick={() => { removeFromCart(e.id) }} alt="" />
              </div>
              <hr />
            </div>  
          );
        }
        return null;
      })}
      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Totals</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>Rs {getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>Rs {getTotalCartAmount()}</h3>
            </div>
          </div>
          <button onClick={handleProceedToPayment}>PROCEED TO PAYMENT</button>
        </div>
        
      </div>
    </div>
  );
};

export default CartItems;
