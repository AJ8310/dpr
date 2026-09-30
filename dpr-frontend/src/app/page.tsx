'use client';

import React, { useState, useEffect } from 'react';
import LandingPage from '@/components/landing/LandingPage';
import LoginCard from '@/components/auth/LoginCard';
import RegisterCard from '@/components/auth/RegisterCard';
import ServiceSelectionView from '@/components/services/ServiceSelectionView';
import FixedSidebar from '@/components/dashboard/FixedSidebar';
import ProgressHeader from '@/components/dashboard/ProgressHeader';
import FormWizard from '@/components/dashboard/FormWizard';
import FloatingChatbotWidget from '@/components/chatbot/FloatingChatbotWidget';
import BackgroundWaves from '@/components/common/BackgroundWaves';
import { UserSession } from '@/types/dpr';

export default function Home() {
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [session, setSession] = useState<UserSession | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    // Clear any legacy demo keys from browser storage
    sessionStorage.removeItem('dpr_current_user_main');
    localStorage.removeItem('dpr_current_user_main');
    localStorage.removeItem('dpr_users_main');

    const storedSession = sessionStorage.getItem('dpr_session');
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        if (parsed.email === 'demo@example.com' || parsed.name === 'Demo User') {
          sessionStorage.removeItem('dpr_session');
          setSession(null);
        } else {
          setSession(parsed);
          const storedService = sessionStorage.getItem('dpr_selected_service') || 'Bank Loan DPR';
          setSelectedService(storedService);
        }
      } catch (e) {
        sessionStorage.removeItem('dpr_session');
        setSession(null);
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    setSession(null);
    setSelectedService(null);
    setActiveStepIndex(0);
  };

  const handleSelectService = (serviceName: string) => {
    sessionStorage.setItem('dpr_selected_service', serviceName);
    setSelectedService(serviceName);
    setActiveStepIndex(0);
  };

  const handleLoginSuccess = (sess: UserSession) => {
    const storedService = sessionStorage.getItem('dpr_selected_service') || 'Bank Loan DPR';
    setSelectedService(storedService);
    setSession(sess);
  };

  // 1. Unauthenticated View (Interactive Landing Page with Login / Register)
  if (!session) {
    return <LandingPage onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. Fallback Service Selection View (Only if user explicitly cleared service inside dashboard)
  if (!selectedService) {
    const fallbackService = sessionStorage.getItem('dpr_selected_service') || 'Bank Loan DPR';
    if (fallbackService) {
      setSelectedService(fallbackService);
    }
  }

  // 3. Full Main Dashboard View (Fixed Sidebar + Form Wizard)
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--vkf-bg-light)', position: 'relative' }}>
      {/* Dark Mobile Overlay Backdrop */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            zIndex: 999,
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Responsive Sidebar Banner (Fixed on Desktop / Drawer on Mobile) */}
      <FixedSidebar
        userName={session.name}
        activeStepIndex={activeStepIndex}
        onSelectStep={(idx) => setActiveStepIndex(idx)}
        onChangeService={() => setSelectedService(null)}
        onLogout={handleLogout}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="dpr-main-container" style={{ flex: 1, minHeight: '100vh' }}>
        <style jsx>{`
          .dpr-main-container {
            margin-left: 280px;
            padding: 2rem 2.2rem 3rem 2.2rem;
          }
          @media (max-width: 992px) {
            .dpr-main-container {
              margin-left: 0 !important;
              padding: 1rem 0.8rem 3rem 0.8rem !important;
            }
          }
        `}</style>

        {/* Mobile Top Navigation Header */}
        <div
          className="mobile-only"
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#FFFFFF',
            padding: '0.65rem 1rem',
            borderRadius: '1rem',
            marginBottom: '1.2rem',
            boxShadow: '0 4px 15px rgba(0, 140, 149, 0.08)',
            border: '1.5px solid #E2E8F0',
          }}
        >
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            style={{
              background: '#F0FDFA',
              border: '1.5px solid #008C95',
              color: '#008C95',
              borderRadius: '0.6rem',
              padding: '0.45rem 0.85rem',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <i className="fas fa-bars" /> Steps Menu
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/VKF_logo.png" alt="VKF Logo" style={{ height: '26px', width: 'auto' }} />
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#123B4A' }}>DPRPro AI</span>
          </div>
        </div>

        <ProgressHeader
          currentStep={activeStepIndex}
          totalSteps={14}
          selectedService={selectedService || 'Bank Loan DPR'}
          onChangeService={(service) => setSelectedService(service)}
        />

        <FormWizard
          initialService={selectedService || 'Bank Loan DPR'}
          activeStep={activeStepIndex}
          setActiveStep={(step) => setActiveStepIndex(step)}
          onNextStep={() => setActiveStepIndex((prev) => Math.min(prev + 1, 13))}
        />
      </main>

      {/* Interactive Bottom-Right Floating Chatbot Widget (Section-Aware) */}
      <FloatingChatbotWidget
        onSelectDprType={handleSelectService}
        onNavigateStep={(stepIdx) => setActiveStepIndex(stepIdx)}
        currentSectionName={[
          "Basic Project Details",
          "Promoter & Management Profile",
          "Product & Manufacturing Details",
          "Market Potential & Strategy",
          "Plant, Machinery & Infrastructure",
          "Raw Materials & Utilities",
          "Manpower & Labor Plan",
          "Capital Expenditure (CAPEX)",
          "Means of Finance & Debt",
          "Financial Projections & Ratios",
          "Working Capital & Inventory",
          "Project Implementation Timeline",
          "Risk Assessment & Mitigation",
          "Declaration & Authorization"
        ][activeStepIndex]}
      />
    </div>
  );
}

