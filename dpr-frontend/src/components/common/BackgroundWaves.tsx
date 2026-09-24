'use client';

import React from 'react';

export default function BackgroundWaves() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {/* Dynamic Keyframe Animations for Live Wave Motion */}
      <style jsx global>{`
        @keyframes slideUpDownWave {
          0% { transform: translateY(0px); }
          50% { transform: translateY(55px); }
          100% { transform: translateY(0px); }
        }

        @keyframes slideUpDownWaveSecondary {
          0% { transform: translateY(0px) scaleY(1); }
          50% { transform: translateY(75px) scaleY(1.04); }
          100% { transform: translateY(0px) scaleY(1); }
        }

        @keyframes liveWaveSlow1 {
          0% { transform: translateY(0px) skewY(0deg); }
          50% { transform: translateY(-16px) skewY(-1.2deg); }
          100% { transform: translateY(0px) skewY(0deg); }
        }

        @keyframes liveWaveSlow2 {
          0% { transform: translateY(0px) scaleY(1); }
          50% { transform: translateY(20px) scaleY(1.05); }
          100% { transform: translateY(0px) scaleY(1); }
        }

        @keyframes liveWaveSideLeft {
          0% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(18px) translateY(-22px); }
          100% { transform: translateX(0px) translateY(0px); }
        }

        @keyframes liveWaveSideRight {
          0% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(-20px) translateY(18px); }
          100% { transform: translateX(0px) translateY(0px); }
        }

        @keyframes livePulseGlow {
          0% { transform: scale(1) translateY(0px); opacity: 0.3; }
          50% { transform: scale(1.15) translateY(-20px); opacity: 0.65; }
          100% { transform: scale(1) translateY(0px); opacity: 0.3; }
        }

        @keyframes liveOrangeStroke {
          0% { stroke-dashoffset: 0; opacity: 0.75; }
          50% { stroke-dashoffset: -40; opacity: 1; }
          100% { stroke-dashoffset: -80; opacity: 0.75; }
        }

        .animate-slide-up-down {
          animation: slideUpDownWave 8s ease-in-out infinite;
          will-change: transform;
        }

        .animate-slide-up-down-slow {
          animation: slideUpDownWaveSecondary 11s ease-in-out infinite;
          will-change: transform;
        }

        .animate-live-wave-1 {
          animation: liveWaveSlow1 10s ease-in-out infinite;
          transform-origin: top left;
          will-change: transform;
        }

        .animate-live-wave-2 {
          animation: liveWaveSlow2 14s ease-in-out infinite;
          transform-origin: top left;
          will-change: transform;
        }

        .animate-live-side-left {
          animation: liveWaveSideLeft 16s ease-in-out infinite;
          will-change: transform;
        }

        .animate-live-side-right {
          animation: liveWaveSideRight 18s ease-in-out infinite;
          will-change: transform;
        }

        .animate-live-glow {
          animation: livePulseGlow 8s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .animate-live-orange-line {
          animation: liveOrangeStroke 6s ease-in-out infinite;
          will-change: opacity;
        }
      `}</style>

      {/* 1. Hero Section Top-Left Visual Wave Structure (Sliding Down and Up) */}
      <svg
        className="animate-slide-up-down"
        style={{ position: 'absolute', top: 0, left: 0, width: '48%', height: '950px', opacity: 0.95 }}
        viewBox="0 0 600 900"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="deepTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#006F78" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#008C95" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="mediumTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#008C95" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#36B5B8" stopOpacity="0.65" />
          </linearGradient>

          <linearGradient id="lightAquaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#36B5B8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#DDF4F3" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="orangeStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFA45B" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Layer 1: Dark Teal Base Wave (Live Sliding Down & Up) */}
        <path
          className="animate-slide-up-down"
          d="M -100 -50 L 380 -50 C 450 200 320 420 220 580 C 120 740 380 850 -100 950 Z"
          fill="url(#deepTealGrad)"
        />

        {/* Layer 2: Medium Teal Wave (Staggered Dynamic Sliding) */}
        <path
          className="animate-slide-up-down-slow"
          d="M -100 -50 L 440 -50 C 510 180 370 450 270 610 C 170 770 420 880 -100 950 Z"
          fill="url(#mediumTealGrad)"
        />

        {/* Layer 3: Soft Aqua Wave */}
        <path
          className="animate-live-wave-1"
          d="M -100 -50 L 500 -50 C 570 150 410 480 310 640 C 210 800 460 900 -100 950 Z"
          fill="url(#lightAquaGrad)"
        />

        {/* Vibrant Orange Accent Line with Live Pulse */}
        <path
          className="animate-live-orange-line"
          d="M 10 -50 C 490 190 350 470 250 630 C 150 790 400 890 -100 950"
          stroke="url(#orangeStrokeGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Fine Secondary Dotted Line */}
        <path
          d="M -50 120 C 350 280 290 520 180 690 C 80 830 300 920 -100 980"
          stroke="#DDF4F3"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.6"
        />
      </svg>

      {/* Hero Section Live Pulsing Radial Glow */}
      <div
        className="animate-live-glow"
        style={{
          position: 'absolute',
          top: '150px',
          left: '8%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(221, 244, 243, 0.35) 0%, rgba(242, 250, 250, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* 2. Middle Section Side Waves (Live Flow Left & Right) */}
      <svg
        className="animate-live-side-left"
        style={{ position: 'absolute', top: '900px', left: 0, width: '24%', height: '2200px', opacity: 0.7 }}
        viewBox="0 0 300 2200"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M -50 0 C 200 350 90 850 -20 1300 C 160 1700 70 2050 -50 2200 Z"
          fill="#36B5B8"
          opacity="0.15"
        />
        <path
          d="M -50 0 C 260 400 130 900 20 1350 C 200 1750 100 2100 -50 2200"
          stroke="#008C95"
          strokeWidth="2"
          fill="none"
          opacity="0.25"
        />
        <path
          className="animate-live-orange-line"
          d="M -50 200 C 220 550 100 1050 10 1500 C 170 1850 60 2150 -50 2200"
          stroke="#FF7A00"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          fill="none"
          opacity="0.4"
        />
      </svg>

      <svg
        className="animate-live-side-right"
        style={{ position: 'absolute', top: '1000px', right: 0, width: '26%', height: '2000px', opacity: 0.65 }}
        viewBox="0 0 350 2000"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M 400 0 C 140 400 260 1000 380 1500 C 220 1750 300 1950 400 2000 Z"
          fill="#008C95"
          opacity="0.14"
        />
        <path
          d="M 400 100 C 170 500 290 1050 390 1550 C 240 1800 320 1980 400 2000"
          stroke="#36B5B8"
          strokeWidth="2"
          fill="none"
          opacity="0.28"
        />
        <path
          d="M 400 250 C 210 600 330 1150 400 1650"
          stroke="#FFA45B"
          strokeWidth="2"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.45"
        />
      </svg>

      {/* Floating Live Glowing Circles */}
      <div
        className="animate-live-glow"
        style={{
          position: 'absolute',
          top: '1600px',
          left: '2%',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 140, 149, 0.12) 0%, rgba(242, 250, 250, 0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="animate-live-glow"
        style={{
          position: 'absolute',
          top: '2600px',
          right: '3%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 122, 0, 0.1) 0%, rgba(242, 250, 250, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Dotted Grid Pattern in Middle Section Margin */}
      <svg
        style={{ position: 'absolute', top: '1500px', right: '2%', width: '130px', height: '140px', opacity: 0.25 }}
        viewBox="0 0 100 120"
        fill="none"
      >
        <pattern id="dot-grid-mid-right" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="2" fill="#008C95" />
        </pattern>
        <rect width="100" height="120" fill="url(#dot-grid-mid-right)" />
      </svg>

      {/* 3. Bottom Section Decorative Vector Waves with Live Undulation */}
      <svg
        className="animate-live-wave-2"
        style={{ position: 'absolute', bottom: 0, right: 0, width: '45%', height: '750px', opacity: 0.88 }}
        viewBox="0 0 600 750"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Layer 1: Soft Aqua Wave */}
        <path
          d="M 650 800 L 120 800 C 200 550 370 380 510 300 C 600 250 640 300 650 370 Z"
          fill="#36B5B8"
          opacity="0.28"
        />
        {/* Layer 2: Medium Teal Accent */}
        <path
          d="M 650 800 L 250 800 C 330 600 470 450 580 390 C 630 360 645 390 650 430 Z"
          fill="#008C95"
          opacity="0.22"
        />
        {/* Layer 3: Vibrant Orange Accent Line */}
        <path
          className="animate-live-orange-line"
          d="M 180 800 C 280 580 440 410 650 330"
          stroke="#FF7A00"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        {/* Fine Secondary Dotted Line */}
        <path
          d="M 230 800 C 320 620 470 470 650 400"
          stroke="#DDF4F3"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.6"
        />
      </svg>

      {/* Bottom Left Live Soft Wave Accent */}
      <svg
        className="animate-slide-up-down-slow"
        style={{ position: 'absolute', bottom: 0, left: 0, width: '38%', height: '600px', opacity: 0.85 }}
        viewBox="0 0 500 600"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M -50 650 L 400 650 C 290 480 180 370 40 300 C -20 270 -45 300 -50 340 Z"
          fill="#006F78"
          opacity="0.16"
        />
        <path
          d="M -50 650 L 300 650 C 210 510 110 420 -10 360 Z"
          fill="#008C95"
          opacity="0.2"
        />
        <path
          d="M 420 650 C 300 500 180 380 -50 310"
          stroke="#FFA45B"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}
