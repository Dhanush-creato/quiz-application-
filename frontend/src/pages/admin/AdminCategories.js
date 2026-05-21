import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { categoryService } from '../../services/api';

const EMPTY = { name: '', description: '', iconClass: '' };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = () => {
    setLoading(true);
    categoryService.getAll().then(r => setCategories(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setModal(true); };
  const openEdit = (cat) => { setEditing(cat); setForm({ name: cat.name, description: cat.description || '', iconClass: cat.iconClass || '' }); setError(''); setModal(true); };
  const closeModal = () => setModal(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await categoryService.update(editing.id, form);
        setSuccess('Category updated!');
      } else {
        await categoryService.create(form);
        setSuccess('Category created!');
      }
      closeModal();
      load();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data || 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await categoryService.delete(id);
    load();
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h1 className="admin-page-title">Categories</h1>
            <p className="admin-page-sub">Manage quiz categories</p>
          </div>
          <button id="add-category-btn" className="btn btn-primary" onClick={openAdd}>
            <i className="fas fa-plus" /> Add Category
          </button>
        </div>

        {success && <div className="alert alert-success">{success}</div>}

        {loading ? <div className="loading-container"><div className="spinner" /></div> : (
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="table">
              <thead><tr><th>ID</th><th>Name</th><th>Description</th><th>Icon Class</th><th>Actions</th></tr></thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id}>
                    <td style={{ color: 'var(--color-text-muted)' }}>#{cat.id}</td>
                    <td style={{ fontWeight: 600 }}><i className={cat.iconClass} style={{ marginRight: 8 }} />{cat.name}</td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{cat.description || '–'}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-accent)' }}>{cat.iconClass || '–'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(cat)}><i className="fas fa-edit" /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat.id)}><i className="fas fa-trash" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {modal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="card modal-box" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editing ? 'Edit Category' : 'Add Category'}</h3>
                <button className="modal-close" onClick={closeModal}><i className="fas fa-times" /></button>
              </div>
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleSave}>
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input id="cat-name" className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input id="cat-desc" className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Font Awesome Icon Class (e.g., fab fa-java)</label>
                  <input id="cat-icon" className="form-control" value={form.iconClass} onChange={e => setForm({ ...form, iconClass: e.target.value })} placeholder="fab fa-java" />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
                  <button id="save-category-btn" type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
