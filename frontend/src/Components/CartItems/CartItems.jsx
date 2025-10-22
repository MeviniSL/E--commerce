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
      total: subtotal,
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
        window.open(`http://localhost:4000/invoice/${data.orderId}`, '_blank');
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
          <h1>Total of the Cart</h1>
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

        {/* Bank Details Section */}
        <div className="cartitems-bank-details">
          <h2>Payment Information</h2>
          <div className="bank-details-box">
            <p className="bank-details-title">Please transfer to:</p>
            <div className="bank-info">
              <div className="bank-info-row">
                <span className="bank-label">Bank Name:</span>
                <span className="bank-value">BOC Banck</span>
              </div>
              <div className="bank-info-row">
                <span className="bank-label">Account Number:</span>
                <span className="bank-value">1234567890</span>
              </div>
              <div className="bank-info-row">
                <span className="bank-label">Account Name:</span>
                <span className="bank-value">StreetSoul</span>
              </div>
              <div className="bank-info-row">
                <span className="bank-label">Branch:</span>
                <span className="bank-value">Kalutara Branch</span>
              </div>
             
            </div>
            <div className="payment-instructions">
              <p>📌 After payment, please upload your receipt on the next page</p>
              <p>📌 Your order will be processed within 24 hours after verification</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
