import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Kitchen', 'Books'];
const SORT_OPTIONS = [
  { value: '', label: 'Sort: Featured' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
];

const SkeletonCard = () => (
  <div className="product-card">
    <div className="skeleton" style={{ aspectRatio: '4/3' }} />
    <div className="product-card-body" style={{ gap: '0.75rem', display: 'flex', flexDirection: 'column' }}>
      <div className="skeleton" style={{ height: '20px', width: '60%' }} />
      <div className="skeleton" style={{ height: '16px', width: '100%' }} />
      <div className="skeleton" style={{ height: '16px', width: '80%' }} />
      <div className="skeleton" style={{ height: '36px', marginTop: 'auto' }} />
    </div>
  </div>
);

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category !== 'All') params.set('category', category);
      if (sort) params.set('sort', sort);

      const { data } = await api.get(`/products?${params.toString()}`);
      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, [search, category, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300); // debounce search
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  return (
    <main className="page-wrapper">
      <div className="container">
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '3rem', padding: '2rem 0' }} className="fade-in">
          <h1 className="page-title" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
            Discover Premium Products
          </h1>
          <p className="page-subtitle" style={{ maxWidth: '480px', margin: '0.5rem auto 0' }}>
            Shop the latest electronics, fashion, kitchen essentials, and bestselling books — all in one place.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="category-tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                id={`category-tab-${cat.toLowerCase()}`}
                className={`category-tab ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <select
            className="sort-select"
            id="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Results count */}
        {!loading && !error && (
          <p className="text-muted text-sm" style={{ marginBottom: '1.25rem' }}>
            {products.length === 0
              ? 'No products found'
              : `Showing ${products.length} product${products.length !== 1 ? 's' : ''}${category !== 'All' ? ` in ${category}` : ''}`}
          </p>
        )}

        {/* Error */}
        {error && <div className="alert alert-error">{error}</div>}

        {/* Products Grid */}
        {loading ? (
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🔍</span>
            <h2 className="empty-title">No Products Found</h2>
            <p className="empty-desc">Try adjusting your search or filters.</p>
            <button
              className="btn btn-secondary"
              onClick={() => { setSearch(''); setCategory('All'); setSort(''); }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default HomePage;
