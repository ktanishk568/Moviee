import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { IconFilm, IconSearch } from './icons';

function LoginPage() {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    else if (name.trim().length < 2) e.name = 'At least 2 characters';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Enter a valid email';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    login(name, email);
  };

  return (
    <div className="login-page">
      {/* Background orbs */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <IconFilm size={22} />
          </div>
          <span className="login-logo-text">CineSearch</span>
        </div>

        <div className="login-header">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to browse movies and leave reviews</p>
        </div>

        <form id="login-form" className="login-form" onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div className="field-group">
            <label htmlFor="login-name" className="field-label">Display Name</label>
            <input
              id="login-name"
              className={`field-input ${errors.name ? 'field-error' : ''}`}
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
              placeholder="e.g. Arpit Himanshu"
              autoComplete="name"
              autoFocus
            />
            {errors.name && <p className="field-error-msg">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="field-group">
            <label htmlFor="login-email" className="field-label">Email Address</label>
            <input
              id="login-email"
              className={`field-input ${errors.email ? 'field-error' : ''}`}
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && <p className="field-error-msg">{errors.email}</p>}
          </div>

          <button
            id="login-submit-btn"
            className="login-btn"
            type="submit"
            disabled={submitting}
          >
            {submitting ? <span className="btn-spinner" /> : 'Continue to CineSearch'}
          </button>
        </form>

        <p className="login-note">
          No password needed. Your data is saved locally in your browser.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
