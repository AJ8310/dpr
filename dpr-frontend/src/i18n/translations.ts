export type Language = 'en' | 'kn' | 'hi';

export interface Translations {
  common: {
    appName: string;
    tagline: string;
    createDpr: string;
    contactTeam: string;
    overview: string;
    fundingNeeds: string;
    sectors: string;
    financialStudio: string;
    pricing: string;
    faq: string;
    signIn: string;
    signUp: string;
    logout: string;
    next: string;
    previous: string;
    saveDraft: string;
    downloadPdf: string;
    downloadDocx: string;
    loading: string;
    viewPlans: string;
    generateDpr: string;
  };
  languageModal: {
    title: string;
    subtitle: string;
    selectPrompt: string;
    knTitle: string;
    knDesc: string;
    hiTitle: string;
    hiDesc: string;
    enTitle: string;
    enDesc: string;
    continueBtn: string;
  };
  hero: {
    headline: string;
    manualPrep: string;
    speedBadge: string;
    subtitle: string;
    viewPlansBtn: string;
    contactTeamBtn: string;
    highlights: {
      speed: string;
      bankReady: string;
      schemes: string;
      caNorms: string;
    };
  };
  sectors: {
    kicker: string;
    title: string;
    subtitle: string;
    keyAnalysis: string;
    generateBtn: string;
  };
  fundingNeeds: {
    kicker: string;
    title: string;
    subtitle: string;
    bankLoansTitle: string;
    bankLoansDesc: string;
    bankLoansBtn: string;
    govtSubsidiesTitle: string;
    govtSubsidiesDesc: string;
    govtSubsidiesBtn: string;
    investorTitle: string;
    investorDesc: string;
    investorBtn: string;
  };
  financialStudio: {
    kicker: string;
    title: string;
    subtitle: string;
    sliderLabel: string;
    totalCost: string;
    bankLoan: string;
    subsidy: string;
    avgDscr: string;
    projectionsTab: string;
    ratiosTab: string;
    repaymentsTab: string;
    sensitivitiesTab: string;
    turnover: string;
    opex: string;
    netProfit: string;
  };
  pricing: {
    title: string;
    highlight: string;
    subtitle: string;
    tagPill: string;
    routes: {
      govt: { title: string; tag: string; desc: string };
      bank: { title: string; tag: string; desc: string };
      inv: { title: string; tag: string; desc: string };
    };
    plans: {
      entry: { name: string; sub: string; cta: string };
      core: { name: string; sub: string; cta: string };
      team: { name: string; sub: string; cta: string };
      ent: { name: string; sub: string; cta: string };
    };
  };
  faq: {
    title: string;
  };
  contact: {
    kicker: string;
    title: string;
    subtitle: string;
    sendInquiry: string;
    accountLogin: string;
    register: string;
    fullName: string;
    businessName: string;
    email: string;
    phone: string;
    city: string;
    businessType: string;
    dprPurpose: string;
    submitBtn: string;
  };
  dashboard: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
    step6: string;
    generatingDpr: string;
    generatingDesc: string;
  };
}

