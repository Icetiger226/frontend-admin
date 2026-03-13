import React, { createContext, useContext, useMemo, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const register = async ({ email, password, nom }) => {
    try {
      setError(null);
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nom }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data?.message || `Erreur ${res.status}`;
        setError(message);
        return { success: false, message };
      }
      return { success: true, data };
    } catch (e) {
      setError(e.message || 'Erreur réseau');
      return { success: false, message: e.message };
    }
  };

  const login = async ({ email, password }) => {
    try {
      setError(null);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data?.message || `Erreur ${res.status}`;
        setError(message);
        return { success: false, message };
      }
      const { token, user } = data || {};
      if (token) window.localStorage.setItem('authToken', token);
      if (user?.role) window.localStorage.setItem('authRole', user.role);
      if (user?.email) window.localStorage.setItem('authEmail', user.email);
      return { success: true, data };
    } catch (e) {
      setError(e.message || 'Erreur réseau');
      return { success: false, message: e.message };
    }
  };

  const logout = () => {
    window.localStorage.removeItem('authToken');
    window.localStorage.removeItem('authRole');
    window.localStorage.removeItem('authEmail');
  };

  const value = useMemo(() => ({ register, login, logout, error, setError }), [error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
