'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export interface PricingPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (routeKey: 'govt' | 'bank' | 'inv', planId: string) => void;
  initialRouteKey?: 'govt' | 'bank' | 'inv';
  initialPlanId?: string;
  isDashboardUser?: boolean;
  onPaymentSuccess?: () => void;
}

export default function PricingPlansModal({
  isOpen,
  onClose,
  onSelectPlan,
  initialRouteKey = 'bank',
  initialPlanId = 'core',
  isDashboardUser = false,
  onPaymentSuccess,
}: PricingPlansModalProps) {
  const { language, t } = useLanguage();
  const [selectedRouteKey, setSelectedRouteKey] = useState<'govt' | 'bank' | 'inv'>(initialRouteKey);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlanId);

  useEffect(() => {
    if (initialRouteKey) setSelectedRouteKey(initialRouteKey);
    if (initialPlanId) setSelectedPlanId(initialPlanId);
  }, [initialRouteKey, initialPlanId, isOpen]);

  if (!isOpen) return null;

  const routeServiceMap: Record<string, string> = {
    govt: 'Govt Subsidy DPR',
    bank: 'Bank Loan DPR',
    inv: 'Investor / Business Pitch DPR',
  };

  const routes = [
    {
      id: 'bank' as const,
      label: language === 'kn' ? 'ಬ್ಯಾಂಕ್ ಸಾಲಗಳು' : language === 'hi' ? 'बैंक ऋण' : 'Bank & NBFC Loans',
      icon: 'fa-building-columns',
      accentColor: '#FF7A00',
      bgSoft: '#FFF7ED',
      borderSoft: '#FFEDD5',
      modalTitle: language === 'kn' ? 'ಬ್ಯಾಂಕ್ ಮತ್ತು NBFC ಸಾಲ ಡಿಪಿಆರ್ ಯೋಜನೆಗಳು' : language === 'hi' ? 'बैंक एवं एनबीएफसी ऋण डीपीआर योजनाएं' : 'Bank & NBFC Loan DPR Plans',
      serviceName: 'Bank Loan DPR',
    },
    {
      id: 'govt' as const,
      label: language === 'kn' ? 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು' : language === 'hi' ? 'सरकारी योजनाएं' : 'Govt Schemes & Subsidies',
      icon: 'fa-landmark',
      accentColor: '#008C95',
      bgSoft: '#F0FDFA',
      borderSoft: '#CCFBF1',
      modalTitle: language === 'kn' ? 'ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ & ಅನುದಾನ ಡಿಪಿಆರ್ ಯೋಜನೆಗಳು' : language === 'hi' ? 'सरकारी सब्सिडी एवं अनुदान डीपीआर योजनाएं' : 'Govt Scheme & Subsidy DPR Plans',
      serviceName: 'Govt Subsidy DPR',
    },
    {
      id: 'inv' as const,
      label: language === 'kn' ? 'ಹೂಡಿಕೆದಾರರ ಪಿಚ್' : language === 'hi' ? 'निवेशक पिच' : 'Investor Pitch',
      icon: 'fa-chart-line',
      accentColor: '#0071E3',
      bgSoft: '#F0F7FF',
      borderSoft: '#D0E3FF',
      modalTitle: language === 'kn' ? 'ಇನ್ವೆಸ್ಟರ್ ಪಿಚ್ ಡಿಪಿಆರ್ ಯೋಜನೆಗಳು' : language === 'hi' ? 'इन्वेस्टर पिच डीपीआर योजनाएं' : 'Investor Pitch DPR Plans',
      serviceName: 'Investor / Business Pitch DPR',
    },
  ];

  const plans = [
    {
      id: 'entry',
      name: language === 'kn' ? 'ಪ್ರಾರಂಭಿಕ (Entry)' : language === 'hi' ? 'प्रारंभिक (Entry)' : 'Entry Plan',
      sub: language === 'kn' ? 'ಆರಂಭಿಕ ಹಂತದ ಯೋಜನೆಗಳು' : language === 'hi' ? 'शुरुआती परियोजनाएं' : 'Early-Stage Projects',
      price: 399,
      priceDisplay: '₹399',
      pages: '15 – 20 Pages',
      desc: language === 'kn'
        ? 'ಆರಂಭಿಕ ಹಂತದ ವ್ಯವಹಾರಗಳು ಮತ್ತು ಸಣ್ಣ ಸಾಲಗಳಿಗಾಗಿ ಪ್ರಮಾಣಿತ ಡಿಪಿಆರ್.'
        : language === 'hi'
        ? 'शुरुआती व्यवसायों और छोटे ऋणों के लिए मानक डीपीआर रिपोर्ट।'
        : 'A standard DPR for early-stage setups, micro-enterprises, and fast loan clearances.',
      features: [
        '15–20 Comprehensive Pages',
        'Executive Summary & Profile',
        'Market & Setup Overview',
        '3–5 Year Financial Statements',
        'Cost of Project & Means of Finance',
        'Instant Official Bankable PDF Download',
      ],
      badge: null,
    },
    {
      id: 'core',
      name: language === 'kn' ? 'ಮುಖ್ಯ (Core)' : language === 'hi' ? 'कोर (Core)' : 'Core Plan',
      sub: language === 'kn' ? 'ಬೆಳೆಯುತ್ತಿರುವ MSME ಗಳು' : language === 'hi' ? 'बढ़ते एमएसएमई' : 'Growing MSME Businesses',
      price: 799,
      priceDisplay: '₹799',
      pages: '25 – 35 Pages',
      desc: language === 'kn'
        ? 'ಸಂಪೂರ್ಣ ಹಣಕಾಸು ಮುನ್ಸೂಚನೆ ಮತ್ತು ಬ್ಯಾಂಕ್ ಮೌಲ್ಯಮಾಪನ ಮಾನದಂಡಗಳನ್ನು ಒಳಗೊಂಡ ಡಿಪಿಆರ್.'
        : language === 'hi'
        ? 'विस्तृत वित्तीय अनुमान और बैंक मूल्यांकन मानकों सहित संपूर्ण डीपीआर।'
        : 'Complete bank-grade DPR with multi-year cash flow, DSCR, break-even, and debt repayment models.',
      features: [
        '25–35 Detailed Pages',
        'Executive Summary & Promoter Profile',
        'In-depth Market & Competitor Analysis',
        '36-Month Cash Flow & CMA Schedules',
        'DSCR, DE Ratio & Tandon Norms',
        'Break-Even & Repayment Viability',
        'Instant Official Bankable PDF Download',
      ],
      badge: language === 'kn' ? 'ಹೆಚ್ಚು ಜನಪ್ರಿಯ' : language === 'hi' ? 'सर्वाधिक लोकप्रिय' : 'MOST POPULAR',
    },
    {
      id: 'team',
      name: language === 'kn' ? 'ಟೀಮ್ (Team)' : language === 'hi' ? 'टीम (Team)' : 'Team Plan (Advanced)',
      sub: language === 'kn' ? 'ಮಧ್ಯಮ ಗಾತ್ರದ ಉದ್ಯಮಗಳು' : language === 'hi' ? 'मध्यम आकार के उद्यम' : 'Growth MSMEs & Institutions',
      price: 999,
      priceDisplay: '₹999',
      pages: '35 – 45 Pages',
      desc: language === 'kn'
        ? 'ವಿವರವಾದ ಹಣಕಾಸು ವಿಶ್ಲೇಷಣೆ, ಒತ್ತಡ ಪರೀಕ್ಷೆಗಳು ಮತ್ತು ಸಬ್ಸಿಡಿ ಸಮರ್ಥನೆಯೊಂದಿಗೆ ಸುಧಾರಿತ ಡಿಪಿಆರ್.'
        : language === 'hi'
        ? 'विस्तृत वित्तीय विश्लेषण, संवेदनशीलता तनाव परीक्षण एवं सब्सिडी दावों के साथ उन्नत डीपीआर।'
        : 'Advanced institutional DPR with sensitivity stress testing, milestone roadmap, and subsidy claims.',
      features: [
        '35–45 Detailed Pages',
        'Priority Advisory Synthesis',
        'Multi-Scenario Sensitivity Stress Testing',
        'Detailed Capex & Working Capital Assessment',
        'Government Subsidy & Incentive Justification',
        'Risk Matrix & Mitigation Roadmap',
        'Instant Official Bankable PDF Download',
      ],
      badge: language === 'kn' ? 'ಸುಧಾರಿತ' : language === 'hi' ? 'उन्नत' : 'ADVANCED',
    },
    {
      id: 'enterprise',
      name: language === 'kn' ? 'ಕಸ್ಟಮ್ (Custom)' : language === 'hi' ? 'कस्टम (Custom)' : 'Custom Plan',
      sub: language === 'kn' ? 'ದೊಡ್ಡ ಪ್ರಮಾಣದ ಯೋಜನೆಗಳು' : language === 'hi' ? 'बड़े पैमाने की परियोजनाएं' : 'Large Scale & Specialized',
      price: 999,
      priceDisplay: 'Custom',
      pages: '45 – 60+ Pages',
      desc: language === 'kn'
        ? 'ಕಸ್ಟಮ್ ಡಿಪಿಆರ್ ವ್ಯಾಪ್ತಿ, 10-ವರ್ಷಗಳ ವಿಸ್ತೃತ ಮಾದರಿ ಮತ್ತು ತಜ್ಞರ ಬೆಂಬಲ.'
        : language === 'hi'
        ? 'कस्टम डीपीआर दायरा, 10-वर्षीय विस्तारित वित्तीय मॉडलिंग एवं विशेषज्ञ सहयोग।'
        : 'Custom enterprise DPR scope, 10-year extended financial projections, BOQ, and custom lender schedules.',
      features: [
        '45–60+ Exhaustive Pages',
        'Tailored Scope & Specialized Annexures',
        '10-Year Financial Forecast & Ratio Modeling',
        'Detailed Raw Material & Infrastructure BOQ',
        'Direct Advisory & Review Support',
        'Customized Lender & Investor Pack',
      ],
      badge: language === 'kn' ? 'ಕಸ್ಟಮ್' : language === 'hi' ? 'कस्टम' : 'CUSTOM',
    },
  ];

  const activeRoute = routes.find((r) => r.id === selectedRouteKey) || routes[0];

  const handleSelect = (planId: string) => {
    setSelectedPlanId(planId);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('dpr_selected_plan', planId);
      sessionStorage.setItem('dpr_selected_service', activeRoute.serviceName);
      sessionStorage.setItem('dpr_plan_chosen', 'true');
    }
    if (onSelectPlan) {
      onSelectPlan(selectedRouteKey, planId);
    }
  };



  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#F8FAFC',
          borderRadius: '24px',
          width: 'min(1240px, 100%)',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '2rem 2.2rem 2.4rem',
          boxShadow: '0 25px 65px -15px rgba(0, 0, 0, 0.35)',
          position: 'relative',
          border: '1.5px solid #E2E8F0',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: '#FFFFFF',
            border: '1.5px solid #CBD5E1',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.05rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 10,
          }}
        >
          <i className="fas fa-times" />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.8rem', paddingRight: '2.5rem' }}>
          {/* Track Switcher Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.2rem' }}>
            {routes.map((rt) => {
              const isActive = selectedRouteKey === rt.id;
              return (
                <button
                  key={rt.id}
                  onClick={() => {
                    setSelectedRouteKey(rt.id);
                    if (typeof window !== 'undefined') {
                      sessionStorage.setItem('dpr_selected_service', rt.serviceName);
                    }
                  }}
                  style={{
                    background: isActive ? rt.bgSoft : '#FFFFFF',
                    border: isActive ? `2px solid ${rt.accentColor}` : '1.5px solid #CBD5E1',
                    color: isActive ? rt.accentColor : '#64748B',
                    padding: '0.5rem 1.2rem',
                    borderRadius: '9999px',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.55rem',
                    boxShadow: isActive ? `0 4px 14px ${rt.accentColor}25` : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <i className={`fas ${rt.icon}`} style={{ fontSize: '0.85rem' }} />
                  {rt.label}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: activeRoute.accentColor, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                {activeRoute.serviceName}
              </div>
              <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#123B4A', margin: '0 0 6px 0', lineHeight: 1.2 }}>
                {activeRoute.modalTitle}
              </h2>
            </div>
            <div style={{ background: '#123B4A', color: '#FFFFFF', padding: '6px 16px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700 }}>
              {language === 'kn' ? 'ಎಲ್ಲಾ ಡಿಪಿಆರ್ ಮಾದರಿಗಳಿಗೂ ಒಂದೇ ದರ: ₹399, ₹799, ₹999 ಮತ್ತು ಕಸ್ಟಮ್' : language === 'hi' ? 'सभी डीपीआर प्रकारों के लिए समान मूल्य: ₹399, ₹799, ₹999 एवं कस्टम' : 'Uniform Pricing: ₹399, ₹799, ₹999 & Custom'}
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#64748B', margin: '6px 0 0 0' }}>
            {language === 'kn'
              ? 'ನಿಮ್ಮ ಯೋಜನೆಗೆ ಅನುಗುಣವಾಗಿ ಸೂಕ್ತವಾದ ಡಿಪಿಆರ್ ಯೋಜನೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:'
              : language === 'hi'
              ? 'अपनी परियोजना की आवश्यकता के अनुसार उपयुक्त डीपीआर योजना चुनें:'
              : 'Select the DPR plan best suited for your project requirement:'}
          </p>
        </div>

        {/* 4 Plans Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem', alignItems: 'stretch' }}>
          {plans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const isFeatured = plan.id === 'core';

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  border: isSelected ? `2.5px solid ${activeRoute.accentColor}` : isFeatured ? '2px solid #008C95' : '1.5px solid #E2E8F0',
                  padding: '1.5rem 1.3rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  boxShadow: isSelected
                    ? `0 12px 32px ${activeRoute.accentColor}25`
                    : isFeatured
                    ? '0 8px 24px rgba(0, 140, 149, 0.12)'
                    : '0 4px 16px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer',
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      right: '16px',
                      background: isSelected ? activeRoute.accentColor : isFeatured ? '#008C95' : '#7C3AED',
                      color: '#FFFFFF',
                      padding: '3px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.66rem',
                      fontWeight: 900,
                      letterSpacing: '0.06em',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#123B4A', margin: 0 }}>{plan.name}</h3>
                      <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '2px 0 0 0' }}>{plan.sub}</p>
                    </div>
                    {isSelected && (
                      <span style={{ background: activeRoute.bgSoft, color: activeRoute.accentColor, fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', border: `1px solid ${activeRoute.borderSoft}` }}>
                        ✓ SELECTED
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div style={{ margin: '14px 0 10px 0' }}>
                    {plan.priceDisplay === 'Custom' ? (
                      <div style={{ display: 'inline-block', padding: '5px 14px', borderRadius: '12px', background: '#F1F5F9', color: '#334155', fontWeight: 800, fontSize: '1.25rem' }}>
                        {language === 'kn' ? 'ಕಸ್ಟಮ್ ಪ್ಲಾನ್' : language === 'hi' ? 'कस्टम प्लान' : 'Custom Scope'}
                      </div>
                    ) : (
                      <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '4px', padding: '5px 14px', borderRadius: '12px', background: activeRoute.bgSoft, border: `1px solid ${activeRoute.borderSoft}`, color: activeRoute.accentColor, fontWeight: 900, fontSize: '1.5rem' }}>
                        {plan.priceDisplay}
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>/ DPR</span>
                      </div>
                    )}
                    <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600, marginTop: '6px' }}>
                      <strong style={{ color: '#123B4A' }}>{plan.pages}</strong>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.45, margin: '0 0 14px 0', minHeight: '38px' }}>
                    {plan.desc}
                  </p>

                  {/* Feature Checklist */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    {plan.features.map((ft, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.78rem', color: '#334155', lineHeight: 1.35 }}>
                        <i className="fas fa-check" style={{ color: activeRoute.accentColor, marginTop: '3px', flexShrink: 0, fontSize: '0.75rem' }} />
                        <span>{ft}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(plan.id);
                      onClose();
                    }}
                    style={{
                      width: '100%',
                      background: isSelected
                        ? `linear-gradient(135deg, ${activeRoute.accentColor} 0%, #006F78 100%)`
                        : isFeatured
                        ? 'linear-gradient(135deg, #008C95 0%, #006F78 100%)'
                        : '#F1F5F9',
                      color: isSelected || isFeatured ? '#FFFFFF' : '#1E293B',
                      border: isSelected || isFeatured ? 'none' : '1.5px solid #CBD5E1',
                      borderRadius: '12px',
                      padding: '0.75rem 1rem',
                      fontWeight: 800,
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      boxShadow: isSelected || isFeatured ? '0 4px 14px rgba(0, 140, 149, 0.25)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isSelected
                      ? `✓ ${language === 'kn' ? 'ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ - ಮುಂದುವರಿಯಿರಿ' : language === 'hi' ? 'चयनित - आगे बढ़ें' : 'Select & Continue to DPR'}`
                      : `${language === 'kn' ? 'ಪ್ಲಾನ್ ಆಯ್ಕೆಮಾಡಿ' : language === 'hi' ? 'प्लान चुनें' : 'Choose'} ${plan.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Bottom Footer Info */}
        <div style={{ marginTop: '1.6rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: '#64748B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fas fa-shield-alt" style={{ color: '#10B981', fontSize: '0.95rem' }} />
            <span>Secured by Razorpay • UPI (GPay, PhonePe, Paytm), All Cards & NetBanking Supported</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.6rem 1.6rem',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
            }}
          >
            {language === 'kn' ? 'ಮುಂದುವರಿಸಿ' : language === 'hi' ? 'जारी रखें' : 'Continue to DPR Form'} &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
