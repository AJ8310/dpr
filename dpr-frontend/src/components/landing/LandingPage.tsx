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
    <div style={{ minHeight: '100vh', position: 'relative', background: '#F2FAFA', color: '#123B4A', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        
        .vkf-nav-link {
          background: none;
          border: none;
          color: #00464E;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: color 0.15s ease;
          padding: 0.4rem 0.6rem;
        }
        .vkf-nav-link:hover {
          color: #008C95;
        }

        .vkf-btn-primary {
          background: linear-gradient(135deg, #008C95 0%, #006F78 100%);
          color: #FFFFFF;
          border: none;
          padding: 0.85rem 1.6rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0, 140, 149, 0.28);
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .vkf-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 140, 149, 0.38);
        }

        .vkf-btn-secondary {
          background: #FFFFFF;
          color: #00464E;
          border: 1.5px solid #00464E;
          padding: 0.85rem 1.6rem;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .vkf-btn-secondary:hover {
          background: #00464E;
          color: #FFFFFF;
        }

        .vkf-card {
          background: #FFFFFF;
          border: 1px solid #DDF4F3;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 8px 24px rgba(0, 70, 78, 0.04);
          transition: all 0.25s ease;
        }
        .vkf-card:hover {
          border-color: #008C95;
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0, 140, 149, 0.12);
        }

        .vkf-pill {
          padding: 8px 16px;
          background: #FFFFFF;
          border: 1px solid #C5EBE9;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #00464E;
        }

        .vkf-kicker {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: #008C95;
          text-transform: uppercase;
          margin-bottom: 8px;
          display: block;
        }

        .vkf-input {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #C5EBE9;
          border-radius: 10px;
          background: #FFFFFF;
          font-size: 0.95rem;
          color: #00464E;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .vkf-input:focus {
          border-color: #008C95;
        }

        .radio-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          border: 1.5px solid #C5EBE9;
          border-radius: 999px;
          background: #FFFFFF;
          font-size: 0.88rem;
          font-weight: 600;
          color: #00464E;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .radio-pill.selected {
          border-color: #008C95;
          background: #E6F7F7;
          color: #006F78;
        }

        .dash-tab-btn {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          gap: 14px;
          padding: 20px 24px;
          border-bottom: 1px solid #DDF4F3;
          position: relative;
          transition: background 0.15s ease;
        }
        .dash-tab-btn[aria-selected="true"] {
          background: #FFFFFF;
        }
        .dash-tab-btn[aria-selected="true"]::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #008C95;
        }

        @media (max-width: 992px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .two-col-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .faq-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .form-2col { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-5 { grid-template-columns: 1fr 1fr !important; }
          .dash-grid { grid-template-columns: 1fr !important; }
          .flow-grid { grid-template-columns: 1fr 1fr !important; }
          .nav-links { display: none !important; }
        }
        @media (max-width: 576px) {
          .grid-5 { grid-template-columns: 1fr !important; }
          .flow-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Vector Background Waves */}
      <BackgroundWaves />

      {/* 1. STICKY NAVIGATION HEADER */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #DDF4F3',
        padding: '0.85rem 2rem',
        boxShadow: '0 4px 20px rgba(0, 111, 120, 0.05)'
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo / Brand */}
          <div onClick={() => scrollToSection('hero')} style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
            <img
              src="/VKF_logo.png"
              alt="Vision Karnataka Foundation Logo"
              style={{ height: '56px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0, 70, 78, 0.12))' }}
            />
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#00464E', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
                VKF DPR
              </div>
              <div style={{ fontSize: '0.78rem', color: '#008C95', fontWeight: 600, letterSpacing: '0.2px' }}>
                Smart Reports. Stronger Decisions.
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.8rem' }}>
            <button onClick={() => scrollToSection('how-it-works')} className="vkf-nav-link">How it works</button>
            <button onClick={() => scrollToSection('funding-needs')} className="vkf-nav-link">Funding needs</button>
            <button onClick={() => scrollToSection('why-digital')} className="vkf-nav-link">Why digital</button>
            <button onClick={() => scrollToSection('faq')} className="vkf-nav-link">FAQ</button>
          </nav>

          {/* Header Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={scrollToAuth} className="vkf-btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.88rem' }}>
              Get in Touch
            </button>
            <button onClick={() => { setAuthView('login'); scrollToAuth(); }} className="vkf-btn-primary" style={{ padding: '0.6rem 1.3rem', fontSize: '0.88rem' }}>
              Create My DPR
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="hero" style={{ padding: '80px 24px 100px', position: 'relative', zIndex: 1 }}>
        <div className="hero-grid" style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '56px', alignItems: 'center' }}>
          
          {/* Left Column Copy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Speed Badge */}
            <div style={{
              display: 'inline-flex',
              alignSelf: 'flex-start',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 16px',
              background: '#FFFFFF',
              border: '1.5px solid #C5EBE9',
              borderRadius: '999px',
              fontSize: '0.88rem',
              fontWeight: 600,
              boxShadow: '0 2px 10px rgba(0, 140, 149, 0.08)'
            }}>
              <span style={{ color: '#7A8C94', textDecoration: 'line-through' }}>3 weeks manual prep</span>
              <span style={{ color: '#008C95', fontWeight: 700 }}>⚡ &lt; 10 mins flow</span>
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: '3.4rem',
              fontWeight: 800,
              color: '#00464E',
              lineHeight: 1.08,
              letterSpacing: '-0.03em'
            }}>
              Build Your Funding-Ready DPR, Smarter.
            </h1>

            {/* Subtitle */}
            <p style={{ fontSize: '1.12rem', color: '#3F5D68', lineHeight: 1.65, maxWidth: '560px' }}>
              Turn your business, project and financial information into a professionally structured Detailed Project Report (DPR) — without weeks of manual preparation.
            </p>

            {/* DPR For Tags */}
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#00464E', marginBottom: '10px' }}>
                Prepare your DPR for
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <span className="vkf-pill">Bank & NBFC Loans</span>
                <span className="vkf-pill">Government Schemes & Subsidies</span>
                <span className="vkf-pill">Investor Funding</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#5A7B87', marginTop: '10px' }}>
                with automated financial projections, funding analysis and structured documentation.
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginTop: '8px' }}>
              <button onClick={() => { setAuthView('login'); scrollToAuth(); }} className="vkf-btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.02rem' }}>
                Create My DPR &rarr;
              </button>
              <button onClick={scrollToAuth} className="vkf-btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.02rem' }}>
                Get in Touch
              </button>
            </div>

          </div>

          {/* Right Column Document Mockup */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '24px',
              left: '32px',
              right: '-12px',
              bottom: '-12px',
              background: '#DDF4F3',
              borderRadius: '20px',
              zIndex: 0
            }}></div>
            
            <div style={{
              position: 'relative',
              zIndex: 1,
              background: '#FFFFFF',
              border: '1.5px solid #C5EBE9',
              borderRadius: '20px',
              boxShadow: '0 24px 48px -16px rgba(0, 70, 78, 0.18)',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.78rem', color: '#008C95', fontWeight: 600 }}>Detailed Project Report</span>
                  <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#00464E', marginTop: '2px' }}>[Your Project Name]</div>
                </div>
                <span style={{ padding: '6px 12px', background: '#E6F7F7', color: '#006F78', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                  Ready to review
                </span>
              </div>

              {/* TOC Items List */}
              <div style={{ borderTop: '1px solid #DDF4F3', borderBottom: '1px solid #DDF4F3', padding: '10px 0' }}>
                {[
                  { id: '01', title: 'Business & Promoter Profile', active: false },
                  { id: '02', title: 'Project Overview', active: false },
                  { id: '03', title: 'Financial Projections', active: true },
                  { id: '04', title: 'Funding Requirement', active: false },
                  { id: '05', title: 'Feasibility & Supporting Analysis', active: false },
                ].map((item) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    background: item.active ? '#E6F7F7' : 'transparent',
                    color: item.active ? '#00464E' : '#5A7B87',
                    fontWeight: item.active ? 700 : 500
                  }}>
                    <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.8rem', color: item.active ? '#008C95' : '#9AAFB5' }}>{item.id}</span>
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>

              {/* Bar Chart Preview */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#5A7B87', marginBottom: '12px' }}>
                  <span>Projected P&L — Year 1 to Year 5</span>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 600, color: '#008C95' }}>Auto-calculated</span>
                </div>
                
                {/* 5 Vertical Bars */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', height: '110px', padding: '10px 0', borderBottom: '1.5px solid #DDF4F3' }}>
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
                        background: bar.highlight ? 'linear-gradient(180deg, #008C95 0%, #006F78 100%)' : '#00464E',
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.3s ease'
                      }}></div>
                      <span style={{ fontSize: '0.72rem', color: '#7A8C94', fontFamily: 'IBM Plex Mono, monospace' }}>{bar.label}</span>
                    </div>
                  ))}
                </div>

                {/* Sub-summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '16px' }}>
                  <div style={{ padding: '10px', background: '#F2FAFA', borderRadius: '8px', border: '1px solid #DDF4F3' }}>
                    <div style={{ fontSize: '0.7rem', color: '#7A8C94' }}>Project Cost</div>
                    <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.85rem', fontWeight: 700, color: '#00464E' }}>₹ 80.0 Lakhs</div>
                  </div>
                  <div style={{ padding: '10px', background: '#F2FAFA', borderRadius: '8px', border: '1px solid #DDF4F3' }}>
                    <div style={{ fontSize: '0.7rem', color: '#7A8C94' }}>Bank Loan</div>
                    <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.85rem', fontWeight: 700, color: '#00464E' }}>₹ 56.0 Lakhs</div>
                  </div>
                  <div style={{ padding: '10px', background: '#E6F7F7', borderRadius: '8px', border: '1px solid #C5EBE9' }}>
                    <div style={{ fontSize: '0.7rem', color: '#006F78' }}>Govt Subsidy</div>
                    <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.85rem', fontWeight: 700, color: '#008C95' }}>₹ 17.5 Lakhs</div>
                  </div>
                </div>
              </div>

              {/* Floating Notification Badge */}
              <div style={{
                position: 'absolute',
                left: '-16px',
                bottom: '36px',
                padding: '12px 18px',
                background: '#003E46',
                color: '#FFFFFF',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.86rem',
                fontWeight: 600,
                boxShadow: '0 12px 28px rgba(0, 62, 70, 0.4)'
              }}>
                <span style={{ fontSize: '1rem' }}>🔄</span>
                <span>Machinery cost changed — projections updated</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. THE PROBLEM SECTION */}
      <section style={{ padding: '100px 24px', background: '#FFFFFF', borderTop: '1px solid #DDF4F3', borderBottom: '1px solid #DDF4F3', position: 'relative', zIndex: 1 }}>
        <div className="two-col-grid" style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '72px', alignItems: 'center' }}>
          
          {/* Left Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <span className="vkf-kicker">The Problem</span>
            <h2 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#00464E', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Your Funding Shouldn't Wait for Your Documentation.
            </h2>
            <p style={{ fontSize: '1.08rem', color: '#3F5D68', lineHeight: 1.65 }}>
              Preparing a DPR manually can mean collecting information across multiple files, building financial projections, checking calculations, formatting reports and going through multiple rounds of revisions.
            </p>
            <p style={{ fontSize: '1.05rem', color: '#3F5D68', lineHeight: 1.65 }}>
              That takes time — especially when your project numbers keep changing.
            </p>

            <blockquote style={{
              margin: '16px 0 0',
              paddingLeft: '20px',
              borderLeft: '4px solid #008C95',
              fontSize: '1.4rem',
              fontWeight: 700,
              color: '#00464E',
              fontStyle: 'italic',
              lineHeight: 1.35
            }}>
              “Your business is ready to move. Your DPR should be too.”
            </blockquote>
          </div>

          {/* Right Side Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#00464E', marginBottom: '4px' }}>The result?</div>
            {[
              { icon: '🕒', text: 'Weeks spent preparing and revising documents' },
              { icon: '📊', text: 'Complex financial projections to build and maintain' },
              { icon: '📄', text: 'Repetitive work across Excel, Word and other files' },
              { icon: '👥', text: 'Higher dependence on external consultants' },
              { icon: '⚠️', text: 'Delays when your project or funding requirements change' }
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '18px 24px',
                background: '#F2FAFA',
                border: '1px solid #DDF4F3',
                borderRadius: '14px',
                fontSize: '1.02rem',
                fontWeight: 600,
                color: '#00464E',
                boxShadow: '0 2px 8px rgba(0, 70, 78, 0.03)'
              }}>
                <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. WORKFLOW MODULES SECTION */}
      <section id="how-it-works" style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'end', marginBottom: '56px' }}>
            <div>
              <span className="vkf-kicker">Workflow Modules</span>
              <h2 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#00464E', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                From Business Data to a Structured DPR
              </h2>
            </div>
            <p style={{ fontSize: '1.08rem', color: '#3F5D68', lineHeight: 1.65 }}>
              VKF DPR helps transform your business, project and financial information into a structured DPR with the key information needed to present your funding requirement.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="grid-3">
            
            {/* Card 01 */}
            <div className="vkf-card">
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.88rem', color: '#008C95', fontWeight: 700 }}>01</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#00464E', margin: '8px 0 10px' }}>Business & Project Profile</h3>
              <p style={{ fontSize: '0.98rem', color: '#5A7B87', lineHeight: 1.6, margin: 0 }}>
                Bring your business, promoter and project information together in one structured workflow.
              </p>
            </div>

            {/* Card 02 */}
            <div className="vkf-card">
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.88rem', color: '#008C95', fontWeight: 700 }}>02</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#00464E', margin: '8px 0 10px' }}>Financial Projections</h3>
              <p style={{ fontSize: '0.98rem', color: '#5A7B87', lineHeight: 1.6, margin: 0 }}>
                Generate multi-year projected Profit & Loss, Balance Sheet and Cash Flow models.
              </p>
            </div>

            {/* Card 03 */}
            <div className="vkf-card">
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.88rem', color: '#008C95', fontWeight: 700 }}>03</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#00464E', margin: '8px 0 10px' }}>Funding Requirement Analysis</h3>
              <p style={{ fontSize: '0.98rem', color: '#5A7B87', lineHeight: 1.6, margin: 0 }}>
                Structure your funding requirements, including term loans, working capital margins and applicable subsidy allocations.
              </p>
            </div>

            {/* Card 04 */}
            <div className="vkf-card">
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.88rem', color: '#008C95', fontWeight: 700 }}>04</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#00464E', margin: '8px 0 10px' }}>Feasibility & Supporting Analysis</h3>
              <p style={{ fontSize: '0.98rem', color: '#5A7B87', lineHeight: 1.6, margin: 0 }}>
                Organize the information required to present your project and financial requirements clearly.
              </p>
            </div>

            {/* Card 05 - Highlighted Dark Card */}
            <div style={{
              gridColumn: 'span 2',
              background: '#003E46',
              color: '#FFFFFF',
              borderRadius: '16px',
              padding: '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: '0 12px 32px rgba(0, 62, 70, 0.25)'
            }}>
              <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.88rem', color: '#5BE2EC', fontWeight: 700 }}>05</span>
              <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#FFFFFF', margin: '8px 0 10px' }}>Professional DPR Output</h3>
              <p style={{ fontSize: '1.02rem', color: '#C5EBE9', lineHeight: 1.6, margin: 0, maxWidth: '580px' }}>
                Generate a structured report containing your project profile, financial projections, funding requirements and supporting analysis.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. SPEED BAND SECTION */}
      <section style={{ padding: '100px 24px', background: '#003E46', color: '#FFFFFF', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', marginBottom: '56px' }} className="two-col-grid">
            <div>
              <h2 style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                3 Weeks of Work.<br />Now Under 10 Minutes.
              </h2>
              <div style={{ fontSize: '1.15rem', color: '#5BE2EC', fontWeight: 700, marginTop: '20px' }}>
                Stop rebuilding your financial model every time something changes.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
              <p style={{ fontSize: '1.08rem', color: '#DDF4F3', lineHeight: 1.65 }}>
                Change a project variable — such as a machinery cost, project investment or other key input — and your financial projections can be updated through the automated calculation workflow.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.02rem', fontWeight: 600, color: '#FFFFFF' }}>
                  <span style={{ color: '#5BE2EC' }}>✓</span> No starting from a blank template.
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.02rem', fontWeight: 600, color: '#FFFFFF' }}>
                  <span style={{ color: '#5BE2EC' }}>✓</span> No rebuilding the entire report for every change.
                </div>
              </div>
            </div>
          </div>

          {/* 4-Step Pipeline Flow Box */}
          <div className="flow-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            border: '1.5px solid rgba(221, 244, 243, 0.25)',
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'rgba(11, 40, 48, 0.6)'
          }}>
            {[
              { step: 'Step 1', title: 'Input your information' },
              { step: 'Step 2', title: 'Build your financial model' },
              { step: 'Step 3', title: 'Review your funding requirements' },
              { step: 'Step 4', title: 'Generate your DPR', active: true }
            ].map((st, i) => (
              <div key={i} style={{
                padding: '28px 24px',
                borderRight: i === 3 ? 'none' : '1px solid rgba(221, 244, 243, 0.2)',
                background: st.active ? '#008C95' : 'transparent',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <small style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.8rem', color: st.active ? '#FFFFFF' : '#8AAFB7' }}>{st.step}</small>
                <b style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>{st.title}</b>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. MULTIPLE FUNDING NEEDS SECTION */}
      <section id="funding-needs" style={{ padding: '100px 24px', background: '#FFFFFF', borderBottom: '1px solid #DDF4F3', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ marginBottom: '56px' }}>
            <span className="vkf-kicker">Use Cases</span>
            <h2 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#00464E', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              One DPR. Multiple Funding Needs.
            </h2>
            <p style={{ fontSize: '1.08rem', color: '#3F5D68', lineHeight: 1.65, marginTop: '12px', maxWidth: '640px' }}>
              Whether you're preparing for your next business expansion or actively seeking funding, build the documentation around your funding objective.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }} className="grid-3">
            
            {/* Card 1 */}
            <div className="vkf-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#F2FAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '20px' }}>
                🏛️
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#00464E', marginBottom: '12px' }}>Bank & NBFC Loans</h3>
              <p style={{ fontSize: '0.98rem', color: '#5A7B87', lineHeight: 1.6, flexGrow: 1, marginBottom: '24px' }}>
                Present your business, project, financial projections and funding requirements in a structured DPR.
              </p>
              <button onClick={scrollToAuth} style={{ all: 'unset', cursor: 'pointer', fontWeight: 700, color: '#008C95', fontSize: '0.95rem' }}>
                Create a Loan DPR &rarr;
              </button>
            </div>

            {/* Card 2 */}
            <div className="vkf-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#F2FAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '20px' }}>
                🏛️
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#00464E', marginBottom: '12px' }}>Government Schemes & Subsidies</h3>
              <p style={{ fontSize: '0.98rem', color: '#5A7B87', lineHeight: 1.6, flexGrow: 1, marginBottom: '24px' }}>
                Prepare structured project documentation for government funding and subsidy-related requirements.
              </p>
              <button onClick={scrollToAuth} style={{ all: 'unset', cursor: 'pointer', fontWeight: 700, color: '#008C95', fontSize: '0.95rem' }}>
                Prepare My DPR &rarr;
              </button>
            </div>

            {/* Card 3 */}
            <div className="vkf-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#F2FAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '20px' }}>
                💼
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#00464E', marginBottom: '12px' }}>Investor Funding</h3>
              <p style={{ fontSize: '0.98rem', color: '#5A7B87', lineHeight: 1.6, flexGrow: 1, marginBottom: '24px' }}>
                Bring your business and financial information together into a professional project document for funding discussions.
              </p>
              <button onClick={scrollToAuth} style={{ all: 'unset', cursor: 'pointer', fontWeight: 700, color: '#008C95', fontSize: '0.95rem' }}>
                Build My DPR &rarr;
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 7. FEATURE GRID SECTION */}
      <section style={{ padding: '100px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 64px' }}>
            <span className="vkf-kicker">Platform Features</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#00464E', lineHeight: 1.1 }}>
              Built for Speed. Designed for Accuracy.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '24px' }} className="grid-5">
            {[
              { title: 'Instant Recalculations', desc: 'Update machinery or investment variables and see instant updates across P&L, Balance Sheet, and ratios.' },
              { title: 'Audit-Ready Projections', desc: 'Financial models built according to Indian banking norms and CA compliance guidelines.' },
              { title: 'Standardized Formats', desc: 'Generates clean, well-aligned DOCX reports ready for submission without manual formatting hassle.' },
              { title: 'Multi-Sector Intelligence', desc: 'Pre-configured schemas for Dairy, Food Processing, Solar, Manufacturing, Textiles, and more.' },
              { title: 'One-Click Exports', desc: 'Export fully formatted Word documents with customizable VKF co-branding or sole business logo.' }
            ].map((ft, idx) => (
              <div key={idx} style={{
                paddingTop: '20px',
                borderTop: '3px solid #008C95',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#00464E', margin: 0 }}>{ft.title}</h3>
                <p style={{ fontSize: '0.92rem', color: '#5A7B87', lineHeight: 1.6, margin: 0 }}>{ft.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. INTERACTIVE DASHBOARD SECTION ("Why Digital") */}
      <section id="why-digital" style={{ padding: '100px 24px', background: '#FFFFFF', borderTop: '1px solid #DDF4F3', borderBottom: '1px solid #DDF4F3', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'end', marginBottom: '48px' }}>
            <div>
              <span className="vkf-kicker">Interactive Financial Calculator</span>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#00464E', lineHeight: 1.1 }}>
                See How Live Financial Calculation Works
              </h2>
            </div>
            <p style={{ fontSize: '1.05rem', color: '#3F5D68', lineHeight: 1.65 }}>
              Try adjusting the machinery cost slider below to observe how the entire financial model recalculates P&L, debt service ratios, and subsidy allocations live.
            </p>
          </div>

          {/* Dashboard Outer Container */}
          <div className="dash-grid" style={{
            background: '#F2FAFA',
            border: '1.5px solid #C5EBE9',
            borderRadius: '20px',
            display: 'grid',
            gridTemplateColumns: '320px 1fr',
            overflow: 'hidden',
            boxShadow: '0 24px 48px -20px rgba(0, 70, 78, 0.15)'
          }}>
            
            {/* Left Tabs */}
            <div style={{ borderRight: '1px solid #DDF4F3', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
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
                    className="dash-tab-btn"
                    aria-selected={isSelected}
                    onClick={() => setActiveDashTab(tab.id as any)}
                  >
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      background: isSelected ? '#008C95' : '#F2FAFA',
                      color: isSelected ? '#FFFFFF' : '#00464E',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      📊
                    </div>
                    <div>
                      <b style={{ fontSize: '0.98rem', color: '#00464E' }}>{tab.label}</b>
                      <span style={{ fontSize: '0.8rem', color: '#5A7B87', display: 'block', marginTop: '2px' }}>{tab.desc}</span>
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
                borderRadius: '14px',
                border: '1px solid #DDF4F3',
                boxShadow: '0 4px 14px rgba(0, 70, 78, 0.04)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label style={{ fontWeight: 700, color: '#00464E', fontSize: '1rem' }}>
                    Adjust Machinery Investment Cost:
                  </label>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.2rem', fontWeight: 800, color: '#008C95' }}>
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
                  style={{ width: '100%', accentColor: '#008C95', cursor: 'pointer' }}
                />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#7A8C94', marginTop: '6px' }}>
                  <span>₹20 Lakhs</span>
                  <span>₹80 Lakhs</span>
                  <span>₹150 Lakhs</span>
                </div>
              </div>

              {/* Dynamic Live Calculated Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: '12px', border: '1px solid #DDF4F3' }}>
                  <div style={{ fontSize: '0.76rem', color: '#5A7B87', fontWeight: 600 }}>Total Project Cost</div>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.2rem', fontWeight: 800, color: '#00464E', marginTop: '4px' }}>
                    ₹{totalProjectCost}L
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: '12px', border: '1px solid #DDF4F3' }}>
                  <div style={{ fontSize: '0.76rem', color: '#5A7B87', fontWeight: 600 }}>Bank Term Loan (70%)</div>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.2rem', fontWeight: 800, color: '#00464E', marginTop: '4px' }}>
                    ₹{termLoan}L
                  </div>
                </div>

                <div style={{ background: '#E6F7F7', padding: '18px', borderRadius: '12px', border: '1px solid #C5EBE9' }}>
                  <div style={{ fontSize: '0.76rem', color: '#006F78', fontWeight: 600 }}>Eligible Subsidy</div>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.2rem', fontWeight: 800, color: '#008C95', marginTop: '4px' }}>
                    ₹{govtSubsidy}L
                  </div>
                </div>

                <div style={{ background: '#FFFFFF', padding: '18px', borderRadius: '12px', border: '1px solid #DDF4F3' }}>
                  <div style={{ fontSize: '0.76rem', color: '#5A7B87', fontWeight: 600 }}>Average DSCR</div>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.2rem', fontWeight: 800, color: '#00464E', marginTop: '4px' }}>
                    {avgDscr}x
                  </div>
                </div>
              </div>

              {/* Data Table / Tab Details */}
              <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '14px', border: '1px solid #DDF4F3' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#00464E', margin: '0 0 16px' }}>
                  {activeDashTab === 'projections' && '5-Year Projected Profitability Overview'}
                  {activeDashTab === 'ratios' && 'Financial Risk & Debt Ratios'}
                  {activeDashTab === 'repayments' && 'Loan Debt Amortization Schedule'}
                  {activeDashTab === 'sensitivities' && 'Capacity Utilization & Sensitivity Thresholds'}
                </h4>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #DDF4F3', textAlign: 'left' }}>
                      <th style={{ padding: '10px 0', color: '#00464E' }}>Particulars (₹ Lakhs)</th>
                      <th style={{ padding: '10px 0', color: '#00464E' }}>Year 1</th>
                      <th style={{ padding: '10px 0', color: '#00464E' }}>Year 3</th>
                      <th style={{ padding: '10px 0', color: '#00464E' }}>Year 5</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #F2FAFA' }}>
                      <td style={{ padding: '12px 0', fontWeight: 600 }}>Gross Turnover</td>
                      <td style={{ padding: '12px 0', fontFamily: 'IBM Plex Mono, monospace' }}>₹{(machineryCost * 1.8).toFixed(1)}L</td>
                      <td style={{ padding: '12px 0', fontFamily: 'IBM Plex Mono, monospace' }}>₹{(machineryCost * 2.9).toFixed(1)}L</td>
                      <td style={{ padding: '12px 0', fontFamily: 'IBM Plex Mono, monospace' }}>₹{(machineryCost * 3.8).toFixed(1)}L</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #F2FAFA' }}>
                      <td style={{ padding: '12px 0', fontWeight: 600 }}>Operating Expenses</td>
                      <td style={{ padding: '12px 0', fontFamily: 'IBM Plex Mono, monospace' }}>₹{(machineryCost * 1.2).toFixed(1)}L</td>
                      <td style={{ padding: '12px 0', fontFamily: 'IBM Plex Mono, monospace' }}>₹{(machineryCost * 1.8).toFixed(1)}L</td>
                      <td style={{ padding: '12px 0', fontFamily: 'IBM Plex Mono, monospace' }}>₹{(machineryCost * 2.3).toFixed(1)}L</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 0', fontWeight: 700, color: '#008C95' }}>Projected Net Profit</td>
                      <td style={{ padding: '12px 0', fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, color: '#008C95' }}>₹{(machineryCost * 0.38).toFixed(1)}L</td>
                      <td style={{ padding: '12px 0', fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, color: '#008C95' }}>₹{netProfitYr3}L</td>
                      <td style={{ padding: '12px 0', fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, color: '#008C95' }}>₹{(machineryCost * 1.15).toFixed(1)}L</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 9. FAQ SECTION (Exact Side-by-Side Design from Screenshot 1) */}
      <section id="faq" style={{ padding: '100px 24px', background: '#FFFFFF', borderTop: '1px solid #DDF4F3', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div className="faq-grid" style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '64px', alignItems: 'start' }}>
            
            {/* Left Column Heading */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#00464E', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                Frequently Asked Questions
              </h2>
              <div style={{ fontSize: '1.05rem', color: '#3F5D68' }}>
                Still unsure?{' '}
                <button
                  onClick={scrollToAuth}
                  style={{ all: 'unset', color: '#00464E', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Talk to our team
                </button>.
              </div>
            </div>

            {/* Right Column List with Dividers */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                {
                  q: 'What is a DPR?',
                  a: 'A Detailed Project Report is a structured document that presents a business or project, its financial requirements, projections and supporting analysis.'
                },
                {
                  q: 'Who can use this DPR tool?',
                  a: 'The solution is designed for startups, MSMEs, entrepreneurs and established businesses seeking loans, government funding, subsidies or investor funding.'
                },
                {
                  q: 'What can I prepare the DPR for?',
                  a: 'You can use it for Bank/NBFC loans, government schemes and subsidies, and investor funding discussions.'
                },
                {
                  q: 'What financial information does the tool generate?',
                  a: 'The platform\'s financial workflow includes projected Profit & Loss, Balance Sheet and Cash Flow models along with funding requirement analysis.'
                }
              ].map((faq, i) => {
                const isOpen = openFaqIndex === i;
                return (
                  <div key={i} style={{
                    borderTop: '1px solid #DDF4F3',
                    borderBottom: i === 3 ? '1px solid #DDF4F3' : 'none',
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
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00464E', margin: 0 }}>
                        {faq.q}
                      </h3>
                      <button style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#003E46',
                        color: '#FFFFFF',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        flexShrink: 0
                      }}>
                        {isOpen ? '✕' : '+'}
                      </button>
                    </div>

                    {isOpen && (
                      <p style={{ marginTop: '16px', fontSize: '1.02rem', color: '#3F5D68', lineHeight: 1.65, maxWidth: '720px' }}>
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* 10. GET IN TOUCH & AUTHENTICATION SECTION (Exact Design from Screenshot 2) */}
      <section id="contact" style={{ padding: '100px 24px', background: '#F2FAFA', borderTop: '1.5px solid #DDF4F3', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div className="two-col-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '64px', alignItems: 'start' }}>
            
            {/* Left Column: Connect with our team */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <span className="vkf-kicker">Connect with our team</span>
              
              <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#00464E', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                Tell us about your project.
              </h2>
              
              <p style={{ fontSize: '1.1rem', color: '#3F5D68', lineHeight: 1.65 }}>
                Share a few details and what you need help with. Our team will get back to you to discuss your DPR and funding documentation.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '1.05rem', fontWeight: 600, color: '#00464E' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #C5EBE9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#008C95' }}>
                    ✉️
                  </div>
                  <span>support@vkf.org</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '1.05rem', fontWeight: 600, color: '#00464E' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #C5EBE9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#008C95' }}>
                    📞
                  </div>
                  <span>+91 98860 12345</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '1.05rem', fontWeight: 600, color: '#00464E' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #C5EBE9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#008C95' }}>
                    📍
                  </div>
                  <span>Vision Karnataka Foundation, Bengaluru, KA</span>
                </div>
              </div>

            </div>

            {/* Right Column: Contact & Auth Card */}
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #C5EBE9',
              borderRadius: '24px',
              padding: '40px',
              boxShadow: '0 24px 48px -16px rgba(0, 70, 78, 0.12)'
            }}>
              
              {/* Card Mode Switcher Tabs */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #DDF4F3', paddingBottom: '16px', marginBottom: '28px' }}>
                <button
                  onClick={() => setAuthView('inquiry')}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    background: authView === 'inquiry' ? '#008C95' : 'transparent',
                    color: authView === 'inquiry' ? '#FFFFFF' : '#00464E'
                  }}
                >
                  Send Inquiry
                </button>
                <button
                  onClick={() => setAuthView('login')}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    background: authView === 'login' ? '#008C95' : 'transparent',
                    color: authView === 'login' ? '#FFFFFF' : '#00464E'
                  }}
                >
                  Account Login
                </button>
                <button
                  onClick={() => setAuthView('register')}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    background: authView === 'register' ? '#008C95' : 'transparent',
                    color: authView === 'register' ? '#FFFFFF' : '#00464E'
                  }}
                >
                  Register
                </button>
              </div>

              {authView === 'inquiry' ? (
                <div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#00464E', margin: 0 }}>Get in touch</h3>
                  <p style={{ fontSize: '0.92rem', color: '#7A8C94', marginTop: '4px', marginBottom: '24px' }}>
                    Fields marked optional can be left blank.
                  </p>

                  {inquirySubmitted ? (
                    <div style={{ padding: '24px', background: '#E6F7F7', borderRadius: '12px', border: '1px solid #C5EBE9', textAlign: 'center', color: '#006F78', fontWeight: 700 }}>
                      ✅ Thank you! Your project details have been submitted. Our team will get back to you shortly.
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      
                      {/* Row 1 */}
                      <div className="form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#00464E', marginBottom: '6px' }}>Full name</label>
                          <input
                            type="text"
                            required
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="Enter your name"
                            className="vkf-input"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#00464E', marginBottom: '6px' }}>Business name <small style={{ fontWeight: 400, color: '#7A8C94' }}>(optional)</small></label>
                          <input type="text" placeholder="Enter business name" className="vkf-input" />
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div className="form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#00464E', marginBottom: '6px' }}>Email</label>
                          <input
                            type="email"
                            required
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            placeholder="name@company.com"
                            className="vkf-input"
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#00464E', marginBottom: '6px' }}>Phone</label>
                          <input
                            type="tel"
                            required
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            placeholder="+91 XXXXX XXXXX"
                            className="vkf-input"
                          />
                        </div>
                      </div>

                      {/* Row 3 */}
                      <div className="form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#00464E', marginBottom: '6px' }}>City <small style={{ fontWeight: 400, color: '#7A8C94' }}>(optional)</small></label>
                          <input type="text" placeholder="City" className="vkf-input" />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#00464E', marginBottom: '6px' }}>Business type <small style={{ fontWeight: 400, color: '#7A8C94' }}>(optional)</small></label>
                          <select className="vkf-input" style={{ cursor: 'pointer' }}>
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
                        <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 700, color: '#00464E', marginBottom: '12px' }}>
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
                              className={`radio-pill ${dprPurpose === item.id ? 'selected' : ''}`}
                            >
                              <span style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                border: dprPurpose === item.id ? '4px solid #008C95' : '1.5px solid #7A8C94',
                                background: '#FFFFFF'
                              }}></span>
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <button type="submit" className="vkf-btn-primary" style={{ marginTop: '8px', padding: '0.95rem' }}>
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

      {/* 11. FOOTER */}
      <footer style={{
        background: '#003E46',
        color: '#FFFFFF',
        padding: '60px 24px 40px',
        borderTop: '1px solid rgba(221, 244, 243, 0.2)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src="/VKF_logo.png"
                alt="VKF DPR Logo"
                style={{ height: '52px', width: 'auto', filter: 'brightness(0) invert(1)' }}
              />
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>VKF DPR</div>
                <div style={{ fontSize: '0.78rem', color: '#5BE2EC' }}>Vision Karnataka Foundation</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', fontSize: '0.9rem', color: '#DDF4F3' }}>
              <button onClick={() => scrollToSection('hero')} style={{ background: 'none', border: 'none', color: '#DDF4F3', cursor: 'pointer' }}>Home</button>
              <button onClick={() => scrollToSection('how-it-works')} style={{ background: 'none', border: 'none', color: '#DDF4F3', cursor: 'pointer' }}>How it works</button>
              <button onClick={() => scrollToSection('funding-needs')} style={{ background: 'none', border: 'none', color: '#DDF4F3', cursor: 'pointer' }}>Funding needs</button>
              <button onClick={() => scrollToSection('why-digital')} style={{ background: 'none', border: 'none', color: '#DDF4F3', cursor: 'pointer' }}>Why digital</button>
              <button onClick={() => scrollToSection('faq')} style={{ background: 'none', border: 'none', color: '#DDF4F3', cursor: 'pointer' }}>FAQ</button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(221, 244, 243, 0.15)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#8AAFB7' }}>
            <div>&copy; {new Date().getFullYear()} Vision Karnataka Foundation. All rights reserved.</div>
            <div>Confidential & Bank-Compliant DPR Preparation Service.</div>
          </div>

        </div>
      </footer>
    </div>
  );
}
