import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { questionService, quizService, categoryService } from '../services/api';

const QUIZ_DURATION = 10 * 60; // 10 minutes in seconds
const QUESTIONS_PER_QUIZ = 10;

export default function QuizPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions]   = useState([]);
  const [category, setCategory]     = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers]       = useState({});
  const [timeLeft, setTimeLeft]     = useState(QUIZ_DURATION);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');

  // ── Load questions ────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      questionService.getQuizQuestions(categoryId, QUESTIONS_PER_QUIZ),
      categoryService.getById(categoryId),
    ]).then(([qRes, cRes]) => {
      setQuestions(qRes.data);
      setCategory(cRes.data);
    }).catch(() => setError('Failed to load quiz. Please try again.'))
      .finally(() => setLoading(false));
  }, [categoryId]);

  // ── Timer ─────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (auto = false) => {
    if (submitting) return;
    setSubmitting(true);
    const timeTaken = QUIZ_DURATION - timeLeft;
    try {
      const res = await quizService.submit({
        categoryId: Number(categoryId),
        answers,
        timeTakenSeconds: timeTaken,
      });
      navigate('/result', { state: { result: res.data } });
    } catch {
      setError('Failed to submit quiz. Please try again.');
      setSubmitting(false);
    }
  }, [submitting, timeLeft, categoryId, answers, navigate]);

  useEffect(() => {
    if (loading) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); handleSubmit(true); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, handleSubmit]);

  const selectAnswer = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const timerClass = timeLeft <= 60 ? 'quiz-timer danger' : timeLeft <= 120 ? 'quiz-timer warning' : 'quiz-timer';

  if (loading) return (
    <div className="loading-container" style={{ minHeight: '60vh' }}>
      <div><div className="spinner" style={{ width: 50, height: 50 }} /><p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--color-text-muted)' }}>Loading quiz...</p></div>
    </div>
  );

  if (error) return <div className="container page-wrapper"><div className="alert alert-error">{error}</div></div>;

  if (questions.length === 0) return (
    <div className="container page-wrapper" style={{ textAlign: 'center' }}>
      <i className="fas fa-inbox" style={{ fontSize: '3rem', opacity: 0.3, display: 'block', marginBottom: '1rem' }} />
      <p style={{ color: 'var(--color-text-muted)' }}>No questions found for this category yet.</p>
    </div>
  );

  const q = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;
  const answered = Object.keys(answers).length;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="quiz-container">
          {/* ── Header ── */}
          <div className="quiz-header">
            <div className="quiz-progress">
              <div className="quiz-progress-text">
                Question {currentIdx + 1} of {questions.length} •{' '}
                <span style={{ color: 'var(--color-success)' }}>{answered} answered</span>
                {category && <span style={{ float: 'right', color: 'var(--color-primary-h)' }}>{category.name}</span>}
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className={timerClass}>
              <i className="fas fa-clock" style={{ fontSize: '1rem', marginRight: '4px' }} />
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* ── Question Card ── */}
          <div className="card question-card">
            <div className="question-num">Question {currentIdx + 1}</div>
            <div className="question-text">{q.questionText}</div>

            {q.difficultyLevel && (
              <div style={{ marginBottom: '1.25rem' }}>
                <span className={`badge badge-${q.difficultyLevel.toLowerCase()}`}>{q.difficultyLevel}</span>
              </div>
            )}

            <div className="options-grid">
              {[
                { key: 'A', text: q.optionA },
                { key: 'B', text: q.optionB },
                { key: 'C', text: q.optionC },
                { key: 'D', text: q.optionD },
              ].map(({ key, text }) => (
                <button
                  key={key}
                  id={`option-${key}`}
                  className={`option-btn ${answers[q.id] === key ? 'selected' : ''}`}
                  onClick={() => selectAnswer(q.id, key)}
                >
                  <span className="option-label">{key}</span>
                  {text}
                </button>
              ))}
            </div>
          </div>

          {/* ── Navigation ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
            <button
              className="btn btn-outline"
              onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
              disabled={currentIdx === 0}
            >
              <i className="fas fa-arrow-left" /> Previous
            </button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIdx(idx)}
                  style={{
                    width: 32, height: 32, border: 'none', borderRadius: '50%', cursor: 'pointer',
                    fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s',
                    background: idx === currentIdx ? 'var(--color-primary)' : answers[questions[idx]?.id] ? 'rgba(34,197,94,0.3)' : 'var(--color-surface-2)',
                    color: idx === currentIdx || answers[questions[idx]?.id] ? '#fff' : 'var(--color-text-muted)',
                  }}
                >{idx + 1}</button>
              ))}
            </div>

            {currentIdx < questions.length - 1 ? (
              <button className="btn btn-primary" onClick={() => setCurrentIdx(i => i + 1)}>
                Next <i className="fas fa-arrow-right" />
              </button>
            ) : (
              <button
                id="submit-quiz-btn"
                className="btn btn-success"
                onClick={() => handleSubmit(false)}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : <><i className="fas fa-check" /> Submit Quiz</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
