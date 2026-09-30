import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQty, subtotal, tax, shipping, total, itemCount } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <main className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <span className="empty-icon">🛒</span>
            <h1 className="empty-title">Your Cart Is Empty</h1>
            <p className="empty-desc">Looks like you haven't added anything yet.</p>
            <Link to="/" className="btn btn-primary btn-lg">Start Shopping</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-wrapper fade-in">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>
        <p className="page-subtitle">{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>

        <div className="cart-page-grid">
          {/* Cart Items Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div className="cart-row-product">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="cart-row-img"
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/72x72/16161f/6366f1?text=${encodeURIComponent(item.name.charAt(0))}`;
                          }}
                        />
                        <div>
                          <Link to={`/products/${item._id}`} className="cart-row-name">
                            {item.name}
                          </Link>
                          <p className="cart-row-brand">{item.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="cart-row-price">${item.price.toFixed(2)}</td>
                    <td>
                      <div className="qty-control">
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item._id, item.qty - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="qty-display">{item.qty}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item._id, item.qty + 1)}
                          disabled={item.qty >= item.stock}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="cart-row-subtotal">${(item.price * item.qty).toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        id={`remove-cart-item-${item._id}`}
                        onClick={() => removeFromCart(item._id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Summary */}
          <div className="order-summary-card">
            <h2 className="order-summary-title">Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal ({itemCount} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className={`summary-row ${shipping === 0 ? 'free' : ''}`}>
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free 🎉' : `$${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Add ${(50 - subtotal).toFixed(2)} more for free shipping
              </p>
            )}
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              className="btn btn-primary btn-lg btn-full"
              id="proceed-to-checkout-btn"
              onClick={() => navigate('/checkout')}
              style={{ marginTop: '1.25rem' }}
            >
              Proceed to Checkout →
            </button>
            <Link
              to="/"
              className="btn btn-secondary btn-full"
              style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center' }}
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
