import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { questionService, categoryService } from '../../services/api';

const EMPTY = { questionText: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: 'A', difficultyLevel: 'EASY', category: { id: '' } };

export default function AdminQuestions() {
  const [questions, setQuestions]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(EMPTY);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [filterCat, setFilterCat]   = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([questionService.getAll(), categoryService.getAll()])
      .then(([q, c]) => { setQuestions(q.data); setCategories(c.data); })
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = filterCat ? questions.filter(q => q.category?.id === Number(filterCat)) : questions;

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true); };
  const openEdit = (q) => {
    setEditing(q);
    setForm({ questionText: q.questionText, optionA: q.optionA, optionB: q.optionB, optionC: q.optionC, optionD: q.optionD, correctAnswer: q.correctAnswer, difficultyLevel: q.difficultyLevel, category: { id: q.category?.id || '' } });
    setError(''); setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      if (editing) { await questionService.update(editing.id, form); setSuccess('Question updated!'); }
      else { await questionService.create(form); setSuccess('Question created!'); }
      setModal(false); load();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data || 'Failed to save question.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    await questionService.delete(id); load();
  };

  const fc = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const fcCat = (e) => setForm({ ...form, category: { id: e.target.value } });

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h1 className="admin-page-title">Questions</h1>
            <p className="admin-page-sub">Manage quiz questions ({questions.length} total)</p>
          </div>
          <button id="add-question-btn" className="btn btn-primary" onClick={openAdd}>
            <i className="fas fa-plus" /> Add Question
          </button>
        </div>

        {success && <div className="alert alert-success">{success}</div>}

        {/* Filter */}
        <div style={{ marginBottom: '1rem' }}>
          <select className="form-control" style={{ maxWidth: 240 }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {loading ? <div className="loading-container"><div className="spinner" /></div> : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr><th>#</th><th>Question</th><th>Category</th><th>Answer</th><th>Difficulty</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map((q, i) => (
                    <tr key={q.id}>
                      <td style={{ color: 'var(--color-text-muted)' }}>{i + 1}</td>
                      <td style={{ maxWidth: 320, fontWeight: 500 }}>{q.questionText}</td>
                      <td><span style={{ color: 'var(--color-primary-h)' }}>{q.category?.name}</span></td>
                      <td><span style={{ fontWeight: 800, color: 'var(--color-success)' }}>{q.correctAnswer}</span></td>
                      <td><span className={`badge badge-${q.difficultyLevel?.toLowerCase()}`}>{q.difficultyLevel}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-outline btn-sm" onClick={() => openEdit(q)}><i className="fas fa-edit" /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(q.id)}><i className="fas fa-trash" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {modal && (
          <div className="modal-overlay" onClick={() => setModal(false)}>
            <div className="card modal-box" style={{ maxWidth: 620 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editing ? 'Edit Question' : 'Add Question'}</h3>
                <button className="modal-close" onClick={() => setModal(false)}><i className="fas fa-times" /></button>
              </div>
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label className="form-label">Question *</label>
                  <textarea id="q-text" className="form-control" rows={3} value={form.questionText} onChange={fc('questionText')} required style={{ resize: 'vertical' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {['A','B','C','D'].map(opt => (
                    <div key={opt} className="form-group">
                      <label className="form-label">Option {opt} *</label>
                      <input id={`q-opt-${opt}`} className="form-control" value={form[`option${opt}`]} onChange={fc(`option${opt}`)} required />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Correct Answer *</label>
                    <select id="q-correct" className="form-control" value={form.correctAnswer} onChange={fc('correctAnswer')}>
                      {['A','B','C','D'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Difficulty</label>
                    <select id="q-difficulty" className="form-control" value={form.difficultyLevel} onChange={fc('difficultyLevel')}>
                      <option>EASY</option><option>MEDIUM</option><option>HARD</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select id="q-category" className="form-control" value={form.category.id} onChange={fcCat} required>
                      <option value="">Select...</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
                  <button id="save-question-btn" type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Question'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
