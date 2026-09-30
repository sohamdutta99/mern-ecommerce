import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const StarRating = ({ rating }) => {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`star ${i <= Math.round(rating) ? 'filled' : 'empty'}`}>
          ★
        </span>
      ))}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`, {
      style: {
        background: 'var(--bg-card)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-accent)',
      },
      iconTheme: { primary: 'var(--accent)', secondary: '#fff' },
    });
  };

  return (
    <div
      className="product-card fade-in-up"
      id={`product-card-${product._id}`}
      onClick={() => navigate(`/products/${product._id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/products/${product._id}`)}
    >
      <div className="product-card-img-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/400x300/16161f/6366f1?text=${encodeURIComponent(product.name)}`;
          }}
        />
      </div>
      <div className="product-card-body">
        <div className="product-card-cat">
          <span className="badge badge-accent">{product.category}</span>
        </div>
        <h3 className="product-card-name">{product.name}</h3>
        <div className="product-card-rating">
          <StarRating rating={product.rating} />
          <span>({product.numReviews.toLocaleString()})</span>
        </div>
        <div className="product-card-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            className="product-add-btn"
            id={`add-to-cart-${product._id}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            aria-label={`Add ${product.name} to cart`}
          >
            {product.stock === 0 ? 'Out of Stock' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
