import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQty,
    subtotal,
    tax,
    shipping,
    total,
    itemCount,
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="drawer-overlay"
        onClick={() => setIsCartOpen(false)}
        id="cart-overlay"
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside className="drawer" role="dialog" aria-label="Shopping cart" id="cart-drawer">
        <div className="drawer-header">
          <h2 className="drawer-title">
            🛒 Cart{' '}
            {itemCount > 0 && (
              <span className="badge badge-accent" style={{ marginLeft: '0.5rem' }}>
                {itemCount}
              </span>
            )}
          </h2>
          <button
            className="drawer-close"
            onClick={() => setIsCartOpen(false)}
            id="close-cart-btn"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div className="drawer-empty">
              <span className="drawer-empty-icon">🛍️</span>
              <p style={{ fontWeight: 600 }}>Your cart is empty</p>
              <p style={{ fontSize: '0.875rem' }}>Add some products to get started!</p>
              <button
                className="btn btn-primary"
                onClick={() => setIsCartOpen(false)}
                style={{ marginTop: '0.5rem' }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item._id} className="cart-item-drawer">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-img"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/68x68/16161f/6366f1?text=${encodeURIComponent(item.name.charAt(0))}`;
                  }}
                />
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-price">${item.price.toFixed(2)}</p>
                  <div className="cart-item-actions">
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
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFromCart(item._id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <div className="drawer-totals">
              <div className="drawer-total-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="drawer-total-row">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="drawer-total-row">
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? 'var(--success)' : '' }}>
                  {shipping === 0 ? 'Free 🎉' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="drawer-total-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              className="btn btn-primary btn-lg btn-full"
              onClick={handleCheckout}
              id="checkout-from-drawer-btn"
            >
              Proceed to Checkout →
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
