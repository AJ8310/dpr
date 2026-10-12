'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/i18n/translations';

export default function LanguageDropdown({ variant = 'header' }: { variant?: 'header' | 'dashboard' }) {
  const { language, setLanguage, setIsLanguageModalOpen } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'kn' as const, label: 'ಕನ್ನಡ', full: 'ಕನ್ನಡ (Kannada)' },
    { code: 'hi' as const, label: 'हिंदी', full: 'हिंदी (Hindi)' },
    { code: 'en' as const, label: 'EN', full: 'English' },
  ];

  const currentLang = languages.find((l) => l.code === language) || languages[2];

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: variant === 'dashboard' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.9)',
          border: '1.5px solid rgba(0, 113, 227, 0.3)',
          borderRadius: '9999px',
          padding: '5px 12px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.84rem',
          fontWeight: 700,
          color: '#0071E3',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0, 113, 227, 0.08)',
          transition: 'all 0.2s ease',
        }}
      >
        <span style={{ fontSize: '0.95rem' }}>🌐</span>
        <span>{currentLang.label}</span>
        <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>▼</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            zIndex: 1000,
            background: '#FFFFFF',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '16px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
            minWidth: '170px',
            padding: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          {languages.map((l) => {
            const isSelected = l.code === language;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLanguage(l.code);
                  setIsOpen(false);
                }}
                style={{
                  background: isSelected ? 'rgba(0, 113, 227, 0.08)' : 'transparent',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: isSelected ? '#0071E3' : '#1D1D1F',
                  fontWeight: isSelected ? 800 : 500,
                  fontSize: '0.86rem',
                  transition: 'background 0.15s ease',
                }}
              >
                <span>{l.full}</span>
                {isSelected && <span style={{ color: '#0071E3', fontWeight: 800 }}>✓</span>}
              </button>
            );
          })}

          <div style={{ height: '1px', background: 'rgba(0, 0, 0, 0.06)', margin: '4px 0' }} />

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setIsLanguageModalOpen(true);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: '10px',
              padding: '6px 12px',
              fontSize: '0.76rem',
              color: '#64748B',
              cursor: 'pointer',
              textAlign: 'center',
              fontWeight: 600,
            }}
          >
            ವಿವರವಾದ ಆಯ್ಕೆ / More Options...
          </button>
        </div>
      )}
    </div>
  );
}
