import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

export default function ResultPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const result = state?.result;

  if (!result) {
    navigate('/categories');
    return null;
  }

  const gradeColor = {
    A: '#22c55e', B: '#6366f1', C: '#f59e0b', D: '#f97316', F: '#ef4444'
  }[result.grade] || '#6366f1';

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="result-container">
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            {result.score >= 60 ? '🎉 Great Job!' : '💪 Keep Practicing!'}
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>{result.categoryName} Quiz Result</p>

          {/* Score Circle */}
          <div
            className="score-circle"
            style={{ '--score': result.score }}
          >
            <div className="score-circle-inner">
              <div className="score-percent">{result.score.toFixed(0)}%</div>
              <div className="score-grade" style={{ color: gradeColor, fontWeight: 700, fontSize: '1.2rem' }}>
                Grade {result.grade}
              </div>
            </div>
          </div>

          {/* Message */}
          <div className={`alert ${result.score >= 60 ? 'alert-success' : 'alert-error'}`} style={{ textAlign: 'center', fontSize: '1rem' }}>
            {result.message}
          </div>

          {/* Stats */}
          <div className="result-stats">
            <div className="result-stat">
              <div className="result-stat-num stat-correct">{result.correctAnswers}</div>
              <div className="result-stat-label"><i className="fas fa-check" /> Correct</div>
            </div>
            <div className="result-stat">
              <div className="result-stat-num stat-wrong">{result.wrongAnswers}</div>
              <div className="result-stat-label"><i className="fas fa-times" /> Wrong</div>
            </div>
            <div className="result-stat">
              <div className="result-stat-num stat-total">{result.totalQuestions}</div>
              <div className="result-stat-label"><i className="fas fa-list" /> Total</div>
            </div>
          </div>

          {/* Time */}
          <div className="card" style={{ display: 'flex', justifyContent: 'space-around', padding: '1.25rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-accent)' }}>
                {Math.floor(result.timeTakenSeconds / 60)}m {result.timeTakenSeconds % 60}s
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Time Taken</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-warning)' }}>
                {result.categoryName}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Category</div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
            <Link to="/categories" className="btn btn-primary btn-lg">
              <i className="fas fa-redo" /> Try Another Quiz
            </Link>
            <Link to="/dashboard" className="btn btn-outline btn-lg">
              <i className="fas fa-chart-bar" /> View All Results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
