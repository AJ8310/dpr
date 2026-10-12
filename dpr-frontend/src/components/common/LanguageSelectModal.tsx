'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/i18n/translations';

export default function LanguageSelectModal() {
  const { language, setLanguage, t, isLanguageModalOpen, setIsLanguageModalOpen } = useLanguage();

  if (!isLanguageModalOpen) return null;

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsLanguageModalOpen(false);
  };

  const languageOptions = [
    {
      code: 'kn' as const,
      nativeName: 'ಕನ್ನಡ',
      englishName: 'Kannada',
      badge: 'ಕರ್ನಾಟಕ ಗ್ರಾಮೀಣ MSME',
      desc: 'ಕರ್ನಾಟಕದ ರೈತರು, ಸಣ್ಣ ಉದ್ಯಮಿಗಳು ಹಾಗೂ ಬ್ಯಾಂಕ್ ಸಾಲ ಮತ್ತು PMEGP/PMFME ಸಬ್ಸಿಡಿಗಾಗಿ.',
      active: language === 'kn',
      color: '#FF7A00',
      bgLight: '#FFF7ED',
      borderColor: '#FDBA74',
    },
    {
      code: 'hi' as const,
      nativeName: 'हिंदी',
      englishName: 'Hindi',
      badge: 'अखिल भारतीय एमएसएमई',
      desc: 'ग्रामीण एवं सूक्ष्म उद्योग, पीएमईजीपी सब्सिडी तथा राष्ट्रीयकृत बैंकों हेतु संस्थागत डीपीआर.',
      active: language === 'hi',
      color: '#008C95',
      bgLight: '#F0FDFA',
      borderColor: '#99F6E4',
    },
    {
      code: 'en' as const,
      nativeName: 'English',
      englishName: 'English',
      badge: 'Institutional Banking Format',
      desc: 'Standard commercial credit appraisal format for State Bank of India, Canara Bank, and NBFCs.',
      active: language === 'en',
      color: '#0071E3',
      bgLight: '#EFF6FF',
      borderColor: '#BFDBFE',
    },
  ];

  return (
    <div
      onClick={() => setIsLanguageModalOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '1.25rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          borderRadius: '28px',
          width: 'min(720px, 96vw)',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '2.4rem 2.2rem',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.35)',
          position: 'relative',
          border: '1.5px solid rgba(0, 0, 0, 0.08)',
          textAlign: 'center',
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsLanguageModalOpen(false)}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#F1F5F9',
            border: '1px solid #CBD5E1',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          ✕
        </button>

        {/* Globe Icon & Header */}
        <div style={{ marginBottom: '1.8rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #0071E3 0%, #005BB5 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              margin: '0 auto 16px',
              boxShadow: '0 8px 24px rgba(0, 113, 227, 0.3)',
            }}
          >
            🌐
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1D1D1F', margin: '0 0 8px 0', lineHeight: 1.2 }}>
            ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ / Select Language
          </h2>
          <p style={{ fontSize: '0.96rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
            ಆಯ್ಕೆಮಾಡಿದ ಭಾಷೆಯಲ್ಲಿ ಅಪ್ಲಿಕೇಶನ್ ಹಾಗೂ ಸಂಪೂರ್ಣ DPR ವರದಿಯನ್ನು ಪಡೆಯಿರಿ.
            <br />
            <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Choose your preferred language for both application navigation and generated DPR report content.</span>
          </p>
        </div>

        {/* 3 Visual Language Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {languageOptions.map((opt) => (
            <div
              key={opt.code}
              onClick={() => handleSelectLanguage(opt.code)}
              style={{
                background: opt.active ? opt.bgLight : '#FFFFFF',
                border: opt.active ? `2.5px solid ${opt.color}` : `1.5px solid #E2E8F0`,
                borderRadius: '20px',
                padding: '24px 18px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: opt.active ? `0 10px 25px ${opt.color}25` : '0 2px 8px rgba(0,0,0,0.02)',
                position: 'relative',
              }}
            >
              {opt.active && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: opt.color,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                  }}
                >
                  ✓
                </div>
              )}

              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: opt.color,
                  background: opt.bgLight,
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  border: `1px solid ${opt.borderColor}`,
                  display: 'inline-block',
                  marginBottom: '10px',
                }}
              >
                {opt.badge}
              </span>

              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1D1D1F', marginBottom: '2px' }}>
                {opt.nativeName}
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B', marginBottom: '10px' }}>
                {opt.englishName}
              </div>

              <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: 1.45, margin: 0 }}>
                {opt.desc}
              </p>

              <button
                type="button"
                style={{
                  marginTop: '16px',
                  width: '100%',
                  background: opt.active ? opt.color : '#F1F5F9',
                  color: opt.active ? '#FFFFFF' : '#334155',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {opt.active ? 'ಆಯ್ಕೆಯಾಗಿದೆ (Selected)' : 'ಆಯ್ಕೆಮಾಡಿ (Select)'}
              </button>
            </div>
          ))}
        </div>

        {/* Helper Note */}
        <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
          💡 ನೀವು ನಂತರ ಹೆಡರ್‌ನಲ್ಲಿರುವ 🌐 ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಬಹುದು.
          <br />
          (You can switch your language preference at any time from the top header.)
        </div>
      </div>
    </div>
  );
}
