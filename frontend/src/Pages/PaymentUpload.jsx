/*import React, { useState } from 'react';
import './CSS/PaymentUpload.css';
import { useParams } from 'react-router-dom';

const PaymentUpload = () => {
  const { orderId } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setReceipt(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!receipt) {
      alert('Please select a receipt file');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('receipt', receipt);
    formData.append('orderId', orderId);

    try {
      const response = await fetch('http://localhost:4000/uploadreceipt', {
        method: 'POST',
        headers: {
          'auth-token': `${localStorage.getItem('auth-token')}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert('Receipt uploaded successfully!');
        window.location.href = '/';
      } else {
        alert('Error uploading receipt: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error uploading receipt');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='payment-upload'>
      <div className="payment-upload-container">
        <h1>Please upload your Payment Receipt</h1>
        <p>Order ID: {orderId}</p>
        <div className="upload-section">
          <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Receipt'}
          </button>
        </div>
        <div className="instructions">
          <h3>Payment Instructions:</h3>
          <p>1. Make payment to the bank account provided</p>
          <p>2. Upload a screenshot or PDF of your payment receipt</p>
          <p>3. Admin will verify and process your order</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentUpload;*/

import React, { useState } from 'react';
import './CSS/PaymentUpload.css';
import { useParams, useNavigate } from 'react-router-dom';

