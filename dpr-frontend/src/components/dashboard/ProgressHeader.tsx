'use client';

import React from 'react';

interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  selectedService: string;
  selectedDepth?: string;
  onChangeService?: (service: string) => void;
  onChangeDepth?: (depth: 'summary' | 'standard' | 'detailed') => void;
}

export default function ProgressHeader({
  currentStep,
  totalSteps = 14,
  selectedService = 'Bank Loan DPR',
  selectedDepth = 'standard',
  onChangeService,
  onChangeDepth,
}: ProgressHeaderProps) {
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
          <i className="fas fa-layer-group"></i> Progress
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
          Step {currentStep + 1}/{totalSteps} <span style={{ color: '#008C95', fontSize: '0.8rem' }}>({progressPercent}%)</span>
        </span>
      </div>

      {/* Right: Corporate Track Switcher & Depth Selector */}
      <div className="progress-right-group" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        {/* Track Selector Dropdown */}
        <div className="track-dropdown-pill" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', background: '#FFF7ED', padding: '0.35rem 0.85rem', borderRadius: '2rem', border: '1px solid #FFEDD5' }}>
          <i className="fas fa-file-contract" style={{ color: '#FF7A00', fontSize: '0.85rem' }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#C2410C' }}>Service:</span>
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
            <option value="Bank Loan DPR">Bank Loan DPR</option>
            <option value="Govt Subsidy DPR">Govt Subsidy DPR</option>
            <option value="Investor / Business Pitch DPR">Investor / Business Pitch DPR</option>
          </select>
        </div>

        {/* DPR Depth Selector Dropdown */}
        <div className="depth-dropdown-pill" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', background: '#F0FDFA', padding: '0.35rem 0.85rem', borderRadius: '2rem', border: '1px solid #CCFBF1' }}>
          <i className="fas fa-book-open" style={{ color: '#008C95', fontSize: '0.85rem' }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F766E' }}>Depth:</span>
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
            <option value="summary">Summary (10–15 pgs)</option>
            <option value="standard">Standard (20–30 pgs)</option>
            <option value="detailed">Detailed (40–60 pgs)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
