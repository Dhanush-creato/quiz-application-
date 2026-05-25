import axios from 'axios';

// Base URL – reads from .env / .env.production automatically
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user?.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authService = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  register: (data) =>
    api.post('/auth/register', data),
};

// ── Categories ────────────────────────────────────────────────────────────────
export const categoryService = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/admin/categories', data),
  update: (id, data) => api.put(`/admin/categories/${id}`, data),
  delete: (id) => api.delete(`/admin/categories/${id}`),
};

// ── Questions ─────────────────────────────────────────────────────────────────
export const questionService = {
  getByCategory: (categoryId) => api.get(`/questions/category/${categoryId}`),
  getQuizQuestions: (categoryId, count = 10) =>
    api.get(`/questions/quiz/${categoryId}?count=${count}`),
  getAll: () => api.get('/admin/questions'),
  create: (data) => api.post('/admin/questions', data),
  update: (id, data) => api.put(`/admin/questions/${id}`, data),
  delete: (id) => api.delete(`/admin/questions/${id}`),
};

// ── Quiz ──────────────────────────────────────────────────────────────────────
export const quizService = {
  submit: (data) => api.post('/quiz/submit', data),
  getMyResults: () => api.get('/quiz/results'),
  getAllResults: () => api.get('/quiz/admin/results'),
};

export default api;