const PaymentUpload = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [deliveryDetails, setDeliveryDetails] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('📎 File selected:', file); // DEBUG
    setReceipt(file);
  };

  const handleDeliveryChange = (e) => {
    setDeliveryDetails({
      ...deliveryDetails,
      [e.target.name]: e.target.value
    });
  };

  const validateDeliveryDetails = () => {
    if (!deliveryDetails.fullName.trim()) {
      alert('Please enter your full name');
      return false;
    }
    if (!deliveryDetails.address.trim()) {
      alert('Please enter your delivery address');
      return false;
    }
    if (!deliveryDetails.city.trim()) {
      alert('Please enter your city');
      return false;
    }
    if (!deliveryDetails.postalCode.trim()) {
      alert('Please enter your postal code');
      return false;
    }
    if (!deliveryDetails.phone.trim()) {
      alert('Please enter your phone number');
      return false;
    }
    return true;
  };

  const handleBankTransferUpload = async () => {
    console.log('🚀 Button clicked!'); // DEBUG
    console.log('📄 Receipt:', receipt); // DEBUG
    console.log('🆔 Order ID:', orderId); // DEBUG
    console.log('🔑 Auth Token:', localStorage.getItem('auth-token')); // DEBUG
    
    if (!receipt) {
      alert('Please select a receipt file');
      return;
    }

    if (!validateDeliveryDetails()) {
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('receipt', receipt);
    formData.append('orderId', orderId);
    formData.append('deliveryDetails', JSON.stringify(deliveryDetails));

    console.log('📦 FormData entries:'); // DEBUG
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      console.log('📡 Sending request...'); // DEBUG
      const response = await fetch('http://localhost:4000/uploadreceipt', {
        method: 'POST',
        headers: {
          'auth-token': `${localStorage.getItem('auth-token')}`,
        },
        body: formData,
      });

      console.log('📥 Response status:', response.status); // DEBUG
      const data = await response.json();
      console.log('📥 Response data:', data); // DEBUG

      if (data.success) {
        alert('Receipt and delivery details uploaded successfully!');
        navigate('/');
      } else {
        alert('Error uploading receipt: ' + data.message);
      }
    } catch (error) {
      console.error('❌ Error:', error); // DEBUG
      alert('Error uploading receipt: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCashOnDelivery = async () => {
    if (!validateDeliveryDetails()) {
      return;
    }

    if (!window.confirm('Confirm Cash on Delivery for this order?')) {
      return;
    }

    setUploading(true);

    try {
      const response = await fetch('http://localhost:4000/cash-on-delivery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': `${localStorage.getItem('auth-token')}`,
        },
        body: JSON.stringify({ 
          orderId,
          deliveryDetails 
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Cash on Delivery order confirmed with delivery details!');
        navigate('/');
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error processing Cash on Delivery');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='payment-upload'>
      <div className="payment-upload-container">
        <h1>Complete Your Order</h1>
        <p className="order-id">Order ID: {orderId}</p>

        {/* Delivery Details Section */}
        <div className="delivery-details-section">
          <h2>📍 Delivery Details</h2>
          <p className="section-description">Please provide your delivery information</p>
          
          <div className="form-grid">
            <div className="form-field">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={deliveryDetails.fullName}
                onChange={handleDeliveryChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-field">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={deliveryDetails.phone}
                onChange={handleDeliveryChange}
                placeholder="+94 XX XXX XXXX"
                required
              />
            </div>

            <div className="form-field full-width">
              <label>Complete Address *</label>
              <textarea
                name="address"
                value={deliveryDetails.address}
                onChange={handleDeliveryChange}
                placeholder="Street address, house number, apartment, etc."
                rows="3"
                required
              ></textarea>
            </div>

            <div className="form-field">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={deliveryDetails.city}
                onChange={handleDeliveryChange}
                placeholder="City"
                required
              />
            </div>

            <div className="form-field">
              <label>Postal Code *</label>
              <input
                type="text"
                name="postalCode"
                value={deliveryDetails.postalCode}
                onChange={handleDeliveryChange}
                placeholder="Postal Code"
                required
              />
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="payment-method-section">
          <h2>💳 Choose Payment Method</h2>
          <div className="payment-method-selection">
            <div 
              className={`payment-option ${paymentMethod === 'bank' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('bank')}
            >
              <div className="option-icon">🏦</div>
              <h3>Bank Transfer</h3>
              <p>Pay now via bank transfer</p>
            </div>

            <div 
              className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('cod')}
            >
              <div className="option-icon">💵</div>
              <h3>Cash on Delivery</h3>
              <p>Pay when you receive</p>
            </div>
          </div>
        </div>

        {/* Bank Transfer Section */}
        {paymentMethod === 'bank' && (
          <div className="bank-transfer-section">
            <h2>📤 Upload Payment Receipt</h2>
            <div className="upload-section">
              <label htmlFor="file-upload" className="file-upload-label">
                {receipt ? `✅ ${receipt.name}` : '📎 Choose Receipt File'}
              </label>
              <input 
                id="file-upload"
                type="file" 
                accept="image/*,application/pdf" 
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              
              {/* Debug info */}
              {receipt && (
                <div style={{ fontSize: '12px', color: '#666', margin: '10px 0' }}>
                  File ready: {receipt.name} ({(receipt.size / 1024).toFixed(2)} KB)
                </div>
              )}
              
              <button 
                className="upload-btn"
                onClick={handleBankTransferUpload} 
                disabled={uploading || !receipt}
                style={{
                  opacity: (uploading || !receipt) ? 0.5 : 1,
                  cursor: (uploading || !receipt) ? 'not-allowed' : 'pointer'
                }}
              >
                {uploading ? '⏳ Submitting...' : !receipt ? '⚠️ Please Select File First' : 'Submit Order with Receipt'}
              </button>
            </div>
            <div className="instructions">
              <h3>📋 Payment Instructions:</h3>
              <ol>
                <li>Make payment to the bank account provided in cart</li>
                <li>Upload a screenshot or PDF of your payment receipt</li>
                <li>Admin will verify and process your order within 24 hours</li>
              </ol>
            </div>
          </div>
        )}

        {/* Cash on Delivery Section */}
        {paymentMethod === 'cod' && (
          <div className="cod-section">
            <h2>💵 Cash on Delivery</h2>
            <div className="cod-info">
              <div className="info-box">
                <span className="icon">✅</span>
                <div>
                  <h4>No Advance Payment</h4>
                  <p>Pay when you receive your order</p>
                </div>
              </div>
              <div className="info-box">
                <span className="icon">🚚</span>
                <div>
                  <h4>Fast Delivery</h4>
                  <p>Your order will be shipped within 24-48 hours</p>
                </div>
              </div>
              <div className="info-box">
                <span className="icon">💰</span>
                <div>
                  <h4>Pay to Delivery Person</h4>
                  <p>Cash payment accepted on delivery</p>
                </div>
              </div>
            </div>
            <div className="cod-note">
              <p><strong>Note:</strong> Please ensure someone is available at the delivery address to receive the order and make payment.</p>
            </div>
            <button 
              className="cod-confirm-btn"
              onClick={handleCashOnDelivery}
              disabled={uploading}
            >
              {uploading ? 'Processing...' : ' Confirm Cash on Delivery'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentUpload;