import React, { useState } from 'react';
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

export default PaymentUpload;