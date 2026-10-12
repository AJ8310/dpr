'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface FixedSidebarProps {
  userName: string;
  activeStepIndex: number;
  onSelectStep: (index: number) => void;
  onChangeService: () => void;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const SECTION_NAV_ITEMS_I18N = {
  en: [
    '01. Basic Information',
    '02. Members & Management',
    '03. Product Specifications',
    '04. Plant & Machinery',
    '05. Market Strategy',
    '06. Manpower Plan',
    '07. Cost & Financing',
    '08. Financial Projections',
    '09. Infrastructure',
    '10. SWOT Analysis',
    '11. Social & Eco Impact',
    '12. Credit Standing',
    '13. Upload Site Images',
    '14. Declaration & Report',
  ],
  kn: [
    '01. ಮೂಲ ಮಾಹಿತಿ',
    '02. ಸದಸ್ಯರು ಮತ್ತು ನಿರ್ವಹಣೆ',
    '03. ಉತ್ಪನ್ನದ ವಿವರಗಳು',
    '04. ಯಂತ್ರೋಪಕರಣಗಳು',
    '05. ಮಾರುಕಟ್ಟೆ ತಂತ್ರ',
    '06. ಸಿಬ್ಬಂದಿ ಯೋಜನೆ',
    '07. ವೆಚ್ಚ ಮತ್ತು ಹಣಕಾಸು',
    '08. ಹಣಕಾಸಿನ ಮುನ್ಸೂಚನೆ',
    '09. ಮೂಲಸೌಕರ್ಯ',
    '10. SWOT ವಿಶ್ಲೇಷಣೆ',
    '11. ಸಾಮಾಜಿಕ & ಪರಿಸರ ಪ್ರಭಾವ',
    '12. ಕ್ರೆಡಿಟ್ ವಿವರ',
    '13. ಚಿತ್ರಗಳ ಅಪ್‌ಲೋಡ್',
    '14. ಘೋಷಣೆ & ವರದಿ ಸಲ್ಲಿಕೆ',
  ],
  hi: [
    '01. बुनियादी जानकारी',
    '02. सदस्य एवं प्रबंधन',
    '03. उत्पाद विनिर्देश',
    '04. संयंत्र और मशीनरी',
    '05. बाजार रणनीति',
    '06. जनशक्ति योजना',
    '07. लागत एवं वित्तपोषण',
    '08. वित्तीय अनुमान',
    '09. बुनियादी ढांचा',
    '10. स्वाट विश्लेषण',
    '11. सामाजिक एवं पर्यावरणीय प्रभाव',
    '12. साख स्थिति',
    '13. साइट चित्र अपलोड',
    '14. घोषणा एवं रिपोर्ट',
  ],
};

const SECTION_ICONS = [
  'fa-building',
  'fa-users',
  'fa-boxes',
  'fa-microchip',
  'fa-chart-line',
  'fa-user-group',
  'fa-coins',
  'fa-chart-simple',
  'fa-hard-hat',
  'fa-chart-pie',
  'fa-hand-holding-heart',
  'fa-credit-card',
  'fa-image',
  'fa-stamp',
];

