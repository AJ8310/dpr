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

  React.useEffect(() => {
    // Pre-warm backend server silently on page load
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://dpr-0eje.onrender.com';
    fetch(`${apiBase.replace(/\/$/, '')}/health/live`).catch(() => {});
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
            <button onClick={() => scrollToSection('why-digital')} className="apple-nav-link">Financial Studio</button>
            <button onClick={() => scrollToSection('pricing')} className="apple-nav-link">Pricing</button>
            <button onClick={() => scrollToSection('faq')} className="apple-nav-link">FAQ</button>
          </nav>

          {/* Header Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={scrollToAuth} className="apple-btn-secondary" style={{ padding: '0.55rem 1.2rem', fontSize: '0.86rem' }}>
              Contact Team
            </button>
            <button onClick={() => { setAuthView('login'); scrollToAuth(); }} className="apple-btn-primary" style={{ padding: '0.55rem 1.3rem', fontSize: '0.86rem' }}>
              Create My DPR &rarr;
            </button>
          </div>
        </div>
      </header>

      {/* 2. APPLE STUDIO HERO SECTION */}
      <section id="hero" style={{ padding: '80px 24px 100px', position: 'relative', zIndex: 1 }}>
        <div className="hero-grid" style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: '48px', alignItems: 'center' }}>
          
          {/* Left Column Copy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Speed Badge */}
            <div style={{
              display: 'inline-flex',
              alignSelf: 'flex-start',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 16px',
              background: 'rgba(0, 113, 227, 0.08)',
              border: '1px solid rgba(0, 113, 227, 0.18)',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 500,
              backdropFilter: 'blur(10px)'
            }}>
              <span style={{ color: '#86868B', textDecoration: 'line-through' }}>3 weeks manual prep</span>
              <span style={{ color: '#0071E3', fontWeight: 600 }}>⚡ &lt; 10 mins flow</span>
            </div>

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
              <button onClick={() => { setAuthView('login'); scrollToAuth(); }} className="apple-btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '1.02rem' }}>
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
                  {/* VKF Logo Watermark Overlay (Bottom Right - Pure Logo without white box) */}
                  <img
                    src="/VKF.png"
                    alt="Vision Karnataka Foundation Logo"
                    style={{
                      position: 'absolute',
                      bottom: '24px',
                      right: '24px',
                      zIndex: 15,
                      height: '76px',
                      width: 'auto',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.65))',
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



      {/* 9.5 COMPLETE DPR PRICING SECTION (FROM dpr-pricing-page 5.html) */}
      <section id="pricing" style={{ padding: '100px 24px', background: 'linear-gradient(180deg, #F4FBFC 0%, #FFFFFF 46%)', borderTop: '1px solid rgba(0, 0, 0, 0.08)', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          {/* HERO HEADER */}
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.03em', margin: 0, lineHeight: 1.15 }}>
              Choose the DPR that fits your funding need
            </h2>
            <p style={{ fontSize: '1.15rem', color: '#66798A', marginTop: '14px', maxWidth: '720px', margin: '14px auto 0', lineHeight: 1.6 }}>
              Build professional Detailed Project Reports with financial projections, funding analysis and lender/investor-ready documentation.
            </p>
          </div>

          {/* 4 PLAN TIER CARDS GRID */}
          <div className="pricing-grid-responsive" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            alignItems: 'stretch',
            marginBottom: '72px'
          }}>

            {/* CARD 2: ENTRY */}
            <div style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FBFEFE 100%)',
              border: '1px solid #D8E3E8',
              borderTop: '4px solid #22A6B3',
              borderRadius: '18px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 5px 16px rgba(0, 65, 80, 0.04)'
            }}>
              <div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', color: '#102536', fontWeight: 800 }}>Entry</h3>
                <div style={{ color: '#66798A', fontSize: '0.78rem', minHeight: '34px', lineHeight: 1.4, fontWeight: 500 }}>Early-stage projects</div>
                <div style={{ display: 'inline-block', padding: '6px 12px', borderRadius: '10px', background: '#E5F8F7', color: '#007B86', fontWeight: 900, fontSize: '1.6rem', marginTop: '16px', marginBottom: '8px' }}>
                  ₹3,999 <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#66798A' }}>/ DPR</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#66798A', lineHeight: 1.5, margin: '8px 0 16px' }}>A standard DPR for early-stage projects and smaller funding requirements.</p>
                <button onClick={() => { setAuthView('register'); scrollToAuth(); }} className="apple-btn-secondary" style={{ width: '100%', padding: '0.7rem', fontSize: '0.86rem', justifyContent: 'center', borderRadius: '10px' }}>Create DPR</button>
              </div>
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '14px', marginTop: '16px' }}>
                <strong style={{ fontSize: '0.7rem', color: '#164E5B', letterSpacing: '0.4px', textTransform: 'uppercase' }}>INCLUDES</strong>
                <ul style={{ padding: 0, margin: '8px 0 0 0', listStyle: 'none', fontSize: '0.78rem', color: '#435B67' }}>
                  {['Standard DPR structure', '1 DPR', 'Basic support', 'Business / project profile', 'Executive summary', 'Market & project overview', 'Basic financial projections', 'Cost & funding requirement', 'Implementation plan', 'Basic risk assessment'].map((item, idx) => (
                    <li key={idx} style={{ margin: '6px 0', paddingLeft: '16px', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: '#008C95', fontWeight: 900 }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CARD 3: CORE (MOST USED FEATURED) */}
            <div style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FBFEFE 100%)',
              border: '2px solid #008C95',
              borderTop: '4px solid #3488D0',
              borderRadius: '18px',
              padding: '24px 20px',
              position: 'relative',
              boxShadow: '0 12px 30px rgba(0, 77, 91, 0.12)',
              transform: 'scale(1.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div style={{ position: 'absolute', top: '-13px', left: '18px', background: '#008C95', color: '#FFFFFF', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.68rem', fontWeight: 900, letterSpacing: '0.5px' }}>
                MOST USED
              </div>
              <div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', color: '#102536', fontWeight: 800 }}>Core</h3>
                <div style={{ color: '#66798A', fontSize: '0.78rem', minHeight: '34px', lineHeight: 1.4, fontWeight: 500 }}>Growing businesses</div>
                <div style={{ display: 'inline-block', padding: '6px 12px', borderRadius: '10px', background: '#EAF3FF', color: '#216DA9', fontWeight: 900, fontSize: '1.6rem', marginTop: '16px', marginBottom: '8px' }}>
                  ₹7,999 <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#66798A' }}>/ DPR</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#66798A', lineHeight: 1.5, margin: '8px 0 16px' }}>A complete DPR with projections and funding analysis for growing businesses.</p>
                <button onClick={() => { setAuthView('register'); scrollToAuth(); }} className="apple-btn-primary" style={{ width: '100%', padding: '0.7rem', fontSize: '0.86rem', justifyContent: 'center', borderRadius: '10px' }}>Create DPR</button>
              </div>
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '14px', marginTop: '16px' }}>
                <strong style={{ fontSize: '0.7rem', color: '#164E5B', letterSpacing: '0.4px', textTransform: 'uppercase' }}>INCLUDES</strong>
                <ul style={{ padding: 0, margin: '8px 0 0 0', listStyle: 'none', fontSize: '0.78rem', color: '#435B67' }}>
                  {['Complete DPR', '1 DPR', 'Standard support', 'Executive summary & profile', 'Market & competitor analysis', 'Detailed financial projections', 'Revenue & expense assumptions', 'Funding requirement analysis', 'Break-even analysis', 'Repayment / viability analysis', 'Risk & mitigation section'].map((item, idx) => (
                    <li key={idx} style={{ margin: '6px 0', paddingLeft: '16px', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: '#008C95', fontWeight: 900 }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CARD 4: TEAM */}
            <div style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FBFEFE 100%)',
              border: '1px solid #D8E3E8',
              borderTop: '4px solid #0B9B86',
              borderRadius: '18px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 5px 16px rgba(0, 65, 80, 0.04)'
            }}>
              <div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', color: '#102536', fontWeight: 800 }}>Team</h3>
                <div style={{ color: '#66798A', fontSize: '0.78rem', minHeight: '34px', lineHeight: 1.4, fontWeight: 500 }}>Growth-stage businesses & MSMEs</div>
                <div style={{ display: 'inline-block', padding: '6px 12px', borderRadius: '10px', background: '#E4F8F1', color: '#08785F', fontWeight: 900, fontSize: '1.4rem', marginTop: '16px', marginBottom: '8px' }}>
                  Custom Scope
                </div>
                <p style={{ fontSize: '0.78rem', color: '#66798A', lineHeight: 1.5, margin: '8px 0 16px' }}>Advanced DPR depth with detailed financial analysis and funding requirement analysis.</p>
                <button onClick={scrollToAuth} className="apple-btn-secondary" style={{ width: '100%', padding: '0.7rem', fontSize: '0.86rem', justifyContent: 'center', borderRadius: '10px' }}>Contact Team</button>
              </div>
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '14px', marginTop: '16px' }}>
                <strong style={{ fontSize: '0.7rem', color: '#164E5B', letterSpacing: '0.4px', textTransform: 'uppercase' }}>INCLUDES</strong>
                <ul style={{ padding: 0, margin: '8px 0 0 0', listStyle: 'none', fontSize: '0.78rem', color: '#435B67' }}>
                  {['Advanced DPR', '1 DPR + revisions', 'Priority support', 'Detailed project & market analysis', 'Detailed financial projections', 'Cash-flow analysis', 'Profitability & break-even analysis', 'DSCR / repayment analysis', 'Funding requirement analysis', 'Risk matrix & mitigation plan', 'Implementation milestone plan', 'Revision support'].map((item, idx) => (
                    <li key={idx} style={{ margin: '6px 0', paddingLeft: '16px', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: '#008C95', fontWeight: 900 }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CARD 5: ENTERPRISE */}
            <div style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FBFEFE 100%)',
              border: '1px solid #D8E3E8',
              borderTop: '4px solid #7256C9',
              borderRadius: '18px',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 5px 16px rgba(0, 65, 80, 0.04)'
            }}>
              <div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', color: '#102536', fontWeight: 800 }}>Enterprise</h3>
                <div style={{ color: '#66798A', fontSize: '0.78rem', minHeight: '34px', lineHeight: 1.4, fontWeight: 500 }}>Established & large businesses</div>
                <div style={{ display: 'inline-block', padding: '6px 12px', borderRadius: '10px', background: '#EEE9FF', color: '#6045AE', fontWeight: 900, fontSize: '1.4rem', marginTop: '16px', marginBottom: '8px' }}>
                  Custom Scope
                </div>
                <p style={{ fontSize: '0.78rem', color: '#66798A', lineHeight: 1.5, margin: '8px 0 16px' }}>Custom DPR depth, detailed projections and analysis based on project scope.</p>
                <button onClick={scrollToAuth} className="apple-btn-secondary" style={{ width: '100%', padding: '0.7rem', fontSize: '0.86rem', justifyContent: 'center', borderRadius: '10px' }}>Contact Team</button>
              </div>
              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '14px', marginTop: '16px' }}>
                <strong style={{ fontSize: '0.7rem', color: '#164E5B', letterSpacing: '0.4px', textTransform: 'uppercase' }}>INCLUDES</strong>
                <ul style={{ padding: 0, margin: '8px 0 0 0', listStyle: 'none', fontSize: '0.78rem', color: '#435B67' }}>
                  {['Advanced / custom DPR', 'Custom DPR scope', 'Dedicated support', '40–60+ page report structure', 'Detailed business & market analysis', '10-year financial projections', 'Detailed cash-flow analysis', 'DSCR & repayment analysis', 'BOQ / capex schedules', 'Funding & capital structure', 'Risk matrix & mitigation plan', 'Customized lender analysis'].map((item, idx) => (
                    <li key={idx} style={{ margin: '6px 0', paddingLeft: '16px', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: '#008C95', fontWeight: 900 }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

        </div>
      </section>

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
                style={{ height: '48px', width: 'auto', filter: 'brightness(0) invert(1)' }}
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

