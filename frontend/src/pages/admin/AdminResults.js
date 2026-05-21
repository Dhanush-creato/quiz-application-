import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { quizService } from '../../services/api';

export default function AdminResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    quizService.getAllResults()
      .then(r => setResults(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = results.filter(r =>
    !search ||
    r.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
    r.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const avg = results.length
    ? (results.reduce((s, r) => s + r.score, 0) / results.length).toFixed(1)
    : 0;
  const passed = results.filter(r => r.score >= 60).length;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <h1 className="admin-page-title">User Results</h1>
        <p className="admin-page-sub">All quiz attempts by registered users</p>

        {/* Summary */}
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          {[
            { icon: '📊', label: 'Total Attempts', value: results.length, color: 'var(--color-primary-h)' },
            { icon: '📈', label: 'Avg Score', value: `${avg}%`, color: 'var(--color-accent)' },
            { icon: '✅', label: 'Passed (≥60%)', value: passed, color: 'var(--color-success)' },
            { icon: '❌', label: 'Failed (<60%)', value: results.length - passed, color: 'var(--color-danger)' },
          ].map(s => (
            <div key={s.label} className="card stat-card">
              <div className="stat-card-icon">{s.icon}</div>
              <div className="stat-card-num" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            id="results-search"
            className="form-control"
            style={{ maxWidth: 320 }}
            placeholder="🔍 Search by username or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th><th>Username</th><th>Category</th><th>Score</th>
                    <th>Correct</th><th>Wrong</th><th>Total</th><th>Time</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r.id}>
                      <td style={{ color: 'var(--color-text-muted)' }}>{i+1}</td>
                      <td style={{ fontWeight: 600 }}>
                        <i className="fas fa-user-circle" style={{ marginRight: 6, color: 'var(--color-primary-h)' }} />
                        {r.user?.username}
                      </td>
                      <td>{r.category?.name}</td>
                      <td style={{ fontWeight: 700, color: r.score >= 60 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                        {r.score?.toFixed(1)}%
                      </td>
                      <td style={{ color: 'var(--color-success)' }}>{r.correctAnswers}</td>
                      <td style={{ color: 'var(--color-danger)' }}>{r.wrongAnswers}</td>
                      <td>{r.totalQuestions}</td>
                      <td>{Math.floor(r.timeTakenSeconds/60)}m {r.timeTakenSeconds%60}s</td>
                      <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                        {new Date(r.attemptedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                  No results found.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