export default function FixedSidebar({
  userName,
  activeStepIndex,
  onSelectStep,
  onChangeService,
  onLogout,
  isMobileOpen = false,
  onCloseMobile,
}: FixedSidebarProps) {
  const { language, t } = useLanguage();
  const stepLabels = SECTION_NAV_ITEMS_I18N[language] || SECTION_NAV_ITEMS_I18N.en;
  return (
    <aside
      className={`dpr-sidebar-container ${isMobileOpen ? 'mobile-open' : ''}`}
      style={{
        width: '280px',
        background: 'linear-gradient(180deg, #123B4A 0%, #006F78 100%)',
        color: '#EEF2FF',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        height: '100vh',
        overflowY: 'auto',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        boxShadow: '4px 0 25px rgba(0, 111, 120, 0.25)',
        zIndex: 1000,
        padding: '1.2rem 0',
        borderRight: '1px solid rgba(221, 244, 243, 0.15)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <style jsx>{`
        aside::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 992px) {
          .dpr-sidebar-container {
            transform: translateX(-100%);
            width: 280px !important;
            max-width: 85vw !important;
          }
          .dpr-sidebar-container.mobile-open {
            transform: translateX(0) !important;
            box-shadow: 10px 0 30px rgba(0, 0, 0, 0.5) !important;
          }
        }


        .sidebar-brand-logo {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .sidebar-brand-logo:hover {
          transform: scale(1.06);
        }

        .sidebar-user-badge {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sidebar-user-badge:hover {
          background: rgba(255, 255, 255, 0.16) !important;
          border-color: rgba(45, 212, 191, 0.5) !important;
          box-shadow: 0 4px 15px rgba(45, 212, 191, 0.2);
          transform: translateY(-2px);
        }
        .sidebar-user-badge:hover i {
          transform: scale(1.2);
          color: #36B5B8 !important;
          transition: transform 0.25s ease;
        }

        .sidebar-btn-track {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .sidebar-btn-track:hover {
          background: linear-gradient(135deg, #008C95 0%, #006F78 100%) !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
          box-shadow: 0 4px 14px rgba(0, 140, 149, 0.4);
          transform: translateY(-2px);
          color: #FFFFFF !important;
        }
        .sidebar-btn-track:hover i {
          transform: rotate(180deg);
          transition: transform 0.4s ease;
        }

        .sidebar-btn-exit {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .sidebar-btn-exit:hover {
          background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%) !important;
          border-color: rgba(239, 68, 68, 0.6) !important;
          box-shadow: 0 4px 14px rgba(239, 68, 68, 0.45);
          transform: translateY(-2px);
          color: #FFFFFF !important;
        }

        .sidebar-step-item {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative;
        }
        .sidebar-step-item:hover {
          transform: translateX(6px) translateY(-1px) scale(1.015);
          background: linear-gradient(135deg, rgba(0, 140, 149, 0.42) 0%, rgba(0, 111, 120, 0.55) 100%) !important;
          border-color: rgba(54, 181, 184, 0.55) !important;
          box-shadow: 0 6px 18px rgba(0, 140, 149, 0.35);
          color: #FFFFFF !important;
        }
        .sidebar-step-item:hover .sidebar-step-icon {
          transform: scale(1.3) rotate(8deg);
          color: #FF7A00 !important;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .sidebar-step-item:hover .sidebar-step-label {
          color: #FFFFFF !important;
          font-weight: 700 !important;
          letter-spacing: 0.2px;
        }
        .sidebar-step-item.active-step {
          background: linear-gradient(135deg, #008C95 0%, #006F78 100%) !important;
          border-color: #FF7A00 !important;
          box-shadow: 0 6px 20px rgba(0, 140, 149, 0.45) !important;
        }
      `}</style>

      {/* Brand Header */}
      <div style={{ padding: '0 1.2rem 1rem 1.2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.12)', marginBottom: '0.8rem', position: 'relative' }}>
        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="mobile-only"
            aria-label="Close sidebar"
            style={{
              position: 'absolute',
              top: '-0.4rem',
              right: '0.8rem',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#FFFFFF',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              cursor: 'pointer',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
            }}
          >
            <i className="fas fa-times" />
          </button>
        )}

        <div className="sidebar-brand-logo" style={{ textAlign: 'center', marginBottom: '0.4rem', cursor: 'pointer' }}>
          <img src="/VKF_logo.png" alt="VISION KARNATAKA FOUNDATION" style={{ maxWidth: '100%', height: 'auto', maxHeight: '50px', objectFit: 'contain' }} />
        </div>
        <div style={{ textAlign: 'center', marginBottom: '0.6rem', fontSize: '0.68rem', color: '#FF7A00', fontWeight: 800, letterSpacing: '0.8px' }}>
          VISION KARNATAKA FOUNDATION
        </div>

        {/* User Info Badge */}
        <div className="sidebar-user-badge" style={{ background: 'rgba(255, 255, 255, 0.08)', borderRadius: '0.75rem', padding: '0.55rem 0.85rem', margin: '0.6rem 0.2rem 0.4rem 0.2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', border: '1px solid rgba(255, 255, 255, 0.12)', cursor: 'pointer' }}>
          <i className="fas fa-user-circle" style={{ color: '#2DD4BF', fontSize: '1.1rem', transition: 'all 0.2s ease' }}></i>
          <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{userName || 'User'}</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem' }}>
          <button
            onClick={() => {
              onLogout();
              if (onCloseMobile) onCloseMobile();
            }}
            className="sidebar-btn-exit"
            style={{
              flex: 1,
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#FCA5A5',
              borderRadius: '0.65rem',
              padding: '0.5rem 0.8rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
          >
            <i className="fas fa-sign-out-alt"></i> {t.common.logout || 'Exit Application'}
          </button>
        </div>
      </div>

      {/* Navigation Step List */}
      <nav style={{ padding: '0 0.6rem' }}>
        {stepLabels.map((label, idx) => {
          const isActive = idx === activeStepIndex;
          const isCompleted = idx < activeStepIndex;
          const icon = SECTION_ICONS[idx] || 'fa-circle';

          return (
            <button
              key={idx}
              onClick={() => {
                onSelectStep(idx);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`sidebar-step-item ${isActive ? 'active-step' : ''}`}
              style={{
                width: '100%',

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                margin: '0.15rem 0',
                borderRadius: '0.75rem',
                border: isActive ? '1px solid #FF7A00' : '1px solid transparent',
                background: isActive
                  ? 'linear-gradient(135deg, #008C95 0%, #006F78 100%)'
                  : 'transparent',
                color: isActive ? '#FFFFFF' : isCompleted ? '#2DD4BF' : '#CBD5E1',
                fontSize: '0.82rem',
                fontWeight: isActive ? 800 : 600,
                textAlign: 'left',
                cursor: 'pointer',
                boxShadow: isActive ? '0 4px 14px rgba(0, 140, 149, 0.35)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <i className={`fas ${icon} sidebar-step-icon`} style={{ width: '16px', fontSize: '0.85rem', color: isActive ? '#FF7A00' : isCompleted ? '#2DD4BF' : '#94A3B8', transition: 'all 0.25s ease' }} />
                <span className="sidebar-step-label" style={{ transition: 'all 0.2s ease' }}>{label}</span>
              </div>
              {isCompleted && <i className="fas fa-check-circle" style={{ fontSize: '0.75rem', color: '#2DD4BF' }} />}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
