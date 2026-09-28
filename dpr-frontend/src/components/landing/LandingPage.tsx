'use client';

import React, { useState, useEffect } from 'react';
import LoginCard from '@/components/auth/LoginCard';
import RegisterCard from '@/components/auth/RegisterCard';
import { UserSession } from '@/types/dpr';

interface LandingPageProps {
  onLoginSuccess: (session: UserSession) => void;
}

export default function LandingPage({ onLoginSuccess }: LandingPageProps) {
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<'fast' | 'struct' | 'upd' | 'one'>('fast');
  const [machineryCost, setMachineryCost] = useState<number>(60);
  const [flashUpdated, setFlashUpdated] = useState<boolean>(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    city: '',
    business_type: '',
    purpose: '',
    message: '',
    consent: false,
  });
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState('');

  // Pre-warm backend API server silently on load
  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://dpr-0eje.onrender.com';
    fetch(`${apiBase.replace(/\/$/, '')}/health`).catch(() => {});
  }, []);

  const scrollToAuth = () => {
    const el = document.getElementById('auth-panel');
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

  // Slider Financial Calculations
  const OTHER_COST = 40;
  const totalProjectCost = machineryCost + OTHER_COST;
  const termLoan75 = totalProjectCost * 0.75;
  const promoterMargin25 = totalProjectCost - termLoan75;
  const annualDepreciation = machineryCost * 0.15;
  const annualRepayment = termLoan75 / 5;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMachineryCost(parseFloat(e.target.value));
    setFlashUpdated(true);
    setTimeout(() => setFlashUpdated(false), 900);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactError('');
    if (!contactForm.name.trim()) { setContactError('Please enter your name.'); return; }
    if (!contactForm.email.trim() || !contactForm.email.includes('@')) { setContactError('Please enter a valid email address.'); return; }
    if (!contactForm.phone.trim() || contactForm.phone.length < 10) { setContactError('Please enter a valid 10-digit phone number.'); return; }
    if (!contactForm.purpose) { setContactError('Please select what you need the DPR for.'); return; }
    if (!contactForm.message.trim()) { setContactError('Please enter your question or project message.'); return; }
    if (!contactForm.consent) { setContactError('Please tick the consent checkbox.'); return; }

    setContactSent(true);
  };

  return (
    <div style={{ background: '#F5F2EA', color: '#13223B', fontFamily: '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif', fontSize: '17px', lineHeight: 1.6, minHeight: '100vh' }}>
      {/* Import Google Fonts Fraunces & IBM Plex */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
        
        :root {
          --paper: #F5F2EA;
          --paper-2: #EDE7DA;
          --surface: #FFFFFF;
          --ink: #13223B;
          --ink-2: #3F4758;
          --muted: #5A6172;
          --line: #DDD6C6;
          --line-2: #CFC7B5;
          --accent: #B4531A;
          --accent-dark: #8A3C10;
          --accent-soft: #F6E6D8;
          --accent-on-ink: #F0B98E;
          --navy-line: #34435E;
          --navy-muted: #C9CFDA;
          --navy-faint: #9AA5B8;
          --ok: #1E5A34;
          --ok-soft: #E6EFE8;
          --serif: "Fraunces", Georgia, "Times New Roman", serif;
          --sans: "IBM Plex Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
          --mono: "IBM Plex Mono", Menlo, Consolas, monospace;
        }

        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        h1, h2, h3 { font-family: var(--serif); font-weight: 600; letter-spacing: -.02em; line-height: 1.08; margin: 0; }
        p { margin: 0; }
        
        .wrap { max-width: 1200px; margin: 0 auto; padding: 0 48px; }
        .section { padding: 112px 0; }
        .band-white { background: var(--surface); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
        .band-navy { background: var(--ink); color: var(--paper); }
        .kicker { font-family: var(--mono); font-size: 13px; letter-spacing: .08em; color: var(--accent); text-transform: uppercase; }
        .h2 { font-size: 48px; }
        .lead { font-size: 18px; line-height: 1.65; color: var(--ink-2); }
        
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 48px;
          padding: 14px 26px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 16px;
          text-decoration: none;
          border: 1.5px solid transparent;
          cursor: pointer;
          font-family: var(--sans);
          transition: background .15s, color .15s;
        }
        .btn-accent { background: var(--accent); color: #fff; }
        .btn-accent:hover { background: var(--accent-dark); color: #fff; }
        .btn-ink { background: var(--ink); color: var(--paper); }
        .btn-ink:hover { background: #0d1a2e; color: var(--paper); }
        .btn-line { border-color: var(--ink); color: var(--ink); background: transparent; }
        .btn-line:hover { background: var(--ink); color: var(--paper); }
        .btn-line-light { border-color: var(--paper); color: var(--paper); background: transparent; }
        .btn-line-light:hover { background: var(--paper); color: var(--ink); }
        .btn-lg { font-size: 17px; padding: 17px 28px; }

        @media (max-width: 1080px) {
          .wrap { padding: 0 24px; }
          .section { padding: 72px 0; }
          .h2 { font-size: 36px; }
        }
      `}</style>

      {/* 1. STICKY TOP NAVIGATION */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(245,242,234,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #DDD6C6' }}>
        <div className="wrap" style={{ height: '76px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#13223B' }}>
            <svg width="32" height="32" viewBox="0 0 30 30" fill="none">
              <rect x="1" y="1" width="28" height="28" rx="6" stroke="#13223B" strokeWidth="2" />
              <path d="M8 20V14M13 20V10M18 20V16M23 20V8" stroke="#B4531A" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
            <span style={{ fontFamily: 'var(--serif)', fontSize: '24px', fontWeight: 700, letterSpacing: '-.02em' }}>Infopace</span>
          </a>

          <nav style={{ display: 'flex', gap: '32px', fontSize: '15px', fontWeight: 500 }} className="desktop-nav">
            <a href="#how" style={{ textDecoration: 'none', color: '#13223B' }}>How it works</a>
            <a href="#uses" style={{ textDecoration: 'none', color: '#13223B' }}>Funding needs</a>
            <a href="#why" style={{ textDecoration: 'none', color: '#13223B' }}>Why digital</a>
            <a href="#faq" style={{ textDecoration: 'none', color: '#13223B' }}>FAQ</a>
          </nav>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-line" onClick={scrollToAuth}>Get in Touch</button>
            <button className="btn btn-ink" onClick={scrollToAuth}>Create My DPR</button>
          </div>
        </div>
      </header>

      <main id="top">
        {/* 2. HERO SECTION */}
        <section className="wrap" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '64px', alignItems: 'center', padding: '88px 0 104px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '8px 16px', background: '#FFFFFF', border: '1px solid #DDD6C6', borderRadius: '999px', fontFamily: 'var(--mono)', fontSize: '14px', alignSelf: 'flex-start' }}>
              <s style={{ color: '#5A6172' }}>3 Weeks</s>
              <svg width="18" height="10" viewBox="0 0 18 10" fill="none"><path d="M1 5h15M12 1l4 4-4 4" stroke="#B4531A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <b style={{ fontWeight: 600, color: '#B4531A' }}>Under 10 Minutes</b>
            </div>

            <h1 style={{ fontSize: '58px', lineHeight: 1.04, letterSpacing: '-.03em', fontFamily: 'var(--serif)', fontWeight: 600 }}>
              Build Your Funding-Ready DPR, Smarter.
            </h1>

            <p className="lead" style={{ maxWidth: '520px' }}>
              Turn your business, project and financial information into a professionally structured Detailed Project Report (DPR) — without weeks of manual preparation.
            </p>

            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#5A6172', marginBottom: '8px' }}>Prepare your DPR for</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ padding: '9px 14px', background: '#FFFFFF', border: '1px solid #DDD6C6', borderRadius: '8px', fontSize: '15px', fontWeight: 500 }}>Bank & NBFC Loans</span>
                <span style={{ padding: '9px 14px', background: '#FFFFFF', border: '1px solid #DDD6C6', borderRadius: '8px', fontSize: '15px', fontWeight: 500 }}>Government Schemes & Subsidies</span>
                <span style={{ padding: '9px 14px', background: '#FFFFFF', border: '1px solid #DDD6C6', borderRadius: '8px', fontSize: '15px', fontWeight: 500 }}>Investor Funding</span>
              </div>
              <p style={{ marginTop: '12px', fontSize: '15px', color: '#3F4758' }}>with automated financial projections, funding analysis and structured documentation.</p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
              <button className="btn btn-accent btn-lg" onClick={scrollToAuth}>
                Create My DPR
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><path d="M1 6h15M11 1l5 5-5 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button className="btn btn-line btn-lg" onClick={scrollToAuth}>Get in Touch</button>
            </div>

            <p style={{ fontSize: '14px', color: '#5A6172' }}>Less manual work. Faster preparation. A clearer path to your funding application.</p>
          </div>

          {/* Right Side: Interactive Document Mockup Card */}
          <div style={{ position: 'relative', minHeight: '540px' }}>
            <div style={{ position: 'absolute', top: '28px', left: '28px', right: '-8px', bottom: '0', background: '#E9E3D5', border: '1px solid #DDD6C6', borderRadius: '16px' }}></div>
            <div style={{ position: 'relative', zIndex: 2, background: '#FFFFFF', border: '1px solid #DDD6C6', borderRadius: '16px', boxShadow: '0 30px 60px -30px rgba(19,34,59,.35)', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div>
                  <div className="kicker">Detailed Project Report</div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '24px', fontWeight: 600 }}>[Your Project Name]</div>
                </div>
                <div style={{ padding: '6px 10px', background: '#E6EFE8', color: '#1E5A34', borderRadius: '6px', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  ✓ Ready to review
                </div>
              </div>

              <div style={{ borderTop: '1px solid #ECE6D8' }}>
                <div style={{ display: 'flex', gap: '16px', padding: '10px 0', borderBottom: '1px solid #ECE6D8', fontSize: '14px' }}><span style={{ fontFamily: 'var(--mono)', color: '#7A7F8C' }}>01</span><span>Business & Promoter Profile</span></div>
                <div style={{ display: 'flex', gap: '16px', padding: '10px 0', borderBottom: '1px solid #ECE6D8', fontSize: '14px' }}><span style={{ fontFamily: 'var(--mono)', color: '#7A7F8C' }}>02</span><span>Project Overview</span></div>
                <div style={{ display: 'flex', gap: '16px', padding: '10px 0', borderBottom: '1px solid #ECE6D8', fontSize: '14px', fontWeight: 600 }}><span style={{ fontFamily: 'var(--mono)', color: '#B4531A' }}>03</span><span>Financial Projections</span></div>
                <div style={{ display: 'flex', gap: '16px', padding: '10px 0', borderBottom: '1px solid #ECE6D8', fontSize: '14px' }}><span style={{ fontFamily: 'var(--mono)', color: '#7A7F8C' }}>04</span><span>Funding Requirement</span></div>
                <div style={{ display: 'flex', gap: '16px', padding: '10px 0', borderBottom: '1px solid #ECE6D8', fontSize: '14px' }}><span style={{ fontFamily: 'var(--mono)', color: '#7A7F8C' }}>05</span><span>Feasibility & Supporting Analysis</span></div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#5A6172', marginBottom: '6px' }}>
                  <span>Projected P&L — Year 1 to Year 5</span>
                  <span style={{ fontFamily: 'var(--mono)' }}>Auto-calculated</span>
                </div>
                <svg width="100%" height="92" viewBox="0 0 420 96" preserveAspectRatio="none">
                  <line x1="0" y1="95" x2="420" y2="95" stroke="#DDD6C6" />
                  <rect x="10" y="62" width="52" height="33" rx="3" fill="#13223B" />
                  <rect x="94" y="50" width="52" height="45" rx="3" fill="#13223B" />
                  <rect x="178" y="38" width="52" height="57" rx="3" fill="#13223B" />
                  <rect x="262" y="24" width="52" height="71" rx="3" fill="#13223B" />
                  <rect x="346" y="8" width="52" height="87" rx="3" fill="#B4531A" />
                </svg>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div style={{ padding: '12px', background: '#F5F2EA', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
                  <small style={{ fontSize: '12px', color: '#5A6172' }}>Term Loan</small>
                  <b style={{ fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 500 }}>₹ [amount]</b>
                </div>
                <div style={{ padding: '12px', background: '#F5F2EA', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
                  <small style={{ fontSize: '12px', color: '#5A6172' }}>WC Margin</small>
                  <b style={{ fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 500 }}>₹ [amount]</b>
                </div>
                <div style={{ padding: '12px', background: '#F5F2EA', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
                  <small style={{ fontSize: '12px', color: '#5A6172' }}>Subsidy</small>
                  <b style={{ fontFamily: 'var(--mono)', fontSize: '13px', fontWeight: 500 }}>₹ [amount]</b>
                </div>
              </div>

              <div style={{ padding: '12px 16px', background: '#13223B', color: '#F5F2EA', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', fontWeight: 500 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" stroke="#F5F2EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Machinery cost changed — projections updated
              </div>
            </div>
          </div>
        </section>

        {/* 3. PROBLEM STATEMENT SECTION */}
        <section className="band-white">
          <div className="wrap section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '64px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div className="kicker">The problem</div>
              <h2 className="h2">Your Funding Shouldn't Wait for Your Documentation.</h2>
              <p className="lead">Preparing a DPR manually can mean collecting information across multiple files, building financial projections, checking calculations, formatting reports and going through multiple rounds of revisions.</p>
              <p className="lead">That takes time — especially when your project numbers keep changing.</p>
              <blockquote style={{ margin: '12px 0 0', fontFamily: 'var(--serif)', fontSize: '28px', lineHeight: 1.3, fontStyle: 'italic', color: '#13223B' }}>
                “Your business is ready to move. Your DPR should be too.”
              </blockquote>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', justifyContent: 'center' }}>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#5A6172' }}>The result?</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 22px', background: '#F5F2EA', borderRadius: '12px', fontSize: '17px', fontWeight: 500 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#8A3C10" strokeWidth="1.8" /><path d="M12 7v5l3 2" stroke="#8A3C10" strokeWidth="1.8" strokeLinecap="round" /></svg>
                Weeks spent preparing and revising documents
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 22px', background: '#F5F2EA', borderRadius: '12px', fontSize: '17px', fontWeight: 500 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="#8A3C10" strokeWidth="1.8" strokeLinecap="round" /></svg>
                Complex financial projections to build and maintain
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 22px', background: '#F5F2EA', borderRadius: '12px', fontSize: '17px', fontWeight: 500 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="12" height="15" rx="2" stroke="#8A3C10" strokeWidth="1.8" /><path d="M9 3h10a2 2 0 0 1 2 2v12" stroke="#8A3C10" strokeWidth="1.8" strokeLinecap="round" /></svg>
                Repetitive work across Excel, Word and other files
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 22px', background: '#F5F2EA', borderRadius: '12px', fontSize: '17px', fontWeight: 500 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.5" stroke="#8A3C10" strokeWidth="1.8" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2 .8 3 3 3 6" stroke="#8A3C10" strokeWidth="1.8" strokeLinecap="round" /></svg>
                Higher dependence on external consultants
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px 22px', background: '#F5F2EA', borderRadius: '12px', fontSize: '17px', fontWeight: 500 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3 2 20h20L12 3Z" stroke="#8A3C10" strokeWidth="1.8" strokeLinejoin="round" /><path d="M12 10v4M12 17v.5" stroke="#8A3C10" strokeWidth="1.8" strokeLinecap="round" /></svg>
                Delays when your project or funding requirements change
              </div>
            </div>
          </div>
        </section>

        {/* 4. WORKFLOW MODULES SECTION */}
        <section id="how" className="wrap section">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '64px', alignItems: 'end', marginBottom: '56px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div className="kicker">One workflow. Everything you need.</div>
              <h2 className="h2">From Business Data to a Structured DPR</h2>
            </div>
            <p className="lead">Infopace helps transform your business, project and financial information into a structured DPR with the key information needed to present your funding requirement.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '32px', background: '#FFFFFF', border: '1px solid #DDD6C6', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: '#B4531A' }}>01</div>
              <h3 style={{ fontSize: '24px' }}>Business & Project Profile</h3>
              <p style={{ fontSize: '16px', color: '#4B5263' }}>Bring your business, promoter and project information together in one structured workflow.</p>
            </div>
            <div style={{ padding: '32px', background: '#FFFFFF', border: '1px solid #DDD6C6', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: '#B4531A' }}>02</div>
              <h3 style={{ fontSize: '24px' }}>Financial Projections</h3>
              <p style={{ fontSize: '16px', color: '#4B5263' }}>Generate multi-year projected Profit & Loss, Balance Sheet and Cash Flow models.</p>
            </div>
            <div style={{ padding: '32px', background: '#FFFFFF', border: '1px solid #DDD6C6', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: '#B4531A' }}>03</div>
              <h3 style={{ fontSize: '24px' }}>Funding Requirement Analysis</h3>
              <p style={{ fontSize: '16px', color: '#4B5263' }}>Structure your funding requirements, including term loans, working capital margins and applicable subsidy allocations.</p>
            </div>
            <div style={{ padding: '32px', background: '#FFFFFF', border: '1px solid #DDD6C6', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: '#B4531A' }}>04</div>
              <h3 style={{ fontSize: '24px' }}>Feasibility & Supporting Analysis</h3>
              <p style={{ fontSize: '16px', color: '#4B5263' }}>Organize the information required to present your project and financial requirements clearly.</p>
            </div>
            <div style={{ padding: '32px', background: '#13223B', border: '1px solid #13223B', borderRadius: '16px', color: '#F5F2EA', display: 'flex', flexDirection: 'column', gap: '14px', gridColumn: 'span 2' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: '#F0B98E' }}>05</div>
              <h3 style={{ fontSize: '28px' }}>Professional DPR Output</h3>
              <p style={{ fontSize: '16px', color: '#C9CFDA', maxWidth: '560px' }}>Generate a structured report containing your project profile, financial projections, funding requirements and supporting analysis.</p>
            </div>
          </div>
        </section>

        {/* 5. SPEED & EFFICIENCY BAND */}
        <section className="band-navy">
          <div className="wrap section">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '64px', marginBottom: '56px' }}>
              <div>
                <h2 style={{ fontSize: '54px', lineHeight: 1.04 }}>3 Weeks of Work. Now Under 10 Minutes.</h2>
                <p style={{ fontSize: '20px', color: '#F0B98E', fontWeight: 500, marginTop: '20px' }}>Stop rebuilding your financial model every time something changes.</p>
              </div>
              <div>
                <p style={{ fontSize: '18px', lineHeight: 1.65, color: '#C9CFDA' }}>
                  Change a project variable — such as a machinery cost, project investment or other key input — and your financial projections can be updated through the automated calculation workflow.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="m5 12 5 5 9-10" stroke="#F0B98E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg> No starting from a blank template.
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="m5 12 5 5 9-10" stroke="#F0B98E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg> No rebuilding the entire report for every change.
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', border: '1px solid #34435E', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ padding: '26px', borderRight: '1px solid #34435E', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <small style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: '#9AA5B8' }}>Step 1</small>
                <b style={{ fontSize: '18px', fontWeight: 600 }}>Input your information</b>
              </div>
              <div style={{ padding: '26px', borderRight: '1px solid #34435E', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <small style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: '#9AA5B8' }}>Step 2</small>
                <b style={{ fontSize: '18px', fontWeight: 600 }}>Build your financial model</b>
              </div>
              <div style={{ padding: '26px', borderRight: '1px solid #34435E', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <small style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: '#9AA5B8' }}>Step 3</small>
                <b style={{ fontSize: '18px', fontWeight: 600 }}>Review your funding requirements</b>
              </div>
              <div style={{ padding: '26px', background: '#B4531A', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <small style={{ fontFamily: 'var(--mono)', fontSize: '13px', color: '#fff' }}>Step 4</small>
                <b style={{ fontSize: '18px', fontWeight: 600 }}>Generate your DPR</b>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FUNDING USES SECTION */}
        <section id="uses" className="wrap section">
          <div style={{ maxWidth: '760px', display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '56px' }}>
            <h2 className="h2">One DPR. Multiple Funding Needs.</h2>
            <p className="lead">Whether you're preparing for your next business expansion or actively seeking funding, build the documentation around your funding objective.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div style={{ padding: '36px', background: '#FFFFFF', border: '1px solid #DDD6C6', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#F5F2EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 9 12 4l9 5M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 20h18" stroke="#13223B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <h3 style={{ fontSize: '26px' }}>Bank & NBFC Loans</h3>
              <p style={{ flexGrow: 1, fontSize: '16px', color: '#4B5263' }}>Present your business, project, financial projections and funding requirements in a structured DPR.</p>
              <button onClick={scrollToAuth} style={{ all: 'unset', cursor: 'pointer', fontWeight: 600, color: '#B4531A' }}>Create a Loan DPR →</button>
            </div>

            <div style={{ padding: '36px', background: '#FFFFFF', border: '1px solid #DDD6C6', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#F5F2EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 3v3M8 6h8l2 4H6l2-4ZM6 10v9M18 10v9M10 13v6M14 13v6M4 21h16" stroke="#13223B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <h3 style={{ fontSize: '26px' }}>Government Schemes & Subsidies</h3>
              <p style={{ flexGrow: 1, fontSize: '16px', color: '#4B5263' }}>Prepare structured project documentation for government funding and subsidy-related requirements.</p>
              <button onClick={scrollToAuth} style={{ all: 'unset', cursor: 'pointer', fontWeight: 600, color: '#B4531A' }}>Prepare My DPR →</button>
            </div>

            <div style={{ padding: '36px', background: '#FFFFFF', border: '1px solid #DDD6C6', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#F5F2EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke="#13223B" strokeWidth="1.8" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18" stroke="#13223B" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </div>
              <h3 style={{ fontSize: '26px' }}>Investor Funding</h3>
              <p style={{ flexGrow: 1, fontSize: '16px', color: '#4B5263' }}>Bring your business and financial information together into a professional project document for funding discussions.</p>
              <button onClick={scrollToAuth} style={{ all: 'unset', cursor: 'pointer', fontWeight: 600, color: '#B4531A' }}>Build My DPR →</button>
            </div>
          </div>
        </section>

        {/* 7. FEATURES GRID SECTION */}
        <section className="band-white">
          <div className="wrap section">
            <h2 className="h2" style={{ maxWidth: '760px', marginBottom: '56px' }}>Everything You Need to Present Your Project Professionally</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '20px', borderTop: '2px solid #13223B' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="m12 3 9 5-9 5-9-5 9-5ZM3 13l9 5 9-5" stroke="#B4531A" strokeWidth="1.8" strokeLinejoin="round" /></svg>
                <h3 style={{ fontFamily: 'var(--sans)', fontSize: '18px' }}>Structured Information</h3>
                <p style={{ fontSize: '15px', color: '#4B5263' }}>Organize your business and project details into a professional report structure.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '20px', borderTop: '2px solid #13223B' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke="#B4531A" strokeWidth="1.8" /><path d="M8 7h8M8 12h2M12 12h2M8 16h2M12 16h2M16 12v4" stroke="#B4531A" strokeWidth="1.8" strokeLinecap="round" /></svg>
                <h3 style={{ fontFamily: 'var(--sans)', fontSize: '18px' }}>Automated Financial Modeling</h3>
                <p style={{ fontSize: '15px', color: '#4B5263' }}>Generate projected financial statements through the digital workflow.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '20px', borderTop: '2px solid #13223B' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 3a9 9 0 1 0 9 9h-9V3Z" stroke="#B4531A" strokeWidth="1.8" strokeLinejoin="round" /><path d="M15 3.5A9 9 0 0 1 20.5 9H15V3.5Z" stroke="#B4531A" strokeWidth="1.8" strokeLinejoin="round" /></svg>
                <h3 style={{ fontFamily: 'var(--sans)', fontSize: '18px' }}>Funding Analysis</h3>
                <p style={{ fontSize: '15px', color: '#4B5263' }}>Understand and structure the funding requirement around your project.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '20px', borderTop: '2px solid #13223B' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" stroke="#B4531A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <h3 style={{ fontFamily: 'var(--sans)', fontSize: '18px' }}>Faster Revisions</h3>
                <p style={{ fontSize: '15px', color: '#4B5263' }}>Make changes to your project inputs without rebuilding the entire report manually.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '20px', borderTop: '2px solid #13223B' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><circle cx="5" cy="6" r="2.5" stroke="#B4531A" strokeWidth="1.8" /><circle cx="19" cy="18" r="2.5" stroke="#B4531A" strokeWidth="1.8" /><path d="M7.5 6H14a3 3 0 0 1 0 6h-4a3 3 0 0 0 0 6h6.5" stroke="#B4531A" strokeWidth="1.8" strokeLinecap="round" /></svg>
                <h3 style={{ fontFamily: 'var(--sans)', fontSize: '18px' }}>Digital Workflow</h3>
                <p style={{ fontSize: '15px', color: '#4B5263' }}>Move from information collection to DPR generation through one streamlined process.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. TARGET AUDIENCES SECTION */}
        <section id="who" className="wrap section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="kicker">Who it's for</div>
            <h2 className="h2" style={{ fontSize: '44px' }}>Built for Businesses That Need Funding Documentation</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '30px', background: '#FFFFFF', border: '1px solid #DDD6C6', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ fontSize: '22px' }}>For MSMEs</h3>
              <p style={{ fontSize: '16px', color: '#4B5263' }}>Prepare structured DPRs for expansion, working capital, machinery, new projects and other financing requirements.</p>
            </div>
            <div style={{ padding: '30px', background: '#FFFFFF', border: '1px solid #DDD6C6', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ fontSize: '22px' }}>For Startups & Entrepreneurs</h3>
              <p style={{ fontSize: '16px', color: '#4B5263' }}>Turn your business and project information into a professional DPR for funding discussions.</p>
            </div>
            <div style={{ padding: '30px', background: '#FFFFFF', border: '1px solid #DDD6C6', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ fontSize: '22px' }}>For Established Businesses</h3>
              <p style={{ fontSize: '16px', color: '#4B5263' }}>Simplify documentation for new projects, capital expenditure and expansion plans.</p>
            </div>
            <div style={{ padding: '30px', background: '#FFFFFF', border: '1px solid #DDD6C6', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ fontSize: '22px' }}>For Finance Teams & Consultants</h3>
              <p style={{ fontSize: '16px', color: '#4B5263' }}>Reduce repetitive report-preparation work and spend more time reviewing the financial story behind the numbers.</p>
            </div>
          </div>
        </section>

        {/* 9. WHY DIGITAL INTERACTIVE DASHBOARD SECTION */}
        <section id="why" style={{ background: '#EDE7DA', borderTop: '1px solid #DDD6C6', borderBottom: '1px solid #DDD6C6' }}>
          <div className="wrap section">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '64px', alignItems: 'end', marginBottom: '48px' }}>
              <h2 className="h2">Why Build Your DPR Digitally?</h2>
              <p className="lead">Select each benefit to see how a digital workflow changes the way your DPR gets built.</p>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #DDD6C6', borderRadius: '20px', display: 'grid', gridTemplateColumns: '340px 1fr', overflow: 'hidden', boxShadow: '0 30px 60px -40px rgba(19,34,59,.35)' }}>
              {/* Tab Selector Sidebar */}
              <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #DDD6C6', background: '#FBFAF6' }}>
                <button
                  onClick={() => setActiveTab('fast')}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '16px',
                    padding: '24px 26px',
                    borderBottom: '1px solid #DDD6C6',
                    background: activeTab === 'fast' ? '#FFFFFF' : 'transparent',
                    borderLeft: activeTab === 'fast' ? '4px solid #B4531A' : '4px solid transparent',
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1.5px solid #CFC7B5', display: 'flex', alignItems: 'center', justifyContent: 'center', background: activeTab === 'fast' ? '#B4531A' : 'transparent', color: activeTab === 'fast' ? '#fff' : '#13223B' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="1.8" /><path d="M12 9v4l2.5 2M10 2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                  </div>
                  <div>
                    <b style={{ display: 'block', fontSize: '17px', fontWeight: 600, color: '#13223B' }}>Faster Preparation</b>
                    <span style={{ display: 'block', fontSize: '14px', color: '#5A6172', marginTop: '4px' }}>Reduce manual effort in calculating & formatting.</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('struct')}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '16px',
                    padding: '24px 26px',
                    borderBottom: '1px solid #DDD6C6',
                    background: activeTab === 'struct' ? '#FFFFFF' : 'transparent',
                    borderLeft: activeTab === 'struct' ? '4px solid #B4531A' : '4px solid transparent',
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1.5px solid #CFC7B5', display: 'flex', alignItems: 'center', justifyContent: 'center', background: activeTab === 'struct' ? '#B4531A' : 'transparent', color: activeTab === 'struct' ? '#fff' : '#13223B' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" /><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" /><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" /><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" /></svg>
                  </div>
                  <div>
                    <b style={{ display: 'block', fontSize: '17px', fontWeight: 600, color: '#13223B' }}>Better Structure</b>
                    <span style={{ display: 'block', fontSize: '14px', color: '#5A6172', marginTop: '4px' }}>Organized business & financial information.</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('upd')}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '16px',
                    padding: '24px 26px',
                    borderBottom: '1px solid #DDD6C6',
                    background: activeTab === 'upd' ? '#FFFFFF' : 'transparent',
                    borderLeft: activeTab === 'upd' ? '4px solid #B4531A' : '4px solid transparent',
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1.5px solid #CFC7B5', display: 'flex', alignItems: 'center', justifyContent: 'center', background: activeTab === 'upd' ? '#B4531A' : 'transparent', color: activeTab === 'upd' ? '#fff' : '#13223B' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div>
                    <b style={{ display: 'block', fontSize: '17px', fontWeight: 600, color: '#13223B' }}>Easier Financial Updates</b>
                    <span style={{ display: 'block', fontSize: '14px', color: '#5A6172', marginTop: '4px' }}>Update inputs without rebuilding statements.</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('one')}
                  style={{
                    all: 'unset',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '16px',
                    padding: '24px 26px',
                    background: activeTab === 'one' ? '#FFFFFF' : 'transparent',
                    borderLeft: activeTab === 'one' ? '4px solid #B4531A' : '4px solid transparent',
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1.5px solid #CFC7B5', display: 'flex', alignItems: 'center', justifyContent: 'center', background: activeTab === 'one' ? '#B4531A' : 'transparent', color: activeTab === 'one' ? '#fff' : '#13223B' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="M12 3v6M12 15v6M3 12h6M15 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                  </div>
                  <div>
                    <b style={{ display: 'block', fontSize: '17px', fontWeight: 600, color: '#13223B' }}>One Funding Hub</b>
                    <span style={{ display: 'block', fontSize: '14px', color: '#5A6172', marginTop: '4px' }}>Single place for all funding routes.</span>
                  </div>
                </button>
              </div>

              {/* Tab Stage Area */}
              <div style={{ padding: '40px 44px', minHeight: '520px', display: 'flex', flexDirection: 'column' }}>
                {/* TAB 1: FASTER PREPARATION */}
                {activeTab === 'fast' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '30px' }}>Faster Preparation</h3>
                        <p style={{ fontSize: '16px', color: '#4B5263', marginTop: '8px' }}>Reduce the manual effort involved in collecting, calculating and formatting your DPR.</p>
                      </div>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', padding: '6px 10px', borderRadius: '6px', background: '#F5F2EA', color: '#5A6172' }}>Time to a first DPR</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginTop: '12px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 150px', gap: '18px', alignItems: 'center' }}>
                        <div style={{ fontWeight: 600, fontSize: '15px' }}>
                          Manual DPR
                          <small style={{ display: 'block', fontWeight: 400, color: '#5A6172', fontSize: '13px' }}>Excel, Word, consultants</small>
                        </div>
                        <div style={{ height: '54px', background: '#F5F2EA', borderRadius: '10px', overflow: 'hidden', display: 'flex' }}>
                          <div style={{ width: '100%', height: '100%', display: 'flex' }}>
                            <span style={{ flex: 22, background: '#2B3B57', color: '#fff', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Collect</span>
                            <span style={{ flex: 26, background: '#3A4B69', color: '#fff', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Project</span>
                            <span style={{ flex: 16, background: '#4B5C7B', color: '#fff', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Check</span>
                            <span style={{ flex: 16, background: '#5D6D8B', color: '#fff', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Format</span>
                            <span style={{ flex: 20, background: '#6F7E9B', color: '#fff', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Revise</span>
                          </div>
                        </div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: '15px', textAlign: 'right' }}>
                          <b style={{ display: 'block', fontFamily: 'var(--serif)', fontSize: '26px', fontWeight: 600 }}>3 weeks</b> of manual work
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr 150px', gap: '18px', alignItems: 'center' }}>
                        <div style={{ fontWeight: 600, fontSize: '15px' }}>
                          Infopace
                          <small style={{ display: 'block', fontWeight: 400, color: '#5A6172', fontSize: '13px' }}>One digital workflow</small>
                        </div>
                        <div style={{ height: '54px', background: '#F5F2EA', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{ width: '15%', height: '100%', background: '#B4531A' }}></div>
                        </div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: '15px', textAlign: 'right' }}>
                          <b style={{ display: 'block', fontFamily: 'var(--serif)', fontSize: '26px', fontWeight: 600, color: '#B4531A' }}>&lt; 10 min</b> to generate
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: 'auto' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', border: '1px solid #DDD6C6', borderRadius: '10px', fontSize: '15px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m5 12 5 5 9-10" stroke="#1E5A34" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg> Collecting — guided form
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', border: '1px solid #DDD6C6', borderRadius: '10px', fontSize: '15px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m5 12 5 5 9-10" stroke="#1E5A34" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg> Calculating — automated
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', border: '1px solid #DDD6C6', borderRadius: '10px', fontSize: '15px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m5 12 5 5 9-10" stroke="#1E5A34" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg> Formatting — report-ready
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: BETTER STRUCTURE */}
                {activeTab === 'struct' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '30px' }}>Better Structure</h3>
                        <p style={{ fontSize: '16px', color: '#4B5263', marginTop: '8px' }}>Keep your business, project, financial and funding information organized in one workflow.</p>
                      </div>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', padding: '6px 10px', borderRadius: '6px', background: '#F5F2EA', color: '#5A6172' }}>4 inputs → 1 workflow</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 1fr', gap: '20px', alignItems: 'center', flexGrow: 1 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ padding: '14px 16px', border: '1.5px solid #CFC7B5', borderRadius: '10px', background: '#FFFFFF', fontSize: '15px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <i style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#B4531A' }}></i> Business Information
                        </div>
                        <div style={{ padding: '14px 16px', border: '1.5px solid #CFC7B5', borderRadius: '10px', background: '#FFFFFF', fontSize: '15px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <i style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#B4531A' }}></i> Project Details
                        </div>
                        <div style={{ padding: '14px 16px', border: '1.5px solid #CFC7B5', borderRadius: '10px', background: '#FFFFFF', fontSize: '15px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <i style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#B4531A' }}></i> Financial Data
                        </div>
                        <div style={{ padding: '14px 16px', border: '1.5px solid #CFC7B5', borderRadius: '10px', background: '#FFFFFF', fontSize: '15px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <i style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#B4531A' }}></i> Funding Requirement
                        </div>
                      </div>

                      <div style={{ padding: '24px 16px', borderRadius: '14px', background: '#13223B', color: '#F5F2EA', display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'center' }}>
                        <b style={{ fontFamily: 'var(--serif)', fontSize: '20px', fontWeight: 600 }}>One Workflow</b>
                        <small style={{ fontSize: '12px', color: '#C9CFDA' }}>Linked & Checked</small>
                      </div>

                      <div style={{ padding: '20px', border: '1.5px solid #13223B', borderRadius: '12px', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <b style={{ fontFamily: 'var(--serif)', fontSize: '19px' }}>Structured DPR</b>
                        <span style={{ fontSize: '13px', color: '#5A6172' }}>✓ Project Profile</span>
                        <span style={{ fontSize: '13px', color: '#5A6172' }}>✓ Financial Projections</span>
                        <span style={{ fontSize: '13px', color: '#5A6172' }}>✓ Funding Requirements</span>
                        <span style={{ fontSize: '13px', color: '#5A6172' }}>✓ Supporting Analysis</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: EASIER FINANCIAL UPDATES (INTERACTIVE SIMULATOR) */}
                {activeTab === 'upd' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '30px' }}>Easier Financial Updates</h3>
                        <p style={{ fontSize: '16px', color: '#4B5263', marginTop: '8px' }}>Make changes to project inputs without manually rebuilding every statement. Move the slider:</p>
                      </div>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', padding: '6px 10px', borderRadius: '6px', background: '#E6EFE8', color: '#1E5A34', fontWeight: 600 }}>Live Simulator</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '28px', flexGrow: 1 }}>
                      <div style={{ padding: '22px', background: '#F5F2EA', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <label style={{ fontWeight: 600, fontSize: '15px' }}>Machinery Cost</label>
                        <output style={{ fontFamily: 'var(--serif)', fontSize: '34px', fontWeight: 600, color: '#B4531A' }}>₹ {machineryCost} L</output>
                        <input
                          type="range"
                          min="20"
                          max="150"
                          step="5"
                          value={machineryCost}
                          onChange={handleSliderChange}
                          style={{ width: '100%', accentColor: '#B4531A', height: '28px', cursor: 'pointer' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: '12px', color: '#5A6172' }}>
                          <span>₹ 20 L</span>
                          <span>₹ 150 L</span>
                        </div>

                        <div style={{ borderTop: '1px solid #CFC7B5', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Other project costs</span>
                            <b>₹ 40 L</b>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, borderTop: '1px dashed #CFC7B5', paddingTop: '8px' }}>
                            <span>Total project cost</span>
                            <b style={{ color: '#B4531A' }}>₹ {totalProjectCost} L</b>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Term loan (75%)</span>
                            <b>₹ {termLoan75.toFixed(1)} L</b>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Promoter margin (25%)</span>
                            <b>₹ {promoterMargin25.toFixed(1)} L</b>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                          <div style={{ padding: '18px', border: flashUpdated ? '2px solid #B4531A' : '1px solid #DDD6C6', borderRadius: '12px', background: flashUpdated ? '#F6E6D8' : '#FFFFFF', transition: 'all 0.3s ease' }}>
                            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Profit & Loss</h4>
                            <p style={{ fontSize: '12px', color: '#5A6172', marginTop: '6px' }}>Depr / yr</p>
                            <b style={{ fontFamily: 'var(--mono)', fontSize: '16px', color: '#13223B' }}>₹ {annualDepreciation.toFixed(1)} L</b>
                          </div>

                          <div style={{ padding: '18px', border: flashUpdated ? '2px solid #B4531A' : '1px solid #DDD6C6', borderRadius: '12px', background: flashUpdated ? '#F6E6D8' : '#FFFFFF', transition: 'all 0.3s ease' }}>
                            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Balance Sheet</h4>
                            <p style={{ fontSize: '12px', color: '#5A6172', marginTop: '6px' }}>Fixed assets</p>
                            <b style={{ fontFamily: 'var(--mono)', fontSize: '16px', color: '#13223B' }}>₹ {totalProjectCost.toFixed(0)} L</b>
                          </div>

                          <div style={{ padding: '18px', border: flashUpdated ? '2px solid #B4531A' : '1px solid #DDD6C6', borderRadius: '12px', background: flashUpdated ? '#F6E6D8' : '#FFFFFF', transition: 'all 0.3s ease' }}>
                            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Cash Flow</h4>
                            <p style={{ fontSize: '12px', color: '#5A6172', marginTop: '6px' }}>Repayment / yr</p>
                            <b style={{ fontFamily: 'var(--mono)', fontSize: '16px', color: '#13223B' }}>₹ {annualRepayment.toFixed(1)} L</b>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', background: '#E6EFE8', color: '#1E5A34', borderRadius: '10px', fontSize: '14px', fontWeight: 500, marginTop: 'auto' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="m5 12 5 5 9-10" stroke="#1E5A34" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          One input changed — all statements auto-recalculated.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: ONE FUNDING HUB */}
                {activeTab === 'one' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ fontSize: '30px' }}>One Place for Your Funding Documentation</h3>
                        <p style={{ fontSize: '16px', color: '#4B5263', marginTop: '8px' }}>Prepare DPRs for loans, government schemes, subsidies and investor funding through one digital solution.</p>
                      </div>
                      <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', padding: '6px 10px', borderRadius: '6px', background: '#F5F2EA', color: '#5A6172' }}>4 funding routes</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', margin: 'auto 0' }}>
                      <div style={{ padding: '20px', background: '#FFFFFF', border: '1.5px solid #DDD6C6', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 9 12 4l9 5M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 20h18" stroke="#13223B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Bank & NBFC Loans
                      </div>

                      <div style={{ padding: '20px', background: '#FFFFFF', border: '1.5px solid #DDD6C6', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 3v3M8 6h8l2 4H6l2-4ZM6 10v9M18 10v9M10 13v6M14 13v6M4 21h16" stroke="#13223B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Government Schemes
                      </div>

                      <div style={{ padding: '20px', background: '#FFFFFF', border: '1.5px solid #DDD6C6', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="#13223B" strokeWidth="1.8" /><path d="M9 9h6M9 12h6M12 12c0 3-2 4-3 4l5 0" stroke="#13223B" strokeWidth="1.8" strokeLinecap="round" /></svg>
                        Capital Subsidies
                      </div>

                      <div style={{ padding: '20px', background: '#FFFFFF', border: '1.5px solid #DDD6C6', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke="#13223B" strokeWidth="1.8" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18" stroke="#13223B" strokeWidth="1.8" strokeLinecap="round" /></svg>
                        Investor Pitching
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 10. CTA SECTION */}
        <section id="create-dpr" className="wrap section">
          <div style={{ background: '#13223B', color: '#F5F2EA', borderRadius: '24px', padding: '80px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px' }}>
            <h2 style={{ fontSize: '50px', maxWidth: '820px', color: '#FFFFFF' }}>Don't Let DPR Preparation Slow Down Your Funding Plans.</h2>
            <p style={{ fontSize: '19px', color: '#C9CFDA', maxWidth: '620px' }}>Your project shouldn't spend weeks waiting for documentation. Build your DPR in under 10 minutes.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', marginTop: '8px' }}>
              <button className="btn btn-accent btn-lg" onClick={scrollToAuth}>Create My DPR</button>
              <button className="btn btn-line-light btn-lg" onClick={scrollToAuth}>Connect with Team</button>
            </div>
            <p style={{ fontSize: '13px', color: '#9AA5B8', maxWidth: '640px', marginTop: '12px' }}>
              The DPR supports your funding application and documentation process. Final funding or credit decisions remain with the relevant lender, institution or investor.
            </p>
          </div>
        </section>

        {/* 11. FAQ ACCORDION SECTION */}
        <section id="faq" className="band-white">
          <div className="wrap section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 className="h2" style={{ fontSize: '44px' }}>Frequently Asked Questions</h2>
              <p style={{ color: '#4B5263' }}>Still unsure? <button onClick={scrollToAuth} style={{ all: 'unset', fontWeight: 600, color: '#B4531A', cursor: 'pointer' }}>Talk to our team</button>.</p>
            </div>

            <div style={{ borderTop: '1px solid #DDD6C6' }}>
              <details style={{ borderBottom: '1px solid #DDD6C6', padding: '22px 0' }}>
                <summary style={{ fontSize: '19px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>What is a DPR?</summary>
                <p style={{ marginTop: '12px', fontSize: '16px', color: '#4B5263' }}>A Detailed Project Report is a structured document that presents a business or project, its financial requirements, projections and supporting analysis for bank sanction or funding.</p>
              </details>

              <details style={{ borderBottom: '1px solid #DDD6C6', padding: '22px 0' }}>
                <summary style={{ fontSize: '19px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>Who can use this DPR tool?</summary>
                <p style={{ marginTop: '12px', fontSize: '16px', color: '#4B5263' }}>The solution is designed for startups, MSMEs, entrepreneurs and established businesses seeking loans, government funding, subsidies or investor funding.</p>
              </details>

              <details style={{ borderBottom: '1px solid #DDD6C6', padding: '22px 0' }}>
                <summary style={{ fontSize: '19px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>What can I prepare the DPR for?</summary>
                <p style={{ marginTop: '12px', fontSize: '16px', color: '#4B5263' }}>You can use it for Bank/NBFC loans, government schemes (PMEGP, Mudra, PMFME) and subsidies, and investor funding discussions.</p>
              </details>

              <details style={{ borderBottom: '1px solid #DDD6C6', padding: '22px 0' }}>
                <summary style={{ fontSize: '19px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>What financial information does the tool generate?</summary>
                <p style={{ marginTop: '12px', fontSize: '16px', color: '#4B5263' }}>The platform's financial workflow includes projected Profit & Loss, Balance Sheet and Cash Flow models along with DSCR ratio and Tandon Committee assessment.</p>
              </details>

              <details style={{ borderBottom: '1px solid #DDD6C6', padding: '22px 0' }}>
                <summary style={{ fontSize: '19px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>Do I need to start from a blank template?</summary>
                <p style={{ marginTop: '12px', fontSize: '16px', color: '#4B5263' }}>No. The workflow is designed to collect your business, project and financial information and structure it into the DPR automatically.</p>
              </details>

              <details style={{ borderBottom: '1px solid #DDD6C6', padding: '22px 0' }}>
                <summary style={{ fontSize: '19px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>Can I change my project numbers later?</summary>
                <p style={{ marginTop: '12px', fontSize: '16px', color: '#4B5263' }}>The automated calculation workflow allows project variables to be adjusted without manually rebuilding the entire financial model.</p>
              </details>

              <details style={{ borderBottom: '1px solid #DDD6C6', padding: '22px 0' }}>
                <summary style={{ fontSize: '19px', fontWeight: 600, cursor: 'pointer', outline: 'none' }}>Does a DPR guarantee funding approval?</summary>
                <p style={{ marginTop: '12px', fontSize: '16px', color: '#4B5263' }}>No. A DPR helps structure and present your project and financial requirements; final funding decisions depend on the lender, government institution or investor.</p>
              </details>
            </div>
          </div>
        </section>

        {/* 12. CONTACT & INTEGRATED AUTH PANEL SECTION */}
        <section id="auth-panel" className="wrap section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '64px', alignItems: 'start' }}>
          {/* Left Side: Contact Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div className="kicker">Connect with our team</div>
            <h2 className="h2" style={{ fontSize: '44px' }}>Tell us about your project.</h2>
            <p className="lead">Share a few details and what you need help with. Our team will get back to you to discuss your DPR and funding documentation.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', fontSize: '16px', color: '#3F4758' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#B4531A" strokeWidth="1.8" /><path d="m4 7 8 6 8-6" stroke="#B4531A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span>support@infopace.com</span>
              </div>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', fontSize: '16px', color: '#3F4758' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" stroke="#B4531A" strokeWidth="1.8" strokeLinejoin="round" /></svg>
                <span>+91 98800 11223</span>
              </div>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', fontSize: '16px', color: '#3F4758' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" stroke="#B4531A" strokeWidth="1.8" /><circle cx="12" cy="9" r="2.5" stroke="#B4531A" strokeWidth="1.8" /></svg>
                <span>Peenya Industrial Area, Bengaluru, Karnataka</span>
              </div>
            </div>

            {/* Optional Enquiry Form */}
            <div style={{ marginTop: '24px', padding: '24px', background: '#FFFFFF', border: '1px solid #DDD6C6', borderRadius: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>Quick Project Enquiry</h4>
              {contactSent ? (
                <div style={{ padding: '12px', background: '#E6EFE8', color: '#1E5A34', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>
                  ✓ Thanks! Your enquiry has been received. Our team will contact you shortly.
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {contactError && <div style={{ color: '#A3261B', fontSize: '13px', fontWeight: 600 }}>{contactError}</div>}
                  <input type="text" placeholder="Full name" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #CFC7B5', fontSize: '14px' }} />
                  <input type="email" placeholder="Email address" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #CFC7B5', fontSize: '14px' }} />
                  <input type="tel" placeholder="Phone number" value={contactForm.phone} onChange={e => setContactForm({ ...contactForm, phone: e.target.value })} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #CFC7B5', fontSize: '14px' }} />
                  
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '13px' }}>
                    <label><input type="radio" name="purpose" value="Loan" checked={contactForm.purpose === 'Loan'} onChange={e => setContactForm({ ...contactForm, purpose: e.target.value })} /> Bank Loan</label>
                    <label><input type="radio" name="purpose" value="Subsidy" checked={contactForm.purpose === 'Subsidy'} onChange={e => setContactForm({ ...contactForm, purpose: e.target.value })} /> Scheme / Subsidy</label>
                    <label><input type="radio" name="purpose" value="Investor" checked={contactForm.purpose === 'Investor'} onChange={e => setContactForm({ ...contactForm, purpose: e.target.value })} /> Investor Pitch</label>
                  </div>

                  <textarea placeholder="Tell us briefly about your project..." value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} rows={2} style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #CFC7B5', fontSize: '14px' }} />

                  <label style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#5A6172' }}>
                    <input type="checkbox" checked={contactForm.consent} onChange={e => setContactForm({ ...contactForm, consent: e.target.checked })} />
                    I agree to be contacted by the Infopace team.
                  </label>

                  <button type="submit" className="btn btn-accent" style={{ minHeight: '40px', padding: '8px 16px', fontSize: '14px' }}>Send enquiry</button>
                </form>
              )}
            </div>
          </div>

          {/* Right Side: Seamless Auth Panel (LoginCard / RegisterCard) */}
          <div style={{ background: '#FFFFFF', border: '1px solid #DDD6C6', borderRadius: '24px', padding: '32px 24px', boxShadow: '0 30px 60px -40px rgba(19,34,59,.35)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '26px', color: '#13223B', marginBottom: '6px' }}>
                {authView === 'login' ? 'Sign In to Build Your DPR' : 'Create Your Infopace Account'}
              </h3>
              <p style={{ fontSize: '15px', color: '#5A6172' }}>
                {authView === 'login'
                  ? 'Access your funding reports and auto-saved drafts.'
                  : 'Start your funding-ready DPR in under 10 minutes.'}
              </p>
            </div>

            {authView === 'login' ? (
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
        </section>
      </main>

      {/* 13. FOOTER */}
      <footer style={{ background: '#13223B', color: '#C9CFDA' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', padding: '72px 0 56px' }}>
            <div>
              <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#FFFFFF' }}>
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                  <rect x="1" y="1" width="28" height="28" rx="6" stroke="#F5F2EA" strokeWidth="2" />
                  <path d="M8 20V14M13 20V10M18 20V16M23 20V8" stroke="#F0B98E" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
                <span style={{ fontFamily: 'var(--serif)', fontSize: '24px', fontWeight: 700 }}>Infopace</span>
              </a>
              <p style={{ fontSize: '15px', maxWidth: '340px', marginTop: '16px', color: '#C9CFDA' }}>
                Build smarter. Prepare faster. Move your funding process forward with a structured, funding-ready DPR.
              </p>
            </div>

            <div>
              <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase' }}>Product</h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px' }}>
                <li><a href="#how" style={{ color: '#C9CFDA', textDecoration: 'none' }}>How it works</a></li>
                <li><a href="#uses" style={{ color: '#C9CFDA', textDecoration: 'none' }}>Funding needs</a></li>
                <li><a href="#why" style={{ color: '#C9CFDA', textDecoration: 'none' }}>Why digital</a></li>
                <li><a href="#faq" style={{ color: '#C9CFDA', textDecoration: 'none' }}>FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase' }}>Company</h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px' }}>
                <li><a href="#auth-panel" style={{ color: '#C9CFDA', textDecoration: 'none' }}>Contact</a></li>
                <li><a href="#privacy" style={{ color: '#C9CFDA', textDecoration: 'none' }}>Privacy Policy</a></li>
                <li><a href="#terms" style={{ color: '#C9CFDA', textDecoration: 'none' }}>Terms of Use</a></li>
              </ul>
            </div>

            <div>
              <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase' }}>Reach Us</h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px' }}>
                <li>support@infopace.com</li>
                <li>+91 98800 11223</li>
                <li>Peenya Industrial Area, Bengaluru</li>
              </ul>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #34435E', padding: '24px 0 32px', display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: '13px', color: '#9AA5B8', flexWrap: 'wrap' }}>
            <span>© {new Date().getFullYear()} Infopace DPR. All rights reserved.</span>
            <span>Final funding or credit decisions remain with the relevant lender, institution or investor.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
