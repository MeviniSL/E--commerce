/*
import React, { useEffect, useState } from 'react';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:4000/orders');
      const data = await response.json();
      console.log('Fetched orders:', data);
      if (data.success) {
        setOrders(data.orders);
      } else {
        console.error('Failed to fetch orders:', data.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`http://localhost:4000/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Order status updated successfully!');
        if (status === 'Completed' && data.emailSent) {
          alert('Delivery details request email sent to customer.');
        }
        fetchOrders();
      } else {
        alert('Failed to update status: ' + (data.message || 'unknown error'));
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  if (loading) return <div className="orders"><h2>Loading orders...</h2></div>;
  if (orders.length === 0) return <div className="orders"><h2>No orders found</h2></div>;

  return (
    <div className="orders">
      <h1>Orders Management</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <h3>Order ID: {order._id}</h3>
              <span className={`status ${order.status.toLowerCase().replace(/ /g, '-')}`}>
                {order.status}
              </span>
            </div>

            <div className="order-details">
              <p><strong>Customer:</strong> {order.customerName}</p>
              <p><strong>Email:</strong> {order.customerEmail}</p>
              {order.paymentMethod && <p><strong>Payment:</strong> {order.paymentMethod}</p>}
              <p><strong>Total:</strong> Rs {order.total}</p>
              <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
            </div>

            <div className="order-items">
              <h4>Items:</h4>
              {order.items.map((item, index) => (
                <div key={index} className="item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>Rs {item.total}</span>
                </div>
              ))}
            </div>

            {order.receiptUrl ? (
              <div className="receipt-section">
                <h4>Payment Receipt:</h4>
                <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer">
                  <button className="view-receipt-btn">View Receipt</button>
                </a>
                <img src={order.receiptUrl} alt="Receipt" className="receipt-preview" />
              </div>
            ) : order.paymentMethod === 'COD' ? (
              <div className="receipt-section">
                <p><em>💵 Cash on Delivery - no receipt required</em></p>
              </div>
            ) : (
              <div className="receipt-section">
                <p><em>No receipt uploaded yet</em></p>
              </div>
            )}

            {order.deliveryAddress && (
              <div className="delivery-address-section">
                <h4>📍 Delivery Address:</h4>
                <div className="address-details">
                  <p><strong>👤 Name:</strong> {order.deliveryAddress.fullName}</p>
                  <p><strong>📞 Phone:</strong> {order.deliveryAddress.phone}</p>
                  <p><strong>📍 Address:</strong> {order.deliveryAddress.address}</p>
                  <p><strong>🏙️ City:</strong> {order.deliveryAddress.city}</p>
                  <p><strong>📮 Postal Code:</strong> {order.deliveryAddress.postalCode}</p>
                </div>
              </div>
            )}

            <div className="order-actions">
              <label>Update Status: </label>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Payment Uploaded">Payment Uploaded</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Verified">Verified</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;*/

import React, { useEffect, useState } from 'react';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:4000/orders');
      const data = await response.json();
      console.log('Fetched orders:', data);
      if (data.success) {
        setOrders(data.orders);
      } else {
        console.error('Failed to fetch orders:', data.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`http://localhost:4000/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Order status updated successfully!');
        if (status === 'Completed' && data.emailSent) {
          alert('Delivery details request email sent to customer.');
        }
        fetchOrders();
      } else {
        alert('Failed to update status: ' + (data.message || 'unknown error'));
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('⚠️ Are you sure you want to permanently delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/orders/${orderId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Order deleted successfully!');
        fetchOrders(); // Refresh the orders list
      } else {
        alert('❌ Failed to delete order: ' + (data.message || 'unknown error'));
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('❌ Failed to delete order');
    }
  };

  if (loading) return <div className="orders"><h2>Loading orders...</h2></div>;
  if (orders.length === 0) return <div className="orders"><h2>No orders found</h2></div>;

  return (
    <div className="orders">
      <h1>Orders Management</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <h3>Order ID: {order._id}</h3>
              <span className={`status ${order.status.toLowerCase().replace(/ /g, '-')}`}>
                {order.status}
              </span>
            </div>

            <div className="order-details">
              <p><strong>Customer:</strong> {order.customerName}</p>
              <p><strong>Email:</strong> {order.customerEmail}</p>
              {order.paymentMethod && <p><strong>Payment:</strong> {order.paymentMethod}</p>}
              <p><strong>Total:</strong> Rs {order.total}</p>
              <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
            </div>

            <div className="order-items">
              <h4>Items:</h4>
              {order.items.map((item, index) => (
                <div key={index} className="item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>Rs {item.total}</span>
                </div>
              ))}
            </div>

            {order.receiptUrl ? (
              <div className="receipt-section">
                <h4>Payment Receipt:</h4>
                <a href={order.receiptUrl} target="_blank" rel="noopener noreferrer">
                  <button className="view-receipt-btn">View Receipt</button>
                </a>
                <img src={order.receiptUrl} alt="Receipt" className="receipt-preview" />
              </div>
            ) : order.paymentMethod === 'COD' ? (
              <div className="receipt-section">
                <p><em>💵 Cash on Delivery - no receipt required</em></p>
              </div>
            ) : (
              <div className="receipt-section">
                <p><em>No receipt uploaded yet</em></p>
              </div>
            )}

            {order.deliveryAddress && (
              <div className="delivery-address-section">
                <h4>📍 Delivery Address:</h4>
                <div className="address-details">
                  <p><strong>👤 Name:</strong> {order.deliveryAddress.fullName}</p>
                  <p><strong>📞 Phone:</strong> {order.deliveryAddress.phone}</p>
                  <p><strong>📍 Address:</strong> {order.deliveryAddress.address}</p>
                  <p><strong>🏙️ City:</strong> {order.deliveryAddress.city}</p>
                  <p><strong>📮 Postal Code:</strong> {order.deliveryAddress.postalCode}</p>
                </div>
              </div>
            )}

            <div className="order-actions">
              <label>Update Status: </label>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Payment Uploaded">Payment Uploaded</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Verified">Verified</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              
              <button 
                className="delete-order-btn"
                onClick={() => deleteOrder(order._id)}
              >
                🗑️ Delete Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
