import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '', fullName: ''
  });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ── Extracts the best error string from any Axios error shape ──
  const extractError = (err) => {
    if (!err.response) return 'Cannot connect to server. Make sure the backend is running on port 8080.';
    const data = err.response?.data;
    if (typeof data === 'string') return data;
    if (data?.message) return data.message;
    if (data?.error)   return data.error;
    return `Registration failed (${err.response.status}). Please try again.`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation
    if (form.username.trim().length < 3) {
      setError('Username must be at least 3 characters.'); return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.'); return;
    }

    setLoading(true);
    try {
      await register({
        username:  form.username.trim(),
        email:     form.email.trim(),
        password:  form.password,
        fullName:  form.fullName.trim(),
      });
      setSuccess('🎉 Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card" style={{ maxWidth: 500 }}>
        <div className="auth-logo">
          <h1><i className="fas fa-brain" /> QuizMaster</h1>
          <p>Create your free account</p>
        </div>

        {error && (
          <div className="alert alert-error" id="register-error">
            <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }} />
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success" id="register-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-fullname">Full Name *</label>
            <input
              id="reg-fullname" name="fullName" type="text"
              className="form-control" placeholder="e.g. John Doe"
              value={form.fullName} onChange={handleChange} required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-username">Username *</label>
            <input
              id="reg-username" name="username" type="text"
              className="form-control" placeholder="Min 3 characters"
              value={form.username} onChange={handleChange} required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address *</label>
            <input
              id="reg-email" name="email" type="email"
              className="form-control" placeholder="john@example.com"
              value={form.email} onChange={handleChange} required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password *</label>
              <input
                id="reg-password" name="password" type="password"
                className="form-control" placeholder="Min 6 chars"
                value={form.password} onChange={handleChange} required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm *</label>
              <input
                id="reg-confirm" name="confirmPassword" type="password"
                className="form-control" placeholder="Repeat password"
                value={form.confirmPassword} onChange={handleChange} required
              />
            </div>
          </div>

          {/* Password match indicator */}
          {form.password && form.confirmPassword && (
            <div style={{
              fontSize: '0.82rem',
              marginTop: '-0.75rem',
              marginBottom: '1rem',
              color: form.password === form.confirmPassword
                ? 'var(--color-success)' : 'var(--color-danger)'
            }}>
              {form.password === form.confirmPassword
                ? '✓ Passwords match'
                : '✗ Passwords do not match'}
            </div>
          )}

          <button
            id="register-btn"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}
            disabled={loading || !!success}
          >
            {loading
              ? <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> &nbsp;Creating account...</>
              : <><i className="fas fa-user-plus" /> Create Account</>
            }
          </button>
        </form>

        <div className="auth-divider">or</div>
        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
