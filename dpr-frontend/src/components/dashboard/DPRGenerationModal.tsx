'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface DPRGenerationModalProps {
  isOpen: boolean;
  progressPercent: number;
  stepName: string;
  language?: string;
}

const modalI18n = {
  en: {
    alertTitle: 'Please stay with us — this may take a few moments.',
    alertDesc: 'No action is required from you.',
    mainTitle: 'We’re turning your project details into a structured, professional DPR.',
    subTitle: 'Processing document compilation. Please wait...',
    inputBadges: [
      { label: 'Project Details', icon: 'fa-file-alt', color: '#2563EB', delay: '0s' },
      { label: 'Financial Inputs', icon: 'fa-coins', color: '#F59E0B', delay: '0.4s' },
      { label: 'Market Data', icon: 'fa-chart-line', color: '#10B981', delay: '0.8s' },
      { label: 'Scheme Info', icon: 'fa-landmark', color: '#1E3A8A', delay: '1.2s' },
      { label: 'Business Plan', icon: 'fa-clipboard-list', color: '#008C95', delay: '1.6s' },
    ],
    aiCore: 'AI Engine Core',
    financialEngine: 'Financial Engine',
    visualEngine: 'Visual Engine',
    dprReport: 'DPR Report',
    detailedProjectReport: 'Detailed Project Report',
    visionKarnataka: 'Vision Karnataka',
    currentAction: 'Current Action:',
    defaultStep: 'Processing Report Generation...',
    stages: [
      { label: 'Gathering Data', desc: 'Project inputs received', threshold: 10, icon: 'fa-database' },
      { label: 'Analyzing', desc: 'Understanding your project', threshold: 25, icon: 'fa-brain' },
      { label: 'Calculating', desc: 'Running financial models', threshold: 45, icon: 'fa-calculator' },
      { label: 'Creating Charts', desc: 'Visualizing insights', threshold: 65, icon: 'fa-chart-pie' },
      { label: 'Structuring', desc: 'Building your report', threshold: 85, icon: 'fa-file-alt' },
      { label: 'Finalizing', desc: 'Preparing Official DPR PDF', threshold: 98, icon: 'fa-check-circle' },
    ],
  },
  kn: {
    alertTitle: 'ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ — ಇದು ಕೆಲವು ಕ್ಷಣಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಬಹುದು.',
    alertDesc: 'ನಿಮ್ಮ ಕಡೆಯಿಂದ ಯಾವುದೇ ಕ್ರಮದ ಅಗತ್ಯವಿಲ್ಲ.',
    mainTitle: 'ನಿಮ್ಮ ಯೋಜನಾ ವಿವರಗಳನ್ನು ವೃತ್ತಿಪರ ಹಾಗೂ ಸುಸಂಘಟಿತ DPR ಆಗಿ ಪರಿವರ್ತಿಸಲಾಗುತ್ತಿದೆ.',
    subTitle: 'ದಾಖಲೆ ಸಂಕಲನ ಪ್ರಕ್ರಿಯೆ ಪ್ರಗತಿಯಲ್ಲಿದೆ. ದಯವಿಟ್ಟು ಕಾಯಿರಿ...',
    inputBadges: [
      { label: 'ಯೋಜನಾ ವಿವರಗಳು', icon: 'fa-file-alt', color: '#2563EB', delay: '0s' },
      { label: 'ಹಣಕಾಸು ಮಾಹಿತಿ', icon: 'fa-coins', color: '#F59E0B', delay: '0.4s' },
      { label: 'ಮಾರುಕಟ್ಟೆ ಡೇಟಾ', icon: 'fa-chart-line', color: '#10B981', delay: '0.8s' },
      { label: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು', icon: 'fa-landmark', color: '#1E3A8A', delay: '1.2s' },
      { label: 'ವ್ಯಾಪಾರ ಯೋಜನೆ', icon: 'fa-clipboard-list', color: '#008C95', delay: '1.6s' },
    ],
    aiCore: 'ಎಐ ಎಂಜಿನ್ ಕೋರ್',
    financialEngine: 'ಹಣಕಾಸು ಎಂಜಿನ್',
    visualEngine: 'ವಿಷುಯಲ್ ಎಂಜಿನ್',
    dprReport: 'DPR ವರದಿ',
    detailedProjectReport: 'ವಿವರವಾದ ಯೋಜನಾ ವರದಿ',
    visionKarnataka: 'ವಿಷನ್ ಕರ್ನಾಟಕ',
    currentAction: 'ಪ್ರಸ್ತುತ ಪ್ರಕ್ರಿಯೆ:',
    defaultStep: 'ವರದಿ ರಚನೆ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ...',
    stages: [
      { label: 'ಡೇಟಾ ಸಂಗ್ರಹಣೆ', desc: 'ಯೋಜನಾ ವಿವರಗಳು ಸ್ವೀಕರಿಸಲಾಗಿದೆ', threshold: 10, icon: 'fa-database' },
      { label: 'ವಿಶ್ಲೇಷಣೆ', desc: 'ಯೋಜನೆಯ ಆಳವಾದ ವಿಶ್ಲೇಷಣೆ', threshold: 25, icon: 'fa-brain' },
      { label: 'ಹಣಕಾಸು ಲೆಕ್ಕಾಚಾರ', desc: 'ಹಣಕಾಸು ಮಾದರಿಗಳ ರಚನೆ', threshold: 45, icon: 'fa-calculator' },
      { label: 'ನಕ್ಷೆಗಳ ರಚನೆ', desc: 'ಹಣಕಾಸಿನ ಗ್ರಾಫ್‌ಗಳು ಸಿದ್ಧ', threshold: 65, icon: 'fa-chart-pie' },
      { label: 'ರಚನೆ ಜೋಡಣೆ', desc: 'ವರದಿಯ ವಿಭಾಗಗಳ ಜೋಡಣೆ', threshold: 85, icon: 'fa-file-alt' },
      { label: 'ಅಂತಿಮಗೊಳಿಸುವಿಕೆ', desc: 'ಅಧಿಕೃತ PDF ಸಿದ್ಧತೆ', threshold: 98, icon: 'fa-check-circle' },
    ],
  },
  hi: {
    alertTitle: 'कृपया प्रतीक्षा करें — इसमें कुछ ही क्षण लग सकते हैं।',
    alertDesc: 'आपकी ओर से किसी कार्रवाई की आवश्यकता नहीं है।',
    mainTitle: 'हम आपके प्रोजेक्ट विवरण को एक संरचित, पेशेवर डीपीआर में बदल रहे हैं।',
    subTitle: 'दस्तावेज़ संकलन प्रगति पर है। कृपया प्रतीक्षा करें...',
    inputBadges: [
      { label: 'परियोजना विवरण', icon: 'fa-file-alt', color: '#2563EB', delay: '0s' },
      { label: 'वित्तीय इनपुट', icon: 'fa-coins', color: '#F59E0B', delay: '0.4s' },
      { label: 'बाजार डेटा', icon: 'fa-chart-line', color: '#10B981', delay: '0.8s' },
      { label: 'योजना जानकारी', icon: 'fa-landmark', color: '#1E3A8A', delay: '1.2s' },
      { label: 'व्यापार योजना', icon: 'fa-clipboard-list', color: '#008C95', delay: '1.6s' },
    ],
    aiCore: 'एआई इंजन कोर',
    financialEngine: 'वित्तीय इंजन',
    visualEngine: 'विजुअल इंजन',
    dprReport: 'डीपीआर रिपोर्ट',
    detailedProjectReport: 'विस्तृत परियोजना रिपोर्ट',
    visionKarnataka: 'विजन कर्नाटक',
    currentAction: 'वर्तमान स्थिति:',
    defaultStep: 'रिपोर्ट तैयार की जा रही है...',
    stages: [
      { label: 'डेटा संग्रह', desc: 'परियोजना इनपुट प्राप्त', threshold: 10, icon: 'fa-database' },
      { label: 'विश्लेषण', desc: 'परियोजना का विश्लेषण', threshold: 25, icon: 'fa-brain' },
      { label: 'वित्तीय गणना', desc: 'वित्तीय मॉडल तैयार करना', threshold: 45, icon: 'fa-calculator' },
      { label: 'चार्ट निर्माण', desc: 'वित्तीय रेखाचित्र तैयार', threshold: 65, icon: 'fa-chart-pie' },
      { label: 'संरचना', desc: 'रिपोर्ट का निर्माण', threshold: 85, icon: 'fa-file-alt' },
      { label: 'अंतिम रूप', desc: 'आधिकारिक PDF तैयार', threshold: 98, icon: 'fa-check-circle' },
    ],
  },
};

const translateStep = (step: string, lang: 'en' | 'kn' | 'hi') => {
  if (!step || lang === 'en') return step;

  const stepTranslations: Record<string, { kn: string; hi: string }> = {
    'Gathering Data: Validating inputs, legal constitution & promoters...': {
      kn: 'ಡೇಟಾ ಸಂಗ್ರಹಣೆ: ವಿವರಗಳು, ಕಾನೂನು ಸಂಸ್ಥೆ ಮತ್ತು ಪ್ರವರ್ತಕರ ಪರಿಶೀಲನೆ...',
      hi: 'डेटा संग्रह: इनपुट, कानूनी संविधान एवं प्रवर्तक विवरण सत्यापन...',
    },
    'Gathering Data: Verifying sector blueprint & machinery inputs...': {
      kn: 'ಡೇಟಾ ಸಂಗ್ರಹಣೆ: ವಲಯ ನೀಲನಕ್ಷೆ ಮತ್ತು ಯಂತ್ರೋಪಕರಣಗಳ ಪರಿಶೀಲನೆ...',
      hi: 'डेटा संग्रह: सेक्टर ब्लूप्रिंट एवं मशीनरी इनपुट सत्यापन...',
    },
    'Analyzing Project: Running AI market, risk & scheme agents...': {
      kn: 'ಯೋಜನಾ ವಿಶ್ಲೇಷಣೆ: ಮಾರುಕಟ್ಟೆ, ಅಪಾಯ ಮತ್ತು ಸಬ್ಸಿಡಿ ಎಐ ವಿಶ್ಲೇಷಣೆ...',
      hi: 'परियोजना विश्लेषण: बाजार, जोखिम एवं सब्सिडी एआई विश्लेषण...',
    },
    'Calculating Financials: Computing 10-Yr P&L, DSCR & Tandon MPBF...': {
      kn: 'ಹಣಕಾಸು ಲೆಕ್ಕಾಚಾರ: 10-ವರ್ಷಗಳ P&L, DSCR ಮತ್ತು ಟಂಡನ್ MPBF ಮಾದರಿ...',
      hi: 'वित्तीय गणना: 10-वर्षीय P&L, DSCR एवं टंडन MPBF की गणना...',
    },
    'Creating Charts: Generating Matplotlib CAPEX & Financial graphics...': {
      kn: 'ನಕ್ಷೆಗಳ ರಚನೆ: ಬಂಡವಾಳ ಹೂಡಿಕೆ ಮತ್ತು ಹಣಕಾಸು ಚಾರ್ಟ್‌ಗಳ ರಚನೆ...',
      hi: 'चार्ट निर्माण: पूंजीगत व्यय एवं वित्तीय रेखाचित्र निर्माण...',
    },
    'Structuring Report: Compiling 30 chapters & 10 annexure schedules...': {
      kn: 'ವರದಿ ಸಂಕಲನ: 31 ಅಧ್ಯಾಯಗಳು ಮತ್ತು 10 ಹಣಕಾಸು ವೇಳಾಪಟ್ಟಿಗಳ ಸಂಯೋಜನೆ...',
      hi: 'रिपोर्ट संरचना: 31 अध्यायों एवं 10 वित्तीय अनुसूचियों का संकलन...',
    },
    'Structuring Report: Compiling 31 chapters & 10 annexure schedules...': {
      kn: 'ವರದಿ ಸಂಕಲನ: 31 ಅಧ್ಯಾಯಗಳು ಮತ್ತು 10 ಹಣಕಾಸು ವೇಳಾಪಟ್ಟಿಗಳ ಸಂಯೋಜನೆ...',
      hi: 'रिपोर्ट संरचना: 31 अध्यायों एवं 10 वित्तीय अनुसूचियों का संकलन...',
    },
    'Finalizing: Preparing publication-ready document...': {
      kn: 'ಅಂತಿಮಗೊಳಿಸುವಿಕೆ: ಪ್ರಕಟಣೆಗೆ ಸಿದ್ಧವಾದ ವರದಿಯನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...',
      hi: 'अंतिम रूप: प्रकाशन-योग्य दस्तावेज़ तैयार किया जा रहा है...',
    },
    'Finalizing: PDF Report generated successfully!': {
      kn: 'ಅಂತಿಮಗೊಳಿಸಲಾಗುತ್ತಿದೆ: PDF ವರದಿ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!',
      hi: 'अंतिम रूप दिया जा रहा है: पीडीएफ रिपोर्ट सफलतापूर्वक तैयार!',
    },
    'Payment verified! Compiling PDF report...': {
      kn: 'ಪಾವತಿ ದೃಢೀಕರಿಸಲಾಗಿದೆ! PDF ವರದಿ ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...',
      hi: 'भुगतान सत्यापित! पीडीएफ रिपोर्ट तैयार की जा रही है...',
    },
    'Processing Report Generation...': {
      kn: 'ವರದಿ ರಚನೆ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ...',
      hi: 'रिपोर्ट तैयार की जा रही है...',
    },
  };

  if (stepTranslations[step] && stepTranslations[step][lang]) {
    return stepTranslations[step][lang];
  }

  for (const [key, trans] of Object.entries(stepTranslations)) {
    if (step.startsWith(key.slice(0, 20))) {
      return trans[lang];
    }
  }

  return step;
};

export default function DPRGenerationModal({ isOpen, progressPercent, stepName, language: propLang }: DPRGenerationModalProps) {
  const { language: ctxLang } = useLanguage();

  if (!isOpen) return null;

  const rawLang =
    propLang ||
    ctxLang ||
    (typeof window !== 'undefined'
      ? sessionStorage.getItem('dpr_selected_language') ||
        localStorage.getItem('dpr_language_preference') ||
        localStorage.getItem('dpr_selected_language')
      : null) ||
    'en';

  const activeLang: 'en' | 'kn' | 'hi' = rawLang === 'kn' ? 'kn' : rawLang === 'hi' ? 'hi' : 'en';
  const tM = modalI18n[activeLang] || modalI18n.en;
  const stages = tM.stages;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '1.5rem',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      <style>{`
        @keyframes floatBob1 {
          0%, 100% { transform: translateY(0px) rotateX(2deg); }
          50% { transform: translateY(-8px) rotateX(-2deg); }
        }
        @keyframes floatBob2 {
          0%, 100% { transform: translateY(-4px) rotateY(-3deg); }
          50% { transform: translateY(6px) rotateY(3deg); }
        }
        @keyframes laserFlow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -32; }
        }
        @keyframes rotateCore {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 15px #00F2FF); }
          50% { transform: scale(1.08); filter: drop-shadow(0 0 30px #00F2FF); }
        }
        @keyframes pageFlip3D {
          0%, 100% { transform: rotateY(0deg) translateZ(0); }
          50% { transform: rotateY(-12deg) translateZ(10px); }
        }
        @keyframes bookGlow {
          0%, 100% { box-shadow: 0 15px 35px rgba(0, 140, 149, 0.35), 0 0 25px rgba(0, 242, 255, 0.4); }
          50% { box-shadow: 0 25px 50px rgba(0, 140, 149, 0.55), 0 0 45px rgba(0, 242, 255, 0.8); }
        }
      `}</style>

      <div
        style={{
          width: '100%',
          maxWidth: '1120px',
          background: '#FFFFFF',
          borderRadius: '28px',
          padding: '2.2rem 2.6rem',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.4), 0 0 50px rgba(0, 140, 149, 0.25)',
          border: '1.5px solid rgba(221, 244, 243, 0.9)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* TOP ORANGE PILL ALERT */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.7rem',
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
            border: '1.5px solid #FDBA74',
            borderRadius: '50px',
            padding: '0.65rem 1.8rem',
            marginBottom: '1.2rem',
            boxShadow: '0 4px 18px rgba(251, 146, 60, 0.18)',
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: '#EA580C',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.82rem',
              fontWeight: 800,
            }}
          >
            <i className="fas fa-clock"></i>
          </div>
          <div>
            <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#9A3412', display: 'block' }}>
              {tM.alertTitle}
            </span>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#C2410C' }}>
              {tM.alertDesc}
            </span>
          </div>
        </div>

        {/* MAIN ENGAGEMENT TEXT MESSAGE */}
        <h2
          style={{
            fontSize: '1.38rem',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: '0.4rem',
            letterSpacing: '-0.3px',
            lineHeight: 1.35,
          }}
        >
          {tM.mainTitle}
        </h2>
        <p style={{ fontSize: '1.02rem', fontWeight: 700, color: '#008C95', marginBottom: '1.6rem' }}>
          {tM.subTitle}
        </p>

        {/* NATIVE LIVE 3D INTERACTIVE PIPELINE VISUAL CONTAINER */}
        <div
          style={{
            position: 'relative',
            height: '330px',
            background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 50%, #F0FDFA 100%)',
            borderRadius: '1.4rem',
            border: '1.5px solid #CBD5E1',
            boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.03), 0 10px 30px rgba(0, 140, 149, 0.08)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            perspective: '1000px',
            marginBottom: '1.6rem',
          }}
        >
          {/* FLOATING FILE BADGES IN BACKGROUND */}
          <div style={{ position: 'absolute', top: '15px', left: '160px', animation: 'floatBob2 4s infinite', zIndex: 1 }}>
            <span style={{ background: '#10B981', color: '#FFF', fontSize: '0.65rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}>XLS</span>
          </div>
          <div style={{ position: 'absolute', top: '45px', left: '200px', animation: 'floatBob1 3.5s infinite', zIndex: 1 }}>
            <span style={{ background: '#EF4444', color: '#FFF', fontSize: '0.65rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', boxShadow: '0 4px 10px rgba(239,68,68,0.3)' }}>PDF</span>
          </div>
          <div style={{ position: 'absolute', bottom: '35px', left: '180px', animation: 'floatBob2 3.8s infinite', zIndex: 1 }}>
            <span style={{ background: '#008C95', color: '#FFF', fontSize: '0.65rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', boxShadow: '0 4px 10px rgba(0,140,149,0.3)' }}>XLE</span>
          </div>

          {/* SVG LIVE ELECTRIFYING LASER BEAMS & PULSES */}
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            <defs>
              <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#008C95" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#00F2FF" stopOpacity="1" />
                <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {/* Stream Paths connecting Input Cards to AI Core */}
            <path d="M 170 50 Q 220 80 270 165" fill="none" stroke="url(#laserGrad)" strokeWidth="2.5" strokeDasharray="8 6" style={{ animation: 'laserFlow 0.8s linear infinite' }} />
            <path d="M 170 100 Q 220 120 270 165" fill="none" stroke="url(#laserGrad)" strokeWidth="2.5" strokeDasharray="8 6" style={{ animation: 'laserFlow 0.7s linear infinite' }} />
            <path d="M 170 165 L 270 165" fill="none" stroke="url(#laserGrad)" strokeWidth="3" strokeDasharray="8 6" style={{ animation: 'laserFlow 0.6s linear infinite' }} />
            <path d="M 170 230 Q 220 210 270 165" fill="none" stroke="url(#laserGrad)" strokeWidth="2.5" strokeDasharray="8 6" style={{ animation: 'laserFlow 0.7s linear infinite' }} />
            <path d="M 170 280 Q 220 250 270 165" fill="none" stroke="url(#laserGrad)" strokeWidth="2.5" strokeDasharray="8 6" style={{ animation: 'laserFlow 0.8s linear infinite' }} />

            {/* Stream Paths connecting AI Core to Financial, Charting & Report Engines */}
            <path d="M 370 165 L 430 165" fill="none" stroke="url(#laserGrad)" strokeWidth="3" strokeDasharray="8 6" style={{ animation: 'laserFlow 0.5s linear infinite' }} />
            <path d="M 550 165 L 610 165" fill="none" stroke="url(#laserGrad)" strokeWidth="3" strokeDasharray="8 6" style={{ animation: 'laserFlow 0.5s linear infinite' }} />
            <path d="M 730 165 L 790 165" fill="none" stroke="url(#laserGrad)" strokeWidth="3.5" strokeDasharray="8 6" style={{ animation: 'laserFlow 0.4s linear infinite' }} />
            <path d="M 890 165 L 940 165" fill="none" stroke="url(#laserGrad)" strokeWidth="3.5" strokeDasharray="8 6" style={{ animation: 'laserFlow 0.3s linear infinite' }} />
          </svg>

          {/* LAYER 1: FLOATING 3D INPUT CARDS (LEFT) */}
          <div style={{ width: '165px', display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 2 }}>
            {tM.inputBadges.map((item, i) => (
              <div
                key={i}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '0.55rem 0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.06), 0 2px 4px rgba(0,140,149,0.08)',
                  border: progressPercent < 25 ? '1.5px solid #008C95' : '1px solid #E2E8F0',
                  animation: `floatBob1 3s ease-in-out infinite`,
                  animationDelay: item.delay,
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(10deg)',
                }}
              >
                <div style={{ color: item.color, fontSize: '0.9rem' }}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#1E293B', whiteSpace: 'nowrap' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* LAYER 2: CENTRAL AI BRAIN CORE (HOLOGRAM PLATFORM) */}
          <div style={{ width: '125px', textAlign: 'center', zIndex: 2 }}>
            <div style={{ position: 'relative', width: '90px', height: '90px', margin: '0 auto' }}>
              {/* Rotating Outer Energy Rings */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: '2px dashed #00F2FF',
                  animation: 'rotateCore 8s linear infinite',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: '-6px',
                  borderRadius: '50%',
                  border: '1.5px solid rgba(0, 140, 149, 0.4)',
                  animation: 'rotateCore 12s linear infinite reverse',
                }}
              />

              {/* Glowing Pulsing AI Core */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #008C95 0%, #006F78 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00F2FF',
                  fontSize: '2.2rem',
                  boxShadow: '0 0 35px rgba(0, 242, 255, 0.7), inset 0 0 15px rgba(255,255,255,0.4)',
                  animation: 'pulseGlow 2.5s ease-in-out infinite',
                }}
              >
                <i className="fas fa-brain"></i>
              </div>
            </div>
            <div style={{ marginTop: '0.6rem', fontSize: '0.76rem', fontWeight: 800, color: '#008C95', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {tM.aiCore}
            </div>
          </div>

          {/* LAYER 3: 3D FINANCIAL MODEL ENGINE CARD */}
          <div
            style={{
              width: '125px',
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '0.9rem 0.7rem',
              border: progressPercent >= 25 && progressPercent < 50 ? '2px solid #2563EB' : '1.5px solid #93C5FD',
              boxShadow: progressPercent >= 25 && progressPercent < 50 ? '0 0 25px rgba(37, 99, 235, 0.4)' : '0 12px 28px rgba(37, 99, 235, 0.15)',
              textAlign: 'center',
              zIndex: 2,
              animation: 'floatBob2 3.2s ease-in-out infinite',
              transform: 'rotateY(5deg)',
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563EB', marginBottom: '0.2rem' }}>
              &sum;
            </div>
            <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '0.4rem' }}>
              <span style={{ background: '#EFF6FF', color: '#1E40AF', fontSize: '0.58rem', fontWeight: 800, padding: '2px 5px', borderRadius: '4px' }}>NPV</span>
              <span style={{ background: '#EFF6FF', color: '#1E40AF', fontSize: '0.58rem', fontWeight: 800, padding: '2px 5px', borderRadius: '4px' }}>IRR</span>
              <span style={{ background: '#EFF6FF', color: '#1E40AF', fontSize: '0.58rem', fontWeight: 800, padding: '2px 5px', borderRadius: '4px' }}>BEP</span>
            </div>
            <div style={{ color: '#2563EB', fontSize: '1.4rem' }}>
              <i className="fas fa-calculator"></i>
            </div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', marginTop: '0.3rem' }}>
              {tM.financialEngine}
            </div>
          </div>

          {/* LAYER 4: 3D VISUAL CHARTING CARD */}
          <div
            style={{
              width: '125px',
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '0.9rem 0.7rem',
              border: progressPercent >= 50 && progressPercent < 75 ? '2px solid #10B981' : '1.5px solid #A7F3D0',
              boxShadow: progressPercent >= 50 && progressPercent < 75 ? '0 0 25px rgba(16, 185, 129, 0.4)' : '0 12px 28px rgba(16, 185, 129, 0.15)',
              textAlign: 'center',
              zIndex: 2,
              animation: 'floatBob1 3.6s ease-in-out infinite',
              transform: 'rotateY(-5deg)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: '#10B981', fontSize: '1.3rem' }}>
              <i className="fas fa-chart-pie"></i>
              <i className="fas fa-chart-bar"></i>
            </div>
            <div style={{ height: '24px', background: '#F0FDFA', borderRadius: '6px', padding: '3px 6px', display: 'flex', alignItems: 'flex-end', gap: '3px', justifyContent: 'center' }}>
              <div style={{ width: '6px', height: '60%', background: '#10B981', borderRadius: '2px' }} />
              <div style={{ width: '6px', height: '90%', background: '#008C95', borderRadius: '2px' }} />
              <div style={{ width: '6px', height: '75%', background: '#3B82F6', borderRadius: '2px' }} />
            </div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', marginTop: '0.4rem' }}>
              {tM.visualEngine}
            </div>
          </div>

          {/* LAYER 5: 3D DOCUMENT PAGE-FLIPPING STACK */}
          <div
            style={{
              width: '115px',
              position: 'relative',
              zIndex: 2,
              animation: 'pageFlip3D 4s ease-in-out infinite',
              transform: 'rotateY(-10deg)',
            }}
          >
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '0.8rem',
                border: progressPercent >= 75 && progressPercent < 90 ? '2px solid #008C95' : '1.5px solid #CBD5E1',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.3rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '3px' }}>
                {tM.dprReport}
              </div>
              <div style={{ height: '4px', background: '#E2E8F0', borderRadius: '2px', marginBottom: '3px', width: '80%' }} />
              <div style={{ height: '4px', background: '#E2E8F0', borderRadius: '2px', marginBottom: '3px', width: '100%' }} />
              <div style={{ height: '4px', background: '#E2E8F0', borderRadius: '2px', marginBottom: '3px', width: '60%' }} />
              <div style={{ height: '18px', background: '#F1F5F9', borderRadius: '4px', marginTop: '5px' }} />
            </div>
          </div>

          {/* LAYER 6: 3D FINALIZED DPR REPORT BOOK WITH GLOWING PULSE */}
          <div
            style={{
              width: '135px',
              height: '190px',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
              borderRadius: '14px',
              border: progressPercent >= 90 ? '2.5px solid #10B981' : '2px solid #008C95',
              padding: '1rem 0.8rem',
              position: 'relative',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              zIndex: 3,
              animation: 'bookGlow 3s infinite, floatBob1 3s ease-in-out infinite',
              transformStyle: 'preserve-3d',
              transform: 'rotateY(-15deg) translateZ(10px)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.3px', lineHeight: 1.25 }}>
                {tM.detailedProjectReport}
              </div>
              <div style={{ fontSize: '0.62rem', fontWeight: 700, color: '#008C95', marginTop: '0.2rem' }}>
                {tM.visionKarnataka}
              </div>
            </div>

            <div style={{ fontSize: '2rem', color: '#008C95' }}>
              <i className="fas fa-building"></i>
            </div>

            {/* Red PDF Badge & Pulsing Green Checkmark Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ background: '#EF4444', color: '#FFF', fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', borderRadius: '5px' }}>
                PDF
              </span>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: progressPercent >= 90 ? '#10B981' : '#CBD5E1',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  boxShadow: progressPercent >= 90 ? '0 0 12px #10B981' : 'none',
                  transition: 'all 0.4s ease',
                }}
              >
                <i className="fas fa-check"></i>
              </div>
            </div>
          </div>
        </div>

        {/* DYNAMIC PROGRESS STEPPER BAR */}
        <div style={{ padding: '0 0.5rem' }}>
          {/* Progress Line Track */}
          <div
            style={{
              position: 'relative',
              height: '8px',
              background: '#E2E8F0',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.max(progressPercent, 5)}%`,
                background: 'linear-gradient(90deg, #008C95 0%, #36B5B8 50%, #FF7A00 100%)',
                borderRadius: '10px',
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 0 12px rgba(0, 140, 149, 0.5)',
              }}
            />
          </div>

          {/* Stepper Stages Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '0.5rem',
              textAlign: 'center',
            }}
          >
            {stages.map((st, idx) => {
              const isCompleted = progressPercent >= st.threshold;
              const isActive =
                progressPercent < st.threshold &&
                (idx === 0 || progressPercent >= stages[idx - 1].threshold);

              return (
                <div key={idx} style={{ opacity: isCompleted || isActive ? 1 : 0.45, transition: 'all 0.3s ease' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      margin: '0 auto 0.4rem auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      background: isCompleted
                        ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                        : isActive
                        ? 'linear-gradient(135deg, #008C95 0%, #006F78 100%)'
                        : '#CBD5E1',
                      color: '#FFFFFF',
                      boxShadow: isActive ? '0 0 15px rgba(0, 140, 149, 0.6)' : 'none',
                      transform: isActive ? 'scale(1.15)' : 'scale(1)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isCompleted ? (
                      <i className="fas fa-check"></i>
                    ) : isActive ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <i className={`fas ${st.icon}`}></i>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: isActive ? '#008C95' : isCompleted ? '#0F172A' : '#64748B',
                      marginBottom: '0.15rem',
                    }}
                  >
                    {st.label}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#64748B', lineHeight: 1.2 }}>
                    {st.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CURRENT LIVE STEP BADGE */}
        <div style={{ marginTop: '1.4rem', fontSize: '0.84rem', fontWeight: 700, color: '#475569' }}>
          {tM.currentAction}{' '}
          <span style={{ color: '#008C95' }}>
            {translateStep(stepName, activeLang) || tM.defaultStep}
          </span>
        </div>
      </div>
    </div>
  );
}
