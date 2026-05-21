import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand">
          <i className="fas fa-brain" style={{ marginRight: '0.5rem' }} />
          QuizMaster
        </Link>

        {/* Navigation Links */}
        <ul className="navbar-nav">
          <li><Link to="/" className={isActive('/')}>Home</Link></li>
          <li><Link to="/categories" className={isActive('/categories')}>Categories</Link></li>

          {user && (
            <li><Link to="/dashboard" className={isActive('/dashboard')}>My Results</Link></li>
          )}
          {user && isAdmin() && (
            <li><Link to="/admin" className={isActive('/admin')}>Admin Panel</Link></li>
          )}
        </ul>

        {/* Auth Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <>
              <div className="nav-user-badge">
                <i className="fas fa-user-circle" />
                {user.username}
                {isAdmin() && <span style={{ marginLeft: '4px', fontSize: '0.7rem', background: 'rgba(168,85,247,0.3)', padding: '1px 6px', borderRadius: '10px', color: '#c084fc' }}>ADMIN</span>}
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                <i className="fas fa-sign-out-alt" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
