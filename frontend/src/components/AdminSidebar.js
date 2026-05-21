import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const adminNav = [
  { path: '/admin', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
  { path: '/admin/questions', icon: 'fas fa-question-circle', label: 'Questions' },
  { path: '/admin/categories', icon: 'fas fa-layer-group', label: 'Categories' },
  { path: '/admin/results', icon: 'fas fa-chart-bar', label: 'User Results' },
];

export default function AdminSidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-title">Admin Panel</div>
      {adminNav.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={`admin-nav-item ${pathname === item.path ? 'active' : ''}`}
        >
          <i className={item.icon} style={{ width: 18, textAlign: 'center' }} />
          {item.label}
        </Link>
      ))}
    </aside>
  );
}
