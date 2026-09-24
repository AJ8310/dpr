'use client';

import React from 'react';

interface ServiceSelectionViewProps {
  userName: string;
  onSelectService: (serviceName: string) => void;
  onLogout?: () => void;
}

export default function ServiceSelectionView({ userName, onSelectService, onLogout }: ServiceSelectionViewProps) {
  const services = [
    {
      id: 'bank_loan',
      title: 'Bank Loan DPR',
      subtitle: 'CGTMSE, MUDRA, Commercial Term Loans & Cash Credit',
      icon: 'fa-building-columns',
      badge: 'Most Popular',
      features: ['DSCR Ratio calculation', '5-Year P&L & Balance Sheet', 'Bank Format Compliance']
    },
    {
      id: 'govt_scheme',
      title: 'Govt Subsidy DPR',
      subtitle: 'PMEGP, KVIC, Stand-Up India, MSME Subsidies',
      icon: 'fa-landmark',
      badge: 'Subsidy Optimized',
      features: ['15% to 35% Margin Money Subsidy', 'State & Central Scheme Check', 'District Industry Center Format']
    },
    {
      id: 'investor_pitch',
      title: 'Investor / Business Pitch DPR',
      subtitle: 'Venture Capital, Angel Funding & Strategic Pitch Decks',
      icon: 'fa-chart-line',
      badge: 'Valuation Ready',
      features: ['IRR & NPV Calculation', 'SWOT & Market Growth Vector', 'Executive Presentation Format']
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '0 1.5rem', position: 'relative' }}>
      <style jsx>{`
        .service-card-interactive {
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .service-card-interactive:hover {
          transform: translateY(-8px) scale(1.015);
          box-shadow: 0 20px 45px rgba(0, 140, 149, 0.18) !important;
          border-color: #008C95 !important;
        }
        .service-card-interactive:hover .service-icon-box {
          background: linear-gradient(135deg, #008C95 0%, #006F78 100%) !important;
          color: #FFFFFF !important;
          transform: scale(1.15) rotate(6deg);
          box-shadow: 0 6px 18px rgba(0, 140, 149, 0.35);
        }
        .service-card-interactive:hover .service-card-btn {
          background: linear-gradient(135deg, #FF7A00 0%, #EA580C 100%) !important;
          box-shadow: 0 8px 24px rgba(255, 122, 0, 0.4) !important;
          transform: translateY(-2px);
        }
      `}</style>

      {/* Extreme Top Right Sign Out Button Bar */}
      {onLogout && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.2rem' }}>
          <button
            onClick={onLogout}
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #DDF4F3',
              color: '#991B1B',
              padding: '0.65rem 1.4rem',
              borderRadius: '0.75rem',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(0, 111, 120, 0.08)',
              transition: 'all 0.2s ease',
            }}
          >
            <i className="fas fa-sign-out-alt"></i> Sign Out
          </button>
        </div>
      )}

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem', fontWeight: 700, color: '#FF7A00', marginBottom: '0.4rem' }}>
          Welcome, {userName || 'User'}
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#123B4A', marginBottom: '0.5rem' }}>
          Select Your DPR Service Type
        </h2>
        <p style={{ color: '#66818C', fontSize: '0.98rem' }}>
          Choose the exact Detailed Project Report type tailored for your financial institution or government scheme requirement.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.8rem' }}>
        {services.map((svc) => (
          <div
            key={svc.id}
            onClick={() => onSelectService(svc.title)}
            className="service-card-interactive"
            style={{
              background: 'white',
              borderRadius: '1.2rem',
              padding: '2rem',
              border: '1px solid #E2E8F0',
              boxShadow: '0 8px 25px rgba(10, 25, 47, 0.05)',
              cursor: 'pointer',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <div className="service-icon-box" style={{ width: '52px', height: '52px', borderRadius: '1rem', background: '#F0FDFA', border: '1px solid #CCFBF1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#008C95', fontSize: '1.4rem', transition: 'all 0.3s ease' }}>
                  <i className={`fas ${svc.icon}`}></i>
                </div>
                <span style={{ background: '#FFF7ED', color: '#EA580C', fontSize: '0.75rem', fontWeight: 700, padding: '0.35rem 0.85rem', borderRadius: '1rem', border: '1px solid #FFEDD5' }}>
                  {svc.badge}
                </span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#123B4A', marginBottom: '0.4rem' }}>{svc.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.2rem', lineHeight: '1.4' }}>{svc.subtitle}</p>

              <ul style={{ listStyle: 'none', marginBottom: '1.5rem' }}>
                {svc.features.map((ft, idx) => (
                  <li key={idx} style={{ fontSize: '0.82rem', color: '#334155', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-check-circle" style={{ color: '#008C95' }}></i> {ft}
                  </li>
                ))}
              </ul>
            </div>

            <button
              className="service-card-btn"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #008C95 0%, #006F78 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.85rem 1rem',
                borderRadius: '0.75rem',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(0, 140, 149, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.25s ease',
              }}
            >
              Start {svc.title} Wizard →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
