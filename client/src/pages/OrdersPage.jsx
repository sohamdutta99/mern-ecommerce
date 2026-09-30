import { useState, useEffect } from 'react';
import api from '../services/api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <main className="page-wrapper">
        <div className="container">
          <div className="page-title">My Orders</div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 80, borderRadius: 'var(--radius-lg)', marginBottom: '1rem' }} />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-wrapper">
        <div className="container">
          <div className="alert alert-error">{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-wrapper fade-in">
      <div className="container">
        <h1 className="page-title">My Orders</h1>
        <p className="page-subtitle">Your complete purchase history.</p>

        {orders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <h2 className="empty-title">No Orders Yet</h2>
            <p className="empty-desc">Once you place your first order, it will appear here.</p>
            <a href="/" className="btn btn-primary btn-lg">Start Shopping</a>
          </div>
        ) : (
          <div>
            {orders.map((order) => (
              <div key={order._id} className="order-card fade-in-up" id={`order-${order._id}`}>
                {/* Order Header */}
                <div
                  className="order-card-header"
                  onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                  aria-expanded={expandedOrder === order._id}
                >
                  <div>
                    <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span className={`badge ${order.isPaid ? 'badge-success' : 'badge-warning'}`}>
                      {order.isPaid ? '✓ Paid' : 'Pending'}
                    </span>
                    <span className={`badge ${order.isDelivered ? 'badge-success' : 'badge-muted'}`}>
                      {order.isDelivered ? '✓ Delivered' : '⏳ Processing'}
                    </span>
                    <span className="order-total">${order.totalPrice.toFixed(2)}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {expandedOrder === order._id ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Expanded: Item breakdown */}
                {expandedOrder === order._id && (
                  <div className="order-items-table">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="order-item-row">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="order-item-img"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/52'; }}
                        />
                        <span className="order-item-name">{item.name}</span>
                        <span className="order-item-qty">×{item.qty}</span>
                        <span className="order-item-price">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                    {/* Shipping Summary */}
                    <div style={{
                      marginTop: '1rem',
                      padding: '0.875rem',
                      background: 'var(--glass)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                    }}>
                      <strong style={{ color: 'var(--text-secondary)' }}>Shipped to:</strong>{' '}
                      {order.shippingAddress.fullName},{' '}
                      {order.shippingAddress.address},{' '}
                      {order.shippingAddress.city},{' '}
                      {order.shippingAddress.postalCode},{' '}
                      {order.shippingAddress.country}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem', gap: '1rem', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Tax: ${order.taxPrice.toFixed(2)}</span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        Shipping: {order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice.toFixed(2)}`}
                      </span>
                      <span style={{ fontWeight: 700 }}>Total: ${order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default OrdersPage;
