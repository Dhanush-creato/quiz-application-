import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  const features = [
    { icon: 'fa-clock', title: 'Timed Quizzes', desc: 'Race against the clock with our real-time countdown timer system.' },
    { icon: 'fa-chart-bar', title: 'Instant Results', desc: 'Get your score and detailed breakdown immediately after submitting.' },
    { icon: 'fa-shield-alt', title: 'Secure Auth', desc: 'JWT-based authentication with Spring Security for data safety.' },
    { icon: 'fa-layer-group', title: 'Categories', desc: 'Choose from Java, JavaScript, Python, SQL, GK and more.' },
    { icon: 'fa-user-cog', title: 'Admin Panel', desc: 'Full CRUD operations for questions, categories and score monitoring.' },
    { icon: 'fa-mobile-alt', title: 'Responsive', desc: 'Seamless experience across desktop, tablet and mobile devices.' },
  ];

  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <h1>
            Master Your Knowledge<br />
            with <span className="gradient-text">QuizMaster</span>
          </h1>
          <p>
            An interactive online quiz platform built with Java Full Stack – Spring Boot REST APIs,
            React.js frontend, MySQL database, and JWT authentication.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/categories" className="btn btn-primary btn-lg">
              <i className="fas fa-play" /> Start a Quiz
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-outline btn-lg">
                <i className="fas fa-user-plus" /> Register Free
              </Link>
            )}
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">100+</div>
              <div className="hero-stat-label">Questions</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">6</div>
              <div className="hero-stat-label">Categories</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">∞</div>
              <div className="hero-stat-label">Attempts</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section style={{ padding: '4rem 0', background: 'rgba(99,102,241,0.04)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Built with</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', fontSize: '0.95rem', fontWeight: 600 }}>
            {[
              { icon: 'fab fa-java', label: 'Spring Boot', color: '#6db33f' },
              { icon: 'fab fa-react', label: 'React.js', color: '#61dafb' },
              { icon: 'fas fa-database', label: 'MySQL', color: '#4479a1' },
              { icon: 'fas fa-shield-alt', label: 'Spring Security', color: '#6366f1' },
              { icon: 'fas fa-key', label: 'JWT', color: '#f59e0b' },
            ].map((t) => (
              <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: t.color }}>
                <i className={t.icon} />
                <span style={{ color: 'var(--color-text-muted)' }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>Everything you need to learn</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>A complete full-stack platform for students and administrators.</p>
          </div>
          <div className="categories-grid">
            {features.map((f) => (
              <div key={f.title} className="card" style={{ textAlign: 'center' }}>
                <div className="category-icon" style={{ margin: '0 auto 1rem', color: 'var(--color-primary-h)' }}>
                  <i className={`fas ${f.icon}`} />
                </div>
                <h3 style={{ marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      {!user && (
        <section style={{ padding: '5rem 0', textAlign: 'center', background: 'rgba(99,102,241,0.04)', borderTop: '1px solid var(--color-border)' }}>
          <div className="container">
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Ready to test your knowledge?</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Join thousands of students improving their skills daily.</p>
            <Link to="/register" className="btn btn-primary btn-lg">
              <i className="fas fa-rocket" /> Get Started – It's Free
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
