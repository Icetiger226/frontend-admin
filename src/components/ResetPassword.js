import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const useQuery = () => {
  return useMemo(() => new URLSearchParams(window.location.search), []);
};

const ResetPassword = () => {
  const query = useQuery();
  const token = query.get('token') || '';
  const email = query.get('email') || '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const validatePassword = (pwd) => {
    const rules = [];
    if (pwd.length < 8) rules.push('Au moins 8 caractères');
    if (!/[A-Z]/.test(pwd)) rules.push('Au moins 1 majuscule');
    if (!/[a-z]/.test(pwd)) rules.push('Au moins 1 minuscule');
    if (!/\d/.test(pwd)) rules.push('Au moins 1 chiffre');
    return rules;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (!token) {
      setError('Lien invalide ou expiré.');
      setLoading(false);
      return;
    }

    const pwErrors = validatePassword(password);
    if (pwErrors.length) {
      setError(pwErrors.join(', '));
      setLoading(false);
      return;
    }

    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Erreur lors de la réinitialisation');
      setMessage('Mot de passe réinitialisé. Vous pouvez vous connecter.');
      // Rediriger vers la page de login après 3 secondes
      setTimeout(() => navigate('/login', { replace: true }), 3000);
    } catch (e) {
      setError(e.message || 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-card">
      <div className="register-header">
        <div className="logo">
          <div className="logo-icon">BAL</div>
          <h1>Nouveau mot de passe</h1>
        </div>
        <p className="subtitle">Définissez un mot de passe sécurisé</p>
      </div>

      {message && <div className="success-message">{message}</div>}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="rp-password">Nouveau mot de passe</label>
          <div className="input-wrapper">
            <input
              id="rp-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre nouveau mot de passe"
              required
              disabled={loading}
            />
            <span className="input-icon">🔒</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="rp-confirm">Confirmer le mot de passe</label>
          <div className="input-wrapper">
            <input
              id="rp-confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirmez le mot de passe"
              required
              disabled={loading}
            />
            <span className="icon">🔒</span>
          </div>
        </div>

        <button type="submit" className="register-button" disabled={loading}>
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>

      <div className="register-footer">
        <a href="/login" className="link-button">Retour à la connexion</a>
      </div>
    </div>
  );
};

export default ResetPassword;
