import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cartItems, subtotal, tax, shipping, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (cartItems.length === 0) {
    return (
      <main className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <span className="empty-icon">🛒</span>
            <h1 className="empty-title">Your Cart Is Empty</h1>
            <p className="empty-desc">Add products before checking out.</p>
            <Link to="/" className="btn btn-primary btn-lg">Shop Now</Link>
          </div>
        </div>
      </main>
    );
  }

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const { fullName, address, city, postalCode, country } = form;
    if (!fullName || !address || !city || !postalCode || !country) {
      setError('Please fill in all shipping fields.');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    setLoading(true);
    setError('');
    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress: form,
        paymentMethod: 'Mock Payment',
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
      };

      const { data } = await api.post('/orders', orderPayload);
      clearCart();
      toast.success('Order placed successfully! 🎉', {
        duration: 4000,
        style: { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-accent)' },
      });
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-wrapper fade-in">
      <div className="container">
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">Complete your order in just a few steps.</p>

        <form onSubmit={handlePlaceOrder}>
          <div className="checkout-grid">
            {/* Left: Shipping + Payment */}
            <div>
              {error && <div className="alert alert-error">{error}</div>}

              {/* Shipping Section */}
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h2 className="checkout-section-title">
                  <span className="checkout-section-num">1</span>
                  Shipping Address
                </h2>
                <div className="form-group">
                  <label className="form-label" htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="form-input"
                    placeholder="John Doe"
                    value={form.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="address">Street Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    className="form-input"
                    placeholder="123 Main Street, Apt 4B"
                    value={form.address}
                    onChange={handleChange}
                    autoComplete="street-address"
                  />
                </div>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="city">City</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      className="form-input"
                      placeholder="New York"
                      value={form.city}
                      onChange={handleChange}
                      autoComplete="address-level2"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="postalCode">Postal Code</label>
                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      className="form-input"
                      placeholder="10001"
                      value={form.postalCode}
                      onChange={handleChange}
                      autoComplete="postal-code"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="country">Country</label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    className="form-input"
                    placeholder="United States"
                    value={form.country}
                    onChange={handleChange}
                    autoComplete="country-name"
                  />
                </div>
              </div>

              {/* Payment Section */}
              <div className="card">
                <h2 className="checkout-section-title">
                  <span className="checkout-section-num">2</span>
                  Payment
                </h2>
                <div className="payment-mock">
                  <span className="payment-mock-icon">🔒</span>
                  <div className="payment-mock-text">
                    <h4>Mock Payment System</h4>
                    <p>Your order will be instantly confirmed. No real payment is processed.</p>
                  </div>
                </div>
                <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {['💳 Visa •••• 4242', '💳 Mastercard •••• 5555'].map((card) => (
                    <label
                      key={card}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.625rem 1rem',
                        background: 'var(--glass)',
                        border: '1px solid var(--border-accent)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        color: 'var(--accent-light)',
                      }}
                    >
                      <input type="radio" name="card" defaultChecked={card.includes('4242')} style={{ accentColor: 'var(--accent)' }} />
                      {card}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Order Review */}
            <div>
              <div className="order-summary-card">
                <h2 className="order-summary-title">Order Review</h2>

                {/* Item list */}
                <div style={{ marginBottom: '1rem' }}>
                  {cartItems.map((item) => (
                    <div key={item._id} style={{
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'center',
                      padding: '0.625rem 0',
                      borderBottom: '1px solid var(--border)',
                      fontSize: '0.875rem',
                    }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', objectFit: 'cover', flexShrink: 0 }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/44'; }}
                      />
                      <span style={{ flex: 1, color: 'var(--text-secondary)' }}>
                        {item.name} <span style={{ color: 'var(--text-muted)' }}>×{item.qty}</span>
                      </span>
                      <span style={{ fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="summary-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
                <div className={`summary-row ${shipping === 0 ? 'free' : ''}`}>
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free 🎉' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-full"
                  id="place-order-btn"
                  disabled={loading}
                  style={{ marginTop: '1.25rem' }}
                >
                  {loading ? (
                    <>
                      <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                      Placing Order…
                    </>
                  ) : (
                    '✅ Place Order'
                  )}
                </button>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.75rem' }}>
                  🔒 Secure mock checkout — no real charge
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CheckoutPage;
