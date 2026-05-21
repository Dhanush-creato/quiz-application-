import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { quizService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    quizService.getMyResults()
      .then(res => setResults(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const avg = results.length
    ? (results.reduce((s, r) => s + r.score, 0) / results.length).toFixed(1)
    : 0;

  const best = results.length
    ? Math.max(...results.map(r => r.score)).toFixed(1)
    : 0;

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
          Welcome back, <span style={{ color: 'var(--color-primary-h)' }}>{user?.fullName || user?.username}</span>!
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem' }}>Track your quiz history and performance</p>

        {/* Summary Stats */}
        <div className="stats-grid" style={{ marginBottom: '2.5rem' }}>
          {[
            { icon: '📝', label: 'Total Quizzes', value: results.length, color: 'var(--color-primary-h)' },
            { icon: '📊', label: 'Average Score', value: `${avg}%`, color: 'var(--color-accent)' },
            { icon: '🏆', label: 'Best Score', value: `${best}%`, color: 'var(--color-success)' },
          ].map(s => (
            <div key={s.label} className="card stat-card">
              <div className="stat-card-icon">{s.icon}</div>
              <div className="stat-card-num" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Results Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.2rem' }}>Quiz History</h2>
            <Link to="/categories" className="btn btn-primary btn-sm">
              <i className="fas fa-play" /> New Quiz
            </Link>
          </div>

          {loading ? (
            <div className="loading-container" style={{ padding: '3rem' }}><div className="spinner" /></div>
          ) : results.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              <i className="fas fa-clipboard-list" style={{ fontSize: '3rem', opacity: 0.3, display: 'block', marginBottom: '1rem' }} />
              <p>No quiz attempts yet. <Link to="/categories">Take your first quiz!</Link></p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Category</th>
                    <th>Score</th>
                    <th>Correct</th>
                    <th>Wrong</th>
                    <th>Time</th>
                    <th>Grade</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => {
                    const gradeColor = { A:'#22c55e', B:'#6366f1', C:'#f59e0b', D:'#f97316', F:'#ef4444' };
                    const grade = r.score>=90?'A': r.score>=75?'B': r.score>=60?'C': r.score>=40?'D':'F';
                    return (
                      <tr key={r.id}>
                        <td style={{ color: 'var(--color-text-muted)' }}>{i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{r.category?.name}</td>
                        <td>
                          <span style={{ color: r.score >= 60 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 700 }}>
                            {r.score?.toFixed(1)}%
                          </span>
                        </td>
                        <td style={{ color: 'var(--color-success)' }}>{r.correctAnswers}</td>
                        <td style={{ color: 'var(--color-danger)' }}>{r.wrongAnswers}</td>
                        <td>{Math.floor(r.timeTakenSeconds/60)}m {r.timeTakenSeconds%60}s</td>
                        <td>
                          <span style={{ fontWeight: 800, color: gradeColor[grade] || '#fff' }}>{grade}</span>
                        </td>
                        <td style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                          {new Date(r.attemptedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
