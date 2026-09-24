'use client';

import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '@/lib/api';

interface Message {
  sender: 'bot' | 'user';
  text: string;
}

interface FloatingChatbotWidgetProps {
  onSelectDprType?: (dprType: string) => void;
  onNavigateStep?: (stepIndex: number) => void;
  currentSectionName?: string;
}

export default function FloatingChatbotWidget({
  onSelectDprType,
  onNavigateStep,
  currentSectionName,
}: FloatingChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: '<strong>Welcome to Vision Karnataka Foundation</strong><br>I am your live DPR Expert. Ask me any question about downloading reports, editing form fields, DSCR ratios, subsidies, or account settings!',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const toggleModal = () => setIsOpen(!isOpen);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputText).trim();
    if (!textToSend) return;

    // Add user message immediately
    const userMsg: Message = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const data = await sendChatMessage(textToSend, currentSectionName);
      const botReply = data && data.reply ? data.reply : 'I have noted your request. Please check the summary step to proceed!';
      const botMsg: Message = { sender: 'bot', text: botReply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: '<strong>DPR Assistant Note:</strong><br>To download your PDF/DOCX report or edit entries, navigate to <strong>Step 14 (Summary & Export)</strong> or click any step number in the top header bar!',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    // Check if clicked element is a step link like data-step="13"
    const stepAttr = target.getAttribute('data-step') || target.closest('[data-step]')?.getAttribute('data-step');
    if (stepAttr && onNavigateStep) {
      const stepIdx = parseInt(stepAttr, 10);
      if (!isNaN(stepIdx)) {
        onNavigateStep(stepIdx);
        setIsOpen(false); // Close chatbot modal on click to show the section
      }
    }
  };

  // Section-aware dynamic suggestion chips
  const getContextualSuggestions = () => {
    const sec = (currentSectionName || '').toLowerCase();
    if (sec.includes('basic') || sec.includes('constitution')) {
      return ['How to edit business details?', 'PMEGP Location Subsidy', 'Udyam Registration'];
    }
    if (sec.includes('promoter') || sec.includes('cibil')) {
      return ['Ideal Bank CIBIL Score?', 'Net Worth calculation', 'Promoter Experience'];
    }
    if (sec.includes('product') || sec.includes('capacity')) {
      return ['How to download PDF report?', 'Installed vs Utilized Capacity', 'FSSAI License rules'];
    }
    if (sec.includes('machinery') || sec.includes('plant')) {
      return ['How to calculate machinery cost?', 'Electrification Cost %', 'Supplier AMC Warranty'];
    }
    if (sec.includes('raw material') || sec.includes('utility')) {
      return ['KSPCB Pollution Category', 'Power HP Connection', 'Raw Material Source'];
    }
    if (sec.includes('capex') || sec.includes('cost')) {
      return ['CAPEX Breakdown', 'Pre-operative Expenses', 'Building Cost estimate'];
    }
    if (sec.includes('finance') || sec.includes('means')) {
      return ['Promoter Equity %', 'Debt-Equity Ratio limit', 'Term Loan vs CC limit'];
    }
    if (sec.includes('projection') || sec.includes('ratio') || sec.includes('financial')) {
      return ['What is DSCR Formula?', 'Ideal BEP % Benchmark', 'NPV & IRR Explanation'];
    }
    if (sec.includes('working capital')) {
      return ['Working Capital Cycle', 'Nayak Committee Norms', 'Inventory Days limit'];
    }
    return ['How to download PDF?', 'How to edit form data?', 'What is DSCR Ratio?', 'PMEGP Subsidy details'];
  };

  const suggestions = getContextualSuggestions();

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={toggleModal}
        style={{
          position: 'fixed',
          bottom: '25px',
          right: '25px',
          background: 'linear-gradient(135deg, #008C95 0%, #006F78 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '2rem',
          padding: '0.6rem 1.2rem',
          boxShadow: '0 8px 25px rgba(0, 140, 149, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          cursor: 'pointer',
          zIndex: 10000,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div style={{ position: 'relative', width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #FF7A00' }}>
          <img src="/media_1787130170152.png" alt="Advisor" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }} />
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>DPR AI Advisor</div>
          <div style={{ fontSize: '0.68rem', color: '#FFE600' }}>Ask any query</div>
        </div>
      </button>

      {/* Floating Chatbot Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '25px',
            width: '420px',
            height: '580px',
            background: 'white',
            borderRadius: '1.2rem',
            boxShadow: '0 15px 40px rgba(0, 111, 120, 0.25)',
            border: '1px solid #DDF4F3',
            zIndex: 10001,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Modal Header */}
          <div style={{ background: 'linear-gradient(135deg, #008C95 0%, #006F78 100%)', color: 'white', padding: '0.85rem 1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px solid #FF7A00' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #FF7A00' }}>
                <img src="/media_1787130170152.png" alt="Advisor" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>DPR AI Advisor</div>
                <div style={{ fontSize: '0.7rem', color: '#4ADE80' }}>
                  Active: {currentSectionName ? currentSectionName : 'General Guidance'}
                </div>
              </div>
            </div>
            <button
              onClick={toggleModal}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: 'white',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>

          {/* Chat Messages Body */}
          <div
            onClick={handleContentClick}
            style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              background: '#F2FAFA',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    maxWidth: '88%',
                    padding: '0.75rem 1rem',
                    borderRadius: msg.sender === 'user' ? '1rem 1rem 0.2rem 1rem' : '1rem 1rem 1rem 0.2rem',
                    fontSize: '0.84rem',
                    lineHeight: '1.5',
                    background: msg.sender === 'user' ? 'linear-gradient(135deg, #008C95 0%, #006F78 100%)' : 'white',
                    color: msg.sender === 'user' ? 'white' : '#123B4A',
                    border: msg.sender === 'user' ? 'none' : '1px solid #DDF4F3',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    wordBreak: 'break-word',
                  }}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ background: 'white', border: '1px solid #DDF4F3', borderRadius: '1rem', padding: '0.6rem 0.9rem', fontSize: '0.78rem', color: '#008C95', fontWeight: 600 }}>
                  AI Advisor is processing your query...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Contextual Quick Suggestion Chips */}
          <div style={{ padding: '0.6rem 0.8rem', background: '#FFFFFF', borderTop: '1px solid #DDF4F3', display: 'flex', gap: '0.4rem', overflowX: 'auto' }}>
            {suggestions.map((sg, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sg)}
                style={{
                  background: '#F0FDFA',
                  border: '1px solid #CCFBF1',
                  color: '#008C95',
                  borderRadius: '1rem',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
              >
                {sg}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{ padding: '0.75rem', background: 'white', borderTop: '1px solid #DDF4F3', display: 'flex', gap: '0.5rem' }}
          >
            <input
              type="text"
              placeholder={currentSectionName ? `Ask query on ${currentSectionName}...` : "Ask any query (download, edit, DSCR, PMEGP)..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flex: 1,
                fontSize: '0.85rem',
                padding: '0.65rem 0.8rem',
                borderRadius: '0.6rem',
                border: '1px solid #CBD5E1',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={isTyping}
              style={{
                background: 'linear-gradient(135deg, #008C95 0%, #006F78 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.6rem',
                padding: '0 1.2rem',
                fontWeight: 700,
                cursor: isTyping ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
              }}
            >
              ➔
            </button>
          </form>
        </div>
      )}
    </>
  );
}
