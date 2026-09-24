'use client';

import React, { useState } from 'react';

export interface QuestionGroup {
  id: string;
  title: string;
  description?: string;
  badge?: string;
  content: React.ReactNode;
  isCompleted?: boolean;
}

interface ProgressiveSectorWrapperProps {
  title: string;
  subtitle?: string;
  questions: QuestionGroup[];
  onCompleteSector?: () => void;
  isSaving?: boolean;
  activeStep?: number;
  totalSteps?: number;
}

export default function ProgressiveSectorWrapper({
  title,
  subtitle,
  questions,
  onCompleteSector,
  isSaving = false,
}: ProgressiveSectorWrapperProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const totalQuestions = questions.length;
  const isLastQuestion = currentIdx === totalQuestions - 1;
  const progressPct = Math.round(((currentIdx + 1) / totalQuestions) * 100);

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else if (onCompleteSector) {
      onCompleteSector();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div className="progressive-sector-container" style={{ position: 'relative' }}>
      {/* SECTOR HEADER & VIEW MODE TOGGLE */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '2px solid #E2E8F0',
          paddingBottom: '0.8rem',
          marginBottom: '1.2rem',
        }}
      >
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            {title}
          </h3>
          {subtitle && (
            <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '2px 0 0 0' }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* TOGGLE VIEW MODE BUTTON */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            style={{
              background: showAll ? '#F1F5F9' : '#F0FDFA',
              border: showAll ? '1.5px solid #CBD5E1' : '1.5px solid #008C95',
              color: showAll ? '#475569' : '#008C95',
              padding: '0.45rem 0.95rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease',
            }}
          >
            <i className={showAll ? 'fas fa-list-ul' : 'fas fa-layer-group'} />
            {showAll ? 'Show Question-by-Question' : 'Show All Questions'}
          </button>
        </div>
      </div>

      {/* PROGRESS BAR & SUB-QUESTION NAV PILLS (only in Progressive Mode) */}
      {!showAll && (
        <div
          style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '1rem 1.2rem',
            marginBottom: '1.4rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.6rem',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  background: '#008C95',
                  color: '#FFFFFF',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '12px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                }}
              >
                Question {currentIdx + 1} of {totalQuestions}
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>
                {questions[currentIdx]?.title}
              </span>
            </div>

            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#008C95' }}>
              {progressPct}% Completed
            </span>
          </div>

          {/* PROGRESS BAR TRACK */}
          <div
            style={{
              width: '100%',
              height: '6px',
              background: '#E2E8F0',
              borderRadius: '3px',
              overflow: 'hidden',
              marginBottom: '0.8rem',
            }}
          >
            <div
              style={{
                width: `${progressPct}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #008C95 0%, #00B4D8 100%)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          {/* QUESTION STEP PILLS */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
            {questions.map((q, idx) => {
              const isActive = idx === currentIdx;
              const isPast = idx < currentIdx;
              return (
                <button
                  key={q.id || idx}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  title={q.title}
                  style={{
                    background: isActive
                      ? '#008C95'
                      : isPast
                      ? '#D1F4F0'
                      : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : isPast ? '#008C95' : '#64748B',
                    border: isActive
                      ? '1.5px solid #008C95'
                      : isPast
                      ? '1.5px solid #99E6E2'
                      : '1.5px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.25rem 0.65rem',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isPast ? (
                    <i className="fas fa-check" style={{ fontSize: '0.7rem' }} />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                  <span
                    style={{
                      maxWidth: '120px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {q.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTENT AREA */}
      {showAll ? (
        /* SHOW ALL QUESTIONS VERTICALLY */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {questions.map((q, idx) => (
            <div
              key={q.id || idx}
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                borderRadius: '14px',
                padding: '1.25rem 1.4rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  marginBottom: '0.8rem',
                  borderBottom: '1px solid #F1F5F9',
                  paddingBottom: '0.5rem',
                }}
              >
                <span
                  style={{
                    background: '#008C95',
                    color: '#FFF',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                  }}
                >
                  {idx + 1}
                </span>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                  {q.title}
                </h4>
                {q.badge && (
                  <span
                    style={{
                      background: '#F0FDFA',
                      color: '#008C95',
                      border: '1px solid #99E6E2',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '10px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    {q.badge}
                  </span>
                )}
              </div>
              {q.description && (
                <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '1rem' }}>
                  {q.description}
                </p>
              )}
              <div>{q.content}</div>
            </div>
          ))}
        </div>
      ) : (
        /* PROGRESSIVE SINGLE QUESTION CARD */
        <div
          style={{
            background: '#FFFFFF',
            border: '2px solid #008C95',
            borderRadius: '16px',
            padding: '1.5rem 1.8rem',
            boxShadow: '0 8px 25px rgba(0, 140, 149, 0.08)',
            position: 'relative',
          }}
        >
          {/* ACTIVE QUESTION CARD HEADER */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              borderBottom: '1px solid #E2E8F0',
              paddingBottom: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #008C95 0%, #006F78 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                }}
              >
                {currentIdx + 1}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 800, color: '#0F172A' }}>
                  {questions[currentIdx]?.title}
                </h4>
                {questions[currentIdx]?.description && (
                  <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#64748B' }}>
                    {questions[currentIdx]?.description}
                  </p>
                )}
              </div>
            </div>

            {questions[currentIdx]?.badge && (
              <span
                style={{
                  background: '#F0FDFA',
                  border: '1px solid #008C95',
                  color: '#008C95',
                  padding: '0.35rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                }}
              >
                {questions[currentIdx]?.badge}
              </span>
            )}
          </div>

          {/* QUESTION FORM FIELDS */}
          <div style={{ minHeight: '120px', marginBottom: '1.5rem' }}>
            {questions[currentIdx]?.content}
          </div>

          {/* INNER NAVIGATION BUTTONS */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #F1F5F9',
              paddingTop: '1.2rem',
              marginTop: '1.2rem',
            }}
          >
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIdx === 0}
              style={{
                background: currentIdx === 0 ? '#F1F5F9' : '#FFFFFF',
                border: currentIdx === 0 ? '1px solid #E2E8F0' : '1.5px solid #008C95',
                color: currentIdx === 0 ? '#94A3B8' : '#008C95',
                padding: '0.65rem 1.3rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.86rem',
                cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
              }}
            >
              <i className="fas fa-arrow-left" /> Previous Question
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isSaving}
              style={{
                background: 'linear-gradient(135deg, #008C95 0%, #006F78 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.65rem 1.6rem',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 4px 14px rgba(0, 140, 149, 0.25)',
                transition: 'all 0.2s ease',
              }}
            >
              {isLastQuestion ? (
                <>
                  <i className="fas fa-check-circle" />{' '}
                  {isSaving ? 'Saving Sector...' : 'Save & Continue to Next Sector'}{' '}
                  <i className="fas fa-arrow-right" />
                </>
              ) : (
                <>
                  Next Question <i className="fas fa-arrow-right" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
