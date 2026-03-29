import { API_URL, credFetch } from './apiConfig';

const SESSION_ROLE = 'authRole';
const SESSION_EMAIL = 'authEmail';

const authProvider = {
  login: async ({ username, password }) => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authRole');
      localStorage.removeItem('authEmail');
    } catch (_) {
      /* ignore */
    }
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Use-Cookie-Auth': '1',
      },
      body: JSON.stringify({ email: username, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || 'Identifiants invalides');
    }
    if (data.user?.role) sessionStorage.setItem(SESSION_ROLE, data.user.role);
    if (data.user?.email) sessionStorage.setItem(SESSION_EMAIL, data.user.email);
    return Promise.resolve();
  },
  logout: async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {});
    sessionStorage.removeItem(SESSION_ROLE);
    sessionStorage.removeItem(SESSION_EMAIL);
    window.location.href = '/login';
    return Promise.resolve();
  },
  checkAuth: async () => {
    let res = await fetch(`${API_URL}/auth/verify`, { credentials: 'include' });
    if (res.status === 401) {
      const r2 = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (r2.ok) {
        res = await fetch(`${API_URL}/auth/verify`, { credentials: 'include' });
      }
    }
    if (res.ok) {
      try {
        const data = await res.json();
        if (data.user?.role) sessionStorage.setItem(SESSION_ROLE, data.user.role);
        if (data.user?.email) sessionStorage.setItem(SESSION_EMAIL, data.user.email);
      } catch (_) {
        /* ignore */
      }
      return Promise.resolve();
    }
    return Promise.reject();
  },
  checkError: (error) => {
    const msg = error?.message || '';
    const httpMatch = typeof msg === 'string' ? msg.match(/HTTP (\d{3}):/) : null;
    const status =
      error.status ||
      error?.response?.status ||
      (httpMatch ? parseInt(httpMatch[1], 10) : undefined);
    if (status === 401 || status === 403) {
      sessionStorage.removeItem(SESSION_ROLE);
      sessionStorage.removeItem(SESSION_EMAIL);
      window.location.href = '/login';
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getPermissions: () => {
    const role = sessionStorage.getItem(SESSION_ROLE) || 'admin_simple';
    return Promise.resolve(role);
  },
};

export default authProvider;
