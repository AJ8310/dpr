'use client';

import React, { useState } from 'react';
import { loginUser } from '@/lib/api';
import { UserSession } from '@/types/dpr';

interface LoginCardProps {
  onLoginSuccess: (session: UserSession) => void;
  onSwitchToRegister: () => void;
}

export default function LoginCard({ onLoginSuccess, onSwitchToRegister }: LoginCardProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginUser(email, password);
      if (data.access_token && data.user) {
        const session: UserSession = {
          ...data.user,
          token: data.access_token,
        };
        if (rememberMe) {
          localStorage.setItem('dpr_session', JSON.stringify(session));
        }
        sessionStorage.setItem('dpr_session', JSON.stringify(session));
        onLoginSuccess(session);
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        const msg = detail.map((d: any) => (d.msg ? `${d.loc?.[d.loc.length - 1] || ''}: ${d.msg}` : String(d))).join('. ');
        setError(msg || 'Invalid email or password.');
      } else if (typeof detail === 'string') {
        setError(detail);
      } else {
        setError('Invalid email or password. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '480px',
        width: '100%',
        margin: '0 auto',
        background: '#FFFFFF',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0, 111, 120, 0.1)',
        padding: '2.4rem 2.2rem',
        border: '1px solid #DDF4F3',
      }}
    >
      {/* Title & Subtitle */}
      <div style={{ marginBottom: '1.6rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#123B4A', marginBottom: '0.3rem' }}>
          Welcome Back
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#66818C' }}>
          Sign in to continue your DPR journey.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div
            style={{
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              marginBottom: '1.2rem',
            }}
          >
            {error}
          </div>
        )}

        {/* 1. Email Address */}
        <div style={{ marginBottom: '1.4rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#123B4A', marginBottom: '0.45rem' }}>
            Email Address
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <i
              className="far fa-envelope"
              style={{
                position: 'absolute',
                left: '1rem',
                color: '#66818C',
                fontSize: '0.95rem',
              }}
            />
            <input
              type="email"
              className="input-modern"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              style={{
                paddingLeft: '2.7rem',
                borderRadius: '12px',
                border: '1px solid #DDF4F3',
                background: '#FFFFFF',
              }}
            />
          </div>
        </div>

        {/* 2. Password */}
        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#123B4A', marginBottom: '0.45rem' }}>
            Password
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <i
              className="fas fa-lock"
              style={{
                position: 'absolute',
                left: '1rem',
                color: '#66818C',
                fontSize: '0.95rem',
              }}
            />
            <input
              type={showPassword ? 'text' : 'password'}
              className="input-modern"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              style={{
                paddingLeft: '2.7rem',
                paddingRight: '2.7rem',
                borderRadius: '12px',
                border: '1px solid #DDF4F3',
                background: '#FFFFFF',
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '1rem',
                background: 'none',
                border: 'none',
                color: '#66818C',
                cursor: 'pointer',
                padding: 0,
                fontSize: '0.9rem',
              }}
            >
              <i className={showPassword ? 'far fa-eye-slash' : 'far fa-eye'} />
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem', fontSize: '0.85rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#123B4A', cursor: 'pointer', userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: '#008C95', cursor: 'pointer' }}
            />
            Remember me
          </label>
          <a
            href="#forgot"
            onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your registered email.'); }}
            style={{ color: '#008C95', fontWeight: 600, textDecoration: 'none' }}
          >
            Forgot Password?
          </a>
        </div>

        {/* Primary Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #008C95 0%, #006F78 100%)',
            color: '#FFFFFF',
            border: 'none',
            padding: '0.9rem',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(0, 140, 149, 0.25)',
            transition: 'all 0.2s ease',
          }}
        >
          {loading ? 'Signing In...' : 'Sign In →'}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '1.2rem 0', gap: '0.75rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.5px' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={() => alert('Google Sign-In integration ready. Use your email or contact system admin.')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            background: '#FFFFFF',
            color: '#1E293B',
            border: '1px solid #CBD5E1',
            padding: '0.75rem',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <i className="fab fa-google" style={{ color: '#EA4335', fontSize: '1rem' }} />
          Continue with Google
        </button>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '1.4rem', fontSize: '0.88rem', color: '#66818C' }}>
          New to VKF DPR?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            style={{ background: 'none', border: 'none', color: '#008C95', fontWeight: 700, cursor: 'pointer', padding: 0 }}
          >
            Get Started →
          </button>
        </div>
      </form>
    </div>
  );
}
