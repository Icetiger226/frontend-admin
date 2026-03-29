import React, { createContext, useContext, useMemo, useState } from 'react';
import { API_URL } from '../apiConfig';

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
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Use-Cookie-Auth': '1',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data?.message || `Erreur ${res.status}`;
        setError(message);
        return { success: false, message };
      }
      const { user } = data || {};
      if (user?.role) sessionStorage.setItem('authRole', user.role);
      if (user?.email) sessionStorage.setItem('authEmail', user.email);
      return { success: true, data };
    } catch (e) {
      setError(e.message || 'Erreur réseau');
      return { success: false, message: e.message };
    }
  };

  const logout = async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {});
    sessionStorage.removeItem('authRole');
    sessionStorage.removeItem('authEmail');
  };

  const value = useMemo(() => ({ register, login, logout, error, setError }), [error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
