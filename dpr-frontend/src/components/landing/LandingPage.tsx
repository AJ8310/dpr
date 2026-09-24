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
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [activeSectorTab, setActiveSectorTab] = useState<'dairy' | 'food' | 'solar'>('dairy');

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

  return (
    <div style={{ minHeight: '100vh', position: 'relative', background: '#F2FAFA', color: '#123B4A', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      {/* Pure Vector SVG Background Waves Across Background */}
      <BackgroundWaves />
      
      {/* 1. Header / Navigation */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #DDF4F3',
          padding: '0.8rem 2rem',
          boxShadow: '0 4px 20px rgba(0, 111, 120, 0.05)',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo / Brand */}
          <div
            onClick={() => scrollToSection('hero')}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
          >
            <img
              src="/VKF_logo.png"
              alt="Vision Karnataka Foundation Logo"
              style={{ height: '68px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0, 70, 78, 0.15))' }}
            />
            <div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#00464E', letterSpacing: '-0.3px', lineHeight: 1.15 }}>
                VKF DPR
              </div>
              <div style={{ fontSize: '0.78rem', color: '#008C95', fontWeight: 600, letterSpacing: '0.2px' }}>
                Smart Reports. Stronger Decisions.
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="landing-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
            <button onClick={() => scrollToSection('hero')} style={navBtnStyle}>Home</button>
            <button onClick={() => scrollToSection('features')} style={navBtnStyle}>Features</button>
            <button onClick={() => scrollToSection('how-it-works')} style={navBtnStyle}>How It Works</button>
            <button onClick={() => scrollToSection('sectors')} style={navBtnStyle}>Sector Intelligence</button>
            <button onClick={() => scrollToSection('dpr-types')} style={navBtnStyle}>DPR Types</button>
            <button onClick={() => scrollToSection('why-vkf')} style={navBtnStyle}>Why VKF DPR</button>
          </nav>

          {/* Primary CTA */}
          <button
            onClick={scrollToAuth}
            style={{
              background: 'linear-gradient(135deg, #008C95 0%, #006F78 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.65rem 1.4rem',
              borderRadius: '24px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 140, 149, 0.25)',
              transition: 'all 0.2s ease',
            }}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section id="hero" style={{ padding: '3.5rem 1.5rem 4.5rem 1.5rem', position: 'relative', zIndex: 5, overflow: 'hidden', scrollMarginTop: '90px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 480px', gap: '3rem', alignItems: 'center' }}>
          
          {/* Left Column: Hero Content directly on Background Waves (No Tile Card Container) */}
          <div style={{ padding: '0.5rem 0' }}>
            {/* Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#E6F7F7',
                border: '1.5px solid #B2E8E6',
                color: '#00464E',
                padding: '0.45rem 1.1rem',
                borderRadius: '30px',
                fontSize: '0.82rem',
                fontWeight: 700,
                marginBottom: '1.4rem',
                boxShadow: '0 4px 14px rgba(0, 70, 78, 0.08)',
              }}
            >
              <i className="fas fa-sparkles" style={{ color: '#FF7A00' }} />
              AI-Powered Dynamic DPR Platform
            </div>

            {/* Main Heading */}
            <h1
              style={{
                fontSize: '2.65rem',
                fontWeight: 800,
                color: '#00383F',
                lineHeight: 1.2,
                letterSpacing: '-0.6px',
                marginBottom: '1.2rem',
                textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)',
              }}
            >
              From Business Idea to Bank-Ready DPR — <span style={{ color: '#008C95' }}>All in One Platform</span>
            </h1>

            {/* Supporting Content */}
            <p style={{ fontSize: '1.05rem', color: '#1A434D', lineHeight: 1.65, marginBottom: '1.2rem', fontWeight: 600 }}>
              Transform your business idea into a professional, data-driven Detailed Project Report with guided questionnaires, financial analysis, market intelligence, government scheme evaluation, risk assessment, and automated document generation.
            </p>
            <p style={{ fontSize: '0.95rem', color: '#00464E', lineHeight: 1.6, marginBottom: '1.8rem', fontWeight: 700, background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(10px)', padding: '0.9rem 1.2rem', borderRadius: '14px', borderLeft: '4px solid #FF7A00', border: '1px solid rgba(0, 140, 149, 0.2)' }}>
              No complex templates. No repetitive calculations. No manual report preparation. Just answer the right questions and let VKF DPR build your report.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <button
                onClick={scrollToAuth}
                style={{
                  background: 'linear-gradient(135deg, #008C95 0%, #006F78 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.95rem 1.9rem',
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(0, 140, 149, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                }}
              >
                Create Your DPR →
              </button>

              <button
                onClick={() => scrollToSection('how-it-works')}
                style={{
                  background: '#FFFFFF',
                  color: '#00464E',
                  border: '1.5px solid #CBD5E1',
                  padding: '0.95rem 1.7rem',
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                }}
              >
                See How It Works
              </button>
            </div>

            {/* Micro Feature Badges */}
            <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', fontSize: '0.85rem', color: '#00383F', fontWeight: 800 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#008C95' }} /> Bank Loan Compliant
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#008C95' }} /> Scheme & Subsidy Evaluation
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#008C95' }} /> 5-Year Financial Engine
              </span>
            </div>
          </div>

          {/* Right Column: Embedded Interactive Login / Register Panel */}
          <div id="auth-panel" style={{ position: 'relative' }}>
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '26px',
                padding: '0.6rem',
                boxShadow: '0 24px 60px rgba(0, 70, 78, 0.12)',
                border: '1.5px solid #DDF4F3',
              }}
            >
              {/* Top Auth Switcher Bar */}
              <div style={{ display: 'flex', background: '#F2FAFA', padding: '4px', borderRadius: '20px', marginBottom: '0.8rem' }}>
                <button
                  onClick={() => setAuthView('login')}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '16px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    background: authView === 'login' ? '#008C95' : 'transparent',
                    color: authView === 'login' ? '#FFFFFF' : '#006F78',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthView('register')}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '16px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    background: authView === 'register' ? '#008C95' : 'transparent',
                    color: authView === 'register' ? '#FFFFFF' : '#006F78',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Create Account
                </button>
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
          </div>

        </div>
      </section>

      {/* 3. What Makes VKF DPR Different */}
      <section id="features" style={{ padding: '5rem 1.5rem', background: 'rgba(255, 255, 255, 0.88)', backdropFilter: 'blur(12px)', position: 'relative', zIndex: 5, scrollMarginTop: '90px', borderTop: '1px solid #E6F7F7' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 3.5rem auto' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#00464E', marginBottom: '1rem' }}>
              More Than a DPR Generator
            </h2>
            <p style={{ fontSize: '1.02rem', color: '#66818C', lineHeight: 1.65 }}>
              Traditional DPR preparation requires collecting information manually, searching for market data, preparing financial projections, checking government schemes, and formatting lengthy documents. VKF DPR brings these activities together into one intelligent workflow.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.8rem' }}>
            
            <FeatureCard
              icon="🧠"
              title="AI-Powered Intelligence"
              description="Get intelligent analysis, recommendations, risk insights and business context throughout your DPR journey."
            />

            <FeatureCard
              icon="🎯"
              title="Sector-Specific Questionnaires"
              description="Answer questions designed specifically for your business sector, activity and project type instead of filling a generic form."
            />

            <FeatureCard
              icon="📊"
              title="Financial Intelligence"
              description="Generate structured project costs, funding requirements, profitability, break-even analysis and financial ratios using deterministic calculations."
            />

            <FeatureCard
              icon="📄"
              title="Automated DPR Generation"
              description="Convert your validated project information and analysis into professional PDF, DOCX and HTML DPR documents."
            />

          </div>
        </div>
      </section>

      {/* 4. How VKF DPR Works */}
      <section id="how-it-works" style={{ padding: '5rem 1.5rem', background: 'rgba(242, 250, 250, 0.82)', backdropFilter: 'blur(12px)', position: 'relative', zIndex: 5, scrollMarginTop: '90px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#00464E', marginBottom: '0.6rem' }}>
              How It Works
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#008C95', fontWeight: 600 }}>
              From your business idea to a professional DPR in a guided step-by-step process.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { step: 'Step 1', title: 'Tell Us About Your Project', text: 'Select your DPR type, business sector, business activity, location and project details.' },
              { step: 'Step 2', title: 'Answer Sector-Specific Questions', text: 'VKF DPR dynamically generates questions based on your sector, activity, project type and business requirements.' },
              { step: 'Step 3', title: 'Build Project & Financial Model', text: 'Enter project costs, assets, manpower, funding requirements, revenue assumptions and other business information.' },
              { step: 'Step 4', title: 'Get Business Intelligence', text: 'The platform analyses your project using market research, industry information, geographical insights and technology considerations.' },
              { step: 'Step 5', title: 'Check Schemes & Risks', text: 'Identify potentially applicable government schemes, subsidy opportunities, project risks and recommended mitigations.' },
              { step: 'Step 6', title: 'Review Your DPR', text: 'Review generated sections, financial information, research findings, tables and recommendations before finalizing.' },
              { step: 'Step 7', title: 'Generate Your Document', text: 'Compile your approved content into a professional DPR available in PDF, DOCX and HTML formats.' },
              { step: 'Step 8', title: 'Download & Use', text: 'Download your completed report for bank financing, government schemes, investors or business planning.' },
            ].map((s, idx) => (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '18px',
                  padding: '1.6rem 1.4rem',
                  border: '1px solid #DDF4F3',
                  boxShadow: '0 6px 18px rgba(0, 70, 78, 0.04)',
                  position: 'relative',
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FF7A00', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  {s.step}
                </div>
                <h3 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#00464E', marginBottom: '0.65rem' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#66818C', lineHeight: 1.55 }}>
                  {s.text}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Sector-Specific Intelligence */}
      <section id="sectors" style={{ padding: '5rem 1.5rem', background: 'rgba(255, 255, 255, 0.88)', backdropFilter: 'blur(12px)', position: 'relative', zIndex: 5, scrollMarginTop: '90px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 3rem auto' }}>
            <div style={{ display: 'inline-block', background: '#FFF3E6', color: '#FF7A00', padding: '0.35rem 0.9rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.8rem' }}>
              SECTOR-SPECIFIC INTELLIGENCE
            </div>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 800, color: '#00464E', marginBottom: '1rem' }}>
              Your Business Is Unique. Your DPR Should Be Too.
            </h2>
            <p style={{ fontSize: '1rem', color: '#66818C', lineHeight: 1.6 }}>
              VKF DPR does not treat every business the same. Once you select your business sector and specific activity, the platform dynamically determines the information required for your DPR and presents relevant questions, calculations, intelligence and document sections.
            </p>
          </div>

          {/* Interactive Sector Switcher Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveSectorTab('dairy')}
              style={sectorTabBtnStyle(activeSectorTab === 'dairy')}
            >
              🌾 Agriculture → Dairy Farming
            </button>
            <button
              onClick={() => setActiveSectorTab('food')}
              style={sectorTabBtnStyle(activeSectorTab === 'food')}
            >
              🏭 Manufacturing → Food Processing
            </button>
            <button
              onClick={() => setActiveSectorTab('solar')}
              style={sectorTabBtnStyle(activeSectorTab === 'solar')}
            >
              ☀️ Renewable Energy → Solar Power Plant
            </button>
          </div>

          {/* Tab Content Display */}
          <div
            style={{
              background: '#F8FCFC',
              borderRadius: '22px',
              padding: '2.2rem',
              border: '1.5px solid #DDF4F3',
              boxShadow: '0 12px 35px rgba(0, 70, 78, 0.06)',
            }}
          >
            {activeSectorTab === 'dairy' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00464E', marginBottom: '1.2rem' }}>
                  Dairy Farming DPR Requirements Checklist:
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.9rem' }}>
                  {[
                    'Land and location status', 'Herd capacity & breed details', 'Feed & fodder requirements',
                    'Milk production yields', 'Veterinary care requirements', 'Milking equipment & chillers',
                    'Labour & staffing hierarchy', 'Raw material inputs', 'Market & off-taker agreements',
                    'Project cost breakup', 'Revenue & yield assumptions', 'DSCR & cash flow model'
                  ].map((item, i) => (
                    <div key={i} style={checklistStyle}>
                      <i className="fas fa-check" style={{ color: '#008C95' }} /> {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSectorTab === 'food' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00464E', marginBottom: '1.2rem' }}>
                  Food Processing DPR Requirements Checklist:
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.9rem' }}>
                  {[
                    'Manufacturing process flow', 'Production capacity (Units/Day)', 'Machinery & automation specs',
                    'Raw material procurement', 'Power & water utility needs', 'Factory built-up area',
                    'FSSAI & quality standards', 'Production cost structure', 'Distribution network',
                    'Market demand & competitors', 'Working capital cycle', 'Break-even capacity analysis'
                  ].map((item, i) => (
                    <div key={i} style={checklistStyle}>
                      <i className="fas fa-check" style={{ color: '#008C95' }} /> {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSectorTab === 'solar' && (
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#00464E', marginBottom: '1.2rem' }}>
                  Solar Power Plant DPR Requirements Checklist:
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.9rem' }}>
                  {[
                    'Solar irradiation data', 'Land area & topography', 'Grid interconnection clearance',
                    'PV Module & Inverter specs', 'PPA agreement terms', 'HV Substation engineering',
                    'O&M cost estimations', 'Tariff rate structure', 'Corporate NPV & WACC',
                    'Project & Equity IRR', 'Environmental clearances', 'Debt-Equity funding ratio'
                  ].map((item, i) => (
                    <div key={i} style={checklistStyle}>
                      <i className="fas fa-check" style={{ color: '#008C95' }} /> {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Highlight Banner */}
          <div
            style={{
              marginTop: '2.5rem',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #00464E 0%, #006F78 100%)',
              color: '#FFFFFF',
              padding: '1.4rem 2rem',
              borderRadius: '16px',
              fontWeight: 800,
              fontSize: '1.1rem',
              letterSpacing: '0.2px',
              boxShadow: '0 8px 24px rgba(0, 70, 78, 0.2)',
            }}
          >
            ⚡ One platform. Multiple industries. Dynamically tailored DPR workflows.
          </div>

        </div>
      </section>

      {/* 6. Supported DPR Types */}
      <section id="dpr-types" style={{ padding: '5rem 1.5rem', background: 'rgba(242, 250, 250, 0.82)', backdropFilter: 'blur(12px)', position: 'relative', zIndex: 5, scrollMarginTop: '90px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 3.5rem auto' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#00464E', marginBottom: '0.6rem' }}>
              Choose the Purpose of Your DPR
            </h2>
            <p style={{ fontSize: '1rem', color: '#66818C' }}>
              Tailored structure and analytics tailored specifically for your target audience.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            {/* Card 1: Bank Loan */}
            <div style={dprTypeCardStyle}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏦</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#00464E', marginBottom: '0.8rem' }}>
                Bank Loan DPR
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#66818C', lineHeight: 1.6, marginBottom: '1.8rem', flex: 1 }}>
                Prepare a structured DPR designed to support bank financing and credit evaluation with detailed project costs, means of finance, financial projections, repayment analysis, DSCR and business viability.
              </p>
              <button onClick={scrollToAuth} style={cardCtaBtnStyle}>
                Create Bank Loan DPR →
              </button>
            </div>

            {/* Card 2: Government Scheme */}
            <div style={dprTypeCardStyle}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏛️</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#00464E', marginBottom: '0.8rem' }}>
                Government Scheme & Subsidy DPR
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#66818C', lineHeight: 1.6, marginBottom: '1.8rem', flex: 1 }}>
                Build a project report aligned with government scheme requirements, including eligibility evaluation, project costs, subsidy considerations, financial analysis and supporting documentation.
              </p>
              <button onClick={scrollToAuth} style={cardCtaBtnStyle}>
                Create Scheme DPR →
              </button>
            </div>

            {/* Card 3: Investor Pitch */}
            <div style={dprTypeCardStyle}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💼</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#00464E', marginBottom: '0.8rem' }}>
                Investor / Business Pitch DPR
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#66818C', lineHeight: 1.6, marginBottom: '1.8rem', flex: 1 }}>
                Present your business opportunity with market analysis, business model, growth potential, financial projections, competitive positioning, risks and investment requirements.
              </p>
              <button onClick={scrollToAuth} style={cardCtaBtnStyle}>
                Create Investor DPR →
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Why Choose VKF DPR? */}
      <section id="why-vkf" style={{ padding: '5rem 1.5rem', background: 'rgba(255, 255, 255, 0.88)', backdropFilter: 'blur(12px)', position: 'relative', zIndex: 5, scrollMarginTop: '90px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#00464E', marginBottom: '0.6rem' }}>
              Why Businesses Choose VKF DPR
            </h2>
            <p style={{ fontSize: '1rem', color: '#66818C' }}>
              Built for reliability, speed, accuracy, and institutional compliance.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.4rem' }}>
            {[
              { num: '01', title: 'Industry-Aware', text: 'Built to understand different sectors, activities and business models instead of relying on a one-size-fits-all questionnaire.' },
              { num: '02', title: 'Data-Driven', text: 'Your DPR is built from structured project information, validated calculations and relevant research.' },
              { num: '03', title: 'Financially Reliable', text: 'Critical financial figures are generated through a deterministic financial engine rather than allowing AI to invent numbers.' },
              { num: '04', title: 'Research-Backed', text: 'Market and industry insights can retain source information, verification status and confidence levels.' },
              { num: '05', title: 'Scheme Intelligence', text: 'Evaluate potentially applicable government schemes based on your project information.' },
              { num: '06', title: 'Risk-Aware', text: 'Identify market, financial, operational, technical, regulatory, supply-chain and other project risks.' },
              { num: '07', title: 'Review Before Generation', text: 'You remain in control. Review and approve generated sections before compiling the final report.' },
              { num: '08', title: 'Professional Documents', text: 'Generate structured DPRs in PDF, DOCX and HTML formats.' },
              { num: '09', title: 'Secure by Design', text: 'Project-level authorization, controlled access and protected project information help keep your business data isolated.' },
              { num: '10', title: 'Built for Scale', text: 'Designed as a production-grade platform capable of supporting high-volume DPR workflows.' },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: '#F8FCFC',
                  borderRadius: '16px',
                  padding: '1.4rem',
                  border: '1px solid #DDF4F3',
                  boxShadow: '0 4px 14px rgba(0, 70, 78, 0.03)',
                }}
              >
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#008C95', marginBottom: '0.4rem' }}>
                  {item.num}
                </div>
                <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#00464E', marginBottom: '0.5rem' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#66818C', lineHeight: 1.5 }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. What You Get */}
      <section id="what-you-get" style={{ padding: '5rem 1.5rem', background: 'rgba(242, 250, 250, 0.82)', backdropFilter: 'blur(12px)', position: 'relative', zIndex: 5, scrollMarginTop: '90px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#00464E', marginBottom: '0.6rem' }}>
              Your DPR Includes More Than Just Text
            </h2>
            <p style={{ fontSize: '1rem', color: '#66818C' }}>
              Comprehensive 15+ section document containing complete quantitative and qualitative evaluation.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              'Executive Summary', 'Business & Promoter Profile', 'Industry Analysis', 'Market Research',
              'Customer Analysis', 'Competitor Analysis', 'Location Analysis', 'Technical Feasibility',
              'Manufacturing Process', 'Raw Material Requirements', 'Machinery & Equipment', 'Manpower Requirements',
              'Project Cost Breakup', 'Means of Finance', 'Revenue Projections', 'Profit & Loss Statement',
              'Cash Flow Statement', 'Break-Even Analysis', 'DSCR & Financial Ratios', 'Government Scheme Analysis',
              'Risk Assessment', 'Mitigation Strategies', 'Implementation Schedule', 'Supporting Tables & Charts'
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '1rem',
                  border: '1px solid #DDF4F3',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#00464E',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  boxShadow: '0 2px 8px rgba(0, 70, 78, 0.03)',
                }}
              >
                <i className="fas fa-file-check" style={{ color: '#008C95' }} />
                <span>{item}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 10. Who Is It For? */}
      <section id="who-it-is-for" style={{ padding: '5rem 1.5rem', background: 'rgba(255, 255, 255, 0.88)', backdropFilter: 'blur(12px)', position: 'relative', zIndex: 5, scrollMarginTop: '90px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3.5rem auto' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#00464E', marginBottom: '0.6rem' }}>
              Built for Different Business Needs
            </h2>
            <p style={{ fontSize: '1rem', color: '#66818C' }}>
              Tailored solutions for entrepreneurs, MSMEs, advisors, and financial institutions.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.6rem' }}>
            {[
              { icon: '🚀', title: 'Entrepreneurs', desc: 'Turn your business idea into a structured project plan.' },
              { icon: '🏭', title: 'MSMEs', desc: 'Prepare professional DPRs for expansion, modernization and financing.' },
              { icon: '💡', title: 'Startups', desc: 'Present your business opportunity clearly to investors and stakeholders.' },
              { icon: '📊', title: 'Consultants', desc: 'Reduce repetitive DPR preparation and analysis work.' },
              { icon: '🏦', title: 'Financial & Investment Teams', desc: 'Review standardized project information, financials, risks and business intelligence.' },
              { icon: '🏛️', title: 'Government / Scheme Applicants', desc: 'Prepare structured project documentation for eligible schemes and subsidies.' },
            ].map((card, idx) => (
              <div
                key={idx}
                style={{
                  background: '#F8FCFC',
                  borderRadius: '18px',
                  padding: '1.6rem',
                  border: '1px solid #DDF4F3',
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '0.8rem' }}>{card.icon}</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#00464E', marginBottom: '0.5rem' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#66818C', lineHeight: 1.55 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 11. Strong Differentiation Statement */}
      <section style={{ padding: '4rem 1.5rem', background: 'rgba(242, 250, 250, 0.82)', backdropFilter: 'blur(12px)', position: 'relative', zIndex: 5 }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #006F78 0%, #00464E 100%)',
              borderRadius: '24px',
              padding: '3rem 2.5rem',
              color: '#FFFFFF',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0, 70, 78, 0.2)',
            }}
          >
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '1.2rem', letterSpacing: '-0.4px' }}>
              Stop Filling Generic Forms. Start Building an Intelligent DPR.
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.65, maxWidth: '880px', margin: '0 auto 2rem auto', color: '#E2F7F6' }}>
              VKF DPR combines sector-specific questionnaires, deterministic financial calculations, market intelligence, scheme evaluation, risk analysis, AI-assisted content generation and automated document compilation into one end-to-end platform.
            </p>
            <button
              onClick={scrollToAuth}
              style={{
                background: '#FF7A00',
                color: '#FFFFFF',
                border: 'none',
                padding: '1rem 2.2rem',
                borderRadius: '16px',
                fontWeight: 800,
                fontSize: '1.05rem',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(255, 122, 0, 0.35)',
              }}
            >
              Get Started Now →
            </button>
          </div>
        </div>
      </section>

      {/* 12. Before You Sign In */}
      <section style={{ padding: '4.5rem 1.5rem', background: 'rgba(255, 255, 255, 0.88)', backdropFilter: 'blur(12px)', position: 'relative', zIndex: 5 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#00464E', marginBottom: '1rem' }}>
            Ready to Build Your DPR?
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#66818C', lineHeight: 1.65, marginBottom: '2rem' }}>
            Your DPR journey starts with a few basic details about your business. Select your DPR purpose → Business Sector → Business Activity → Location, and VKF DPR will guide you through the information required for your specific project.
          </p>
          <button
            onClick={scrollToAuth}
            style={{
              background: 'linear-gradient(135deg, #008C95 0%, #006F78 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '1rem 2.5rem',
              borderRadius: '16px',
              fontWeight: 800,
              fontSize: '1.08rem',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0, 140, 149, 0.3)',
            }}
          >
            Start My DPR →
          </button>
        </div>
      </section>

      {/* 13. About Vision Karnataka Foundation (VKF) */}
      <section
        id="about-vkf"
        style={{
          padding: '4.5rem 1.5rem',
          background: 'linear-gradient(135deg, #00464E 0%, #006F78 100%)',
          color: '#FFFFFF',
          position: 'relative',
          zIndex: 5,
          boxShadow: '0 -10px 40px rgba(0, 70, 78, 0.15)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          {/* Logo & Foundation Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.4rem', flexWrap: 'wrap' }}>
            <img
              src="/VKF_logo.png"
              alt="Vision Karnataka Foundation Logo"
              style={{ height: '62px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.25))' }}
            />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FF7A00', letterSpacing: '1px', textTransform: 'uppercase' }}>
                About The Foundation
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
                Vision Karnataka Foundation (VKF)
              </div>
            </div>
          </div>

          {/* Core Foundation Description */}
          <p
            style={{
              fontSize: '1.15rem',
              color: '#E2F7F6',
              lineHeight: 1.7,
              maxWidth: '920px',
              margin: '0 auto 2.2rem auto',
              fontWeight: 500,
              letterSpacing: '0.1px',
            }}
          >
            Vision Karnataka Foundation is a Community of Change Champions who are from various walks of Social Spaces with diverse backgrounds and specialists from their domains.
          </p>

          {/* Know More CTA Button */}
          <a
            href="https://vkfoundations.org/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: '#FF7A00',
              color: '#FFFFFF',
              textDecoration: 'none',
              padding: '0.95rem 2.4rem',
              borderRadius: '16px',
              fontWeight: 800,
              fontSize: '1.02rem',
              boxShadow: '0 8px 24px rgba(255, 122, 0, 0.35)',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
          >
            Know more! <i className="fas fa-external-link-alt" style={{ fontSize: '0.85rem' }} />
          </a>
        </div>
      </section>

      {/* 14. Trust Message & Footer */}
      <footer style={{ background: '#00252A', color: '#FFFFFF', padding: '3.5rem 1.5rem 2rem 1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', position: 'relative', zIndex: 5 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          {/* Trust Banner */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '16px',
              padding: '1.2rem 1.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.8rem',
              marginBottom: '3rem',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: '#E2F7F6',
              textAlign: 'center',
            }}
          >
            <span>🔒</span>
            <span><strong>Secure & Protected:</strong> Your project information is protected with controlled access and secure application architecture.</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#2DD4BF', marginBottom: '0.2rem' }}>
                VKF DPR Studio
              </div>
              <div style={{ fontSize: '0.85rem', color: '#A0B4B8' }}>
                Secure · Intelligent · Data-Driven · Built for Business
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#A0B4B8' }}>
              © 2026 Vision Karnataka Foundation. All Rights Reserved.
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}

const navBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '0.88rem',
  fontWeight: 600,
  color: '#4A626C',
  cursor: 'pointer',
  transition: 'color 0.2s ease',
};

const dprTypeCardStyle: React.CSSProperties = {
  background: '#FFFFFF',
  borderRadius: '22px',
  padding: '2.2rem',
  border: '1px solid #DDF4F3',
  boxShadow: '0 8px 24px rgba(0, 70, 78, 0.05)',
  display: 'flex',
  flexDirection: 'column',
};

const cardCtaBtnStyle: React.CSSProperties = {
  background: '#F2FAFA',
  color: '#008C95',
  border: '1.5px solid #B2E8E6',
  padding: '0.8rem 1.2rem',
  borderRadius: '14px',
  fontWeight: 700,
  fontSize: '0.92rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  width: '100%',
};

const sectorTabBtnStyle = (active: boolean): React.CSSProperties => ({
  background: active ? '#008C95' : '#FFFFFF',
  color: active ? '#FFFFFF' : '#00464E',
  border: active ? 'none' : '1px solid #CBD5E1',
  padding: '0.75rem 1.4rem',
  borderRadius: '14px',
  fontWeight: 700,
  fontSize: '0.92rem',
  cursor: 'pointer',
  boxShadow: active ? '0 6px 18px rgba(0, 140, 149, 0.25)' : 'none',
  transition: 'all 0.2s ease',
});

const checklistStyle: React.CSSProperties = {
  background: '#FFFFFF',
  padding: '0.8rem 1rem',
  borderRadius: '12px',
  fontSize: '0.88rem',
  fontWeight: 600,
  color: '#123B4A',
  border: '1px solid #E2E8F0',
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
};

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div
      style={{
        background: '#F8FCFC',
        borderRadius: '20px',
        padding: '1.8rem',
        border: '1px solid #DDF4F3',
        boxShadow: '0 6px 20px rgba(0, 70, 78, 0.04)',
      }}
    >
      <div style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: '#00464E', marginBottom: '0.6rem' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.9rem', color: '#66818C', lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  );
}
