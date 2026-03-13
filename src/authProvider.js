const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authProvider = {
  login: async ({ username, password }) => {
    // React-Admin default passes { username, password }
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || 'Identifiants invalides');
    }
    const { token, user } = data;
    if (token) window.localStorage.setItem('authToken', token);
    if (user?.role) window.localStorage.setItem('authRole', user.role);
    if (user?.email) window.localStorage.setItem('authEmail', user.email);
    return Promise.resolve();
  },
  logout: () => {
    window.localStorage.removeItem('authToken');
    window.localStorage.removeItem('authRole');
    window.localStorage.removeItem('authEmail');
    // Rediriger vers la page de login après déconnexion
    window.location.href = '/login';
    return Promise.resolve();
  },
  checkAuth: () => {
    const token = window.localStorage.getItem('authToken');
    return token ? Promise.resolve() : Promise.reject();
  },
  checkError: (error) => {
    const status = error.status || error?.response?.status;
    if (status === 401 || status === 403) {
      window.localStorage.removeItem('authToken');
      window.localStorage.removeItem('authRole');
      window.localStorage.removeItem('authEmail');
      // Rediriger vers la page de login en cas d'erreur d'authentification
      window.location.href = '/login';
      return Promise.reject();
    }
    return Promise.resolve();
  },
  getPermissions: () => {
    const role = window.localStorage.getItem('authRole') || 'admin_simple';
    return Promise.resolve(role);
  },
};

export default authProvider;
