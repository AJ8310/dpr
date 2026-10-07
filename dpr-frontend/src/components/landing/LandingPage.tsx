'use client';

import React, { useState } from 'react';
import LoginCard from '@/components/auth/LoginCard';
import RegisterCard from '@/components/auth/RegisterCard';
import BackgroundWaves from '@/components/common/BackgroundWaves';
import { UserSession } from '@/types/dpr';

interface LandingPageProps {
  onLoginSuccess: (session: UserSession) => void;
}

export default function LandingPage({ onLoginSuccess }: LandingPageProps) {
  const [authView, setAuthView] = useState<'inquiry' | 'login' | 'register'>('inquiry');
  const [activeDashTab, setActiveDashTab] = useState<'projections' | 'ratios' | 'repayments' | 'sensitivities'>('projections');
  const [machineryCost, setMachineryCost] = useState<number>(50); // in Lakhs
  const [heroRightTab, setHeroRightTab] = useState<'video' | 'blueprint'>('video');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Inquiry Form State
  const [dprPurpose, setDprPurpose] = useState<string>('bank_loan');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Auth Pop-Up Modal State (Opens when clicking 'View Plans by Project Size' / 'Create My DPR')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [popupAuthMode, setPopupAuthMode] = useState<'login' | 'register'>('login');
  const [pendingSession, setPendingSession] = useState<UserSession | null>(null);

  const isLeadCaptured = () => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('dpr_lead_captured') === 'true' || !!sessionStorage.getItem('dpr_session');
  };

  // Funding Routes & Project-Size Plans Dialog State
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const [selectedRouteKey, setSelectedRouteKey] = useState<'govt' | 'bank' | 'inv'>('bank');

  // Supported Business Sectors Rolling Banner State & Effect
  const sectorTrackRef = React.useRef<HTMLDivElement>(null);
  const [isSectorAutoRolling, setIsSectorAutoRolling] = useState(true);

  const scrollSectorTrack = (direction: 'left' | 'right') => {
    if (sectorTrackRef.current) {
      const scrollAmount = direction === 'left' ? -374 : 374;
      sectorTrackRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    if (!isSectorAutoRolling) return;
    const interval = setInterval(() => {
      if (sectorTrackRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sectorTrackRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          sectorTrackRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          sectorTrackRef.current.scrollBy({ left: 374, behavior: 'smooth' });
        }
      }
    }, 3200);
    return () => clearInterval(interval);
  }, [isSectorAutoRolling]);

  const saveSelection = (routeKey: string, planId?: string) => {
    const serviceMap: Record<string, string> = {
      govt: 'Govt Subsidy DPR',
      bank: 'Bank Loan DPR',
      inv: 'Investor / Business Pitch DPR'
    };
    const canonicalService = serviceMap[routeKey] || 'Bank Loan DPR';
    sessionStorage.setItem('dpr_selected_service', canonicalService);
    if (planId) {
      sessionStorage.setItem('dpr_selected_plan', planId);
    }
  };

  React.useEffect(() => {
    // Proactive backend pre-warming to eliminate cold starts & login delays
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://dpr-0eje.onrender.com').replace(/\/$/, '');
    const pingBackend = () => {
      fetch(`${apiBase}/health/live`).catch(() => {});
      fetch(`${apiBase}/api/payment/config`).catch(() => {});
    };

    pingBackend();
    const interval = setInterval(pingBackend, 180000); // 3 minutes keep-alive
    return () => clearInterval(interval);
  }, []);

  const scrollToAuth = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactPhone('');
    }, 4000);
  };

  // Dynamic calculations based on machinery cost slider
  const totalProjectCost = Math.round(machineryCost * 1.6 * 10) / 10;
  const termLoan = Math.round(totalProjectCost * 0.7 * 10) / 10;
  const govtSubsidy = Math.round(Math.min(machineryCost * 0.35, 35) * 10) / 10;
  const netProfitYr3 = Math.round(machineryCost * 0.76 * 10) / 10;
  const avgDscr = (1.75 + machineryCost / 400).toFixed(2);

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      background: '#F5F5F7',
      color: '#1D1D1F',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Inter, sans-serif'
    }}>
      <style jsx global>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        
        .apple-nav-link {
          background: none;
          border: none;
          color: #1D1D1F;
          font-weight: 500;
          font-size: 0.92rem;
          cursor: pointer;
          transition: color 0.15s ease;
          padding: 0.4rem 0.8rem;
          border-radius: 9999px;
        }
        .apple-nav-link:hover {
          color: #0071E3;
          background: rgba(0, 113, 227, 0.05);
        }

        .apple-btn-primary {
          background: #0071E3;
          color: #FFFFFF;
          border: none;
          padding: 0.8rem 1.6rem;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.92rem;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0, 113, 227, 0.28);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .apple-btn-primary:hover {
          background: #0077ED;
          transform: scale(1.02);
          box-shadow: 0 6px 20px rgba(0, 113, 227, 0.38);
        }

        .apple-btn-secondary {
          background: rgba(255, 255, 255, 0.8);
          color: #1D1D1F;
          border: 1px solid rgba(0, 0, 0, 0.12);
          padding: 0.8rem 1.6rem;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.92rem;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .apple-btn-secondary:hover {
          background: #FFFFFF;
          border-color: rgba(0, 0, 0, 0.25);
          transform: scale(1.02);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }

        .apple-bento-card {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 28px;
          padding: 36px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .apple-bento-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
          border-color: rgba(0, 113, 227, 0.2);
        }
        .apple-bento-card:hover .sector-img {
          transform: scale(1.06);
        }

        .apple-pill {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 9999px;
          font-size: 0.88rem;
          font-weight: 500;
          color: #1D1D1F;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
        }

        .apple-kicker {
          font-family: 'SF Mono', 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: #0071E3;
          text-transform: uppercase;
          margin-bottom: 10px;
          display: block;
        }

        .apple-input {
          width: 100%;
          padding: 14px 18px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 14px;
          background: #FFFFFF;
          font-size: 0.95rem;
          color: #1D1D1F;
          font-family: inherit;
          outline: none;
          transition: all 0.2s ease;
        }
        .apple-input:focus {
          border-color: #0071E3;
          box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.15);
        }

        .radio-pill-apple {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 9999px;
          background: #FFFFFF;
          font-size: 0.88rem;
          font-weight: 500;
          color: #1D1D1F;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .radio-pill-apple.selected {
          border-color: #0071E3;
          background: rgba(0, 113, 227, 0.06);
          color: #0071E3;
          font-weight: 600;
        }

        .dash-tab-btn-apple {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          gap: 14px;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          position: relative;
          transition: background 0.2s ease;
        }
        .dash-tab-btn-apple[aria-selected="true"] {
          background: #FFFFFF;
        }
        .dash-tab-btn-apple[aria-selected="true"]::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3.5px;
          background: #0071E3;
          border-radius: 0 4px 4px 0;
        }

        @media (max-width: 992px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .two-col-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .faq-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .form-2col { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-5 { grid-template-columns: 1fr 1fr !important; }
          .dash-grid { grid-template-columns: 1fr !important; }
          .flow-grid { grid-template-columns: 1fr 1fr !important; }
          .nav-links { display: none !important; }
          .header-tagline { display: none !important; }
          .hero-section-padding { padding: 40px 16px 60px !important; }
          .hero-title-responsive { font-size: 2.1rem !important; line-height: 1.15 !important; }
          .hero-video-container { max-height: 320px !important; }
          .pricing-grid-responsive { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
        }
        @media (max-width: 576px) {
          .grid-5 { grid-template-columns: 1fr !important; }
          .flow-grid { grid-template-columns: 1fr !important; }
          .header-btn-secondary { display: none !important; }
        }

        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Vector Background Waves */}
      <BackgroundWaves />

      {/* 1. APPLE FROSTED GLASS STICKY HEADER */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.78)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        padding: '0.85rem 1.5rem'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo / Brand */}
          <div onClick={() => scrollToSection('hero')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
            <img
              src="/VKF_logo.png"
              alt="Vision Karnataka Foundation Logo"
              style={{ height: '42px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.08))' }}
            />
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                DPRPro AI
              </div>
              <div className="header-tagline" style={{ fontSize: '0.74rem', color: '#86868B', fontWeight: 500, letterSpacing: '0.2px' }}>
                Create Professional DPR Reports in Less Time
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <button onClick={() => scrollToSection('how-it-works')} className="apple-nav-link">Overview</button>
            <button onClick={() => scrollToSection('funding-needs')} className="apple-nav-link">Funding Needs</button>
            <button onClick={() => scrollToSection('supported-sectors')} className="apple-nav-link">Sectors</button>
            <button onClick={() => scrollToSection('why-digital')} className="apple-nav-link">Financial Studio</button>
            <button onClick={() => scrollToSection('pricing')} className="apple-nav-link">Pricing</button>
            <button onClick={() => scrollToSection('faq')} className="apple-nav-link">FAQ</button>
          </nav>

          {/* Header Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={scrollToAuth} className="apple-btn-secondary" style={{ padding: '0.55rem 1.2rem', fontSize: '0.86rem' }}>
              Contact Team
            </button>
            <button onClick={() => { saveSelection(selectedRouteKey); setIsAuthModalOpen(true); }} className="apple-btn-primary" style={{ padding: '0.55rem 1.3rem', fontSize: '0.86rem' }}>
              Create My DPR &rarr;
            </button>
          </div>
        </div>
      </header>

      {/* 2. APPLE STUDIO HERO SECTION */}
      <section id="hero" style={{ padding: '80px 24px 100px', position: 'relative', zIndex: 1 }}>
        <div className="hero-grid" style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: '48px', alignItems: 'center' }}>
          
          {/* Left Column Copy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Main Headline */}
            <h1 style={{
              fontSize: '3.6rem',
              fontWeight: 700,
              color: '#1D1D1F',
              lineHeight: 1.05,
              letterSpacing: '-0.038em'
            }}>
              Build Your Funding-Ready DPR, Smarter.
            </h1>

            {/* Speed Badge */}
            <div style={{
              display: 'inline-flex',
              alignSelf: 'flex-start',
              alignItems: 'center',
              gap: '12px',
              padding: '4px 6px 4px 18px',
              background: '#F1F5F9',
              border: '1.5px solid #E2E8F0',
              borderRadius: '9999px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
              margin: '4px 0'
            }}>
              <span style={{ color: '#64748B', textDecoration: 'line-through', fontSize: '0.94rem', fontWeight: 600 }}>
                3 weeks manual prep
              </span>
              <span style={{
                background: 'linear-gradient(135deg, #0071E3 0%, #005BB5 100%)',
                color: '#FFFFFF',
                borderRadius: '9999px',
                padding: '6px 16px',
                fontSize: '0.94rem',
                fontWeight: 700,
                boxShadow: '0 3px 10px rgba(0, 113, 227, 0.28)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                ⚡ &lt; 10 mins flow
              </span>
            </div>

            {/* Subtitle */}
            <p style={{ fontSize: '1.18rem', color: '#515154', lineHeight: 1.5, maxWidth: '560px', fontWeight: 400 }}>
              Turn your business, project and financial information into a professionally structured Detailed Project Report (DPR) — formatted for institutional credit appraisal.
            </p>

            {/* DPR For Tags */}
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#1D1D1F', marginBottom: '10px' }}>
                Prepare your DPR for
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <span className="apple-pill">Bank & NBFC Loans</span>
                <span className="apple-pill">Government Schemes & Subsidies</span>
                <span className="apple-pill">Investor Funding</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#86868B', marginTop: '10px' }}>
                With automated financial projections, funding analysis and structured documentation.
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '8px' }}>
              <button onClick={() => { saveSelection(selectedRouteKey); setIsAuthModalOpen(true); }} className="apple-btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '1.02rem' }}>
                Create My DPR &rarr;
              </button>
              <button onClick={scrollToAuth} className="apple-btn-secondary" style={{ padding: '0.9rem 2.2rem', fontSize: '1.02rem' }}>
                Get in Touch
              </button>
            </div>

          </div>

          {/* Right Column: macOS DPR Studio Window & High-Clarity Video Player */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'relative',
              zIndex: 1,
              background: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '24px',
              boxShadow: '0 30px 70px -15px rgba(0, 113, 227, 0.22), 0 0 0 1px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
              transform: 'translateZ(0)',
              WebkitFontSmoothing: 'antialiased'
            }}>
              
              {/* macOS Window Header Bar with Mode Switcher */}
              <div style={{
                background: 'rgba(245, 245, 247, 0.95)',
                backdropFilter: 'blur(16px)',
                padding: '12px 18px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF5F56', display: 'inline-block' }}></span>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFBD2E', display: 'inline-block' }}></span>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27C93F', display: 'inline-block' }}></span>
                </div>

                {/* Switcher Pills */}
                <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.05)', borderRadius: '9999px', padding: '3px' }}>
                  <button
                    type="button"
                    onClick={() => setHeroRightTab('video')}
                    style={{
                      background: heroRightTab === 'video' ? '#FFFFFF' : 'transparent',
                      color: heroRightTab === 'video' ? '#0071E3' : '#6E6E73',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '4px 14px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: heroRightTab === 'video' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    🎥 Studio Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroRightTab('blueprint')}
                    style={{
                      background: heroRightTab === 'blueprint' ? '#FFFFFF' : 'transparent',
                      color: heroRightTab === 'blueprint' ? '#0071E3' : '#6E6E73',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '4px 14px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: heroRightTab === 'blueprint' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    📄 Report Blueprint
                  </button>
                </div>
              </div>

              {/* VIDEO VIEW */}
              {heroRightTab === 'video' && (
                <div style={{ position: 'relative', width: '100%', background: '#000000', overflow: 'hidden' }}>
                  <video
                    src="/gemini_generated_video_ff7aa1fe.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    style={{
                      width: '100%',
                      height: 'auto',
                      minHeight: '480px',
                      maxHeight: '800px',
                      display: 'block',
                      objectFit: 'cover',
                      filter: 'contrast(1.05) brightness(1.03) saturate(1.06)',
                      WebkitTransform: 'translateZ(0)',
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden'
                    }}
                  />
                  {/* VKF Logo Watermark Overlay (Transparent Logo Placed Directly Over Video Watermark) */}
                  <img
                    src="/VKF_logo.png"
                    alt="Vision Karnataka Foundation Logo"
                    style={{
                      position: 'absolute',
                      bottom: '18px',
                      right: '18px',
                      zIndex: 25,
                      height: '48px',
                      width: 'auto',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.85))',
                      pointerEvents: 'none'
                    }}
                  />

                  {/* Subtle Glass Bottom Left Info Bar */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '12px 18px',
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.75) 100%)',
                    backdropFilter: 'blur(4px)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    pointerEvents: 'none'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#0071E3', fontSize: '1rem' }}>✨</span>
                      <span>AI-Powered Financial & Detailed Project Report Generator</span>
                    </div>
                  </div>
                </div>
              )}

              {/* BLUEPRINT VIEW */}
              {heroRightTab === 'blueprint' && (
                <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {/* Project Title Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontFamily: 'SF Mono, monospace', fontSize: '0.78rem', color: '#0071E3', fontWeight: 600 }}>DETAILED PROJECT REPORT</span>
                      <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1D1D1F', marginTop: '2px' }}>[Your Enterprise Unit]</div>
                    </div>
                  </div>

                  {/* TOC Items List */}
                  <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '10px 0' }}>
                    {[
                      { id: '01', title: 'Business & Promoter Profile', active: false },
                      { id: '02', title: 'Project Overview & Capital Head', active: false },
                      { id: '03', title: 'Financial Projections (10-Year P&L)', active: true },
                      { id: '04', title: 'Funding & Subsidy Allocation Matrix', active: false },
                      { id: '05', title: 'Feasibility & DSCR Amortization', active: false },
                    ].map((item) => (
                      <div key={item.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        fontSize: '0.88rem',
                        background: item.active ? 'rgba(0, 113, 227, 0.08)' : 'transparent',
                        color: item.active ? '#0071E3' : '#6E6E73',
                        fontWeight: item.active ? 600 : 400
                      }}>
                        <span style={{ fontFamily: 'SF Mono, monospace', fontSize: '0.78rem', color: item.active ? '#0071E3' : '#A1A1A6' }}>{item.id}</span>
                        <span>{item.title}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bar Chart Preview */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#86868B', marginBottom: '12px' }}>
                      <span>Projected Revenue & Net Profit (Y1 - Y5)</span>
                      <span style={{ fontFamily: 'SF Mono, monospace', fontWeight: 600, color: '#0071E3' }}>Auto-calculated</span>
                    </div>
                    
                    {/* 5 Vertical Apple Blue Gradient Bars */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', height: '100px', padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                      {[
                        { h: '45%', label: 'Y1' },
                        { h: '60%', label: 'Y2' },
                        { h: '75%', label: 'Y3' },
                        { h: '88%', label: 'Y4' },
                        { h: '100%', label: 'Y5', highlight: true }
                      ].map((bar, i) => (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                          <div style={{
                            width: '100%',
                            height: bar.h,
                            background: bar.highlight ? 'linear-gradient(180deg, #0071E3 0%, #005BB5 100%)' : 'rgba(0, 0, 0, 0.08)',
                            borderRadius: '6px 6px 0 0',
                            transition: 'height 0.3s ease'
                          }}></div>
                          <span style={{ fontSize: '0.72rem', color: '#86868B', fontFamily: 'SF Mono, monospace' }}>{bar.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Sub-summary Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '14px' }}>
                      <div style={{ padding: '10px', background: '#F5F5F7', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.04)' }}>
                        <div style={{ fontSize: '0.68rem', color: '#86868B' }}>Project Cost</div>
                        <div style={{ fontFamily: 'SF Mono, monospace', fontSize: '0.85rem', fontWeight: 700, color: '#1D1D1F' }}>₹ 80.0 Lakhs</div>
                      </div>
                      <div style={{ padding: '10px', background: '#F5F5F7', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.04)' }}>
                        <div style={{ fontSize: '0.68rem', color: '#86868B' }}>Bank Loan</div>
                        <div style={{ fontFamily: 'SF Mono, monospace', fontSize: '0.85rem', fontWeight: 700, color: '#1D1D1F' }}>₹ 56.0 Lakhs</div>
                      </div>
                      <div style={{ padding: '10px', background: 'rgba(0, 113, 227, 0.06)', borderRadius: '10px', border: '1px solid rgba(0, 113, 227, 0.12)' }}>
                        <div style={{ fontSize: '0.68rem', color: '#0071E3' }}>Govt Subsidy</div>
                        <div style={{ fontFamily: 'SF Mono, monospace', fontSize: '0.85rem', fontWeight: 700, color: '#0071E3' }}>₹ 17.5 Lakhs</div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* 3. THE PROBLEM SECTION */}
      <section style={{ padding: '100px 24px', background: '#FFFFFF', borderTop: '1px solid rgba(0, 0, 0, 0.06)', borderBottom: '1px solid rgba(0, 0, 0, 0.06)', position: 'relative', zIndex: 1 }}>
        <div className="two-col-grid" style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '72px', alignItems: 'center' }}>
          
          {/* Left Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <span className="apple-kicker">The Challenge</span>
            <h2 style={{ fontSize: '2.8rem', fontWeight: 700, color: '#1D1D1F', lineHeight: 1.08, letterSpacing: '-0.03em' }}>
              Your Funding Shouldn't Wait for Your Documentation.
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#515154', lineHeight: 1.6 }}>
              Preparing a DPR manually can mean collecting information across multiple files, building financial projections, checking calculations, formatting reports and going through multiple rounds of revisions.
            </p>

            <blockquote style={{
              margin: '16px 0 0',
              paddingLeft: '20px',
              borderLeft: '3px solid #0071E3',
              fontSize: '1.35rem',
              fontWeight: 600,
              color: '#1D1D1F',
              lineHeight: 1.35
            }}>
              “Your business is ready to move. Your DPR should be too.”
            </blockquote>
          </div>

          {/* Right Side Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#1D1D1F', marginBottom: '4px' }}>Traditional challenges:</div>
            {[
              { icon: '🕒', text: 'Weeks spent preparing and revising documents manually' },
              { icon: '📊', text: 'Complex financial projections to build and check' },
              { icon: '📄', text: 'Repetitive work across Excel spreadsheets and Word files' },
              { icon: '👥', text: 'High dependence on external consultant turnaround times' },
              { icon: '⚠️', text: 'Delays whenever project inputs or loan amounts change' }
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '18px 24px',
                background: '#F5F5F7',
                border: '1px solid rgba(0, 0, 0, 0.04)',
                borderRadius: '16px',
                fontSize: '1.02rem',
                fontWeight: 500,
                color: '#1D1D1F'
              }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. WORKFLOW MODULES SECTION (BENTO GRID) */}
      <section id="how-it-works" style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'end', marginBottom: '56px' }}>
            <div>
              <span className="apple-kicker">Workflow Modules</span>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 700, color: '#1D1D1F', lineHeight: 1.08, letterSpacing: '-0.03em' }}>
                From Business Data to a Structured DPR
              </h2>
            </div>
            <p style={{ fontSize: '1.1rem', color: '#515154', lineHeight: 1.6 }}>
              VKF DPR Studio transforms your raw project parameters and financial inputs into an institutional-grade report built for credit approval.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="grid-3">
            
            {/* Card 01 */}
            <div className="apple-bento-card">
              <span style={{ fontFamily: 'SF Mono, monospace', fontSize: '0.88rem', color: '#0071E3', fontWeight: 600 }}>01</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1D1D1F', margin: '10px 0 10px' }}>Business & Project Profile</h3>
              <p style={{ fontSize: '0.98rem', color: '#86868B', lineHeight: 1.6, margin: 0 }}>
                Bring your business profile, promoter track record, and infrastructure assets into one unified workflow.
              </p>
            </div>

            {/* Card 02 */}
            <div className="apple-bento-card">
              <span style={{ fontFamily: 'SF Mono, monospace', fontSize: '0.88rem', color: '#0071E3', fontWeight: 600 }}>02</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1D1D1F', margin: '10px 0 10px' }}>Financial Projections</h3>
              <p style={{ fontSize: '0.98rem', color: '#86868B', lineHeight: 1.6, margin: 0 }}>
                Generate multi-year projected Profit & Loss statements, Balance Sheets, and Cash Flow models instantly.
              </p>
            </div>

            {/* Card 03 */}
            <div className="apple-bento-card">
              <span style={{ fontFamily: 'SF Mono, monospace', fontSize: '0.88rem', color: '#0071E3', fontWeight: 600 }}>03</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1D1D1F', margin: '10px 0 10px' }}>Funding Allocation Analysis</h3>
              <p style={{ fontSize: '0.98rem', color: '#86868B', lineHeight: 1.6, margin: 0 }}>
                Structure term loans, working capital margins, promoter contribution, and central/state subsidy allocations.
              </p>
            </div>

            {/* Card 04 */}
            <div className="apple-bento-card">
              <span style={{ fontFamily: 'SF Mono, monospace', fontSize: '0.88rem', color: '#0071E3', fontWeight: 600 }}>04</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1D1D1F', margin: '10px 0 10px' }}>Feasibility & Risk Audits</h3>
              <p style={{ fontSize: '0.98rem', color: '#86868B', lineHeight: 1.6, margin: 0 }}>
                Organize DSCR ratio calculations, sensitivity stress tests, and Tandon committee working capital norms.
              </p>
            </div>

            {/* Card 05 - Apple Sleek Dark Bento Card */}
            <div style={{
              gridColumn: 'span 2',
              background: '#1D1D1F',
              color: '#FFFFFF',
              borderRadius: '28px',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.18)'
            }}>
              <span style={{ fontFamily: 'SF Mono, monospace', fontSize: '0.88rem', color: '#64D2FF', fontWeight: 600 }}>05</span>
              <h3 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#FFFFFF', margin: '10px 0 10px' }}>Professional DPR Output</h3>
              <p style={{ fontSize: '1.02rem', color: '#A1A1A6', lineHeight: 1.6, margin: 0, maxWidth: '580px' }}>
                Export fully formatted Word (.docx) reports with optional VKF co-branding, ready for immediate bank submission.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. SPEED BAND SECTION (APPLE DARK STAGE) */}
      <section style={{ padding: '100px 24px', background: '#000000', color: '#FFFFFF', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', marginBottom: '56px' }} className="two-col-grid">
            <div>
              <h2 style={{ fontSize: '3.4rem', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.038em', color: '#FFFFFF' }}>
                3 Weeks of Work.<br />Now Under 10 Minutes.
              </h2>
              <div style={{ fontSize: '1.2rem', color: '#64D2FF', fontWeight: 500, marginTop: '20px' }}>
                Stop rebuilding your financial models manually.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
              <p style={{ fontSize: '1.1rem', color: '#A1A1A6', lineHeight: 1.6 }}>
                Modify any project parameter — like machinery expenditure or working capital — and your entire 10-year P&L, balance sheet, and DSCR ratios recalculate automatically.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.02rem', fontWeight: 500, color: '#FFFFFF' }}>
                  <span style={{ color: '#30D158' }}>✓</span> No starting from scratch.
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.02rem', fontWeight: 500, color: '#FFFFFF' }}>
                  <span style={{ color: '#30D158' }}>✓</span> Zero spreadsheet formula breakages.
                </div>
              </div>
            </div>
          </div>

          {/* 4-Step Pipeline Flow Box */}
          <div className="flow-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            overflow: 'hidden',
            background: 'rgba(29, 29, 31, 0.8)',
            backdropFilter: 'blur(20px)'
          }}>
            {[
              { step: 'Step 1', title: 'Input your business details' },
              { step: 'Step 2', title: 'Automate financial model' },
              { step: 'Step 3', title: 'Review debt & subsidy margins' },
              { step: 'Step 4', title: 'Export bank-ready DPR', active: true }
            ].map((st, i) => (
              <div key={i} style={{
                padding: '28px 24px',
                borderRight: i === 3 ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                background: st.active ? '#0071E3' : 'transparent',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <small style={{ fontFamily: 'SF Mono, monospace', fontSize: '0.8rem', color: st.active ? '#FFFFFF' : '#86868B' }}>{st.step}</small>
                <b style={{ fontSize: '1.1rem', fontWeight: 600, color: '#FFFFFF' }}>{st.title}</b>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. MULTIPLE FUNDING NEEDS SECTION */}
      <section id="funding-needs" style={{ padding: '100px 24px', background: '#FFFFFF', borderBottom: '1px solid rgba(0, 0, 0, 0.06)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '56px' }}>
            <span className="apple-kicker">Use Cases</span>
            <h2 style={{ fontSize: '2.8rem', fontWeight: 700, color: '#1D1D1F', lineHeight: 1.08, letterSpacing: '-0.03em' }}>
              One DPR. Multiple Funding Goals.
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#515154', lineHeight: 1.6, marginTop: '12px', maxWidth: '640px' }}>
              Whether you're preparing for business expansion or seeking institutional finance, structure documentation around your specific objective.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }} className="grid-3">
            
            {/* Card 1 */}
            <div className="apple-bento-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#F5F5F7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '20px' }}>
                🏛️
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1D1D1F', marginBottom: '12px' }}>Bank & NBFC Loans</h3>
              <p style={{ fontSize: '0.98rem', color: '#86868B', lineHeight: 1.6, flexGrow: 1, marginBottom: '24px' }}>
                Present your business, project heads, financial projections, and debt repayment schedules in a structured report.
              </p>
              <button onClick={scrollToAuth} style={{ all: 'unset', cursor: 'pointer', fontWeight: 600, color: '#0071E3', fontSize: '0.95rem' }}>
                Create Loan DPR &rarr;
              </button>
            </div>

            {/* Card 2 */}
            <div className="apple-bento-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#F5F5F7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '20px' }}>
                🏛️
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1D1D1F', marginBottom: '12px' }}>Government Subsidies</h3>
              <p style={{ fontSize: '0.98rem', color: '#86868B', lineHeight: 1.6, flexGrow: 1, marginBottom: '24px' }}>
                Prepare structured project reports for PMEGP, PMFME, State Industrial Policies, and MSME capital subsidy claims.
              </p>
              <button onClick={scrollToAuth} style={{ all: 'unset', cursor: 'pointer', fontWeight: 600, color: '#0071E3', fontSize: '0.95rem' }}>
                Prepare Subsidy DPR &rarr;
              </button>
            </div>

            {/* Card 3 */}
            <div className="apple-bento-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#F5F5F7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '20px' }}>
                💼
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1D1D1F', marginBottom: '12px' }}>Investor Funding</h3>
              <p style={{ fontSize: '0.98rem', color: '#86868B', lineHeight: 1.6, flexGrow: 1, marginBottom: '24px' }}>
                Consolidate your unit profile, unit economics, and multi-scenario sensitivities into a compelling pitch document.
              </p>
              <button onClick={scrollToAuth} style={{ all: 'unset', cursor: 'pointer', fontWeight: 600, color: '#0071E3', fontSize: '0.95rem' }}>
                Build Investor DPR &rarr;
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 7. FEATURE GRID SECTION */}
      <section style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 64px' }}>
            <span className="apple-kicker">Platform Features</span>
            <h2 style={{ fontSize: '2.6rem', fontWeight: 700, color: '#1D1D1F', lineHeight: 1.1 }}>
              Built for Speed. Designed for Precision.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px' }} className="grid-5">
            {[
              { title: 'Live Recalculations', desc: 'Update machinery or investment variables and see instant updates across P&L, Balance Sheet, and ratios.' },
              { title: 'Audit-Ready Models', desc: 'Financial calculations structured according to RBI lending guidelines and CA norms.' },
              { title: 'Standardized Formats', desc: 'Generates clean, well-aligned DOCX reports ready for submission without manual formatting hassle.' },
              { title: 'Multi-Sector Intelligence', desc: 'Pre-configured schemas for Dairy, Food Processing, Solar, Manufacturing, Textiles, and more.' },
              { title: 'One-Click Exports', desc: 'Export fully formatted Word documents with customizable VKF co-branding or sole business logo.' }
            ].map((ft, idx) => (
              <div key={idx} style={{
                paddingTop: '20px',
                borderTop: '2.5px solid #0071E3',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1D1D1F', margin: 0 }}>{ft.title}</h3>
                <p style={{ fontSize: '0.92rem', color: '#86868B', lineHeight: 1.6, margin: 0 }}>{ft.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. INTERACTIVE DASHBOARD SECTION ("Why Digital") */}
      <section id="why-digital" style={{ padding: '100px 24px', background: '#FFFFFF', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'end', marginBottom: '48px' }}>
            <div>
              <span className="apple-kicker">Interactive Financial Simulator</span>
              <h2 style={{ fontSize: '2.6rem', fontWeight: 700, color: '#1D1D1F', lineHeight: 1.1 }}>
                Experience Real-Time Calculation Engine
              </h2>
            </div>
            <p style={{ fontSize: '1.08rem', color: '#515154', lineHeight: 1.6 }}>
              Adjust the machinery cost slider below to see how our engine automatically updates P&L projections, DSCR coverage, and term loan limits live.
            </p>
          </div>

          {/* Dashboard Outer Container */}
          <div className="dash-grid" style={{
            background: '#F5F5F7',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '24px',
            display: 'grid',
            gridTemplateColumns: '320px 1fr',
            overflow: 'hidden',
            boxShadow: '0 24px 48px -20px rgba(0, 0, 0, 0.12)'
          }}>
            
            {/* Left Tabs */}
            <div style={{ borderRight: '1px solid rgba(0, 0, 0, 0.06)', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
              {[
                { id: 'projections', label: 'Projections', desc: '5-year Profit & Loss forecast' },
                { id: 'ratios', label: 'Key Ratios', desc: 'DSCR, Debt-Equity & Margins' },
                { id: 'repayments', label: 'Loan Repayments', desc: 'Principal & Interest amortization' },
                { id: 'sensitivities', label: 'Sensitivity Analysis', desc: 'Break-even & capacity utilization' }
              ].map((tab) => {
                const isSelected = activeDashTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    className="dash-tab-btn-apple"
                    aria-selected={isSelected}
                    onClick={() => setActiveDashTab(tab.id as any)}
                  >
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: isSelected ? '#0071E3' : '#F5F5F7',
                      color: isSelected ? '#FFFFFF' : '#1D1D1F',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      📊
                    </div>
                    <div>
                      <b style={{ fontSize: '0.98rem', color: '#1D1D1F' }}>{tab.label}</b>
                      <span style={{ fontSize: '0.8rem', color: '#86868B', display: 'block', marginTop: '2px' }}>{tab.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Interactive Display Panel */}
            <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
              
              {/* Interactive Slider Input */}
              <div style={{
                background: '#FFFFFF',
                padding: '24px',
                borderRadius: '18px',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <label style={{ fontWeight: 600, color: '#1D1D1F', fontSize: '1rem' }}>
                    Adjust Machinery Investment Cost:
                  </label>
                  <span style={{ fontFamily: 'SF Mono, monospace', fontSize: '1.25rem', fontWeight: 700, color: '#0071E3' }}>
                    ₹ {machineryCost} Lakhs
                  </span>
                </div>
                
                <input
                  type="range"
                  min="20"
                  max="150"
                  step="5"
                  value={machineryCost}
                  onChange={(e) => setMachineryCost(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0071E3', cursor: 'pointer' }}
                />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#86868B', marginTop: '8px', fontFamily: 'SF Mono, monospace' }}>
                  <span>₹20 Lakhs</span>
                  <span>₹80 Lakhs</span>
                  <span>₹150 Lakhs</span>
                </div>
              </div>

              {/* Dynamic Live Calculated Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '0.76rem', color: '#86868B', fontWeight: 500 }}>Total Project Cost</div>
                  <div style={{ fontFamily: 'SF Mono, monospace', fontSize: '1.2rem', fontWeight: 700, color: '#1D1D1F', marginTop: '4px' }}>
                    ₹{totalProjectCost}L
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '0.76rem', color: '#86868B', fontWeight: 500 }}>Bank Loan (70%)</div>
                  <div style={{ fontFamily: 'SF Mono, monospace', fontSize: '1.2rem', fontWeight: 700, color: '#1D1D1F', marginTop: '4px' }}>
                    ₹{termLoan}L
                  </div>
                </div>

                <div style={{ background: 'rgba(0, 113, 227, 0.06)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(0, 113, 227, 0.12)' }}>
                  <div style={{ fontSize: '0.76rem', color: '#0071E3', fontWeight: 500 }}>Eligible Subsidy</div>
                  <div style={{ fontFamily: 'SF Mono, monospace', fontSize: '1.2rem', fontWeight: 700, color: '#0071E3', marginTop: '4px' }}>
                    ₹{govtSubsidy}L
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '0.76rem', color: '#86868B', fontWeight: 500 }}>Average DSCR</div>
                  <div style={{ fontFamily: 'SF Mono, monospace', fontSize: '1.2rem', fontWeight: 700, color: '#1D1D1F', marginTop: '4px' }}>
                    {avgDscr}x
                  </div>
                </div>
              </div>

              {/* Data Table / Tab Details */}
              <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1D1D1F', margin: '0 0 16px' }}>
                  {activeDashTab === 'projections' && '5-Year Projected Profitability Overview'}
                  {activeDashTab === 'ratios' && 'Financial Risk & Debt Service Coverage'}
                  {activeDashTab === 'repayments' && 'Loan Debt Amortization Schedule'}
                  {activeDashTab === 'sensitivities' && 'Capacity Utilization & Sensitivity Thresholds'}
                </h4>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', textAlign: 'left' }}>
                      <th style={{ padding: '10px 0', color: '#1D1D1F', fontWeight: 600 }}>Particulars (₹ Lakhs)</th>
                      <th style={{ padding: '10px 0', color: '#1D1D1F', fontWeight: 600 }}>Year 1</th>
                      <th style={{ padding: '10px 0', color: '#1D1D1F', fontWeight: 600 }}>Year 3</th>
                      <th style={{ padding: '10px 0', color: '#1D1D1F', fontWeight: 600 }}>Year 5</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <td style={{ padding: '12px 0', fontWeight: 500 }}>Gross Turnover</td>
                      <td style={{ padding: '12px 0', fontFamily: 'SF Mono, monospace' }}>₹{(machineryCost * 1.8).toFixed(1)}L</td>
                      <td style={{ padding: '12px 0', fontFamily: 'SF Mono, monospace' }}>₹{(machineryCost * 2.9).toFixed(1)}L</td>
                      <td style={{ padding: '12px 0', fontFamily: 'SF Mono, monospace' }}>₹{(machineryCost * 3.8).toFixed(1)}L</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <td style={{ padding: '12px 0', fontWeight: 500 }}>Operating Expenses</td>
                      <td style={{ padding: '12px 0', fontFamily: 'SF Mono, monospace' }}>₹{(machineryCost * 1.2).toFixed(1)}L</td>
                      <td style={{ padding: '12px 0', fontFamily: 'SF Mono, monospace' }}>₹{(machineryCost * 1.8).toFixed(1)}L</td>
                      <td style={{ padding: '12px 0', fontFamily: 'SF Mono, monospace' }}>₹{(machineryCost * 2.3).toFixed(1)}L</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 0', fontWeight: 700, color: '#0071E3' }}>Projected Net Profit</td>
                      <td style={{ padding: '12px 0', fontFamily: 'SF Mono, monospace', fontWeight: 700, color: '#0071E3' }}>₹{(machineryCost * 0.38).toFixed(1)}L</td>
                      <td style={{ padding: '12px 0', fontFamily: 'SF Mono, monospace', fontWeight: 700, color: '#0071E3' }}>₹{netProfitYr3}L</td>
                      <td style={{ padding: '12px 0', fontFamily: 'SF Mono, monospace', fontWeight: 700, color: '#0071E3' }}>₹{(machineryCost * 1.15).toFixed(1)}L</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 8.5 SUPPORTED BUSINESS SECTORS SECTION (ROLLING BANNER) */}
      <section id="supported-sectors" style={{ padding: '100px 24px', background: '#F5F5F7', borderTop: '1px solid rgba(0, 0, 0, 0.06)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
          
          {/* Centered Header Row */}
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
            <span className="apple-kicker">Supported Business Sectors</span>
            <h2 style={{ fontSize: '3rem', fontWeight: 700, color: '#1D1D1F', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
              Built for Every Business Sector
            </h2>
            <p style={{ fontSize: '1.12rem', color: '#515154', lineHeight: 1.6, marginTop: '12px' }}>
              Our AI engine generates institutional-grade Detailed Project Reports tailored to specific industry norms, machinery heads, and benchmark operational metrics.
            </p>
          </div>

          {/* Rolling Track Container Wrapper with Floating Side Navigation Arrows */}
          <div style={{ position: 'relative', padding: '0 8px' }}>
            
            {/* Left Floating Arrow Button */}
            <button
              type="button"
              onClick={() => scrollSectorTrack('left')}
              aria-label="Scroll left"
              style={{
                position: 'absolute',
                left: '-18px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 20,
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1.5px solid rgba(0, 0, 0, 0.12)',
                color: '#1D1D1F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.2s ease'
              }}
            >
              &larr;
            </button>

            {/* Right Floating Arrow Button */}
            <button
              type="button"
              onClick={() => scrollSectorTrack('right')}
              aria-label="Scroll right"
              style={{
                position: 'absolute',
                right: '-18px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 20,
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1.5px solid rgba(0, 0, 0, 0.12)',
                color: '#1D1D1F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.3rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.2s ease'
              }}
            >
              &rarr;
            </button>

            {/* Rolling Track Container */}
            <div
              ref={sectorTrackRef}
              className="no-scrollbar"
              onMouseEnter={() => setIsSectorAutoRolling(false)}
              onMouseLeave={() => setIsSectorAutoRolling(true)}
              style={{
                display: 'flex',
                gap: '24px',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                padding: '12px 6px 24px',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {[
                {
                  id: 'manufacturing',
                  title: 'Manufacturing & Engineering',
                  image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80',
                  badge: 'High Demand',
                  desc: 'Auto components, metal fabrication, CNC machining, plastic molding, packaging, and industrial tools.',
                  activities: ['Raw Material BOQ', 'Plant & Machinery Capex', 'Capacity & Shift Planning', 'Power & Utility Load']
                },
                {
                  id: 'food_processing',
                  title: 'Food Processing & Agro',
                  image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
                  badge: 'PMEGP / PMFME Ready',
                  desc: 'Flour & rice mills, spice grinding, cold storage, dairy processing, fruit pulp, and edible oil units.',
                  activities: ['FSSAI & Quality Capex', 'Seasonal Crop Working Capital', 'Cold Storage Logistics', 'Yield Loss Projections']
                },
                {
                  id: 'agriculture',
                  title: 'Agriculture & Farming',
                  image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600&auto=format&fit=crop&q=80',
                  badge: 'AIF Eligible',
                  desc: 'Hydroponics, hi-tech greenhouse farming, poultry & dairy farming, polyhouses, and organic fertilizer.',
                  activities: ['Land Prep & Irrigation', 'Crop Cycle Revenue Schedule', 'Subsidy Margin Breakdown', 'Polyhouse Capex']
                },
                {
                  id: 'textile',
                  title: 'Textile & Garments',
                  image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=600&auto=format&fit=crop&q=80',
                  badge: 'Export Focus',
                  desc: 'Garment manufacturing, weaving & spinning mills, silk processing, readymade apparel, and embroidery.',
                  activities: ['Loom & Sewing Capex', 'Yarn & Fabric Working Capital', 'Labor & Overhead Schedule', 'Order Execution Cycle']
                },
                {
                  id: 'healthcare',
                  title: 'Healthcare & Pharma',
                  image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
                  badge: 'NABH / ISO Standards',
                  desc: 'Diagnostic centers, medical device manufacturing, pharma formulation, specialty hospitals, and AYUSH.',
                  activities: ['Medical Equipment Capex', 'Cleanroom Installation', 'Consumables Inventory', 'Bed Capacity & Utilization']
                },
                {
                  id: 'it_services',
                  title: 'IT & Software Services',
                  image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80',
                  badge: 'Fast Sanction',
                  desc: 'SaaS products, IT consulting, hardware assembly, data centers, and AI/ML tech solutions.',
                  activities: ['Cloud & Workstation Capex', 'Software Talent Cost Model', 'SaaS Recurring Revenue', 'IP & License Valuation']
                },
                {
                  id: 'renewable_energy',
                  title: 'Renewable Energy & EV',
                  image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
                  badge: 'PM-KUSUM Ready',
                  desc: 'Rooftop & ground solar plants, EV charging hubs, battery swapping stations, and biomass pellets.',
                  activities: ['PPA Tariff Calculations', 'Solar Panel & Inverter BOQ', 'Degradation & Maintenance', 'Grid Connection Expenses']
                },
                {
                  id: 'tourism',
                  title: 'Tourism & Hospitality',
                  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
                  badge: 'State Policy Eligible',
                  desc: 'Eco-resorts, boutique hotels, theme parks, wellness sanctuaries, and adventure tourism setups.',
                  activities: ['Room Capex & Interiors', 'Seasonality Occupancy Rate', 'F&B Revenue Breakdown', 'Property Lease Schedules']
                },
                {
                  id: 'infrastructure',
                  title: 'Infrastructure & Logistics',
                  image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
                  badge: 'Institutional Scale',
                  desc: 'Logistics hubs, dry warehouses, cold chain networks, commercial spaces, and transport fleets.',
                  activities: ['Warehouse Construction BOQ', 'Fleet Capex & Maintenance', 'Lease Rental Discounting', 'Throughput Capacity']
                },
                {
                  id: 'services',
                  title: 'Commercial Services',
                  image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
                  badge: 'MSME Approved',
                  desc: 'Educational institutes, fitness chains, retail supermarkets, automated laundromats, and co-working spaces.',
                  activities: ['Fit-out & Interior Capex', 'Membership & Fee Cashflows', 'Working Capital Cycle', 'Staff Payroll Structure']
                },
                {
                  id: 'custom',
                  title: 'Custom & Emerging Sectors',
                  image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
                  badge: 'Tailored Model',
                  desc: 'Tailored DPR structures for unique business models, novel technologies, and specialized ventures.',
                  activities: ['Custom Capex Builder', 'Variable Cost Drivers', 'Flexible DSCR Calculator', 'Dynamic Revenue Scenarios']
                }
              ].map((sec) => (
                <div
                  key={sec.id}
                  className="apple-bento-card"
                  style={{
                    flex: '0 0 350px',
                    minWidth: '350px',
                    maxWidth: '350px',
                    scrollSnapAlign: 'start',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: '#FFFFFF',
                    borderRadius: '24px',
                    padding: '0',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  {/* Sector Image Header Banner */}
                  <div style={{ position: 'relative', width: '100%', height: '175px', overflow: 'hidden', background: '#123B4A' }}>
                    <img
                      src={sec.image}
                      alt={sec.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                      className="sector-img"
                    />
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)'
                    }} />
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      background: 'rgba(0, 113, 227, 0.85)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}>
                      {sec.badge}
                    </span>
                    <h3 style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '18px',
                      right: '18px',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      margin: 0,
                      lineHeight: 1.25,
                      textShadow: '0 2px 4px rgba(0,0,0,0.4)'
                    }}>
                      {sec.title}
                    </h3>
                  </div>

                  {/* Card Content Body */}
                  <div style={{ padding: '24px 22px 24px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, marginBottom: '18px', minHeight: '42px' }}>
                        {sec.desc}
                      </p>

                      <div style={{ borderTop: '1px dashed rgba(0,0,0,0.1)', paddingTop: '14px', marginBottom: '20px' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#86868B', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
                          Key DPR Sections & Analysis:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {sec.activities.map((act, idx) => (
                            <span key={idx} style={{
                              fontSize: '0.74rem',
                              background: '#F5F5F7',
                              color: '#424245',
                              padding: '4px 9px',
                              borderRadius: '6px',
                              fontWeight: 500
                            }}>
                              {act}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        sessionStorage.setItem('dpr_selected_sector', sec.id);
                        saveSelection(selectedRouteKey);
                        if (isLeadCaptured()) {
                          setIsPlansModalOpen(true);
                        } else {
                          setIsAuthModalOpen(true);
                        }
                      }}
                      className="apple-btn-secondary"
                      style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.88rem', borderRadius: '12px' }}
                    >
                      Generate {sec.title.split(' ')[0]} DPR &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 9.5 FUNDING ROUTES & PROJECT-SIZE DPR PLANS SECTION (FROM vkf-funding-plans.html) */}
      <section id="pricing" style={{ padding: '90px 24px 100px', background: 'linear-gradient(180deg, #F4FBFC 0%, #FFFFFF 46%)', borderTop: '1px solid rgba(0, 0, 0, 0.08)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          {/* SECTION HEAD */}
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.03em', margin: 0, lineHeight: 1.15 }}>
              Choose your <em style={{ fontStyle: 'normal', color: '#FF7A00' }}>funding route</em>
            </h2>
            <p style={{ fontSize: '1.12rem', color: '#515154', marginTop: '14px', maxWidth: '640px', margin: '14px auto 0', lineHeight: 1.55 }}>
              Select how you plan to raise capital for your project. On the next screen, pick a DPR plan sized for your project.
            </p>
            <div style={{ display: 'inline-flex', flexWrap: 'wrap', justifyContent: 'center', gap: '6px 12px', alignItems: 'center', background: '#123B4A', color: '#FFFFFF', borderRadius: '9999px', padding: '10px 24px', marginTop: '24px', fontSize: '0.82rem', fontWeight: 700 }}>
              <span>3 Funding Routes</span> <i style={{ fontStyle: 'normal', opacity: 0.6 }}>•</i> <span>Prices start at ₹3,999</span>
            </div>
          </div>

          {/* 3 ROUTE CARDS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', alignItems: 'stretch' }}>
            {[
              {
                id: 'govt' as const,
                label: 'Govt Schemes',
                tag: 'GOVT SCHEMES & SUBSIDIES',
                title: 'PMEGP, PMFME & State Policies',
                accentColor: '#008C95',
                bgSoft: '#F0FDFA',
                borderSoft: '#CCFBF1',
                btnGradient: 'linear-gradient(135deg, #008C95 0%, #006F78 100%)',
                icon: 'fa-landmark',
                desc: 'For entrepreneurs applying for government grants, margin money, or capital subsidies.',
                checks: [
                  'Scheme-compliant DPR format & layout',
                  'Subsidy eligibility & margin money breakup',
                  'Lender & nodal agency submission ready',
                  'Detailed 5–10 year financial projections'
                ],
                projectSizeText: 'Project sizes from ₹5L to ₹25Cr+',
                modalTitle: 'Govt Scheme & Subsidy DPR Plans',
                prices: { entry: 3999, core: 7999, team: 14999 }
              },
              {
                id: 'bank' as const,
                label: 'Bank Loans',
                tag: 'BANK & NBFC LOANS',
                title: 'Term Loan & Working Capital',
                accentColor: '#FF7A00',
                bgSoft: '#FFF7ED',
                borderSoft: '#FFEDD5',
                btnGradient: 'linear-gradient(135deg, #FF7A00 0%, #EA580C 100%)',
                icon: 'fa-building-columns',
                desc: 'For businesses seeking debt financing from public, private, or co-operative banks.',
                checks: [
                  'Bankable DPR with Credit Appraisal norms',
                  'DSCR, DE ratio & Tandon Committee checks',
                  '36-month cash flow & CMA-style schedules',
                  'IRR, NPV, BEP & sensitivity analysis'
                ],
                projectSizeText: 'Project sizes from ₹5L to ₹25Cr+',
                modalTitle: 'Bank & NBFC Loan DPR Plans',
                prices: { entry: 3999, core: 7999, team: 14999 }
              },
              {
                id: 'inv' as const,
                label: 'Investor Pitch',
                tag: 'INVESTOR FUNDING',
                title: 'Pitch DPR & Equity Expansion',
                accentColor: '#0071E3',
                bgSoft: '#F0F7FF',
                borderSoft: '#D0E3FF',
                btnGradient: 'linear-gradient(135deg, #0071E3 0%, #005BB5 100%)',
                icon: 'fa-chart-line',
                desc: 'For startups & MSMEs pitching to angel investors, VC funds, or strategic partners.',
                checks: [
                  'Investor-grade executive summary & deck',
                  'Unit economics, CAC & LTV projections',
                  'Valuation benchmarks & cap table summary',
                  'Use of funds & exit strategy outline'
                ],
                projectSizeText: 'Project sizes from ₹5L to ₹25Cr+',
                modalTitle: 'Investor Pitch DPR Plans',
                prices: { entry: 4999, core: 9999, team: 19999 }
              }
            ].map((route) => (
              <div
                key={route.id}
                style={{
                  background: '#FFFFFF',
                  border: `1.5px solid ${route.borderSoft}`,
                  borderRadius: '24px',
                  padding: '32px 28px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                }}
              >
                <div>
                  {/* Icon Badge & Tag */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: route.bgSoft, border: `1px solid ${route.borderSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: route.accentColor, fontSize: '1.25rem' }}>
                      <i className={`fas ${route.icon}`} />
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: route.accentColor, background: route.bgSoft, padding: '4px 12px', borderRadius: '9999px', border: `1px solid ${route.borderSoft}` }}>
                      {route.tag}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#123B4A', margin: '0 0 10px 0', lineHeight: 1.25 }}>
                    {route.title}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5, marginBottom: '22px' }}>
                    {route.desc}
                  </p>

                  {/* Checklist */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {route.checks.map((chk, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.84rem', color: '#334155', lineHeight: 1.4 }}>
                        <i className="fas fa-check-circle" style={{ color: route.accentColor, marginTop: '3px', flexShrink: 0, fontSize: '0.9rem' }} />
                        <span>{chk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer Action */}
                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px', marginTop: '12px' }}>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span>Project size range</span>
                    <strong style={{ color: '#123B4A', fontWeight: 800 }}>₹5L to ₹25Cr+</strong>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedRouteKey(route.id);
                      saveSelection(route.id);
                      if (isLeadCaptured()) {
                        setIsPlansModalOpen(true);
                      } else {
                        setIsAuthModalOpen(true);
                      }
                    }}
                    style={{
                      width: '100%',
                      background: route.btnGradient,
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0.85rem 1.4rem',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.6rem',
                      boxShadow: `0 8px 20px ${route.accentColor}33`,
                      transition: 'all 0.25s ease',
                    }}
                  >
                    View Plans by Project Size <i className="fas fa-arrow-right" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECT SIZE PLANS MODAL DIALOG SHEET */}
      {isPlansModalOpen && (
        <div
          onClick={() => setIsPlansModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
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
              width: 'min(1200px, 100%)',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '2rem 2.2rem 2.2rem',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              border: '1px solid #E2E8F0',
            }}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setIsPlansModalOpen(false)}
              aria-label="Close dialog"
              style={{
                position: 'absolute',
                top: '1.2rem',
                right: '1.2rem',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1.5px solid #CBD5E1',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <i className="fas fa-times" />
            </button>

            {/* Modal Header & Route Switcher Tabs */}
            <div style={{ marginBottom: '1.8rem', paddingRight: '2.5rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1rem' }}>
                {[
                  { id: 'govt' as const, label: 'Govt Schemes', icon: 'fa-landmark', accentColor: '#008C95', bgSoft: '#F0FDFA', modalTitle: 'Govt Scheme & Subsidy DPR Plans' },
                  { id: 'bank' as const, label: 'Bank Loans', icon: 'fa-building-columns', accentColor: '#FF7A00', bgSoft: '#FFF7ED', modalTitle: 'Bank & NBFC Loan DPR Plans' },
                  { id: 'inv' as const, label: 'Investor Pitch', icon: 'fa-chart-line', accentColor: '#0071E3', bgSoft: '#F0F7FF', modalTitle: 'Investor Pitch DPR Plans' }
                ].map((rt) => {
                  const isActive = selectedRouteKey === rt.id;
                  return (
                    <button
                      key={rt.id}
                      onClick={() => {
                        setSelectedRouteKey(rt.id);
                        saveSelection(rt.id);
                      }}
                      style={{
                        background: isActive ? rt.bgSoft : '#FFFFFF',
                        border: isActive ? `2px solid ${rt.accentColor}` : '1.5px solid #CBD5E1',
                        color: isActive ? rt.accentColor : '#64748B',
                        padding: '0.45rem 1.1rem',
                        borderRadius: '9999px',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <i className={`fas ${rt.icon}`} style={{ fontSize: '0.8rem' }} />
                      {rt.label}
                    </button>
                  );
                })}
              </div>

              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#123B4A', margin: '0 0 6px 0', lineHeight: 1.2 }}>
                {selectedRouteKey === 'govt' ? 'Govt Scheme & Subsidy DPR Plans' : selectedRouteKey === 'bank' ? 'Bank & NBFC Loan DPR Plans' : 'Investor Pitch DPR Plans'}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#64748B', margin: 0 }}>
                Prices are per DPR report. Choose the plan that matches your project investment size:
              </p>
            </div>

            {/* 4 PROJECT-SIZE PLANS GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', alignItems: 'stretch' }}>
              {[
                {
                  id: 'entry',
                  name: 'Entry',
                  sub: 'Early-stage projects',
                  size: '₹5L – ₹25L',
                  cta: 'Create DPR',
                  desc: 'A standard DPR for early-stage projects and smaller funding requirements.',
                  inc: [
                    'Basic support',
                    'Business / project profile',
                    'Executive summary',
                    'Market & project overview',
                    'Basic financial projections',
                    'Cost & funding requirement',
                    'Implementation plan',
                    'Basic risk assessment'
                  ]
                },
                {
                  id: 'core',
                  name: 'Core',
                  sub: 'Growing businesses',
                  size: '₹25L – ₹1Cr',
                  cta: 'Create DPR',
                  desc: 'A complete DPR with projections and funding analysis for growing businesses.',
                  inc: [
                    'Standard support',
                    'Executive summary & profile',
                    'Market & competitor analysis',
                    'Detailed financial projections',
                    'Revenue & expense assumptions',
                    'Funding requirement analysis',
                    'Break-even analysis',
                    'Repayment / viability analysis',
                    'Risk & mitigation section'
                  ]
                },
                {
                  id: 'team',
                  name: 'Team',
                  sub: 'Growth-stage businesses & MSMEs',
                  size: '₹1Cr – ₹5Cr',
                  cta: 'Create Advanced DPR',
                  badge: 'MOST USED',
                  desc: 'Advanced DPR with detailed financial analysis and funding requirement analysis.',
                  inc: [
                    'Priority support',
                    'Detailed project & market analysis',
                    'Detailed financial projections',
                    'Cash-flow analysis',
                    'Profitability & break-even analysis',
                    'DSCR / repayment analysis',
                    'Funding requirement analysis',
                    'Risk matrix & mitigation plan',
                    'Implementation milestone plan',
                    'Revision support'
                  ]
                },
                {
                  id: 'ent',
                  name: 'Enterprise',
                  sub: 'Established & large businesses',
                  size: '₹5Cr – ₹25Cr+',
                  cta: 'Contact Team',
                  contact: true,
                  desc: 'Custom DPR depth, detailed projections and analysis based on project scope.',
                  inc: [
                    'Dedicated support',
                    'Detailed business & market analysis',
                    '10-year financial projections',
                    'Detailed cash-flow analysis',
                    'DSCR & repayment analysis',
                    'BOQ / capex schedules',
                    'Funding & capital structure',
                    'Risk matrix & mitigation plan',
                    'Customized lender analysis'
                  ]
                }
              ].map((plan) => {
                const routePrices: Record<string, Record<string, number>> = {
                  govt: { entry: 3999, core: 7999, team: 14999 },
                  bank: { entry: 3999, core: 7999, team: 14999 },
                  inv: { entry: 4999, core: 9999, team: 19999 },
                };
                const accentColors: Record<string, string> = {
                  govt: '#008C95',
                  bank: '#FF7A00',
                  inv: '#0071E3',
                };
                const bgSofts: Record<string, string> = {
                  govt: '#F0FDFA',
                  bank: '#FFF7ED',
                  inv: '#F0F7FF',
                };
                const borderSofts: Record<string, string> = {
                  govt: '#CCFBF1',
                  bank: '#FFEDD5',
                  inv: '#D0E3FF',
                };

                const accentColor = accentColors[selectedRouteKey];
                const bgSoft = bgSofts[selectedRouteKey];
                const borderSoft = borderSofts[selectedRouteKey];
                const planPrice = routePrices[selectedRouteKey]?.[plan.id];
                const isFeatured = plan.id === 'team';

                return (
                  <div
                    key={plan.id}
                    style={{
                      background: '#FFFFFF',
                      border: isFeatured ? `2.5px solid ${accentColor}` : '1.5px solid #E2E8F0',
                      borderTop: `4px solid ${isFeatured ? accentColor : plan.id === 'entry' ? '#36B5B8' : plan.id === 'core' ? '#0071E3' : '#7256C9'}`,
                      borderRadius: '20px',
                      padding: '1.6rem 1.4rem 1.4rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      boxShadow: isFeatured ? `0 12px 30px ${accentColor}25` : '0 4px 15px rgba(0, 0, 0, 0.03)',
                    }}
                  >
                    {plan.badge && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-13px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: accentColor,
                          color: '#FFFFFF',
                          padding: '3px 14px',
                          borderRadius: '9999px',
                          fontSize: '0.68rem',
                          fontWeight: 900,
                          letterSpacing: '0.06em',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {plan.badge}
                      </div>
                    )}

                    <div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#123B4A', marginBottom: '2px' }}>
                        {plan.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600, minHeight: '32px', marginBottom: '12px' }}>
                        {plan.sub}
                      </div>

                      {/* Price Badge */}
                      <div style={{ marginBottom: '12px' }}>
                        {plan.contact ? (
                          <div style={{ display: 'inline-block', padding: '6px 14px', borderRadius: '12px', background: '#F1F5F9', color: '#334155', fontWeight: 800, fontSize: '1.25rem' }}>
                            Custom Scope
                          </div>
                        ) : (
                          <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '4px', padding: '6px 14px', borderRadius: '12px', background: bgSoft, border: `1px solid ${borderSoft}`, color: accentColor, fontWeight: 900, fontSize: '1.45rem' }}>
                            ₹{planPrice?.toLocaleString('en-IN')}
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B' }}>/ DPR</span>
                          </div>
                        )}
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, marginTop: '6px' }}>
                          For projects of <strong style={{ color: '#123B4A' }}>{plan.size}</strong>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.45, marginBottom: '16px', minHeight: '40px' }}>
                        {plan.desc}
                      </p>

                      {/* CTA Button */}
                      <button
                        type="button"
                        onClick={() => {
                          saveSelection(selectedRouteKey, plan.id);
                          setIsPlansModalOpen(false);
                          const activeSess = pendingSession || (typeof window !== 'undefined' && sessionStorage.getItem('dpr_session') ? JSON.parse(sessionStorage.getItem('dpr_session')!) : null);
                          if (activeSess) {
                            onLoginSuccess(activeSess);
                          } else {
                            setIsAuthModalOpen(true);
                          }
                        }}
                        style={{
                          width: '100%',
                          background: plan.contact ? '#F1F5F9' : isFeatured ? `linear-gradient(135deg, ${accentColor} 0%, #006F78 100%)` : 'linear-gradient(135deg, #123B4A 0%, #006F78 100%)',
                          color: plan.contact ? '#1E293B' : '#FFFFFF',
                          border: plan.contact ? '1.5px solid #CBD5E1' : 'none',
                          borderRadius: '12px',
                          padding: '0.75rem 1rem',
                          fontWeight: 800,
                          fontSize: '0.86rem',
                          cursor: 'pointer',
                          marginBottom: '16px',
                          boxShadow: !plan.contact && isFeatured ? `0 6px 18px ${accentColor}35` : 'none',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {plan.cta}
                      </button>
                    </div>

                    {/* Includes List */}
                    <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '14px', marginTop: '10px' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#008C95', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>
                        INCLUDES
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {plan.inc.map((item, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.76rem', color: '#334155', lineHeight: 1.35 }}>
                            <i className="fas fa-check" style={{ color: '#008C95', fontSize: '0.7rem', marginTop: '3px', flexShrink: 0 }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 9.5. AUTO & GATED AUTH POPUP MODAL */}
      {isAuthModalOpen && (
        <div
          onClick={() => setIsAuthModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.72)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 20000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '28px',
              width: 'min(500px, 94vw)',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '2.2rem 2.2rem 2.4rem',
              boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.35)',
              position: 'relative',
              border: '1.5px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsAuthModalOpen(false)}
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
              <i className="fas fa-times" />
            </button>

            {/* Modal Header */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem', paddingRight: '1rem' }}>
              <img src="/VKF_logo.png" alt="VKF Logo" style={{ height: '44px', margin: '0 auto 10px', display: 'block' }} />
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#123B4A', margin: '0 0 6px 0', lineHeight: 1.2 }}>
                {popupAuthMode === 'login' ? 'Sign In to Continue' : 'Create Your DPR Account'}
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
                Sign in or register to select pricing plans and build your bankable DPR report.
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div style={{ display: 'flex', gap: '8px', background: '#F1F5F9', padding: '4px', borderRadius: '9999px', marginBottom: '1.6rem' }}>
              <button
                type="button"
                onClick={() => setPopupAuthMode('login')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: popupAuthMode === 'login' ? '#0071E3' : 'transparent',
                  color: popupAuthMode === 'login' ? '#FFFFFF' : '#64748B',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setPopupAuthMode('register')}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: popupAuthMode === 'register' ? '#0071E3' : 'transparent',
                  color: popupAuthMode === 'register' ? '#FFFFFF' : '#64748B',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Sign Up
              </button>
            </div>

            {/* Auth Form Card */}
            {popupAuthMode === 'login' ? (
              <LoginCard
                onLoginSuccess={(sess) => {
                  sessionStorage.setItem('dpr_lead_captured', 'true');
                  sessionStorage.setItem('dpr_session', JSON.stringify(sess));
                  setPendingSession(sess);
                  setIsAuthModalOpen(false);
                  setIsPlansModalOpen(true);
                }}
                onSwitchToRegister={() => setPopupAuthMode('register')}
              />
            ) : (
              <RegisterCard
                onRegisterSuccess={(sess) => {
                  sessionStorage.setItem('dpr_lead_captured', 'true');
                  sessionStorage.setItem('dpr_session', JSON.stringify(sess));
                  setPendingSession(sess);
                  setIsAuthModalOpen(false);
                  setIsPlansModalOpen(true);
                }}
                onSwitchToLogin={() => setPopupAuthMode('login')}
              />
            )}
          </div>
        </div>
      )}

      {/* 10. GET IN TOUCH & AUTHENTICATION SECTION */}
      <section id="contact" style={{ padding: '100px 24px', background: '#F5F5F7', borderTop: '1px solid rgba(0, 0, 0, 0.08)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div className="two-col-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '64px', alignItems: 'start' }}>
            
            {/* Left Column: Connect with our team */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <span className="apple-kicker">Connect with our team</span>
              
              <h2 style={{ fontSize: '3rem', fontWeight: 700, color: '#1D1D1F', lineHeight: 1.05, letterSpacing: '-0.03em' }}>
                Tell us about your project.
              </h2>
              
              <p style={{ fontSize: '1.1rem', color: '#515154', lineHeight: 1.6 }}>
                Share your project details and requirements. Our advisory team will assist you in preparing a bankable DPR.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '1.05rem', fontWeight: 500, color: '#1D1D1F' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#FFFFFF', border: '1px solid rgba(0, 0, 0, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#0071E3' }}>
                    ✉️
                  </div>
                  <a href="mailto:support@infopaceindia.com" style={{ color: '#1D1D1F', textDecoration: 'none' }}>
                    support@infopaceindia.com
                  </a>
                </div>
              </div>

            </div>

            {/* Right Column: Contact & Auth Card */}
            <div style={{
              background: '#FFFFFF',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '28px',
              padding: '40px',
              boxShadow: '0 24px 48px -16px rgba(0, 0, 0, 0.12)'
            }}>
              
              {/* Card Mode Switcher Tabs */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(0, 0, 0, 0.06)', paddingBottom: '16px', marginBottom: '28px' }}>
                <button
                  onClick={() => setAuthView('inquiry')}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    background: authView === 'inquiry' ? '#0071E3' : 'transparent',
                    color: authView === 'inquiry' ? '#FFFFFF' : '#1D1D1F'
                  }}
                >
                  Send Inquiry
                </button>
                <button
                  onClick={() => setAuthView('login')}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    background: authView === 'login' ? '#0071E3' : 'transparent',
                    color: authView === 'login' ? '#FFFFFF' : '#1D1D1F'
                  }}
                >
                  Account Login
                </button>
                <button
                  onClick={() => setAuthView('register')}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    background: authView === 'register' ? '#0071E3' : 'transparent',
                    color: authView === 'register' ? '#FFFFFF' : '#1D1D1F'
                  }}
                >
                  Register
                </button>
              </div>

              {authView === 'inquiry' ? (
                <div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1D1D1F', margin: 0 }}>Get in touch</h3>
                  <p style={{ fontSize: '0.92rem', color: '#86868B', marginTop: '4px', marginBottom: '24px' }}>
                    Fields marked optional can be left blank.
                  </p>

                  {inquirySubmitted ? (
                    <div style={{ padding: '24px', background: 'rgba(52, 199, 89, 0.1)', borderRadius: '16px', border: '1px solid rgba(52, 199, 89, 0.2)', textAlign: 'center', color: '#248A3D', fontWeight: 600 }}>
                      ✅ Thank you! Your project details have been submitted. Our team will contact you shortly.
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      
                      {/* Row 1 */}
                      <div className="form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#1D1D1F', marginBottom: '6px' }}>Full name</label>
                          <input
                            type="text"
                            required
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="Enter your name"
                            className="apple-input"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#1D1D1F', marginBottom: '6px' }}>Business name <small style={{ fontWeight: 400, color: '#86868B' }}>(optional)</small></label>
                          <input type="text" placeholder="Enter business name" className="apple-input" />
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div className="form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#1D1D1F', marginBottom: '6px' }}>Email</label>
                          <input
                            type="email"
                            required
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="name@company.com"
                            className="apple-input"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#1D1D1F', marginBottom: '6px' }}>Phone</label>
                          <input
                            type="tel"
                            required
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            placeholder="+91 XXXXX XXXXX"
                            className="apple-input"
                          />
                        </div>
                      </div>

                      {/* Row 3 */}
                      <div className="form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#1D1D1F', marginBottom: '6px' }}>City <small style={{ fontWeight: 400, color: '#86868B' }}>(optional)</small></label>
                          <input type="text" placeholder="City" className="apple-input" />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, color: '#1D1D1F', marginBottom: '6px' }}>Business type <small style={{ fontWeight: 400, color: '#86868B' }}>(optional)</small></label>
                          <select className="apple-input" style={{ cursor: 'pointer' }}>
                            <option value="">Select business type</option>
                            <option value="manufacturing">Manufacturing</option>
                            <option value="services">Services</option>
                            <option value="agri">Dairy & Food Processing</option>
                            <option value="solar">Solar / Renewable Energy</option>
                            <option value="trading">Trading</option>
                          </select>
                        </div>
                      </div>

                      {/* DPR Purpose Radios */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 600, color: '#1D1D1F', marginBottom: '12px' }}>
                          What do you need the DPR for?
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                          {[
                            { id: 'bank_loan', label: 'Bank / NBFC loan' },
                            { id: 'govt_subsidy', label: 'Government scheme / subsidy' },
                            { id: 'investor', label: 'Investor funding' },
                            { id: 'not_sure', label: 'Not sure yet' }
                          ].map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setDprPurpose(item.id)}
                              className={`radio-pill-apple ${dprPurpose === item.id ? 'selected' : ''}`}
                            >
                              <span style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                border: dprPurpose === item.id ? '4px solid #0071E3' : '1.5px solid #86868B',
                                background: '#FFFFFF'
                              }}></span>
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <button type="submit" className="apple-btn-primary" style={{ marginTop: '8px', padding: '0.95rem', justifyContent: 'center', width: '100%', borderRadius: '14px' }}>
                        Send Message &rarr;
                      </button>

                    </form>
                  )}
                </div>
              ) : authView === 'login' ? (
                <LoginCard
                  onLoginSuccess={onLoginSuccess}
                  onSwitchToRegister={() => setAuthView('register')}
                />
              ) : (
                <RegisterCard
                  onRegisterSuccess={onLoginSuccess}
                  onSwitchToLogin={() => setAuthView('login')}
                />
              )}

            </div>

          </div>

        </div>
      </section>

      {/* 10.5. FAQ SECTION (AT END OF LANDING PAGE) */}
      <section id="faq" style={{ padding: '100px 24px', background: '#FFFFFF', borderTop: '1px solid rgba(0, 0, 0, 0.06)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          
          {/* Centered Heading */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 700, color: '#1D1D1F', lineHeight: 1.15, letterSpacing: '-0.03em', margin: 0 }}>
              Frequently Asked Questions
            </h2>
          </div>

          {/* Centered Accordion List with Dividers */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              {
                q: 'What is a Detailed Project Report (DPR)?',
                a: 'A Detailed Project Report is an official comprehensive document that details a enterprise setup, its capital expenditure heads, operational parameters, 10-year projected financials, and debt service viability for institutional sanction.'
              },
              {
                q: 'Who can use this DPR tool?',
                a: 'The DPR Studio is built for MSMEs, entrepreneurs, chartered accountants, and consultants preparing bank loans, subsidy applications, and investor presentations.'
              },
              {
                q: 'Which government subsidy schemes are supported?',
                a: 'The engine supports central and state government schemes including PMEGP, PMFME, State Industrial Policy capital subsidies, AIF, and PM-KUSUM.'
              },
              {
                q: 'What formats can I export my DPR to?',
                a: 'You can generate fully formatted Microsoft Word (.docx) documents with option for custom enterprise co-branding.'
              }
            ].map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div key={i} style={{
                  borderTop: '1px solid rgba(0, 0, 0, 0.08)',
                  borderBottom: i === 3 ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
                  padding: '24px 0'
                }}>
                  <div
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      gap: '20px'
                    }}
                  >
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1D1D1F', margin: 0 }}>
                      {faq.q}
                    </h3>
                    <button style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#1D1D1F',
                      color: '#FFFFFF',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}>
                      {isOpen ? '✕' : '+'}
                    </button>
                  </div>

                  {isOpen && (
                    <p style={{ marginTop: '16px', fontSize: '1.02rem', color: '#515154', lineHeight: 1.6, maxWidth: '820px' }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 11. FOOTER */}
      <footer style={{
        background: '#1D1D1F',
        color: '#FFFFFF',
        padding: '60px 24px 40px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src="/VKF_logo.png"
                alt="VKF DPR Logo"
                style={{ height: '48px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2))' }}
              />
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF' }}>DPRPro AI</div>
                <div style={{ fontSize: '0.78rem', color: '#86868B' }}>Create Professional DPR Reports in Less Time</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', fontSize: '0.9rem', color: '#A1A1A6' }}>
              <button onClick={() => scrollToSection('hero')} style={{ background: 'none', border: 'none', color: '#A1A1A6', cursor: 'pointer' }}>Home</button>
              <button onClick={() => scrollToSection('how-it-works')} style={{ background: 'none', border: 'none', color: '#A1A1A6', cursor: 'pointer' }}>Overview</button>
              <button onClick={() => scrollToSection('funding-needs')} style={{ background: 'none', border: 'none', color: '#A1A1A6', cursor: 'pointer' }}>Funding Needs</button>
              <button onClick={() => scrollToSection('supported-sectors')} style={{ background: 'none', border: 'none', color: '#A1A1A6', cursor: 'pointer' }}>Sectors</button>
              <button onClick={() => scrollToSection('why-digital')} style={{ background: 'none', border: 'none', color: '#A1A1A6', cursor: 'pointer' }}>Financial Studio</button>
              <button onClick={() => scrollToSection('pricing')} style={{ background: 'none', border: 'none', color: '#A1A1A6', cursor: 'pointer' }}>Pricing</button>
              <button onClick={() => scrollToSection('faq')} style={{ background: 'none', border: 'none', color: '#A1A1A6', cursor: 'pointer' }}>FAQ</button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#86868B' }}>
            <div>&copy; {new Date().getFullYear()} Vision Karnataka Foundation. All rights reserved.</div>
            <div>Institutional Grade DPR & Project Appraisal Engine.</div>
          </div>

        </div>
      </footer>
    </div>
  );
}

