import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Register from './Register';
import './Register.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await login(form);
      if (result.success) {
        // Rediriger vers l'interface admin après connexion réussie
        navigate('/', { replace: true });
      } else {
        setError(result.message || 'Erreur de connexion');
      }
    } catch (e) {
      setError(e?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  if (showRegister) {
    return (
      <div className="auth-wrapper">
        <Register />
        <div className="switch-auth">
          <button className="link-button" onClick={() => setShowRegister(false)}>
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo">
            <img
              src="/Logo.jpg"
              alt="Logo Be A Leader"
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                objectFit: 'cover',
                boxShadow: '0 10px 24px rgba(15, 23, 42, 0.10)',
              }}
            />
            <h1>Be A Leader</h1>
          </div>
          <p className="subtitle">Espace d'administration</p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="votre@email.com"
                required
                disabled={loading}
              />
              <span className="input-icon">📧</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-wrapper">
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                placeholder="Votre mot de passe"
                required
                disabled={loading}
              />
              <span className="input-icon">🔒</span>
            </div>
          </div>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="register-footer" style={{ marginTop: 8 }}>
          <a href="/forgot-password" className="link-button">Mot de passe oublié ?</a>
        </div>

        <div className="register-footer">
          <p>Pas de compte ?</p>
          <button className="link-button" onClick={() => setShowRegister(true)}>
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
