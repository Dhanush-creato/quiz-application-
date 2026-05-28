import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CategoriesPage from './pages/CategoriesPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminQuestions from './pages/admin/AdminQuestions';
import AdminCategories from './pages/admin/AdminCategories';
import AdminResults from './pages/admin/AdminResults';

// Protected Route wrapper – saves current path so login redirects back here
const PrivateRoute = ({ children }) => {
  const { isUser } = useAuth();
  const location = useLocation();
  return isUser() ? children : <Navigate to="/login" state={{ from: location.pathname }} replace />;
};


const AdminRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  return isAdmin() ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/"          element={<HomePage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/register"  element={<RegisterPage />} />
        <Route path="/categories" element={<CategoriesPage />} />

        {/* Protected – User */}
        <Route path="/quiz/:categoryId" element={<PrivateRoute><QuizPage /></PrivateRoute>} />
        <Route path="/result"           element={<PrivateRoute><ResultPage /></PrivateRoute>} />
        <Route path="/dashboard"        element={<PrivateRoute><DashboardPage /></PrivateRoute>} />

        {/* Protected – Admin */}
        <Route path="/admin"            element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/questions"  element={<AdminRoute><AdminQuestions /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
        <Route path="/admin/results"    element={<AdminRoute><AdminResults /></AdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
