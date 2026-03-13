import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || 'Erreur lors de l\'envoi');
      setMessage('Si cet email existe, un lien de réinitialisation a été envoyé.');
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
          <h1>Réinitialisation</h1>
        </div>
        <p className="subtitle">Demander un lien de réinitialisation</p>
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
          <label htmlFor="fp-email">Email</label>
          <div className="input-wrapper">
            <input
              id="fp-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              disabled={loading}
            />
            <span className="input-icon">📧</span>
          </div>
        </div>
        <button type="submit" className="register-button" disabled={loading || !email}>
          {loading ? 'Envoi...' : 'Envoyer le lien'}
        </button>
      </form>

      <div className="register-footer">
        <a href="/login" className="link-button">Retour à la connexion</a>
      </div>
    </div>
  );
};

export default ForgotPassword;
