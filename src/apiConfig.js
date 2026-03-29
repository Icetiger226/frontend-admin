/**
 * API base URL + fetch avec cookies httpOnly (access/refresh).
 * Pas de JWT dans localStorage : le navigateur envoie les cookies automatiquement.
 */
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * GET/POST/etc. avec credentials + tentative de refresh si 401.
 */
export async function credFetch(url, options = {}) {
  const opts = {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body && !options.headers?.['Content-Type']
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...(options.headers || {}),
    },
  };

  let res = await fetch(url, opts);

  const isAuthUrl =
    url.includes('/auth/refresh') ||
    url.includes('/auth/login') ||
    url.includes('/auth/logout') ||
    url.includes('/auth/register');

  if (res.status === 401 && !isAuthUrl) {
    const r2 = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (r2.ok) {
      res = await fetch(url, opts);
    }
  }

  return res;
}
