import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const StarRating = ({ rating, numReviews }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
    <div className="stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`star ${i <= Math.round(rating) ? 'filled' : 'empty'}`} style={{ fontSize: '1.1rem' }}>★</span>
      ))}
    </div>
    <span className="text-secondary text-sm">{rating.toFixed(1)} ({numReviews.toLocaleString()} reviews)</span>
  </div>
);

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch {
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${product.name} (×${qty}) added to cart!`, {
      style: { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border-accent)' },
      iconTheme: { primary: 'var(--accent)', secondary: '#fff' },
    });
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="product-detail-grid">
            <div className="skeleton" style={{ aspectRatio: '1/1', borderRadius: 'var(--radius-xl)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="skeleton" style={{ height: '24px', width: '40%' }} />
              <div className="skeleton" style={{ height: '36px', width: '80%' }} />
              <div className="skeleton" style={{ height: '48px', width: '30%' }} />
              <div className="skeleton" style={{ height: '100px' }} />
              <div className="skeleton" style={{ height: '52px' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <span className="empty-icon">⚠️</span>
            <h2 className="empty-title">Product Not Found</h2>
            <p className="empty-desc">{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Shop</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="page-wrapper fade-in">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span className="breadcrumb-sep">›</span>
          <Link to={`/?category=${product.category}`}>{product.category}</Link>
          <span className="breadcrumb-sep">›</span>
          <span style={{ color: 'var(--text-secondary)' }}>{product.name}</span>
        </nav>

        <div className="product-detail-grid">
          {/* Image */}
          <div className="product-detail-img-wrap">
            <img
              src={product.image}
              alt={product.name}
              className="product-detail-img"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/600x600/16161f/6366f1?text=${encodeURIComponent(product.name)}`;
              }}
            />
          </div>

          {/* Info */}
          <div className="fade-in-up">
            <span className="badge badge-accent">{product.category}</span>
            <h1 className="product-detail-name">{product.name}</h1>
            <StarRating rating={product.rating} numReviews={product.numReviews} />
            <p className="product-detail-price">${product.price.toFixed(2)}</p>
            <p className="product-detail-desc">{product.description}</p>

            <div className="product-detail-meta">
              <div className="product-detail-meta-row">
                <span>Brand</span>
                <span>{product.brand}</span>
              </div>
              <div className="product-detail-meta-row">
                <span>Category</span>
                <span>{product.category}</span>
              </div>
              <div className="product-detail-meta-row">
                <span>Availability</span>
                <span>
                  {product.stock > 0 ? (
                    <span className="stock-badge">
                      <span className="stock-dot" />
                      In Stock ({product.stock} left)
                    </span>
                  ) : (
                    <span style={{ color: 'var(--error)' }}>Out of Stock</span>
                  )}
                </span>
              </div>
            </div>

            {product.stock > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="qty-display">{qty}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  className="btn btn-primary btn-lg"
                  id="add-to-cart-detail-btn"
                  onClick={handleAddToCart}
                  style={{ flex: 1 }}
                >
                  🛒 Add to Cart
                </button>
              </div>
            )}

            <hr className="divider" />

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { icon: '🚚', label: 'Free shipping over $50' },
                { icon: '🔄', label: '30-day returns' },
                { icon: '🔒', label: 'Secure checkout' },
              ].map((b) => (
                <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>{b.icon}</span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetailsPage;
