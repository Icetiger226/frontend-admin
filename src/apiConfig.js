/**
 * API base URL + fetch avec cookies httpOnly (access/refresh).
 * Pas de JWT dans localStorage : le navigateur envoie les cookies automatiquement.

 *
 * Production Netlify : REACT_APP_API_URL=/api (proxy same-origin → Render, voir netlify.toml).
 * Local : http://localhost:5000/api
 */
const raw = process.env.REACT_APP_API_URL;
export const API_URL = (raw && raw.replace(/\/$/, '')) || 'http://localhost:5000/api';

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

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

  const method = String(opts.method || 'GET').toUpperCase();
  const isWriteMethod = !['GET', 'HEAD', 'OPTIONS'].includes(method);
  if (isWriteMethod && !opts.headers['X-CSRF-Token']) {
    const csrf = getCookie('csrf_token');
    if (csrf) {
      opts.headers['X-CSRF-Token'] = csrf;
    }
  }

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
