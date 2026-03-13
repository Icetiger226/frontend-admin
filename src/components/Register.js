import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    nom: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  
  const { register, error, setError } = useAuth();
  const navigate = useNavigate();

  // Règles de validation des mots de passe
  const passwordRules = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireDigit: true
  };

  // Validation des mots de passe
  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < passwordRules.minLength) {
      errors.push(`Au moins ${passwordRules.minLength} caractères`);
    }
    
    if (passwordRules.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Au moins 1 majuscule');
    }
    
    if (passwordRules.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Au moins 1 minuscule');
    }
    
    if (passwordRules.requireDigit && !/\d/.test(password)) {
      errors.push('Au moins 1 chiffre');
    }
    
    return errors;
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    // Validation email
    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    // Validation nom
    if (!formData.nom) {
      newErrors.nom = 'Nom requis';
    } else if (formData.nom.length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    }
    
    // Validation mot de passe
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors;
    }
    
    // Validation confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        nom: formData.nom
      });
      
      if (result.success) {
        setSuccess(true);
        setFormData({ email: '', nom: '', password: '', confirmPassword: '' });
        // Redirection automatique vers la connexion après 2 secondes
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer les erreurs quand l'utilisateur tape
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    
    const strengthMap = {
      0: { label: 'Très faible', color: '#e53e3e' },
      1: { label: 'Faible', color: '#dd6b20' },
      2: { label: 'Moyen', color: '#d69e2e' },
      3: { label: 'Bon', color: '#38a169' },
      4: { label: 'Très bon', color: '#2f855a' }
    };
    
    return { score, ...strengthMap[score] };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (success) {
    return (
      <div className="register-container">
        <div className="register-card">
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h2>Inscription réussie !</h2>
            <p>Votre compte a été créé avec succès.</p>
            <p className="status-info">
              <strong>Statut :</strong> En attente de validation
            </p>
            <p className="admin-notice">
              Un administrateur super_admin doit valider votre compte avant que vous puissiez vous connecter.
            </p>
            <button 
              onClick={() => setSuccess(false)}
              className="back-button"
            >
              Créer un autre compte
            </button>
            <a href="/login" className="login-link">
              Retour à la connexion
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="logo">
            <div className="logo-icon">BAL</div>
            <h1>Be A Leader</h1>
          </div>
          <p className="subtitle">Créer un compte administrateur</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="votre@email.com"
                required
                disabled={isLoading}
                className={errors.email ? 'error' : ''}
              />
              <span className="input-icon">📧</span>
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="nom">Nom complet</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                placeholder="Votre nom complet"
                required
                disabled={isLoading}
                className={errors.nom ? 'error' : ''}
              />
              <span className="input-icon">👤</span>
            </div>
            {errors.nom && <span className="field-error">{errors.nom}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Votre mot de passe"
                required
                disabled={isLoading}
                className={errors.password ? 'error' : ''}
              />
              <span className="input-icon">🔒</span>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            
            {/* Indicateur de force du mot de passe */}
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-fill" 
                    style={{ 
                      width: `${(passwordStrength.score / 4) * 100}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  ></div>
                </div>
                <span className="strength-label" style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
            
            {/* Règles de mot de passe */}
            <div className="password-rules">
              <p className="rules-title">Le mot de passe doit contenir :</p>
              <ul>
                <li className={formData.password.length >= 8 ? 'valid' : 'invalid'}>
                  Au moins 8 caractères
                </li>
                <li className={/[A-Z]/.test(formData.password) ? 'valid' : 'invalid'}>
                  Au moins 1 majuscule
                </li>
                <li className={/[a-z]/.test(formData.password) ? 'valid' : 'invalid'}>
                  Au moins 1 minuscule
                </li>
                <li className={/\d/.test(formData.password) ? 'valid' : 'invalid'}>
                  Au moins 1 chiffre
                </li>
              </ul>
            </div>
            
            {errors.password && (
              <div className="field-error">
                {Array.isArray(errors.password) ? errors.password.join(', ') : errors.password}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirmez votre mot de passe"
                required
                disabled={isLoading}
                className={errors.confirmPassword ? 'error' : ''}
              />
              <span className="input-icon">🔒</span>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={isLoading || !formData.email || !formData.nom || !formData.password || !formData.confirmPassword}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Création du compte...
              </>
            ) : (
              'Créer le compte'
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>Déjà un compte ?</p>
          <a href="/login" className="login-link">
            Se connecter
          </a>
        </div>

        <div className="security-info">
          <p>🔒 Compte créé avec statut "en attente"</p>
          <p>🛡️ Validation requise par un super_admin</p>
          <p>📧 Vous recevrez une notification après validation</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
