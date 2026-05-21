import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem('user') || 'null')
  );

  const login = async (username, password) => {
    const res = await authService.login(username, password);
    const userData = res.data;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (data) => {
    return authService.register(data);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = () => user?.roles?.includes('ROLE_ADMIN');
  const isUser = () => !!user;

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, isUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
