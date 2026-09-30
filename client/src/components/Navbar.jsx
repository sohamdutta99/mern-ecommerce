import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = ({ onSearch }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchValue);
    else navigate(`/?search=${searchValue}`);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">🛍️</div>
          <span>
            Nova<span className="text-accent">Shop</span>
          </span>
        </Link>

        {/* Search Bar */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            id="navbar-search-input"
            placeholder="Search products…"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
          />
        </form>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Cart Button */}
          <button
            id="open-cart-btn"
            className="cart-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open cart"
          >
            🛒
            <span>Cart</span>
            {itemCount > 0 && (
              <span className="cart-badge">{itemCount}</span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="user-menu" ref={dropdownRef}>
              <div
                id="user-avatar-btn"
                className="user-avatar"
                onClick={() => setDropdownOpen((v) => !v)}
                title={user?.name}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              {dropdownOpen && (
                <div className="dropdown">
                  <div style={{ padding: '0.5rem 0.75rem 0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Signed in as<br />
                    <strong style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{user?.name}</strong>
                  </div>
                  <div className="dropdown-divider" />
                  <Link
                    to="/orders"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    📦 My Orders
                  </Link>
                  <div className="dropdown-divider" />
                  <button
                    id="logout-btn"
                    className="dropdown-item danger"
                    onClick={handleLogout}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="btn btn-secondary btn-sm" id="login-nav-btn">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="register-nav-btn">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
