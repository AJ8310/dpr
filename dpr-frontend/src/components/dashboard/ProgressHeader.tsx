'use client';

import React from 'react';
import LanguageDropdown from '@/components/common/LanguageDropdown';
import { useLanguage } from '@/context/LanguageContext';
import { wizardTranslations } from '@/i18n/wizardTranslations';

interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  selectedService: string;
  selectedDepth?: string;
  onChangeService?: (service: string) => void;
  onChangeDepth?: (depth: 'summary' | 'standard' | 'detailed') => void;
  onOpenPricing?: () => void;
  currentPlanId?: string;
}

export default function ProgressHeader({
  currentStep,
  totalSteps = 14,
  selectedService = 'Bank Loan DPR',
  selectedDepth = 'standard',
  onChangeService,
  onChangeDepth,
  onOpenPricing,
  currentPlanId = 'core',
}: ProgressHeaderProps) {
  const { language } = useLanguage();
  const tW = wizardTranslations[language] || wizardTranslations.en;
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div
      className="progress-header-container"
      style={{
        background: '#FFFFFF',
        borderRadius: '1.2rem',
        padding: '1rem 1.8rem',
        marginBottom: '1.6rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 8px 30px rgba(0, 140, 149, 0.07)',
        border: '1.5px solid #E2E8F0',
      }}
    >
      <style jsx>{`
        @media (max-width: 768px) {
          .progress-header-container {
            padding: 0.85rem 1rem !important;
            border-radius: 0.9rem !important;
            margin-bottom: 1rem !important;
          }
          .progress-left-group, .progress-right-group {
            width: 100% !important;
            justify-content: space-between !important;
          }
          .progress-bar-wrapper {
            flex: 1 !important;
            min-width: 100px !important;
          }
          .track-dropdown-pill, .depth-dropdown-pill {
            flex: 1 !important;
            justify-content: center !important;
          }
        }
      `}</style>

      {/* Left: Step Progress & Bar */}
      <div className="progress-left-group" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
        <span
          style={{
            background: '#F0FDFA',
            borderRadius: '2rem',
            padding: '0.4rem 0.9rem',
            fontWeight: 800,
            fontSize: '0.82rem',
            color: '#008C95',
            border: '1px solid #CCFBF1',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <i className="fas fa-layer-group"></i> {tW.header.progress}
        </span>

        {/* Progress Bar */}
        <div className="progress-bar-wrapper" style={{ width: '180px', height: '9px', background: '#E2E8F0', borderRadius: '1rem', overflow: 'hidden' }}>
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #008C95 0%, #FF7A00 100%)',
              transition: 'width 0.4s ease',
              borderRadius: '1rem',
            }}
          ></div>
        </div>

        <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#123B4A' }}>
          {tW.header.step(currentStep + 1, totalSteps)} <span style={{ color: '#008C95', fontSize: '0.8rem' }}>({progressPercent}%)</span>
        </span>
      </div>

      {/* Right: Language Dropdown, Corporate Track Switcher & Depth Selector */}
      <div className="progress-right-group" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        {/* Multilingual Selector */}
        <LanguageDropdown variant="dashboard" />

        {/* Track Selector Dropdown */}
        <div className="track-dropdown-pill" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', background: '#FFF7ED', padding: '0.35rem 0.85rem', borderRadius: '2rem', border: '1px solid #FFEDD5' }}>
          <i className="fas fa-file-contract" style={{ color: '#FF7A00', fontSize: '0.85rem' }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#C2410C' }}>{tW.header.service}</span>
          <select
            value={selectedService}
            onChange={(e) => onChangeService && onChangeService(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.82rem',
              color: '#EA580C',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="Bank Loan DPR">{tW.header.services.bank}</option>
            <option value="Govt Subsidy DPR">{tW.header.services.govt}</option>
            <option value="Investor / Business Pitch DPR">{tW.header.services.investor}</option>
          </select>
        </div>

        {/* DPR Depth Selector Dropdown */}
        <div className="depth-dropdown-pill" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', background: '#F0FDFA', padding: '0.35rem 0.85rem', borderRadius: '2rem', border: '1px solid #CCFBF1' }}>
          <i className="fas fa-book-open" style={{ color: '#008C95', fontSize: '0.85rem' }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F766E' }}>{tW.header.depth}</span>
          <select
            value={selectedDepth}
            onChange={(e) => onChangeDepth && onChangeDepth(e.target.value as any)}
            style={{
              background: 'transparent',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.82rem',
              color: '#008C95',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="summary">{tW.header.depths.summary}</option>
            <option value="standard">{tW.header.depths.standard}</option>
            <option value="detailed">{tW.header.depths.detailed}</option>
          </select>
        </div>

        {/* Pricing Plan Selector Button */}
        {onOpenPricing && (
          <button
            type="button"
            onClick={onOpenPricing}
            className="plan-dropdown-pill"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: '#FFF7ED',
              padding: '0.35rem 0.85rem',
              borderRadius: '2rem',
              border: '1px solid #FFEDD5',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <i className="fas fa-tags" style={{ color: '#FF7A00', fontSize: '0.85rem' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#C2410C' }}>Plan:</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#EA580C' }}>
              {currentPlanId === 'entry'
                ? 'Entry (₹399)'
                : currentPlanId === 'team'
                ? 'Team (₹999)'
                : currentPlanId === 'enterprise' || currentPlanId === 'custom'
                ? 'Custom'
                : 'Core (₹799)'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
