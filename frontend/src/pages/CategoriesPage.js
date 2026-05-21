import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/api';

const ICON_COLORS = ['#6366f1', '#a855f7', '#06b6d4', '#22c55e', '#f59e0b', '#ef4444'];

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    categoryService.getAll()
      .then(res => setCategories(res.data))
      .catch(() => setError('Failed to load categories. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-layer-group" style={{ color: 'var(--color-primary-h)', marginRight: '0.5rem' }} />
            Quiz Categories
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Choose a category and put your knowledge to the test!
          </p>
        </div>

        {loading && (
          <div className="loading-container">
            <div>
              <div className="spinner" style={{ width: 50, height: 50 }} />
              <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '1rem' }}>Loading categories...</p>
            </div>
          </div>
        )}

        {error && <div className="alert alert-error"><i className="fas fa-exclamation-triangle" /> {error}</div>}

        {!loading && !error && (
          <>
            {categories.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)' }}>
                <i className="fas fa-inbox" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block', opacity: 0.4 }} />
                <p>No categories found. Ask your admin to add some!</p>
              </div>
            ) : (
              <div className="categories-grid">
                {categories.map((cat, i) => (
                  <Link
                    key={cat.id}
                    to={`/quiz/${cat.id}`}
                    className="category-card"
                    id={`category-${cat.id}`}
                  >
                    <div className="category-icon" style={{ color: ICON_COLORS[i % ICON_COLORS.length], background: `rgba(${hexToRgb(ICON_COLORS[i % ICON_COLORS.length])}, 0.12)` }}>
                      <i className={cat.iconClass || 'fas fa-question-circle'} />
                    </div>
                    <h3>{cat.name}</h3>
                    <p>{cat.description || 'Test your knowledge in this category'}</p>
                    <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: 'var(--color-primary-h)', fontSize: '0.85rem', fontWeight: 600 }}>
                      Start Quiz <i className="fas fa-arrow-right" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `${r},${g},${b}`;
}
