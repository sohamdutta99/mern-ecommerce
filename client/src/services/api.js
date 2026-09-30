import axios from 'axios';

// Create Axios instance with base URL pointing to our Express server
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ─────────────────────────────────────────
// Automatically attaches Authorization: Bearer <token> to every request
// so we never have to add it manually in individual service calls.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ────────────────────────────────────────
// On 401 Unauthorized, clear stale auth data so the UI reflects logout.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Let components handle the redirect via AuthContext
    }
    return Promise.reject(error);
  }
);

export default api;
