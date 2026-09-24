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
    setSelectedService(serviceName);
    setActiveStepIndex(0);
  };

  // 1. Unauthenticated View (Interactive Landing Page with Login / Register)
  if (!session) {
    return <LandingPage onLoginSuccess={(sess) => setSession(sess)} />;
  }

  // 2. Service Selection View (User selects DPR Type)
  if (!selectedService) {
    return (
      <main style={{ minHeight: '100vh', background: 'var(--vkf-bg-light)', padding: '2rem 1rem' }}>
        <ServiceSelectionView
          userName={session.name}
          onSelectService={handleSelectService}
          onLogout={handleLogout}
        />
        <FloatingChatbotWidget onSelectDprType={handleSelectService} />
      </main>
    );
  }

  // 3. Full Main Dashboard View (Fixed Sidebar + Form Wizard)
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--vkf-bg-light)' }}>
      {/* Fixed Non-Scrolling Sidebar Banner */}
      <FixedSidebar
        userName={session.name}
        activeStepIndex={activeStepIndex}
        onSelectStep={(idx) => setActiveStepIndex(idx)}
        onChangeService={() => setSelectedService(null)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, marginLeft: '280px', padding: '2rem 2.2rem 3rem 2.2rem', minHeight: '100vh' }}>
        <ProgressHeader
          currentStep={activeStepIndex}
          totalSteps={14}
          selectedService={selectedService}
          onChangeService={(service) => setSelectedService(service)}
        />

        <FormWizard
          initialService={selectedService}
          activeStep={activeStepIndex}
          setActiveStep={(step) => setActiveStepIndex(step)}
          onNextStep={() => setActiveStepIndex((prev) => Math.min(prev + 1, 13))}
        />
      </main>

      {/* Interactive Bottom-Right Floating Chatbot Widget (Section-Aware) */}
      <FloatingChatbotWidget
        onSelectDprType={handleSelectService}
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
