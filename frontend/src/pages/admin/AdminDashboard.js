import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import { categoryService, questionService, quizService } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ categories: 0, questions: 0, results: 0 });
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      categoryService.getAll(),
      questionService.getAll(),
      quizService.getAllResults(),
    ]).then(([c, q, r]) => {
      setStats({ categories: c.data.length, questions: q.data.length, results: r.data.length });
      setRecentResults(r.data.slice(0, 5));
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <h1 className="admin-page-title">Admin Dashboard</h1>
        <p className="admin-page-sub">Overview of your quiz platform</p>

        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : (
          <>
            <div className="stats-grid">
              {[
                { icon: '📁', label: 'Categories', value: stats.categories, color: '#a855f7', link: '/admin/categories' },
                { icon: '❓', label: 'Questions', value: stats.questions, color: '#6366f1', link: '/admin/questions' },
                { icon: '📊', label: 'Total Attempts', value: stats.results, color: '#22c55e', link: '/admin/results' },
              ].map(s => (
                <Link key={s.label} to={s.link} style={{ textDecoration: 'none' }}>
                  <div className="card stat-card" style={{ cursor: 'pointer' }}>
                    <div className="stat-card-icon">{s.icon}</div>
                    <div className="stat-card-num" style={{ color: s.color }}>{s.value}</div>
                    <div className="stat-card-label">{s.label}</div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                <h3>Recent Quiz Attempts</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead><tr><th>User</th><th>Category</th><th>Score</th><th>Date</th></tr></thead>
                  <tbody>
                    {recentResults.map(r => (
                      <tr key={r.id}>
                        <td>{r.user?.username}</td>
                        <td>{r.category?.name}</td>
                        <td style={{ color: r.score >= 60 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 700 }}>
                          {r.score?.toFixed(1)}%
                        </td>
                        <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                          {new Date(r.attemptedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
