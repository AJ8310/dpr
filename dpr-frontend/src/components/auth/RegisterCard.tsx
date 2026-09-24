'use client';

import React, { useState } from 'react';
import { registerUser } from '@/lib/api';
import { UserSession } from '@/types/dpr';

interface RegisterCardProps {
  onRegisterSuccess: (session: UserSession) => void;
  onSwitchToLogin: () => void;
}

export default function RegisterCard({ onRegisterSuccess, onSwitchToLogin }: RegisterCardProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const data = await registerUser({ name, email, password, company, phone });
      if (data.access_token && data.user) {
        setSuccessMsg('Profile successfully saved to database.');
        const session: UserSession = {
          ...data.user,
          token: data.access_token,
        };
        sessionStorage.setItem('dpr_session', JSON.stringify(session));
        setTimeout(() => {
          onRegisterSuccess(session);
        }, 800);
      }
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        const msg = detail.map((d: any) => (d.msg ? `${d.loc?.[d.loc.length - 1] || ''}: ${d.msg}` : String(d))).join('. ');
        setError(msg || 'Registration failed. Please check inputs.');
      } else if (typeof detail === 'string') {
        setError(detail);
      } else {
        setError('Registration failed. Please check your inputs.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '500px',
        width: '100%',
        margin: '0 auto',
        background: '#FFFFFF',
        borderRadius: '22px',
        boxShadow: '0 20px 50px rgba(0, 111, 120, 0.08)',
        padding: '2.5rem 2.2rem',
        border: '1px solid #DDF4F3',
      }}
    >
      {/* Title & Subtitle */}
      <div style={{ marginBottom: '1.6rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#123B4A', marginBottom: '0.3rem' }}>
          Create Your Account
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#66818C' }}>
          Start building your Detailed Project Report
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {successMsg && (
          <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', color: '#065F46', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1.2rem', fontWeight: 600 }}>
            {successMsg}
          </div>
        )}
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#123B4A', marginBottom: '0.45rem' }}>
            Full Name
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <i className="far fa-user" style={{ position: 'absolute', left: '1rem', color: '#66818C', fontSize: '0.95rem' }} />
            <input
              type="text"
              className="input-modern"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Your name"
              style={{ paddingLeft: '2.7rem', borderRadius: '12px', border: '1px solid #DDF4F3' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#123B4A', marginBottom: '0.45rem' }}>
            Email Address
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <i className="far fa-envelope" style={{ position: 'absolute', left: '1rem', color: '#66818C', fontSize: '0.95rem' }} />
            <input
              type="email"
              className="input-modern"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Your email address"
              style={{ paddingLeft: '2.7rem', borderRadius: '12px', border: '1px solid #DDF4F3' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#123B4A', marginBottom: '0.45rem' }}>
            Password
          </label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <i className="fas fa-lock" style={{ position: 'absolute', left: '1rem', color: '#66818C', fontSize: '0.95rem' }} />
            <input
              type="password"
              className="input-modern"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Create a strong password"
              style={{ paddingLeft: '2.7rem', borderRadius: '12px', border: '1px solid #DDF4F3' }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.8rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#123B4A', marginBottom: '0.4rem' }}>
              Organization
            </label>
            <input
              type="text"
              className="input-modern"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Your organization"
              style={{ borderRadius: '12px', border: '1px solid #DDF4F3' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#123B4A', marginBottom: '0.4rem' }}>
              Phone Number
            </label>
            <input
              type="text"
              className="input-modern"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
              style={{ borderRadius: '12px', border: '1px solid #DDF4F3' }}
            />
          </div>
        </div>

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
          {loading ? 'Creating Account...' : 'Register Account'}
        </button>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#66818C' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{ background: 'none', border: 'none', color: '#008C95', fontWeight: 700, cursor: 'pointer', padding: 0 }}
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}
