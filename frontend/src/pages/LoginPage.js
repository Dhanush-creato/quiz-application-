import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ── Extracts the best error string from any Axios error shape ──
  const extractError = (err) => {
    if (!err.response) return 'Cannot connect to server. Make sure the backend is running on port 8080.';
    const data = err.response?.data;
    if (typeof data === 'string') return data;
    if (data?.message) return data.message;
    if (data?.error)   return data.error;
    return `Login failed (${err.response.status}). Please check your credentials.`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.username, form.password);
      if (from) navigate(from, { replace: true });
      else if (user.roles?.includes('ROLE_ADMIN')) navigate('/admin');
      else navigate('/categories');
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <div className="auth-logo">
          <h1><i className="fas fa-brain" /> QuizMaster</h1>
          <p>Sign in to your account</p>
        </div>

        {error && (
          <div className="alert alert-error" id="login-error">
            <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="login-username">Username</label>
            <input
              id="login-username"
              name="username"
              type="text"
              className="form-control"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            id="login-btn"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading
              ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> &nbsp;Signing in...</>
              : <><i className="fas fa-sign-in-alt" /> Sign In</>
            }
          </button>
        </form>

        <div className="auth-divider">or</div>
        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>Create one for free</Link>
        </div>
      </div>
    </div>
  );
}