export const translations: Record<Language, Translations> = {
  // 1. ENGLISH (DEFAULT)
  en: {
    common: {
      appName: 'DPRPro AI',
      tagline: 'Create Professional DPR Reports in Less Time',
      createDpr: 'Create My DPR',
      contactTeam: 'Contact Team',
      overview: 'Overview',
      fundingNeeds: 'Funding Needs',
      sectors: 'Sectors',
      financialStudio: 'Financial Studio',
      pricing: 'Pricing',
      faq: 'FAQ',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      logout: 'Log Out',
      next: 'Next Step',
      previous: 'Previous',
      saveDraft: 'Save Draft',
      downloadPdf: 'Download PDF Report',
      downloadDocx: 'Download Word (.docx)',
      loading: 'Loading...',
      viewPlans: 'View Plans by Project Size',
      generateDpr: 'Generate DPR',
    },
    languageModal: {
      title: 'Welcome to DPRPro AI',
      subtitle: 'Institutional Detailed Project Report (DPR) Engine',
      selectPrompt: 'Select your preferred language to continue:',
      knTitle: 'ಕನ್ನಡ (Kannada)',
      knDesc: 'ಕರ್ನಾಟಕದ ಗ್ರಾಮೀಣ ಹಾಗೂ ಸಣ್ಣ ಉದ್ಯಮಿಗಳಿಗೆ ಬ್ಯಾಂಕ್ ಸಾಲ ಮತ್ತು ಸಬ್ಸಿಡಿ DPR ವರದಿ',
      hiTitle: 'हिंदी (Hindi)',
      hiDesc: 'एमएसएमई, पीएमईजीपी एवं बैंक ऋण हेतु संस्थागत डीपीआर रिपोर्ट',
      enTitle: 'English',
      enDesc: 'Institutional credit appraisal format for banks, NBFCs, and investors',
      continueBtn: 'Continue in English →',
    },
    hero: {
      headline: 'Build Your Funding-Ready DPR, Smarter.',
      manualPrep: '3 weeks manual prep',
      speedBadge: '⚡ < 10 mins flow',
      subtitle: 'Turn your business, project and financial information into a professionally structured Detailed Project Report (DPR) — formatted for institutional credit appraisal.',
      viewPlansBtn: 'View Plans by Project Size',
      contactTeamBtn: 'Contact Team',
      highlights: {
        speed: '10-Minute Generation Flow',
        bankReady: 'Bank Credit Appraisal Compliant',
        schemes: 'PMEGP / PMFME & State Schemes',
        caNorms: 'RBI Norms & CA Standards',
      },
    },
    sectors: {
      kicker: 'Supported Business Sectors',
      title: 'Built for Every Business Sector',
      subtitle: 'Our AI engine generates institutional-grade Detailed Project Reports tailored to specific industry norms, machinery heads, and benchmark operational metrics.',
      keyAnalysis: 'Key DPR Sections & Analysis:',
      generateBtn: 'Generate DPR →',
    },
    fundingNeeds: {
      kicker: 'Use Cases',
      title: 'One DPR. Multiple Funding Goals.',
      subtitle: 'Whether you are preparing for business expansion or seeking institutional finance, structure documentation around your specific objective.',
      bankLoansTitle: 'Bank & NBFC Loans',
      bankLoansDesc: 'Present your business, project heads, financial projections, and debt repayment schedules in a structured report for credit sanction.',
      bankLoansBtn: 'Create Loan DPR →',
      govtSubsidiesTitle: 'Government Subsidies',
      govtSubsidiesDesc: 'Prepare structured project reports for PMEGP, PMFME, State Industrial Policies, and MSME capital subsidy claims.',
      govtSubsidiesBtn: 'Prepare Subsidy DPR →',
      investorTitle: 'Investor Funding',
      investorDesc: 'Consolidate your unit profile, unit economics, and multi-scenario sensitivities into a compelling pitch document.',
      investorBtn: 'Build Investor DPR →',
    },
    financialStudio: {
      kicker: 'Interactive Financial Simulator',
      title: 'Experience Real-Time Calculation Engine',
      subtitle: 'Adjust the machinery cost slider below to see how our engine automatically updates P&L projections, DSCR coverage, and term loan limits live.',
      sliderLabel: 'Adjust Machinery Investment Cost:',
      totalCost: 'Total Project Cost',
      bankLoan: 'Bank Loan (70%)',
      subsidy: 'Eligible Subsidy',
      avgDscr: 'Average DSCR',
      projectionsTab: '5-Year Profit & Loss forecast',
      ratiosTab: 'DSCR, Debt-Equity & Margins',
      repaymentsTab: 'Principal & Interest amortization',
      sensitivitiesTab: 'Break-even & capacity utilization',
      turnover: 'Gross Turnover',
      opex: 'Operating Expenses',
      netProfit: 'Projected Net Profit',
    },
    pricing: {
      title: 'Choose your',
      highlight: 'funding route',
      subtitle: 'Select how you plan to raise capital for your project. On the next screen, pick a DPR plan sized for your project.',
      tagPill: '3 Funding Routes • Prices start at ₹3,999',
      routes: {
        govt: { title: 'PMEGP, PMFME & State Policies', tag: 'GOVT SCHEMES & SUBSIDIES', desc: 'For entrepreneurs applying for government grants, margin money, or capital subsidies.' },
        bank: { title: 'Term Loan & Working Capital', tag: 'BANK & NBFC LOANS', desc: 'For businesses seeking debt financing from public, private, or co-operative banks.' },
        inv: { title: 'Pitch DPR & Equity Expansion', tag: 'INVESTOR FUNDING', desc: 'For startups & MSMEs pitching to angel investors, VC funds, or strategic partners.' },
      },
      plans: {
        entry: { name: 'Entry', sub: 'Early-stage projects (₹5L – ₹25L)', cta: 'Create DPR' },
        core: { name: 'Core', sub: 'Growing businesses (₹25L – ₹1Cr)', cta: 'Create DPR' },
        team: { name: 'Team', sub: 'Growth-stage businesses & MSMEs (₹1Cr – ₹5Cr)', cta: 'Create Advanced DPR' },
        ent: { name: 'Enterprise', sub: 'Established & large businesses (₹5Cr – ₹25Cr+)', cta: 'Contact Team' },
      },
    },
    faq: {
      title: 'Frequently Asked Questions',
    },
    contact: {
      kicker: 'Connect with our team',
      title: 'Tell us about your project.',
      subtitle: 'Share your project details and requirements. Our advisory team will assist you in preparing a bankable DPR.',
      sendInquiry: 'Send Inquiry',
      accountLogin: 'Account Login',
      register: 'Register',
      fullName: 'Full name',
      businessName: 'Business name (optional)',
      email: 'Email',
      phone: 'Phone',
      city: 'City (optional)',
      businessType: 'Business type (optional)',
      dprPurpose: 'What do you need the DPR for?',
      submitBtn: 'Send Message →',
    },
    dashboard: {
      step1: 'Business Profile',
      step2: 'Promoter Details',
      step3: 'Products & Machinery',
      step4: 'Financial Planning',
      step5: 'Debt & Subsidies',
      step6: 'Generate DPR',
      generatingDpr: 'Building Your Bank-Ready DPR',
      generatingDesc: 'Calculating 10-year financials, DSCR, and rendering institutional report...',
    },
  },

  // 2. KANNADA (ಕನ್ನಡ - PRIMARY FOR KARNATAKA RURAL ENTREPRENEURS)
  kn: {
    common: {
      appName: 'DPRPro AI',
      tagline: 'ಕಡಿಮೆ ಸಮಯದಲ್ಲಿ ವೃತ್ತಿಪರ DPR ವರದಿಗಳನ್ನು ತಯಾರಿಸಿ',
      createDpr: 'ನನ್ನ DPR ರಚಿಸಿ',
      contactTeam: 'ತಜ್ಞರ ಸಂಪರ್ಕ',
      overview: 'ಅವಲೋಕನ',
      fundingNeeds: 'ಹಣಕಾಸು ಅಗತ್ಯಗಳು',
      sectors: 'ಉದ್ಯಮ ವಲಯಗಳು',
      financialStudio: 'ಹಣಕಾಸು ಸ್ಟುಡಿಯೋ',
      pricing: 'ದರಪಟ್ಟಿ',
      faq: 'ಪ್ರಶ್ನೋತ್ತರ',
      signIn: 'ಲಾಗಿನ್',
      signUp: 'ನೋಂದಣಿ',
      logout: 'ನಿರ್ಗಮನ',
      next: 'ಮುಂದಿನ ಹಂತ',
      previous: 'ಹಿಂದಿನ ಹಂತ',
      saveDraft: 'ಕರಡು ಉಳಿಸಿ',
      downloadPdf: 'PDF ವರದಿ ಡೌನ್‌ಲೋಡ್',
      downloadDocx: 'ವರ್ಡ್ (.docx) ಡೌನ್‌ಲೋಡ್',
      loading: 'ಪ್ರಕ್ರಿಯೆ ನಡೆಯುತ್ತಿದೆ...',
      viewPlans: 'ಯೋಜನಾ ಗಾತ್ರದ ಪ್ರಕಾರ ಯೋಜನೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
      generateDpr: 'DPR ರಚಿಸಿ',
    },
    languageModal: {
      title: 'DPRPro AI ಗೆ ಸುಸ್ವಾಗತ',
      subtitle: 'ಸಂಸ್ಥಾಗತ ವಿವರವಾದ ಯೋಜನಾ ವರದಿ (DPR) ಎಂಜಿನ್',
      selectPrompt: 'ಮುಂದುವರಿಯಲು ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
      knTitle: 'ಕನ್ನಡ (Kannada)',
      knDesc: 'ಕರ್ನಾಟಕದ ಗ್ರಾಮೀಣ ಹಾಗೂ ಸಣ್ಣ ಉದ್ಯಮಿಗಳಿಗೆ ಬ್ಯಾಂಕ್ ಸಾಲ ಮತ್ತು ಸಬ್ಸಿಡಿ DPR ವರದಿ',
      hiTitle: 'हिंदी (Hindi)',
      hiDesc: 'एमएसएमई, पीएमईजीपी एवं बैंक ऋण हेतु संस्थागत डीपीआर रिपोर्ट',
      enTitle: 'English (ಇಂಗ್ಲಿಷ್)',
      enDesc: 'ಬ್ಯಾಂಕ್‌ಗಳು ಮತ್ತು ಹಣಕಾಸು ಸಂಸ್ಥೆಗಳಿಗೆ ಅಧಿಕೃತ ಆಂಗ್ಲ ಮಾದರಿ',
      continueBtn: 'ಕನ್ನಡದಲ್ಲಿ ಮುಂದುವರಿಯಿರಿ →',
    },
    hero: {
      headline: 'ಬ್ಯಾಂಕ್ ಸಾಲ ಹಾಗೂ ಸಬ್ಸಿಡಿಗೆ ಅಧಿಕೃತ DPR ವರದಿ ಸುಲಭವಾಗಿ ಸಿದ್ಧಪಡಿಸಿ.',
      manualPrep: '3 ವಾರಗಳ ಹಸ್ತಚಾಲಿತ ಕೆಲಸ',
      speedBadge: '⚡ 10 ನಿಮಿಷಗಳ ಸುಲಭ ಪ್ರಕ್ರಿಯೆ',
      subtitle: 'ನಿಮ್ಮ ವ್ಯವಹಾರ, ಯಂತ್ರೋಪಕರಣ ಮತ್ತು ಹಣಕಾಸಿನ ಮಾಹಿತಿಯನ್ನು ಅಧಿಕೃತ ಬ್ಯಾಂಕ್ ಸಾಲ ಮತ್ತು ಸಬ್ಸಿಡಿ ಮಂಜೂರಾತಿಗಾಗಿ ವೃತ್ತಿಪರ ವಿವರವಾದ ಯೋಜನಾ ವರದಿಯಾಗಿ (DPR) ಪರಿವರ್ತಿಸಿ.',
      viewPlansBtn: 'ಯೋಜನಾ ಗಾತ್ರದ ಯೋಜನೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
      contactTeamBtn: 'ತಜ್ಞರ ಸಂಪರ್ಕ',
      highlights: {
        speed: '10 ನಿಮಿಷಗಳಲ್ಲಿ ಸಂಪೂರ್ಣ DPR',
        bankReady: 'ಬ್ಯಾಂಕ್ ಕ್ರೆಡಿಟ್ ಮಂಜೂರಾತಿ ನಿಯಮಗಳಿಗೆ ಅನುಗುಣ',
        schemes: 'PMEGP / PMFME ಮತ್ತು ರಾಜ್ಯ ಸಬ್ಸಿಡಿ ಸಿದ್ಧ',
        caNorms: 'RBI ಮತ್ತು CA ಗುಣಮಟ್ಟಕ್ಕೆ ಅನುಸಾರ',
      },
    },
    sectors: {
      kicker: 'ಬೆಂಬಲಿತ ವ್ಯವಹಾರ ವಲಯಗಳು',
      title: 'ಪ್ರತಿಯೊಂದು ಉದ್ಯಮ ವಲಯಕ್ಕೂ ವಿಶೇಷ DPR',
      subtitle: 'ನಮ್ಮ AI ಎಂಜಿನ್ ಉದ್ಯಮ ಮಾನದಂಡಗಳು, ಯಂತ್ರೋಪಕರಣಗಳ ವೆಚ್ಚ ಮತ್ತು ಕಾರ್ಯಾಚರಣೆಯ ಮೆಟ್ರಿಕ್‌ಗಳಿಗೆ ತಕ್ಕಂತೆ ಅಧಿಕೃತ ಯೋಜನಾ ವರದಿಗಳನ್ನು ರಚಿಸುತ್ತದೆ.',
      keyAnalysis: 'ಪ್ರಮುಖ DPR ವಿಭಾಗಗಳು ಮತ್ತು ವಿಶ್ಲೇಷಣೆ:',
      generateBtn: 'DPR ರಚಿಸಿ →',
    },
    fundingNeeds: {
      kicker: 'ಉಪಯೋಗಗಳು',
      title: 'ಒಂದೇ DPR. ವಿವಿಧ ಹಣಕಾಸು ಗುರಿಗಳು.',
      subtitle: 'ನೀವು ಹೊಸ ವ್ಯವಹಾರ ಆರಂಭಿಸುತ್ತಿರಲಿ ಅಥವಾ ವಿಸ್ತರಣೆ ಮಾಡುತ್ತಿರಲಿ, ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ಗುರಿಗೆ ತಕ್ಕಂತೆ ವರದಿ ರಚಿಸಿ.',
      bankLoansTitle: 'ಬ್ಯಾಂಕ್ ಮತ್ತು NBFC ಸಾಲಗಳು',
      bankLoansDesc: 'ಸಾಲ ಮಂಜೂರಾತಿಗಾಗಿ ನಿಮ್ಮ ವ್ಯವಹಾರ ವಿವರ, ಆರ್ಥಿಕ ಪ್ರಕ್ಷೇಪಗಳು ಮತ್ತು ಮರುಪಾವತಿ ವೇಳಾಪಟ್ಟಿಯನ್ನು ಅಧಿಕೃತವಾಗಿ ಪ್ರಸ್ತುತಪಡಿಸಿ.',
      bankLoansBtn: 'ಸಾಲ DPR ರಚಿಸಿ →',
      govtSubsidiesTitle: 'ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿಗಳು',
      govtSubsidiesDesc: 'PMEGP, PMFME, ರಾಜ್ಯ ಕೈಗಾರಿಕಾ ನೀತಿ ಮತ್ತು MSME ಬಂಡವಾಳ ಸಬ್ಸಿಡಿ ಕ್ಲೈಮ್‌ಗಳಿಗಾಗಿ ಕರಾರುವಾಕ್ ವರದಿ ಸಿದ್ಧಪಡಿಸಿ.',
      govtSubsidiesBtn: 'ಸಬ್ಸಿಡಿ DPR ಸಿದ್ಧಪಡಿಸಿ →',
      investorTitle: 'ಹೂಡಿಕೆದಾರರ ಬಂಡವಾಳ',
      investorDesc: 'ನಿಮ್ಮ ವ್ಯವಹಾರದ ಸಾಮರ್ಥ್ಯ, ಆದಾಯ ಮಾದರಿ ಮತ್ತು ಭವಿಷ್ಯದ ಬೆಳವಣಿಗೆಯನ್ನು ಆಕರ್ಷಕ ಹೂಡಿಕೆದಾರರ ಪಿಚ್ ಡಾಕ್ಯುಮೆಂಟ್ ಆಗಿ ಸಂಯೋಜಿಸಿ.',
      investorBtn: 'ಹೂಡಿಕೆದಾರರ DPR ರಚಿಸಿ →',
    },
    financialStudio: {
      kicker: 'ಸಂವಾದಾತ್ಮಕ ಹಣಕಾಸು ಸಿಮ್ಯುಲೇಟರ್',
      title: 'ಲೈವ್ ಲೆಕ್ಕಾಚಾರ ಎಂಜಿನ್ ಅನುಭವಿಸಿ',
      subtitle: 'ಕೆಳಗಿನ ಯಂತ್ರೋಪಕರಣ ವೆಚ್ಚದ ಸ್ಲೈಡರ್ ಅನ್ನು ಹೊಂದಿಸಿ, ನಮ್ಮ ಎಂಜಿನ್ ಹೇಗೆ ಲಾಭ-ನಷ್ಟ, DSCR ಅನುಪಾತ ಮತ್ತು ಬ್ಯಾಂಕ್ ಸಾಲದ ಮಿತಿಗಳನ್ನು ತಕ್ಷಣವೇ ನವೀಕರಿಸುತ್ತದೆ ಎಂದು ನೋಡಿ.',
      sliderLabel: 'ಯಂತ್ರೋಪಕರಣ ಹೂಡಿಕೆ ವೆಚ್ಚ ಹೊಂದಿಸಿ:',
      totalCost: 'ಒಟ್ಟು ಯೋಜನಾ ವೆಚ್ಚ',
      bankLoan: 'ಬ್ಯಾಂಕ್ ಸಾಲ (70%)',
      subsidy: 'ಅರ್ಹ ಸಬ್ಸಿಡಿ',
      avgDscr: 'ಸರಾಸರಿ DSCR',
      projectionsTab: '5-ವರ್ಷಗಳ ಲಾಭ-ನಷ್ಟ ಮುನ್ಸೂಚನೆ',
      ratiosTab: 'DSCR, ಸಾಲ-ಇಕ್ವಿಟಿ ಅನುಪಾತಗಳು',
      repaymentsTab: 'ಅಸಲು ಮತ್ತು ಬಡ್ಡಿ ಮರುಪಾವತಿ',
      sensitivitiesTab: 'ಬ್ರೇಕ್-ಈವನ್ ಮತ್ತು ಸಾಮರ್ಥ್ಯ ಬಳಕೆ',
      turnover: 'ಒಟ್ಟು ವಹಿವಾಟು',
      opex: 'ಕಾರ್ಯಾಚರಣೆ ವೆಚ್ಚಗಳು',
      netProfit: 'ನಿರೀಕ್ಷಿತ ನಿವ್ವಳ ಲಾಭ',
    },
    pricing: {
      title: 'ನಿಮ್ಮ',
      highlight: 'ಹಣಕಾಸು ಮಾರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      subtitle: 'ನಿಮ್ಮ ಯೋಜನೆಗೆ ಬಂಡವಾಳವನ್ನು ಹೇಗೆ ಸಂಗ್ರಹಿಸಲು ಬಯಸುತ್ತೀರಿ ಎಂಬುದನ್ನು ಆರಿಸಿ. ಮುಂದಿನ ಪರದೆಯಲ್ಲಿ ಯೋಜನಾ ಗಾತ್ರಕ್ಕೆ ತಕ್ಕ ಯೋಜನೆ ಆರಿಸಿ.',
      tagPill: '3 ಹಣಕಾಸು ಮಾರ್ಗಗಳು • ಕೇವಲ ₹3,999 ರಿಂದ ಆರಂಭ',
      routes: {
        govt: { title: 'PMEGP, PMFME ಮತ್ತು ರಾಜ್ಯ ನೀತಿಗಳು', tag: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಸಬ್ಸಿಡಿ', desc: 'ಸರ್ಕಾರಿ ಅನುದಾನ, ಮಾರ್ಜಿನ್ ಹಣ ಅಥವಾ ಬಂಡವಾಳ ಸಬ್ಸಿಡಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಉದ್ಯಮಿಗಳಿಗಾಗಿ.' },
        bank: { title: 'ಅವಧಿ ಸಾಲ ಮತ್ತು ಕಾರ್ಯಕಾರಿ ಬಂಡವಾಳ', tag: 'ಬ್ಯಾಂಕ್ ಮತ್ತು NBFC ಸಾಲಗಳು', desc: 'ಸಾರ್ವಜನಿಕ, ಖಾಸಗಿ ಅಥವಾ ಸಹಕಾರಿ ಬ್ಯಾಂಕ್‌ಗಳಿಂದ ಸಾಲ ಪಡೆಯುವ ವ್ಯವಹಾರಗಳಿಗಾಗಿ.' },
        inv: { title: 'ಹೂಡಿಕೆದಾರರ ಪಿಚ್ ಮತ್ತು ಇಕ್ವಿಟಿ ವಿಸ್ತರಣೆ', tag: 'ಹೂಡಿಕೆದಾರರ ಬಂಡವಾಳ', desc: 'ಏಂಜೆಲ್ ಹೂಡಿಕೆದಾರರು, ವಿಸಿ ನಿಧಿಗಳು ಅಥವಾ ಕಾರ್ಯತಂತ್ರದ ಪಾಲುದಾರರಿಗೆ ಪ್ರಸ್ತುತಪಡಿಸಲು.' },
      },
      plans: {
        entry: { name: 'ಎಂಟ್ರಿ (ಆರಂಭಿಕ)', sub: 'ಆರಂಭಿಕ ಹಂತದ ಯೋಜನೆಗಳು (₹5 ಲಕ್ಷ – ₹25 ಲಕ್ಷ)', cta: 'DPR ರಚಿಸಿ' },
        core: { name: 'ಕೋರ್ (ಸ್ಟ್ಯಾಂಡರ್ಡ್)', sub: 'ಬೆಳೆಯುತ್ತಿರುವ ವ್ಯವಹಾರಗಳು (₹25 ಲಕ್ಷ – ₹1 ಕೋಟಿ)', cta: 'DPR ರಚಿಸಿ' },
        team: { name: 'ಟೀಮ್ (ಅಡ್ವಾನ್ಸ್ಡ್)', sub: 'MSME ಮತ್ತು ಮಧ್ಯಮ ಉದ್ಯಮಗಳು (₹1 ಕೋಟಿ – ₹5 ಕೋಟಿ)', cta: 'ಮುಂದುವರಿದ DPR ರಚಿಸಿ' },
        ent: { name: 'ಎಂಟರ್‌ಪ್ರೈಸ್', sub: 'ದೊಡ್ಡ ಕೈಗಾರಿಕಾ ಘಟಕಗಳು (₹5 ಕೋಟಿ – ₹25 ಕೋಟಿ+)', cta: 'ತಜ್ಞರ ಸಂಪರ್ಕಿಸಿ' },
      },
    },
    faq: {
      title: 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು',
    },
    contact: {
      kicker: 'ನಮ್ಮ ತಂಡವನ್ನು ಸಂಪರ್ಕಿಸಿ',
      title: 'ನಿಮ್ಮ ಯೋಜನೆಯ ಬಗ್ಗೆ ನಮಗೆ ತಿಳಿಸಿ.',
      subtitle: 'ನಿಮ್ಮ ಯೋಜನಾ ವಿವರಗಳು ಮತ್ತು ಅಗತ್ಯತೆಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ. ಬ್ಯಾಂಕ್ ಮಂಜೂರಾತಿಗೆ ಸೂಕ್ತವಾದ DPR ಸಿದ್ಧಪಡಿಸಲು ನಮ್ಮ ತಜ್ಞರು ಸಹಾಯ ಮಾಡುತ್ತಾರೆ.',
      sendInquiry: 'ವಿಚಾರಣೆ ಕಳುಹಿಸಿ',
      accountLogin: 'ಖಾತೆ ಲಾಗಿನ್',
      register: 'ಹೊಸ ನೋಂದಣಿ',
      fullName: 'ಪೂರ್ಣ ಹೆಸರು',
      businessName: 'ವ್ಯವಹಾರದ ಹೆಸರು (ಐಚ್ಛಿಕ)',
      email: 'ಇಮೇಲ್',
      phone: 'ದೂರವಾಣಿ ಸಂಖ್ಯೆ',
      city: 'ನಗರ/ಸ್ಥಳ (ಐಚ್ಛಿಕ)',
      businessType: 'ವ್ಯವಹಾರದ ಪ್ರಕಾರ (ಐಚ್ಛಿಕ)',
      dprPurpose: 'DPR ವರದಿ ಯಾವುದಕ್ಕಾಗಿ ಅಗತ್ಯವಿದೆ?',
      submitBtn: 'ಸಂದೇಶ ಕಳುಹಿಸಿ →',
    },
    dashboard: {
      step1: 'ವ್ಯವಹಾರ ವಿವರ',
      step2: 'ಪ್ರವರ್ತಕರ ವಿವರ',
      step3: 'ಉತ್ಪನ್ನಗಳು ಮತ್ತು ಯಂತ್ರಗಳು',
      step4: 'ಹಣಕಾಸು ಯೋಜನೆ',
      step5: 'ಸಾಲ ಮತ್ತು ಸಬ್ಸಿಡಿ',
      step6: 'DPR ರಚನೆ',
      generatingDpr: 'ನಿಮ್ಮ ಬ್ಯಾಂಕ್ DPR ರಚಿಸಲಾಗುತ್ತಿದೆ',
      generatingDesc: '10 ವರ್ಷಗಳ ಹಣಕಾಸು ಪ್ರಕ್ಷೇಪಗಳು, DSCR ಮತ್ತು ವರದಿಯನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...',
    },
  },

  // 3. HINDI (हिंदी - FOR NATIONWIDE RURAL & MSME ENTREPRENEURS)
  hi: {
    common: {
      appName: 'DPRPro AI',
      tagline: 'कम समय में पेशेवर डीपीआर रिपोर्ट बनाएं',
      createDpr: 'मेरी DPR बनाएं',
      contactTeam: 'टीम से संपर्क करें',
      overview: 'अवलोकन',
      fundingNeeds: 'वित्तीय आवश्यकताएं',
      sectors: 'व्यावसायिक क्षेत्र',
      financialStudio: 'वित्तीय स्टूडियो',
      pricing: 'मूल्य निर्धारण',
      faq: 'अक्सर पूछे जाने वाले प्रश्न',
      signIn: 'साइन इन',
      signUp: 'साइन अप',
      logout: 'लॉग आउट',
      next: 'अगला कदम',
      previous: 'पिछला',
      saveDraft: 'ड्राफ्ट सहेजें',
      downloadPdf: 'PDF रिपोर्ट डाउनलोड करें',
      downloadDocx: 'Word (.docx) डाउनलोड करें',
      loading: 'प्रक्रिया जारी है...',
      viewPlans: 'परियोजना आकार के अनुसार योजनाएं देखें',
      generateDpr: 'DPR तैयार करें',
    },
    languageModal: {
      title: 'DPRPro AI में आपका स्वागत है',
      subtitle: 'संस्थागत विस्तृत परियोजना रिपोर्ट (DPR) इंजन',
      selectPrompt: 'आगे बढ़ने के लिए अपनी पसंदीदा भाषा चुनें:',
      knTitle: 'ಕನ್ನಡ (Kannada)',
      knDesc: 'कर्नाटक के ग्रामीण एवं लघु उद्यमियों हेतु बैंक ऋण व सब्सिडी डीपीआर',
      hiTitle: 'हिंदी (Hindi)',
      hiDesc: 'एमएसएमई, पीएमईजीपी एवं बैंक ऋण हेतु संस्थागत डीपीआर रिपोर्ट',
      enTitle: 'English (अंग्रेज़ी)',
      enDesc: 'बैंकों एवं वित्तीय संस्थानों हेतु आधिकारिक क्रेडिट मूल्यांकन प्रारूप',
      continueBtn: 'हिंदी में जारी रखें →',
    },
    hero: {
      headline: 'बैंक ऋण एवं सब्सिडी के लिए आधिकारिक DPR रिपोर्ट आसानी से बनाएं।',
      manualPrep: '3 सप्ताह की कठिन मैन्युअल मेहनत',
      speedBadge: '⚡ 10 मिनट की सरल प्रक्रिया',
      subtitle: 'अपने व्यावसायिक, परियोजना एवं वित्तीय विवरण को संस्थागत बैंक ऋण स्वीकृति एवं सरकारी सब्सिडी हेतु आधिकारिक विस्तृत परियोजना रिपोर्ट (DPR) में बदलें।',
      viewPlansBtn: 'परियोजना आकार के अनुसार योजनाएं देखें',
      contactTeamBtn: 'टीम से संपर्क करें',
      highlights: {
        speed: '10 मिनट में पूर्ण डीपीआर',
        bankReady: 'बैंक क्रेडिट मूल्यांकन मानदंडों के अनुरूप',
        schemes: 'पीएमईजीपी, पीएमएफएमई एवं राज्य नीतियां',
        caNorms: 'आरबीआई एवं सीए मानकों पर आधारित',
      },
    },
    sectors: {
      kicker: 'समर्थित व्यावसायिक क्षेत्र',
      title: 'प्रत्येक व्यावसायिक क्षेत्र के लिए उपयुक्त',
      subtitle: 'हमारा एआई इंजन उद्योग मानकों, मशीनरी लागत और परिचालन मेट्रिक्स के आधार पर आधिकारिक डीपीआर तैयार करता है।',
      keyAnalysis: 'प्रमुख डीपीआर अनुभाग एवं विश्लेषण:',
      generateBtn: 'DPR तैयार करें →',
    },
    fundingNeeds: {
      kicker: 'उपयोग के मामले',
      title: 'एक DPR. अनेक वित्तीय लक्ष्य.',
      subtitle: 'चाहे आप नया व्यवसाय शुरू कर रहे हों या विस्तार कर रहे हों, अपने विशिष्ट वित्तीय लक्ष्य के अनुसार रिपोर्ट तैयार करें।',
      bankLoansTitle: 'बैंक एवं एनबीएफसी ऋण',
      bankLoansDesc: 'बैंक ऋण स्वीकृति हेतु अपनी व्यावसायिक पृष्ठभूमि, वित्तीय अनुमान एवं ऋण पुनर्भुगतान समय-सारणी आधिकारिक रूप से प्रस्तुत करें।',
      bankLoansBtn: 'ऋण DPR बनाएं →',
      govtSubsidiesTitle: 'सरकारी सब्सिडी योजनाएं',
      govtSubsidiesDesc: 'पीएमईजीपी, पीएमएफएमई, राज्य औद्योगिक नीतियों एवं एमएसएमई पूंजी सब्सिडी दावों हेतु संरचित परियोजना रिपोर्ट तैयार करें।',
      govtSubsidiesBtn: 'सब्सिडी DPR बनाएं →',
      investorTitle: 'निवेशक फंडिंग',
      investorDesc: 'अपने व्यवसाय की इकाई अर्थशास्त्र और बहु-परिदृश्य संवेदनशीलता को एक प्रभावशाली पिच दस्तावेज में समेकित करें।',
      investorBtn: 'इन्वेस्टर DPR बनाएं →',
    },
    financialStudio: {
      kicker: 'संवादात्मक वित्तीय सिम्युलेटर',
      title: 'लाइव वित्तीय गणना इंजन का अनुभव करें',
      subtitle: 'मशीनरी लागत स्लाइडर को समायोजित करें और देखें कि हमारा इंजन लाभ-हानि, डीएससीआर कवरेज और ऋण सीमाओं को लाइव कैसे अपडेट करता है।',
      sliderLabel: 'मशीनरी निवेश लागत समायोजित करें:',
      totalCost: 'कुल परियोजना लागत',
      bankLoan: 'बैंक ऋण (70%)',
      subsidy: 'अनुमानित सब्सिडी',
      avgDscr: 'औसत DSCR',
      projectionsTab: '5-वर्षीय लाभ और हानि पूर्वानुमान',
      ratiosTab: 'डीएससीआर, ऋण-इक्विटी अनुपात',
      repaymentsTab: 'मूलधन एवं ब्याज पुनर्भुगतान',
      sensitivitiesTab: 'ब्रेक-ईवन एवं क्षमता उपयोग',
      turnover: 'कुल कारोबार',
      opex: 'परिचालन व्यय',
      netProfit: 'अनुमानित शुद्ध लाभ',
    },
    pricing: {
      title: 'अपना',
      highlight: 'वित्तीय मार्ग चुनें',
      subtitle: 'चुनें कि आप अपने प्रोजेक्ट के लिए पूंजी कैसे जुटाना चाहते हैं। अगली स्क्रीन पर उपयुक्त आकार का प्लान चुनें।',
      tagPill: '3 फंडिंग मार्ग • मात्र ₹3,999 से प्रारंभ',
      routes: {
        govt: { title: 'पीएमईजीपी, पीएमएफएमई एवं राज्य नीतियां', tag: 'सरकारी योजनाएं एवं सब्सिडी', desc: 'सरकारी अनुदान, मार्जिन मनी या पूंजी सब्सिडी के लिए आवेदन करने वाले उद्यमियों हेतु।' },
        bank: { title: 'सावधि ऋण एवं कार्यशील पूंजी', tag: 'बैंक एवं एनबीएफसी ऋण', desc: 'सार्वजनिक, निजी या सहकारी बैंकों से ऋण वित्तपोषण चाहने वाले व्यवसायों हेतु।' },
        inv: { title: 'पिच डीपीआर एवं इक्विटी विस्तार', tag: 'निवेशक फंडिंग', desc: 'एंजेल निवेशकों, वीसी फंडों या रणनीतिक भागीदारों के समक्ष प्रस्तुति हेतु।' },
      },
      plans: {
        entry: { name: 'एंट्री (प्रारंभिक)', sub: 'शुरुआती परियोजनाएं (₹5 लाख – ₹25 लाख)', cta: 'DPR बनाएं' },
        core: { name: 'कोर (मानक)', sub: 'विकासशील व्यवसाय (₹25 लाख – ₹1 करोड़)', cta: 'DPR बनाएं' },
        team: { name: 'टीम (उन्नत)', sub: 'एमएसएमई एवं मध्यम उद्यम (₹1 करोड़ – ₹5 करोड़)', cta: 'उन्नत DPR बनाएं' },
        ent: { name: 'एंटरप्राइज', sub: 'स्थापित एवं बड़े व्यवसाय (₹5 करोड़ – ₹25 करोड़+)', cta: 'टीम से संपर्क करें' },
      },
    },
    faq: {
      title: 'अक्सर पूछे जाने वाले प्रश्न',
    },
    contact: {
      kicker: 'हमारी टीम से जुड़ें',
      title: 'हमें अपने प्रोजेक्ट के बारे में बताएं।',
      subtitle: 'अपने प्रोजेक्ट विवरण साझा करें। हमारी सलाहकार टीम बैंक ऋण योग्य डीपीआर तैयार करने में आपकी पूरी सहायता करेगी।',
      sendInquiry: 'पूछताछ भेजें',
      accountLogin: 'खाता लॉगिन',
      register: 'नया पंजीकरण',
      fullName: 'पूरा नाम',
      businessName: 'व्यवसाय का नाम (वैकल्पिक)',
      email: 'ईमेल',
      phone: 'फोन नंबर',
      city: 'शहर (वैकल्पिक)',
      businessType: 'व्यवसाय का प्रकार (वैकल्पिक)',
      dprPurpose: 'आपको डीपीआर किस उद्देश्य के लिए चाहिए?',
      submitBtn: 'संदेश भेजें →',
    },
    dashboard: {
      step1: 'व्यवसाय विवरण',
      step2: 'प्रवर्तक विवरण',
      step3: 'उत्पाद एवं मशीनरी',
      step4: 'वित्तीय योजना',
      step5: 'ऋण एवं सब्सिडी',
      step6: 'DPR निर्माण',
      generatingDpr: 'आपकी बैंक डीपीआर तैयार की जा रही है',
      generatingDesc: '10-वर्षीय वित्तीय अनुमान, डीएससीआर एवं रिपोर्ट तैयार की जा रही है...',
    },
  },
};
