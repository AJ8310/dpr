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
    demoVideo: string;
    blueprint: string;
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
    forHeading: string;
    summaryLine: string;
    viewPlansBtn: string;
    contactTeamBtn: string;
    highlights: {
      speed: string;
      bankReady: string;
      schemes: string;
      caNorms: string;
    };
  };
  challenge: {
    kicker: string;
    title: string;
    desc: string;
    quote: string;
    traditionalTitle: string;
    challenges: Array<{ icon: string; text: string }>;
  };
  workflow: {
    kicker: string;
    title: string;
    desc: string;
    modules: Array<{ num: string; title: string; desc: string }>;
  };
  speedBand: {
    title: string;
    tagline: string;
    desc: string;
    point1: string;
    point2: string;
    steps: Array<{ step: string; title: string }>;
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
  features: {
    kicker: string;
    title: string;
    items: Array<{ title: string; desc: string }>;
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
    particulars: string;
    year1: string;
    year3: string;
    year5: string;
    turnover: string;
    opex: string;
    netProfit: string;
    tableHeadingProjections: string;
    tableHeadingRatios: string;
    tableHeadingRepayments: string;
    tableHeadingSensitivities: string;
    tabs: {
      projections: { label: string; desc: string };
      ratios: { label: string; desc: string };
      repayments: { label: string; desc: string };
      sensitivities: { label: string; desc: string };
    };
  };
  sectors: {
    kicker: string;
    title: string;
    subtitle: string;
    keyAnalysis: string;
    generateBtn: string;
    generateSectorDpr: string;
    items: Record<string, { title: string; badge: string; desc: string; activities: string[] }>;
  };
  pricing: {
    title: string;
    highlight: string;
    subtitle: string;
    tagPill: string;
    viewPlansBtn: string;
    routes: Record<'govt' | 'bank' | 'inv', {
      label: string;
      tag: string;
      title: string;
      desc: string;
      checks: string[];
      projectSizeText: string;
      modalTitle: string;
    }>;
    plans: {
      entry: { name: string; sub: string; cta: string };
      core: { name: string; sub: string; cta: string };
      team: { name: string; sub: string; cta: string };
      ent: { name: string; sub: string; cta: string };
    };
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
    purposeLoan: string;
    purposeSubsidy: string;
    purposeInvestor: string;
    submitBtn: string;
    submittedMsg: string;
  };
  faq: {
    title: string;
    items: Array<{ q: string; a: string }>;
  };
  footer: {
    rights: string;
    institution: string;
    links: {
      home: string;
      overview: string;
      fundingNeeds: string;
      sectors: string;
      financialStudio: string;
      pricing: string;
      faq: string;
    };
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
  // ==========================================
  // 1. ENGLISH (DEFAULT)
  // ==========================================
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
      demoVideo: '🎥 Studio Demo',
      blueprint: 'DPR Blueprint',
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
      forHeading: 'Prepare your DPR for',
      summaryLine: 'With automated financial projections, funding analysis and structured documentation.',
      viewPlansBtn: 'View Plans by Project Size',
      contactTeamBtn: 'Contact Team',
      highlights: {
        speed: '10-Minute Generation Flow',
        bankReady: 'Bank Credit Appraisal Compliant',
        schemes: 'PMEGP / PMFME & State Schemes',
        caNorms: 'RBI Norms & CA Standards',
      },
    },
    challenge: {
      kicker: 'The Challenge',
      title: "Your Funding Shouldn't Wait for Your Documentation.",
      desc: 'Preparing a DPR manually can mean collecting information across multiple files, building financial projections, checking calculations, formatting reports and going through multiple rounds of revisions.',
      quote: '“Your business is ready to move. Your DPR should be too.”',
      traditionalTitle: 'Traditional challenges:',
      challenges: [
        { icon: '🕒', text: 'Weeks spent preparing and revising documents manually' },
        { icon: '📊', text: 'Complex financial projections to build and check' },
        { icon: '📄', text: 'Repetitive work across Excel spreadsheets and Word files' },
        { icon: '👥', text: 'High dependence on external consultant turnaround times' },
        { icon: '⚠️', text: 'Delays whenever project inputs or loan amounts change' },
      ],
    },
    workflow: {
      kicker: 'Workflow Modules',
      title: 'From Business Data to a Structured DPR',
      desc: 'VKF DPR Studio transforms your raw project parameters and financial inputs into an institutional-grade report built for credit approval.',
      modules: [
        { num: '01', title: 'Business & Project Profile', desc: 'Bring your business profile, promoter track record, and infrastructure assets into one unified workflow.' },
        { num: '02', title: 'Financial Projections', desc: 'Generate multi-year projected Profit & Loss statements, Balance Sheets, and Cash Flow models instantly.' },
        { num: '03', title: 'Funding Allocation Analysis', desc: 'Structure term loans, working capital margins, promoter contribution, and central/state subsidy allocations.' },
        { num: '04', title: 'Feasibility & Risk Audits', desc: 'Organize DSCR ratio calculations, sensitivity stress tests, and Tandon committee working capital norms.' },
        { num: '05', title: 'Professional DPR Output', desc: 'Export publication-ready official bankable PDF reports with optional VKF co-branding, ready for immediate bank submission.' },
      ],
    },
    speedBand: {
      title: '3 Weeks of Work.\nNow Under 10 Minutes.',
      tagline: 'Stop rebuilding your financial models manually.',
      desc: 'Modify any project parameter — like machinery expenditure or working capital — and your entire 10-year P&L, balance sheet, and DSCR ratios recalculate automatically.',
      point1: 'No starting from scratch.',
      point2: 'Zero spreadsheet formula breakages.',
      steps: [
        { step: 'Step 1', title: 'Input your business details' },
        { step: 'Step 2', title: 'Automate financial model' },
        { step: 'Step 3', title: 'Review debt & subsidy margins' },
        { step: 'Step 4', title: 'Export bank-ready DPR' },
      ],
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
    features: {
      kicker: 'Platform Features',
      title: 'Built for Speed. Designed for Precision.',
      items: [
        { title: 'Live Recalculations', desc: 'Update machinery or investment variables and see instant updates across P&L, Balance Sheet, and ratios.' },
        { title: 'Audit-Ready Models', desc: 'Financial calculations structured according to RBI lending guidelines and CA norms.' },
        { title: 'Standardized Formats', desc: 'Generates clean, well-aligned official PDF reports ready for submission without manual formatting hassle.' },
        { title: 'Multi-Sector Intelligence', desc: 'Pre-configured schemas for Dairy, Food Processing, Solar, Manufacturing, Textiles, and more.' },
        { title: 'One-Click Exports', desc: 'Export publication-ready PDF documents with customizable VKF co-branding or sole business logo.' },
      ],
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
      particulars: 'Particulars (₹ Lakhs)',
      year1: 'Year 1',
      year3: 'Year 3',
      year5: 'Year 5',
      turnover: 'Gross Turnover',
      opex: 'Operating Expenses',
      netProfit: 'Projected Net Profit',
      tableHeadingProjections: '5-Year Projected Profitability Overview',
      tableHeadingRatios: 'Financial Risk & Debt Service Coverage',
      tableHeadingRepayments: 'Loan Debt Amortization Schedule',
      tableHeadingSensitivities: 'Capacity Utilization & Sensitivity Thresholds',
      tabs: {
        projections: { label: 'Projections', desc: '5-year Profit & Loss forecast' },
        ratios: { label: 'Key Ratios', desc: 'DSCR, Debt-Equity & Margins' },
        repayments: { label: 'Loan Repayments', desc: 'Principal & Interest amortization' },
        sensitivities: { label: 'Sensitivity Analysis', desc: 'Break-even & capacity utilization' },
      },
    },
    sectors: {
      kicker: 'Supported Business Sectors',
      title: 'Built for Every Business Sector',
      subtitle: 'Our AI engine generates institutional-grade Detailed Project Reports tailored to specific industry norms, machinery heads, and benchmark operational metrics.',
      keyAnalysis: 'Key DPR Sections & Analysis:',
      generateBtn: 'Generate DPR →',
      generateSectorDpr: 'Generate',
      items: {
        manufacturing: {
          title: 'Manufacturing & Engineering',
          badge: 'High Demand',
          desc: 'Auto components, metal fabrication, CNC machining, plastic molding, packaging, and industrial tools.',
          activities: ['Raw Material BOQ', 'Plant & Machinery Capex', 'Capacity & Shift Planning', 'Power & Utility Load']
        },
        food_processing: {
          title: 'Food Processing & Agro',
          badge: 'PMEGP / PMFME Ready',
          desc: 'Flour & rice mills, spice grinding, cold storage, dairy processing, fruit pulp, and edible oil units.',
          activities: ['FSSAI & Quality Capex', 'Seasonal Crop Working Capital', 'Cold Storage Logistics', 'Yield Loss Projections']
        },
        agriculture: {
          title: 'Agriculture & Farming',
          badge: 'AIF Eligible',
          desc: 'Hydroponics, hi-tech greenhouse farming, poultry & dairy farming, polyhouses, and organic fertilizer.',
          activities: ['Land Prep & Irrigation', 'Crop Cycle Revenue Schedule', 'Subsidy Margin Breakdown', 'Polyhouse Capex']
        },
        textile: {
          title: 'Textile & Garments',
          badge: 'Export Focus',
          desc: 'Garment manufacturing, weaving & spinning mills, silk processing, readymade apparel, and embroidery.',
          activities: ['Loom & Sewing Capex', 'Yarn & Fabric Working Capital', 'Labor & Overhead Schedule', 'Order Execution Cycle']
        },
        healthcare: {
          title: 'Healthcare & Pharma',
          badge: 'NABH / ISO Standards',
          desc: 'Diagnostic centers, medical device manufacturing, pharma formulation, specialty hospitals, and AYUSH.',
          activities: ['Medical Equipment Capex', 'Cleanroom Installation', 'Consumables Inventory', 'Bed Capacity & Utilization']
        },
        it_services: {
          title: 'IT & Software Services',
          badge: 'Fast Sanction',
          desc: 'SaaS products, IT consulting, hardware assembly, data centers, and AI/ML tech solutions.',
          activities: ['Cloud & Workstation Capex', 'Software Talent Cost Model', 'SaaS Recurring Revenue', 'IP & License Valuation']
        },
        renewable_energy: {
          title: 'Renewable Energy & EV',
          badge: 'PM-KUSUM Ready',
          desc: 'Rooftop & ground solar plants, EV charging hubs, battery swapping stations, and biomass pellets.',
          activities: ['PPA Tariff Calculations', 'Solar Panel & Inverter BOQ', 'Degradation & Maintenance', 'Grid Connection Expenses']
        },
        tourism: {
          title: 'Tourism & Hospitality',
          badge: 'State Policy Eligible',
          desc: 'Eco-resorts, boutique hotels, theme parks, wellness sanctuaries, and adventure tourism setups.',
          activities: ['Room Capex & Interiors', 'Seasonality Occupancy Rate', 'F&B Revenue Breakdown', 'Property Lease Schedules']
        },
        infrastructure: {
          title: 'Infrastructure & Logistics',
          badge: 'Institutional Scale',
          desc: 'Logistics hubs, dry warehouses, cold chain networks, commercial spaces, and transport fleets.',
          activities: ['Warehouse Construction BOQ', 'Fleet Capex & Maintenance', 'Lease Rental Discounting', 'Throughput Capacity']
        },
        services: {
          title: 'Commercial Services',
          badge: 'MSME Approved',
          desc: 'Educational institutes, fitness chains, retail supermarkets, automated laundromats, and co-working spaces.',
          activities: ['Fit-out & Interior Capex', 'Membership & Fee Cashflows', 'Working Capital Cycle', 'Staff Payroll Structure']
        },
        custom: {
          title: 'Custom & Emerging Sectors',
          badge: 'Tailored Model',
          desc: 'Tailored DPR structures for unique business models, novel technologies, and specialized ventures.',
          activities: ['Custom Capex Builder', 'Variable Cost Drivers', 'Flexible DSCR Calculator', 'Dynamic Revenue Scenarios']
        }
      }
    },
    pricing: {
      title: 'Choose your',
      highlight: 'funding route',
      subtitle: 'Select how you plan to raise capital for your project. On the next screen, pick a DPR plan sized for your project.',
      tagPill: '3 Funding Routes • Prices start at ₹3,999',
      viewPlansBtn: 'View Plans by Project Size →',
      routes: {
        govt: {
          label: 'Govt Schemes',
          tag: 'GOVT SCHEMES & SUBSIDIES',
          title: 'PMEGP, PMFME & State Policies',
          desc: 'For entrepreneurs applying for government grants, margin money, or capital subsidies.',
          checks: [
            'Scheme-compliant DPR format & layout',
            'Subsidy eligibility & margin money breakup',
            'Lender & nodal agency submission ready',
            'Detailed 5–10 year financial projections'
          ],
          projectSizeText: 'Project sizes from ₹5L to ₹25Cr+',
          modalTitle: 'Govt Scheme & Subsidy DPR Plans'
        },
        bank: {
          label: 'Bank Loans',
          tag: 'BANK & NBFC LOANS',
          title: 'Term Loan & Working Capital',
          desc: 'For businesses seeking debt financing from public, private, or co-operative banks.',
          checks: [
            'Bankable DPR with Credit Appraisal norms',
            'DSCR, DE ratio & Tandon Committee checks',
            '36-month cash flow & CMA-style schedules',
            'IRR, NPV, BEP & sensitivity analysis'
          ],
          projectSizeText: 'Project sizes from ₹5L to ₹25Cr+',
          modalTitle: 'Bank & NBFC Loan DPR Plans'
        },
        inv: {
          label: 'Investor Pitch',
          tag: 'INVESTOR FUNDING',
          title: 'Pitch DPR & Equity Expansion',
          desc: 'For startups & MSMEs pitching to angel investors, VC funds, or strategic partners.',
          checks: [
            'Investor-grade executive summary & deck',
            'Unit economics, CAC & LTV projections',
            'Valuation benchmarks & cap table summary',
            'Use of funds & exit strategy outline'
          ],
          projectSizeText: 'Project sizes from ₹5L to ₹25Cr+',
          modalTitle: 'Investor Pitch DPR Plans'
        }
      },
      plans: {
        entry: { name: 'Entry', sub: 'Early-stage projects (₹5L – ₹25L)', cta: 'Create DPR' },
        core: { name: 'Core', sub: 'Standard MSME projects (₹25L – ₹2Cr)', cta: 'Create DPR' },
        team: { name: 'Team', sub: 'Medium enterprises (₹2Cr – ₹10Cr)', cta: 'Create DPR' },
        ent: { name: 'Enterprise', sub: 'Large scale projects (₹10Cr+)', cta: 'Create DPR' },
      },
    },
    contact: {
      kicker: 'Connect with our team',
      title: 'Tell us about your project.',
      subtitle: 'Share your project details and requirements. Our advisory team will assist you in preparing a bankable DPR.',
      sendInquiry: 'Send Inquiry',
      accountLogin: 'Account Login',
      register: 'Register New Account',
      fullName: 'Full Name',
      businessName: 'Business / Enterprise Name',
      email: 'Email Address',
      phone: 'Phone Number (10 digits)',
      city: 'City / District',
      businessType: 'Business Sector (e.g., Manufacturing, Food, Dairy)',
      dprPurpose: 'DPR Purpose',
      purposeLoan: 'Bank / NBFC Term Loan & Working Capital',
      purposeSubsidy: 'Government Subsidy (PMEGP, PMFME, State Policy)',
      purposeInvestor: 'Investor Pitch & Equity Expansion',
      submitBtn: 'Send Inquiry →',
      submittedMsg: '✓ Thank you! Your inquiry has been submitted. Our advisory team will contact you shortly.',
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        {
          q: 'What is a Detailed Project Report (DPR)?',
          a: 'A Detailed Project Report is an official comprehensive document that details an enterprise setup, its capital expenditure heads, operational parameters, 10-year projected financials, and debt service viability for institutional sanction.'
        },
        {
          q: 'Who can use this DPR tool?',
          a: 'The DPR Studio is built for MSMEs, entrepreneurs, chartered accountants, and consultants preparing bank loans, subsidy applications, and investor presentations.'
        },
        {
          q: 'Which government subsidy schemes are supported?',
          a: 'The engine supports central and state government schemes including PMEGP, PMFME, State Industrial Policy capital subsidies, AIF, and PM-KUSUM.'
        },
        {
          q: 'What formats can I export my DPR to?',
          a: 'You can generate fully formatted official bankable PDF documents with option for custom enterprise co-branding.'
        }
      ]
    },
    footer: {
      rights: '© 2026 Vision Karnataka Foundation. All rights reserved.',
      institution: 'Institutional Grade DPR & Project Appraisal Engine.',
      links: {
        home: 'Home',
        overview: 'Overview',
        fundingNeeds: 'Funding Needs',
        sectors: 'Sectors',
        financialStudio: 'Financial Studio',
        pricing: 'Pricing',
        faq: 'FAQ',
      }
    },
    dashboard: {
      step1: 'Basic Information',
      step2: 'Members & Management',
      step3: 'Product Specifications',
      step4: 'Plant & Machinery',
      step5: 'Market Strategy',
      step6: 'Manpower Plan',
      generatingDpr: 'Generating Institutional DPR...',
      generatingDesc: 'Compiling financial projections, credit appraisal ratios, and executive narratives.',
    },
  },

  // ==========================================
  // 2. KANNADA (ಕನ್ನಡ)
  // ==========================================
  kn: {
    common: {
      appName: 'DPRPro AI',
      tagline: 'ಕಡಿಮೆ ಸಮಯದಲ್ಲಿ ವೃತ್ತಿಪರ ಡಿಪಿಆರ್ ವರದಿಗಳನ್ನು ರಚಿಸಿ',
      createDpr: 'ನನ್ನ ಡಿಪಿಆರ್ ರಚಿಸಿ',
      contactTeam: 'ತಂಡವನ್ನು ಸಂಪರ್ಕಿಸಿ',
      overview: 'ಅವಲೋಕನ',
      fundingNeeds: 'ಬಂಡವಾಳ ಅಗತ್ಯಗಳು',
      sectors: 'ಉದ್ಯಮ ಕ್ಷೇತ್ರಗಳು',
      financialStudio: 'ಹಣಕಾಸು ಸ್ಟುಡಿಯೋ',
      pricing: 'ದರಪಟ್ಟಿ',
      faq: 'ಪ್ರಶ್ನೋತ್ತರ',
      signIn: 'ಲಾಗಿನ್ ಮಾಡಿ',
      signUp: 'ಸೈನ್ ಅಪ್ ಮಾಡಿ',
      logout: 'ಹೊರಹೋಗಿ',
      next: 'ಮುಂದಿನ ಹಂತ',
      previous: 'ಹಿಂದಿನ ಹಂತ',
      saveDraft: 'ಕರಡು ಉಳಿಸಿ',
      downloadPdf: 'PDF ವರದಿ ಡೌನ್‌ಲೋಡ್',
      downloadDocx: 'ವರ್ಡ್ (.docx) ಡೌನ್‌ಲೋಡ್',
      loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
      viewPlans: 'ಯೋಜನೆಯ ಗಾತ್ರದ ಪ್ರಕಾರ ಪ್ಲಾನ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
      generateDpr: 'ಡಿಪಿಆರ್ ರಚಿಸಿ',
      demoVideo: '🎥 ಪ್ರಾತ್ಯಕ್ಷಿಕೆ',
      blueprint: 'ಡಿಪಿಆರ್ ಬ್ಲೂಪ್ರಿಂಟ್',
    },
    languageModal: {
      title: 'DPRPro AI ಗೆ ಸುಸ್ವಾಗತ',
      subtitle: 'ಸಾಂಸ್ಥಿಕ ವಿಸ್ತೃತ ಯೋಜನಾ ವರದಿ (DPR) ಎಂಜಿನ್',
      selectPrompt: 'ಮುಂದುವರಿಯಲು ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:',
      knTitle: 'ಕನ್ನಡ (Kannada)',
      knDesc: 'ಕರ್ನಾಟಕದ ಗ್ರಾಮೀಣ ಹಾಗೂ ಸಣ್ಣ ಉದ್ಯಮಿಗಳಿಗೆ ಬ್ಯಾಂಕ್ ಸಾಲ ಮತ್ತು ಸಬ್ಸಿಡಿ DPR ವರದಿ',
      hiTitle: 'हिंदी (Hindi)',
      hiDesc: 'एमएसएमई, पीएमईजीपी एवं बैंक ऋण हेतु संस्थागत डीपीआर रिपोर्ट',
      enTitle: 'English',
      enDesc: 'Institutional credit appraisal format for banks, NBFCs, and investors',
      continueBtn: 'ಕನ್ನಡದಲ್ಲಿ ಮುಂದುವರಿಯಿರಿ →',
    },
    hero: {
      headline: 'ನಿಮ್ಮ ಬಂಡವಾಳ-ಸಿದ್ಧ ಡಿಪಿಆರ್ ಅನ್ನು ಚುರುಕಾಗಿ ನಿರ್ಮಿಸಿ.',
      manualPrep: '3 ವಾರಗಳ ಮ್ಯಾನುಯಲ್ ಪರಿಶ್ರಮ',
      speedBadge: '⚡ < 10 ನಿಮಿಷಗಳ ಸುಲಭ ಹಂತ',
      subtitle: 'ನಿಮ್ಮ ವ್ಯಾಪಾರ, ಯೋಜನಾ ವೆಚ್ಚ ಮತ್ತು ಹಣಕಾಸಿನ ಮಾಹಿತಿಯನ್ನು ಸಾಂಸ್ಥಿಕ ಬ್ಯಾಂಕ್ ಸಾಲ ಮಂಜೂರಾತಿಗೆ ಸೂಕ್ತವಾದ ವೃತ್ತಿಪರ ವಿಸ್ತೃತ ಯೋಜನಾ ವರದಿಯಾಗಿ (DPR) ಪರಿವರ್ತಿಸಿ.',
      forHeading: 'ಯಾವ ಉದ್ದೇಶಕ್ಕಾಗಿ ಡಿಪಿಆರ್ ತಯಾರಿಸುತ್ತಿದ್ದೀರಿ?',
      summaryLine: 'ಸ್ವಯಂಚಾಲಿತ ಹಣಕಾಸು ಮುನ್ಸೂಚನೆ, ಸಾಲ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ರಚನಾತ್ಮಕ ದಾಖಲಾತಿಯೊಂದಿಗೆ.',
      viewPlansBtn: 'ಯೋಜನೆಯ ಗಾತ್ರದ ಪ್ರಕಾರ ಪ್ಲಾನ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
      contactTeamBtn: 'ತಂಡವನ್ನು ಸಂಪರ್ಕಿಸಿ',
      highlights: {
        speed: '10-ನಿಮಿಷಗಳ ತ್ವರಿತ ವರದಿ ರಚನೆ',
        bankReady: 'ಬ್ಯಾಂಕ್ ಕ್ರೆಡಿಟ್ ಅಪ್ರೈಸಲ್ ಮಾನದಂಡಗಳಿಗೆ ಅನುಗುಣ',
        schemes: 'PMEGP / PMFME & ರಾಜ್ಯ ಸರ್ಕಾರದ ಸಬ್ಸಿಡಿ ಯೋಜನೆಗಳು',
        caNorms: 'ಆರ್‌ಬಿಐ ನಿಯಮಗಳು & ಸಿಎ ಮಾನದಂಡಗಳು',
      },
    },
    challenge: {
      kicker: 'ಸವಾಲು',
      title: 'ನಿಮ್ಮ ಯೋಜನಾ ಸಾಲಕ್ಕೆ ದಾಖಲೆಗಳ ಕೊರತೆ ತಡೆಯಾಗದಿರಲಿ.',
      desc: 'ಮ್ಯಾನುಯಲ್ ಆಗಿ ಡಿಪಿಆರ್ ತಯಾರಿಸುವುದು ವಾರಗಳ ಕಾಲ ಸಮಯ ವ್ಯಯ ಮಾಡುತ್ತದೆ; ಸಂಕೀರ್ಣ ಲೆಕ್ಕಾಚಾರಗಳು, ಎಕ್ಸೆಲ್ ಫೈಲ್‌ಗಳು ಮತ್ತು ಪುನರಾವರ್ತಿತ ಬದಲಾವಣೆಗಳಿಗೆ ಕಾರಣವಾಗುತ್ತದೆ.',
      quote: '“ನಿಮ್ಮ ವ್ಯಾಪಾರ ಮುನ್ನಡೆಯಲು ಸಿದ್ಧವಾಗಿದೆ. ನಿಮ್ಮ ಡಿಪಿಆರ್ ಕೂಡ ಸಿದ್ಧವಾಗಿರಬೇಕು.”',
      traditionalTitle: 'ಸಾಂಪ್ರದಾಯಿಕ ಸವಾಲುಗಳು:',
      challenges: [
        { icon: '🕒', text: 'ದಾಖಲೆಗಳನ್ನು ಮ್ಯಾನುಯಲ್ ಆಗಿ ತಯಾರಿಸಲು ವಾರಗಳ ಕಾಲ ಕಾಯುವಿಕೆ' },
        { icon: '📊', text: 'ಸಂಕೀರ್ಣ ಹಣಕಾಸು ಮುನ್ಸೂಚನೆಗಳನ್ನು ನಿರ್ಮಿಸುವುದು ಮತ್ತು ಪರಿಶೀಲಿಸುವುದು' },
        { icon: '📄', text: 'ಎಕ್ಸೆಲ್ ಸ್ಪ್ರೆಡ್‌ಶೀಟ್‌ಗಳು ಮತ್ತು ವರ್ಡ್ ಫೈಲ್‌ಗಳಲ್ಲಿ ಪುನರಾವರ್ತಿತ ಕೆಲಸ' },
        { icon: '👥', text: 'ಬಾಹ್ಯ ಸಲಹೆಗಾರರ ಸಮಯದ ಮೇಲೆ ಅತಿಯಾದ ಅವಲಂಬನೆ' },
        { icon: '⚠️', text: 'ಯೋಜನೆಯ ವೆಚ್ಚ ಅಥವಾ ಸಾಲದ ಮೊತ್ತ ಬದಲಾದಾಗಲೆಲ್ಲಾ ವಿಳಂಬ' },
      ],
    },
    workflow: {
      kicker: 'ಕಾರ್ಯವಿಧಾನದ ಹಂತಗಳು',
      title: 'ವ್ಯಾಪಾರದ ವಿವರಗಳಿಂದ ಅಧಿಕೃತ ಬ್ಯಾಂಕ್ ಡಿಪಿಆರ್‌ವರೆಗೆ',
      desc: 'VKF DPR Studio ನಿಮ್ಮ ಯೋಜನಾ ನಿಯತಾಂಕಗಳು ಮತ್ತು ಹಣಕಾಸಿನ ಮಾಹಿತಿಯನ್ನು ಬ್ಯಾಂಕ್ ಅನುಮೋದನೆಗೆ ಸಿದ್ಧವಾಗಿರುವ ಸಾಂಸ್ಥಿಕ ದರ್ಜೆಯ ವರದಿಯಾಗಿ ಪರಿವರ್ತಿಸುತ್ತದೆ.',
      modules: [
        { num: '01', title: 'ವ್ಯಾಪಾರ & ಯೋಜನಾ ಪ್ರೊಫೈಲ್', desc: 'ನಿಮ್ಮ ವ್ಯಾಪಾರ ವಿವರ, ಪ್ರವರ್ತಕರ ಹಿನ್ನೆಲೆ ಮತ್ತು ಆಸ್ತಿಗಳನ್ನು ಒಂದೇ ವೇದಿಕೆಯಲ್ಲಿ ಜೋಡಿಸಿ.' },
        { num: '02', title: 'ಹಣಕಾಸಿನ ಮುನ್ಸೂಚನೆ', desc: 'ಬಹು-ವರ್ಷಗಳ ಲಾಭ-ನಷ್ಟದ ಪಟ್ಟಿ, ಬ್ಯಾಲೆನ್ಸ್ ಶೀಟ್ ಮತ್ತು ನಗದು ಹರಿವಿನ ಮಾದರಿಯನ್ನು ತಕ್ಷಣ ಸೃಷ್ಟಿಸಿ.' },
        { num: '03', title: 'ಬಂಡವಾಳ ಹಂಚಿಕೆ & ಸಬ್ಸಿಡಿ', desc: 'ಅವಧಿ ಸಾಲ, ದುಡಿಯುವ ಬಂಡವಾಳ, ಪ್ರವರ್ತಕರ ಇಕ್ವಿಟಿ ಮತ್ತು ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿಗಳನ್ನು ನಿಖರವಾಗಿ ರಚಿಸಿ.' },
        { num: '04', title: 'ಕಾರ್ಯಸಾಧ್ಯತೆ & ರಿಸ್ಕ್ ಆಡಿಟ್', desc: 'DSCR ಅನುಪಾತ, ಸೂಕ್ಷ್ಮತೆಯ ಒತ್ತಡ ಪರೀಕ್ಷೆ ಮತ್ತು ಟಂಡನ್ ಸಮಿತಿಯ ನಿಯಮಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ.' },
        { num: '05', title: 'ಅಧಿಕೃತ ಡಿಪಿಆರ್ ಔಟ್‌ಪುಟ್', desc: 'ಬ್ಯಾಂಕ್ ಸಲ್ಲಿಕೆಗೆ ಸಿದ್ಧವಾಗಿರುವ ಅತ್ಯುನ್ನತ ಗುಣಮಟ್ಟದ ಅಧಿಕೃತ ಪಿಡಿಎಫ್ (PDF) ವರದಿಯನ್ನು ತಕ್ಷಣ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.' },
      ],
    },
    speedBand: {
      title: '3 ವಾರಗಳ ಕೆಲಸ.\nಈಗ ಕೇವಲ 10 ನಿಮಿಷಗಳಲ್ಲಿ.',
      tagline: 'ಹಣಕಾಸು ಮಾದರಿಯನ್ನು ಮ್ಯಾನುಯಲ್ ಆಗಿ ಮತ್ತೆ ನಿರ್ಮಿಸುವುದನ್ನು ನಿಲ್ಲಿಸಿ.',
      desc: 'ಯಾವುದೇ ಯೋಜನಾ ನಿಯತಾಂಕವನ್ನು ಬದಲಾಯಿಸಿ — ಯಂತ್ರೋಪಕರಣ ವೆಚ್ಚ ಅಥವಾ ದುಡಿಯುವ ಬಂಡವಾಳ — ಸಂಪೂರ್ಣ 10-ವರ್ಷದ P&L, ಬ್ಯಾಲೆನ್ಸ್ ಶೀಟ್ ಮತ್ತು DSCR ಅನುಪಾತ ತಾನಾಗಿಯೇ ಅಪ್‌ಡೇಟ್ ಆಗುತ್ತದೆ.',
      point1: 'ಮೊದಲಿನಿಂದ ಪ್ರಾರಂಭಿಸುವ ಗೊಂದಲವಿಲ್ಲ.',
      point2: 'ಎಕ್ಸೆಲ್ ಫಾರ್ಮುಲಾ ದೋಷಗಳ ಭಯವಿಲ್ಲ.',
      steps: [
        { step: 'ಹಂತ 1', title: 'ನಿಮ್ಮ ಉದ್ಯಮದ ವಿವರ ನಮೂದಿಸಿ' },
        { step: 'ಹಂತ 2', title: 'ಸ್ವಯಂಚಾಲಿತ ಹಣಕಾಸು ಮಾದರಿ' },
        { step: 'ಹಂತ 3', title: 'ಸಾಲ ಮತ್ತು ಸಬ್ಸಿಡಿ ಮಾರ್ಜಿನ್ ಪರಿಶೀಲಿಸಿ' },
        { step: 'ಹಂತ 4', title: 'ಬ್ಯಾಂಕ್-ಸಿದ್ಧ ಡಿಪಿಆರ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ' },
      ],
    },
    fundingNeeds: {
      kicker: 'ಬಳಕೆಯ ಉದ್ದೇಶಗಳು',
      title: 'ಒಂದೇ ಡಿಪಿಆರ್. ಬಹು ಬಂಡವಾಳ ಗುರಿಗಳು.',
      subtitle: 'ನೀವು ವ್ಯಾಪಾರ ವಿಸ್ತರಣೆಗೆ ಯೋಜಿಸುತ್ತಿರಲಿ ಅಥವಾ ಸಾಂಸ್ಥಿಕ ಹಣಕಾಸು ಬಯಸುತ್ತಿರಲಿ, ನಿಮ್ಮ ನಿರ್ದಿಷ್ಟ ಉದ್ದೇಶಕ್ಕೆ ತಕ್ಕಂತೆ ವರದಿ ಪಡೆಯಿರಿ.',
      bankLoansTitle: 'ಬ್ಯಾಂಕ್ & NBFC ಸಾಲಗಳು',
      bankLoansDesc: 'ಸಾಲ ಮಂಜೂರಾತಿಗಾಗಿ ನಿಮ್ಮ ವ್ಯಾಪಾರ, ಪ್ರಾಜೆಕ್ಟ್ ಹೆಡ್ಸ್, ಹಣಕಾಸು ಮುನ್ಸೂಚನೆ ಮತ್ತು ಸಾಲ ಮರುಪಾವತಿ ವೇಳಾಪಟ್ಟಿಯನ್ನು ಅಧಿಕೃತ ವರದಿಯಲ್ಲಿ ಪ್ರಸ್ತುತಪಡಿಸಿ.',
      bankLoansBtn: 'ಸಾಲದ ಡಿಪಿಆರ್ ರಚಿಸಿ →',
      govtSubsidiesTitle: 'ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿಗಳು',
      govtSubsidiesDesc: 'PMEGP, PMFME, ರಾಜ್ಯ ಕೈಗಾರಿಕಾ ನೀತಿಗಳು ಮತ್ತು MSME ಬಂಡವಾಳ ಸಬ್ಸಿಡಿ ಕ್ಲೈಮ್‌ಗಳಿಗಾಗಿ ಯೋಜನಾ ವರದಿಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಿ.',
      govtSubsidiesBtn: 'ಸಬ್ಸಿಡಿ ಡಿಪಿಆರ್ ಸಿದ್ಧಪಡಿಸಿ →',
      investorTitle: 'ಹೂಡಿಕೆದಾರರ ಬಂಡವಾಳ',
      investorDesc: 'ನಿಮ್ಮ ಘಟಕದ ಪ್ರೊಫೈಲ್, ಆರ್ಥಿಕ ಸಾಮರ್ಥ್ಯ ಮತ್ತು ಬಹು-ಸನ್ನಿವೇಶದ ಸಂವೇದನಾಶೀಲತೆಯನ್ನು ಆಕರ್ಷಕ ಪಿಚ್ ದಾಖಲೆಯಾಗಿ ಜೋಡಿಸಿ.',
      investorBtn: 'ಹೂಡಿಕೆದಾರರ ಡಿಪಿಆರ್ ನಿರ್ಮಿಸಿ →',
    },
    features: {
      kicker: 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ವೈಶಿಷ್ಟ್ಯಗಳು',
      title: 'ವೇಗ ಮತ್ತು ನಿಖರತೆಗೆ ತಕ್ಕಂತೆ ನಿರ್ಮಿಸಲಾಗಿದೆ.',
      items: [
        { title: 'ಲೈವ್ ಮರುಲೆಕ್ಕಾಚಾರ', desc: 'ವೆಚ್ಚಗಳನ್ನು ಬದಲಾಯಿಸಿ, ತಕ್ಷಣ P&L, ಬ್ಯಾಲೆನ್ಸ್ ಶೀಟ್ ಮತ್ತು ಅನುಪಾತಗಳು ನವೀಕರಣಗೊಳ್ಳುತ್ತವೆ.' },
        { title: 'ಆಡಿಟ್-ಸಿದ್ಧ ಮಾದರಿ', desc: 'ಆರ್‌ಬಿಐ ನಿಯಮಗಳು ಮತ್ತು ಸಿಎ ಮಾನದಂಡಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ರಚಿಸಲಾದ ಲೆಕ್ಕಾಚಾರಗಳು.' },
        { title: 'ಪ್ರಮಾಣಿತ ವಿನ್ಯಾಸ', desc: 'ಮ್ಯಾನುಯಲ್ ಫಾರ್ಮ್ಯಾಟಿಂಗ್ ಗೊಂದಲವಿಲ್ಲದೆ ಬ್ಯಾಂಕ್‌ಗೆ ಸಲ್ಲಿಸಲು ಸಿದ್ಧವಾಗಿರುವ ವರದಿ.' },
        { title: 'ಬಹು-ವಲಯ ಬುದ್ಧಿಮತ್ತೆ', desc: 'ಡೈರಿ, ಆಹಾರ, ಸೌರಶಕ್ತಿ, ಉತ್ಪಾದನೆ, ಜವಳಿ ಇತ್ಯಾದಿಗಳಿಗೆ ಸಿದ್ಧ ಟೆಂಪ್ಲೇಟ್‌ಗಳು.' },
        { title: 'ಏಕ-ಕ್ಲಿಕ್ ಡೌನ್‌ಲೋಡ್', desc: 'ಸಂಪೂರ್ಣ ವಿನ್ಯಾಸದ ಅಧಿಕೃತ ಪಿಡಿಎಫ್ (PDF) ವರದಿಗಳನ್ನು ಕಸ್ಟಮ್ ಲೋಗೋದೊಂದಿಗೆ ಸುಲಭವಾಗಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.' },
      ],
    },
    financialStudio: {
      kicker: 'ಇಂಟರ್ಯಾಕ್ಟಿವ್ ಹಣಕಾಸು ಸಿಮ್ಯುಲೇಟರ್',
      title: 'ನೈಜ-ಸಮಯದ ಲೆಕ್ಕಾಚಾರ ಎಂಜಿನ್ ಅನ್ನು ಅನುಭವಿಸಿ',
      subtitle: 'ಯಂತ್ರೋಪಕರಣ ವೆಚ್ಚದ ಸ್ಲೈಡರ್ ಅನ್ನು ಸರಿಹೊಂದಿಸಿ, P&L ಮುನ್ಸೂಚನೆ, DSCR ವ್ಯಾಪ್ತಿ ಮತ್ತು ಸಾಲದ ಮಿತಿಗಳು ನೇರವಾಗಿ ಬದಲಾಗುವುದನ್ನು ವೀಕ್ಷಿಸಿ.',
      sliderLabel: 'ಯಂತ್ರೋಪಕರಣ ಹೂಡಿಕೆ ವೆಚ್ಚವನ್ನು ಸರಿಹೊಂದಿಸಿ:',
      totalCost: 'ಒಟ್ಟು ಯೋಜನಾ ವೆಚ್ಚ',
      bankLoan: 'ಬ್ಯಾಂಕ್ ಸಾಲ (70%)',
      subsidy: 'ಅರ್ಹ ಸಬ್ಸಿಡಿ ಮೊತ್ತ',
      avgDscr: 'ಸರಾಸರಿ DSCR ಅನುಪಾತ',
      particulars: 'ವಿವರಗಳು (₹ ಲಕ್ಷಗಳಲ್ಲಿ)',
      year1: 'ವರ್ಷ 1',
      year3: 'ವರ್ಷ 3',
      year5: 'ವರ್ಷ 5',
      turnover: 'ಒಟ್ಟು ವಹಿವಾಟು',
      opex: 'ನಿರ್ವಹಣಾ ವೆಚ್ಚಗಳು',
      netProfit: 'ಅಂದಾಜು ನಿವ್ವಳ ಲಾಭ',
      tableHeadingProjections: '5-ವರ್ಷಗಳ ಅಂದಾಜು ಲಾಭದಾಯಕತೆಯ ಅವಲೋಕನ',
      tableHeadingRatios: 'ಹಣಕಾಸು ಅಪಾಯ & ಸಾಲ ಸೇವಾ ವ್ಯಾಪ್ತಿ (DSCR)',
      tableHeadingRepayments: 'ಸಾಲದ ಅಸಲು ಮತ್ತು ಬಡ್ಡಿ ಮರುಪಾವತಿ ವೇಳಾಪಟ್ಟಿ',
      tableHeadingSensitivities: 'ಸಾಮರ್ಥ್ಯ ಬಳಕೆ ಮತ್ತು ಸಂವೇದನಾಶೀಲತೆಯ ಮಿತಿಗಳು',
      tabs: {
        projections: { label: 'ಮುನ್ಸೂಚನೆ', desc: '5-ವರ್ಷಗಳ ಲಾಭ-ನಷ್ಟದ ಮುನ್ನೋಟ' },
        ratios: { label: 'ಪ್ರಮುಖ ಅನುಪಾತಗಳು', desc: 'DSCR, ಸಾಲ-ಇಕ್ವಿಟಿ & ಮಾರ್ಜಿನ್‌ಗಳು' },
        repayments: { label: 'ಸಾಲ ಮರುಪಾವತಿ', desc: 'ಅಸಲು & ಬಡ್ಡಿ ಮರುಪಾವತಿ ಪಟ್ಟಿ' },
        sensitivities: { label: 'ಸೂಕ್ಷ್ಮತೆಯ ವಿಶ್ಲೇಷಣೆ', desc: 'ಬ್ರೇಕ್-ಈವನ್ & ಸಾಮರ್ಥ್ಯ ಬಳಕೆ' },
      },
    },
    sectors: {
      kicker: 'ಬೆಂಬಲಿತ ವ್ಯಾಪಾರ ಕ್ಷೇತ್ರಗಳು',
      title: 'ಪ್ರತಿಯೊಂದು ಉದ್ಯಮ ಕ್ಷೇತ್ರಕ್ಕೂ ವಿಶೇಷ ಡಿಪಿಆರ್',
      subtitle: 'ನಮ್ಮ AI ಎಂಜಿನ್ ಉದ್ಯಮ ಮಾನದಂಡಗಳು, ಯಂತ್ರೋಪಕರಣ ವಿಭಾಗಗಳು ಮತ್ತು ಕಾರ್ಯಾಚರಣೆಯ ಮಾನದಂಡಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ವರದಿಗಳನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತದೆ.',
      keyAnalysis: 'ಪ್ರಮುಖ ಡಿಪಿಆರ್ ವಿಭಾಗಗಳು & ವಿಶ್ಲೇಷಣೆ:',
      generateBtn: 'ಡಿಪಿಆರ್ ರಚಿಸಿ →',
      generateSectorDpr: 'ರಚಿಸಿ',
      items: {
        manufacturing: {
          title: 'ಉತ್ಪಾದನೆ ಮತ್ತು ಎಂಜಿನಿಯರಿಂಗ್',
          badge: 'ಹೆಚ್ಚಿನ ಬೇಡಿಕೆ',
          desc: 'ಆಟೋ ಕಾಂಪೊನೆಂಟ್ಸ್, ಲೋಹದ ಫ್ಯಾಬ್ರಿಕೇಶನ್, ಸಿಎನ್‌ಸಿ ಯಂತ್ರಗಳು, ಪ್ಲಾಸ್ಟಿಕ್ ಮೋಲ್ಡಿಂಗ್, ಪ್ಯಾಕೇಜಿಂಗ್, ಕೈಗಾರಿಕಾ ಉಪಕರಣಗಳು.',
          activities: ['ಕಚ್ಚಾ ವಸ್ತುಗಳ BOQ', 'ಯಂತ್ರೋಪಕರಣ ಬಂಡವಾಳ', 'ಸಾಮರ್ಥ್ಯ ಯೋಜನೆ', 'ವಿದ್ಯುತ್ & ಉಪಯುಕ್ತತೆ']
        },
        food_processing: {
          title: 'ಆಹಾರ ಸಂಸ್ಕರಣೆ ಮತ್ತು ಕೃಷಿ ಉದ್ಯಮ',
          badge: 'PMEGP / PMFME ಸಿದ್ಧ',
          desc: 'ಹಿಟ್ಟಿನ ಗಿರಣಿ, ಅಕ್ಕಿ ಗಿರಣಿ, ಮಸಾಲೆ ಪುಡಿ, ಶೀತಲ ಸಂಗ್ರಹಾಗಾರ, ಡೈರಿ ಸಂಸ್ಕರಣೆ, ಖಾದ್ಯ ತೈಲ ಘಟಕಗಳು.',
          activities: ['FSSAI ಗುಣಮಟ್ಟ ವೆಚ್ಚ', 'ಋತುಮಾನ ಬೆಳೆ ದುಡಿಯುವ ಬಂಡವಾಳ', 'ಕೋಲ್ಡ್ ಸ್ಟೋರೇಜ್ ಲಾಜಿಸ್ಟಿಕ್ಸ್', 'ಇಳುವರಿ ನಷ್ಟ ಮುನ್ಸೂಚನೆ']
        },
        agriculture: {
          title: 'ಕೃಷಿ ಮತ್ತು ತೋಟಗಾರಿಕೆ',
          badge: 'AIF ಯೋಜನೆ ಅರ್ಹ',
          desc: 'ಹೈಡ್ರೋಪೋನಿಕ್ಸ್, ಹೈಟೆಕ್ ಹಸಿರುಮನೆ ಕೃಷಿ, ಕೋಳಿ ಮತ್ತು ಡೈರಿ ಫಾರ್ಮಿಂಗ್, ಪಾಲಿಹೌಸ್, ಸಾವಯವ ಗೊಬ್ಬರ.',
          activities: ['ಭೂಮಿ ಸಿದ್ಧತೆ & ನೀರಾವರಿ', 'ಬೆಳೆ ಚಕ್ರ ಆದಾಯ ವಿವರ', 'ಸಬ್ಸಿಡಿ ಮಾರ್ಜಿನ್ ವಿಶ್ಲೇಷಣೆ', 'ಪಾಲಿಹೌಸ್ ಬಂಡವಾಳ']
        },
        textile: {
          title: 'ಜವಳಿ ಮತ್ತು ಸಿದ್ಧ ಉಡುಪು',
          badge: 'ರಫ್ತು ಕೇಂದ್ರೀಕೃತ',
          desc: 'ಉಡುಪು ತಯಾರಿಕೆ, ನೇಯ್ಗೆ & ನೂಲುವ ಗಿರಣಿ, ರೇಷ್ಮೆ ಸಂಸ್ಕರಣೆ, ಸಿದ್ಧ ಉಡುಪು, ಕಸೂತಿ ಘಟಕಗಳು.',
          activities: ['ಮಗ್ಗ ಮತ್ತು ಹೊಲಿಗೆ ಬಂಡವಾಳ', 'ನೂಲು & ಬಟ್ಟೆ ದುಡಿಯುವ ಬಂಡವಾಳ', 'ಕೂಲಿ ಮತ್ತು ನಿರ್ವಹಣೆ ವೆಚ್ಚ', 'ಆರ್ಡರ್ ಪೂರೈಕೆ ಚಕ್ರ']
        },
        healthcare: {
          title: 'ಆರೋಗ್ಯ ಮತ್ತು ಫಾರ್ಮಾ',
          badge: 'NABH / ISO ಮಾನದಂಡ',
          desc: 'ಡಯಾಗ್ನೋಸ್ಟಿಕ್ ಕೇಂದ್ರಗಳು, ವೈದ್ಯಕೀಯ ಉಪಕರಣಗಳ ತಯಾರಿಕೆ, ಫಾರ್ಮಾ ಫಾರ್ಮುಲೇಶನ್, ಆಸ್ಪತ್ರೆಗಳು, ಆಯುಷ್ ಘಟಕಗಳು.',
          activities: ['ವೈದ್ಯಕೀಯ ಸಲಕರಣೆ ವೆಚ್ಚ', 'ಕ್ಲೀನ್‌ರೂಮ್ ಸ್ಥಾಪನೆ', 'ವೈದ್ಯಕೀಯ ದಾಸ್ತಾನು', 'ಹಾಸಿಗೆ ಸಾಮರ್ಥ್ಯ & ಬಳಕೆ']
        },
        it_services: {
          title: 'ಐಟಿ & ತಂತ್ರಾಂಶ ಸೇವೆಗಳು',
          badge: 'ತ್ವರಿತ ಮಂಜೂರಾತಿ',
          desc: 'SaaS ಸಾಫ್ಟ್‌ವೇರ್, ಐಟಿ ಸಲಹಾ ಸೇವೆಗಳು, ಹಾರ್ಡ್‌ವೇರ್ ಅಸೆಂಬ್ಲಿ, ಡೇಟಾ ಸೆಂಟರ್, AI/ML ಪರಿಹಾರಗಳು.',
          activities: ['ಕ್ಲೌಡ್ & ಕಂಪ್ಯೂಟರ್ ಬಂಡವಾಳ', 'ತಂತ್ರಜ್ಞರ ವೇತನ ಮಾದರಿ', 'SaaS ಮರುಕಳಿಸುವ ಆದಾಯ', 'IP ಮತ್ತು ಲೈಸೆನ್ಸ್ ಮೌಲ್ಯಮಾಪನ']
        },
        renewable_energy: {
          title: 'ನವೀಕರಿಸಬಹುದಾದ ಇಂಧನ & ಇವಿ',
          badge: 'PM-KUSUM ಸಿದ್ಧ',
          desc: 'ಸೌರ ವಿದ್ಯುತ್ ಸ್ಥಾವರಗಳು, ಇವಿ ಚಾರ್ಜಿಂಗ್ ಹಬ್‌ಗಳು, ಬ್ಯಾಟರಿ ವಿನಿಮಯ ಕೇಂದ್ರಗಳು, ಬಯೋಮಾಸ್ ಘಟಕಗಳು.',
          activities: ['PPA ದರ ಲೆಕ್ಕಾಚಾರ', 'ಸೌರ ಫಲಕ & ಇನ್ವರ್ಟರ್ BOQ', 'ನಿರ್ವಹಣಾ ವೆಚ್ಚ', 'ಗ್ರಿಡ್ ಸಂಪರ್ಕ ವೆಚ್ಚಗಳು']
        },
        tourism: {
          title: 'ಪ್ರವಾಸೋದ್ಯಮ ಮತ್ತು ಆತಿಥ್ಯ',
          badge: 'ರಾಜ್ಯ ನೀತಿ ಅರ್ಹ',
          desc: 'ಪರಿಸರ-ರೆಸಾರ್ಟ್‌ಗಳು, ಹೋಟೆಲ್‌ಗಳು, ಥೀಮ್ ಪಾರ್ಕ್‌ಗಳು, ಕ್ಷೇಮ ಕೇಂದ್ರಗಳು, ಸಾಹಸ ಪ್ರವಾಸೋದ್ಯಮ.',
          activities: ['ಕೊಠಡಿ ಮತ್ತು ಒಳಾಂಗಣ ವೆಚ್ಚ', 'ಋತುಮಾನ ಆಕ್ಯುಪೆನ್ಸಿ ದರ', 'ಆಹಾರ & ಪಾನೀಯ ಆದಾಯ', 'ಗುತ್ತಿಗೆ ಕರಾರು ವಿವರ']
        },
        infrastructure: {
          title: 'ಮೂಲಸೌಕರ್ಯ ಮತ್ತು ಲಾಜಿಸ್ಟಿಕ್ಸ್',
          badge: 'ಸಾಂಸ್ಥಿಕ ಪ್ರಮಾಣ',
          desc: 'ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಹಬ್‌ಗಳು, ಗೋದಾಮುಗಳು, ಕೋಲ್ಡ್ ಚೈನ್ ನೆಟ್‌ವರ್ಕ್, ವಾಣಿಜ್ಯ ಸ್ಥಳಗಳು, ಸಾರಿಗೆ ವಾಹನಗಳು.',
          activities: ['ಗೋದಾಮು ನಿರ್ಮಾಣ BOQ', 'ವಾಹನ ಖರೀದಿ & ನಿರ್ವಹಣೆ', 'ಬಾಡಿಗೆ ರಿಯಾಯಿತಿ ಲೆಕ್ಕ', 'ದಾಸ್ತಾನು ನಿರ್ವಹಣಾ ಸಾಮರ್ಥ್ಯ']
        },
        services: {
          title: 'ವಾಣಿಜ್ಯ ಸೇವೆಗಳು',
          badge: 'MSME ಮಾನ್ಯತೆ',
          desc: 'ಶಿಕ್ಷಣ ಸಂಸ್ಥೆಗಳು, ಫಿಟ್‌ನೆಸ್ ಕೇಂದ್ರಗಳು, ಸೂಪರ್‌ಮಾರ್ಕೆಟ್‌ಗಳು, ಲಾಂಡ್ರೊಮ್ಯಾಟ್‌ಗಳು, ಕೋ-ವರ್ಕಿಂಗ್ ಸ್ಪೇಸ್‌ಗಳು.',
          activities: ['ಒಳಾಂಗಣ ವಿನ್ಯಾಸ ಬಂಡವಾಳ', 'ಸದಸ್ಯತ್ವ & ಶುಲ್ಕ ಆದಾಯ', 'ದುಡಿಯುವ ಬಂಡವಾಳ ಚಕ್ರ', 'ಸಿಬ್ಬಂದಿ ವೇತನ ರಚನೆ']
        },
        custom: {
          title: 'ಇತರ ಮತ್ತು ಉದಯೋನ್ಮುಖ ಕ್ಷೇತ್ರಗಳು',
          badge: 'ವಿಶೇಷ ಮಾದರಿ',
          desc: 'ವಿಶಿಷ್ಟ ವ್ಯಾಪಾರ ಮಾದರಿಗಳು, ಹೊಸ ತಂತ್ರಜ್ಞಾನಗಳು ಮತ್ತು ನವೀನ ಉದ್ಯಮಗಳಿಗೆ ಸೂಕ್ತ ಡಿಪಿಆರ್ ರಚನೆ.',
          activities: ['ಕಸ್ಟಮ್ ಬಂಡವಾಳ ಬಿಲ್ಡರ್', 'ಸ್ಥಿರ & ವ್ಯತ್ಯಾಸ ವೆಚ್ಚಗಳು', 'ಹೊಂದಿಕೊಳ್ಳುವ DSCR ಕ್ಯಾಲ್ಕುಲೇಟರ್', 'ಗತಿಶೀಲ ಆದಾಯ ಸನ್ನಿವೇಶಗಳು']
        }
      }
    },
    pricing: {
      title: 'ನಿಮ್ಮ ಸೂಕ್ತವಾದ',
      highlight: 'ಬಂಡವಾಳ ಮಾರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      subtitle: 'ನಿಮ್ಮ ಯೋಜನೆಗೆ ಬಂಡವಾಳ ಸಂಗ್ರಹಿಸಲು ಬಯಸುವ ಮಾರ್ಗವನ್ನು ಆರಿಸಿ. ಮುಂದಿನ ಪರದೆಯಲ್ಲಿ, ಯೋಜನಾ ಗಾತ್ರಕ್ಕೆ ತಕ್ಕ ಡಿಪಿಆರ್ ಪ್ಲಾನ್ ಆಯ್ಕೆಮಾಡಿ.',
      tagPill: '3 ಬಂಡವಾಳ ಮಾರ್ಗಗಳು • ಬೆಲೆಗಳು ₹3,999 ರಿಂದ ಪ್ರಾರಂಭ',
      viewPlansBtn: 'ಯೋಜನೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ & ಡಿಪಿಆರ್ ರಚಿಸಿ →',
      routes: {
        govt: {
          label: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
          tag: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು & ಸಬ್ಸಿಡಿಗಳು',
          title: 'PMEGP, PMFME & ರಾಜ್ಯ ಕೈಗಾರಿಕಾ ನೀತಿಗಳು',
          desc: 'ಸರ್ಕಾರಿ ಅನುದಾನ, ಮಾರ್ಜಿನ್ ಮನಿ ಅಥವಾ ಬಂಡವಾಳ ಸಬ್ಸಿಡಿಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಉದ್ಯಮಿಗಳಿಗಾಗಿ.',
          checks: [
            'ಯೋಜನೆಗೆ ಅನುಗುಣವಾದ ಡಿಪಿಆರ್ ವಿನ್ಯಾಸ',
            'ಸಬ್ಸಿಡಿ ಅರ್ಹತೆ ಮತ್ತು ಮಾರ್ಜಿನ್ ಮನಿ ವಿವರ',
            'ಬ್ಯಾಂಕ್ ಮತ್ತು ನೋಡಲ್ ಏಜೆನ್ಸಿ ಸಲ್ಲಿಕೆಗೆ ಸಿದ್ಧ',
            '5-10 ವರ್ಷಗಳ ವಿವರವಾದ ಹಣಕಾಸು ಮುನ್ಸೂಚನೆ'
          ],
          projectSizeText: 'ಯೋಜನೆಯ ಗಾತ್ರ ₹5 ಲಕ್ಷದಿಂದ ₹25 ಕೋಟಿ+',
          modalTitle: 'ಸರ್ಕಾರಿ ಯೋಜನೆ ಮತ್ತು ಸಬ್ಸಿಡಿ ಡಿಪಿಆರ್ ಪ್ಲಾನ್‌ಗಳು'
        },
        bank: {
          label: 'ಬ್ಯಾಂಕ್ ಸಾಲಗಳು',
          tag: 'ಬ್ಯಾಂಕ್ & NBFC ಸಾಲಗಳು',
          title: 'ಅವಧಿ ಸಾಲ & ದುಡಿಯುವ ಬಂಡವಾಳ',
          desc: 'ಸಾರ್ವಜನಿಕ, ಖಾಸಗಿ ಅಥವಾ ಸಹಕಾರಿ ಬ್ಯಾಂಕ್‌ಗಳಿಂದ ಸಾಲ ಬಯಸುವ ವ್ಯಾಪಾರಗಳಿಗಾಗಿ.',
          checks: [
            'ಬ್ಯಾಂಕ್ ಕ್ರೆಡಿಟ್ ಮಾನದಂಡಗಳಿಗೆ ಅನುಗುಣವಾದ ಡಿಪಿಆರ್',
            'DSCR, ಸಾಲ-ಇಕ್ವಿಟಿ ಮತ್ತು ಟಂಡನ್ ಸಮಿತಿ ಲೆಕ್ಕಾಚಾರ',
            '36-ತಿಂಗಳ ನಗದು ಹರಿವು & CMA ವೇಳಾಪಟ್ಟಿ',
            'IRR, NPV, BEP & ಸಂವೇದನಾಶೀಲತೆಯ ವಿಶ್ಲೇಷಣೆ'
          ],
          projectSizeText: 'ಯೋಜನೆಯ ಗಾತ್ರ ₹5 ಲಕ್ಷದಿಂದ ₹25 ಕೋಟಿ+',
          modalTitle: 'ಬ್ಯಾಂಕ್ & NBFC ಸಾಲ ಡಿಪಿಆರ್ ಪ್ಲಾನ್‌ಗಳು'
        },
        inv: {
          label: 'ಹೂಡಿಕೆದಾರರ ಪಿಚ್',
          tag: 'ಹೂಡಿಕೆದಾರರ ಫಂಡಿಂಗ್',
          title: 'ಪಿಚ್ ಡಿಪಿಆರ್ & ಇಕ್ವಿಟಿ ವಿಸ್ತರಣೆ',
          desc: 'ಏಂಜೆಲ್ ಹೂಡಿಕೆದಾರರು, ವಿಸಿ ಫಂಡ್‌ಗಳು ಅಥವಾ ಪಾಲುದಾರರಿಗೆ ಪಿಚ್ ಮಾಡುವ ಸ್ಟಾರ್ಟಪ್‌ಗಳಿಗಾಗಿ.',
          checks: [
            'ಹೂಡಿಕೆದಾರರ ಶ್ರೇಣಿಯ ಕಾರ್ಯನಿರ್ವಾಹಕ ಸಾರಾಂಶ',
            'ಯೂನಿಟ್ ಅರ್ಥಶಾಸ್ತ್ರ & ಮುನ್ಸೂಚನೆ',
            'ಮೌಲ್ಯಮಾಪನ ಮಾನದಂಡಗಳು & ಕ್ಯಾಪ್ ಟೇಬಲ್',
            'ನಿಧಿಗಳ ಬಳಕೆ & ಎಕ್ಸಿಟ್ ತಂತ್ರ'
          ],
          projectSizeText: 'ಯೋಜನೆಯ ಗಾತ್ರ ₹5 ಲಕ್ಷದಿಂದ ₹25 ಕೋಟಿ+',
          modalTitle: 'ಹೂಡಿಕೆದಾರರ ಪಿಚ್ ಡಿಪಿಆರ್ ಪ್ಲಾನ್‌ಗಳು'
        }
      },
      plans: {
        entry: { name: 'ಪ್ರಾರಂಭಿಕ (Entry)', sub: 'ಆರಂಭಿಕ ಹಂತದ ಯೋಜನೆಗಳು (₹5 ಲಕ್ಷ – ₹25 ಲಕ್ಷ)', cta: 'ಡಿಪಿಆರ್ ರಚಿಸಿ' },
        core: { name: 'ಮುಖ್ಯ (Core)', sub: 'ಪ್ರಮಾಣಿತ MSME ಯೋಜನೆಗಳು (₹25 ಲಕ್ಷ – ₹2 ಕೋಟಿ)', cta: 'ಡಿಪಿಆರ್ ರಚಿಸಿ' },
        team: { name: 'ಟೀಮ್ (Team)', sub: 'ಮಧ್ಯಮ ಗಾತ್ರದ ಉದ್ಯಮಗಳು (₹2 ಕೋಟಿ – ₹10 ಕೋಟಿ)', cta: 'ಡಿಪಿಆರ್ ರಚಿಸಿ' },
        ent: { name: 'ಎಂಟರ್‌ಪ್ರೈಸ್', sub: 'ದೊಡ್ಡ ಪ್ರಮಾಣದ ಯೋಜನೆಗಳು (₹10 ಕೋಟಿ+)', cta: 'ಡಿಪಿಆರ್ ರಚಿಸಿ' },
      },
    },
    contact: {
      kicker: 'ನಮ್ಮ ತಂಡದೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ',
      title: 'ನಿಮ್ಮ ಯೋಜನೆಯ ಬಗ್ಗೆ ತಿಳಿಸಿ.',
      subtitle: 'ನಿಮ್ಮ ಯೋಜನೆಯ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ. ನಮ್ಮ ಸಲಹಾ ತಂಡವು ಸಾಲ ಮಂಜೂರಾತಿಗೆ ಸೂಕ್ತ ಡಿಪಿಆರ್ ತಯಾರಿಸಲು ನೆರವಾಗುತ್ತದೆ.',
      sendInquiry: 'ವಿಚಾರಣೆ ಕಳುಹಿಸಿ',
      accountLogin: 'ಖಾತೆಗೆ ಲಾಗಿನ್',
      register: 'ಹೊಸ ನೋಂದಣಿ',
      fullName: 'ಪೂರ್ಣ ಹೆಸರು',
      businessName: 'ವ್ಯಾಪಾರ / ಸಂಸ್ಥೆಯ ಹೆಸರು',
      email: 'ಇಮೇಲ್ ವಿಳಾಸ',
      phone: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (10 ಅಂಕಿಗಳು)',
      city: 'ನಗರ / ಜಿಲ್ಲೆ',
      businessType: 'ವ್ಯಾಪಾರದ ವರ್ಗ (ಉದಾ. ಉತ್ಪಾದನೆ, ಆಹಾರ, ಡೈರಿ...)',
      dprPurpose: 'ಡಿಪಿಆರ್ ತಯಾರಿಕೆಯ ಉದ್ದೇಶ',
      purposeLoan: 'ಬ್ಯಾಂಕ್ / NBFC ಅವಧಿ ಸಾಲ ಮತ್ತು ದುಡಿಯುವ ಬಂಡವಾಳ',
      purposeSubsidy: 'ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ (PMEGP, PMFME, ರಾಜ್ಯ ನೀತಿ)',
      purposeInvestor: 'ಹೂಡಿಕೆದಾರರ ಪಿಚ್ ಮತ್ತು ಇಕ್ವಿಟಿ ವಿಸ್ತರಣೆ',
      submitBtn: 'ವಿಚಾರಣೆ ಸಲ್ಲಿಸಿ →',
      submittedMsg: '✓ ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ವಿಚಾರಣೆಯನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ನಮ್ಮ ಸಲಹಾ ತಂಡವು ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.',
    },
    faq: {
      title: 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು',
      items: [
        {
          q: 'ವಿವರವಾದ ಯೋಜನಾ ವರದಿ (DPR) ಎಂದರೇನು?',
          a: 'ಡಿಪಿಆರ್ ಎಂಬುದು ಸಂಸ್ಥೆಯ ಬಂಡವಾಳ ವೆಚ್ಚ, ಕಾರ್ಯಕಾರಿ ನಿಯತಾಂಕಗಳು, 10-ವರ್ಷಗಳ ಹಣಕಾಸು ಮುನ್ಸೂಚನೆ ಮತ್ತು ಬ್ಯಾಂಕ್ ಸಾಲ ಮಂಜೂರಾತಿ ಕಾರ್ಯಸಾಧ್ಯತೆಯನ್ನು ವಿವರಿಸುವ ಅಧಿಕೃತ ಸಮಗ್ರ ದಾಖಲೆಯಾಗಿದೆ.'
        },
        {
          q: 'ಈ ಡಿಪಿಆರ್ ತಂತ್ರಾಂಶವನ್ನು ಯಾರು ಬಳಸಬಹುದು?',
          a: 'ಎಂಎಸ್ಎಂಇಗಳು, ಸಣ್ಣ ಉದ್ಯಮಿಗಳು, ಚಾರ್ಟರ್ಡ್ ಅಕೌಂಟೆಂಟ್‌ಗಳು ಹಾಗೂ ಬ್ಯಾಂಕ್ ಸಾಲ, ಸಬ್ಸಿಡಿ ಅಥವಾ ಹೂಡಿಕೆಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಎಲ್ಲರೂ ಬಳಸಬಹುದು.'
        },
        {
          q: 'ಯಾವ ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ ಯೋಜನೆಗಳನ್ನು ಬೆಂಬಲಿಸಲಾಗುತ್ತದೆ?',
          a: 'ಪಿಎಂಇಜಿಪಿ (PMEGP), ಪಿಎಂಎಫ್‌ಎಂಇ (PMFME), ರಾಜ್ಯ ಕೈಗಾರಿಕಾ ನೀತಿ ಬಂಡವಾಳ ಸಬ್ಸಿಡಿ, ಎಐಎಫ್ (AIF) ಮತ್ತು ಪಿಎಂ-ಕುಸುಮ್ (PM-KUSUM) ಸೇರಿದಂತೆ ಪ್ರಮುಖ ಯೋಜನೆಗಳು.'
        },
        {
          q: 'ನನ್ನ ಡಿಪಿಆರ್ ಅನ್ನು ಯಾವ ಫಾರ್ಮ್ಯಾಟ್‌ಗಳಲ್ಲಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬಹುದು?',
          a: 'ನೀವು ಬ್ಯಾಂಕ್ ಸಲ್ಲಿಕೆಗೆ ಸಿದ್ಧವಾಗಿರುವ ಅತ್ಯುನ್ನತ ಗುಣಮಟ್ಟದ ಅಧಿಕೃತ ಪಿಡಿಎಫ್ (PDF) ವರದಿಯನ್ನು ಕಸ್ಟಮ್ ಉದ್ಯಮ ಲೋಗೋದೊಂದಿಗೆ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿಕೊಳ್ಳಬಹುದು.'
        }
      ]
    },
    footer: {
      rights: '© 2026 Vision Karnataka Foundation. ಸರ್ವ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
      institution: 'ಸಾಂಸ್ಥಿಕ ದರ್ಜೆಯ ಡಿಪಿಆರ್ ಮತ್ತು ಪ್ರಾಜೆಕ್ಟ್ ಅಪ್ರೈಸಲ್ ಎಂಜಿನ್.',
      links: {
        home: 'ಮುಖಪುಟ',
        overview: 'ಅವಲೋಕನ',
        fundingNeeds: 'ಬಂಡವಾಳ ಅಗತ್ಯಗಳು',
        sectors: 'ಉದ್ಯಮ ಕ್ಷೇತ್ರಗಳು',
        financialStudio: 'ಹಣಕಾಸು ಸ್ಟುಡಿಯೋ',
        pricing: 'ದರಪಟ್ಟಿ',
        faq: 'ಪ್ರಶ್ನೋತ್ತರ',
      }
    },
    dashboard: {
      step1: '01. ಮೂಲ ಮಾಹಿತಿ',
      step2: '02. ಸದಸ್ಯರು ಮತ್ತು ನಿರ್ವಹಣೆ',
      step3: '03. ಉತ್ಪನ್ನದ ವಿವರಗಳು',
      step4: '04. ಯಂತ್ರೋಪಕರಣಗಳು',
      step5: '05. ಮಾರುಕಟ್ಟೆ ತಂತ್ರ',
      step6: '06. ಸಿಬ್ಬಂದಿ ಯೋಜನೆ',
      generatingDpr: 'ಸಾಂಸ್ಥಿಕ ಡಿಪಿಆರ್ ರಚಿಸಲಾಗುತ್ತಿದೆ...',
      generatingDesc: 'ಹಣಕಾಸು ಮುನ್ಸೂಚನೆಗಳು, ಬ್ಯಾಂಕ್ ಕ್ರೆಡಿಟ್ ಅನುಪಾತಗಳು ಮತ್ತು ಕಾರ್ಯನಿರ್ವಾಹಕ ವಿವರಗಳನ್ನು ಜೋಡಿಸಲಾಗುತ್ತಿದೆ.',
    },
  },

  // ==========================================
  // 3. HINDI (हिंदी)
  // ==========================================
  hi: {
    common: {
      appName: 'DPRPro AI',
      tagline: 'कम समय में पेशेवर डीपीआर रिपोर्ट तैयार करें',
      createDpr: 'मेरी डीपीआर बनाएं',
      contactTeam: 'टीम से संपर्क करें',
      overview: 'अवलोकन',
      fundingNeeds: 'फंडिंग आवश्यकताएं',
      sectors: 'व्यावसायिक क्षेत्र',
      financialStudio: 'वित्तीय स्टूडियो',
      pricing: 'मूल्य निर्धारण',
      faq: 'अक्सर पूछे जाने वाले प्रश्न',
      signIn: 'साइन इन करें',
      signUp: 'साइन अप करें',
      logout: 'लॉग आउट',
      next: 'अगला कदम',
      previous: 'पिछला कदम',
      saveDraft: 'ड्राफ्ट सहेजें',
      downloadPdf: 'PDF रिपोर्ट डाउनलोड करें',
      downloadDocx: 'Word (.docx) डाउनलोड करें',
      loading: 'लोड हो रहा है...',
      viewPlans: 'परियोजना आकार के अनुसार प्लान देखें',
      generateDpr: 'डीपीआर बनाएं',
      demoVideo: '🎥 स्टूडियो डेमो',
      blueprint: 'डीपीआर ब्लूप्रिंट',
    },
    languageModal: {
      title: 'DPRPro AI में आपका स्वागत है',
      subtitle: 'संस्थागत विस्तृत परियोजना रिपोर्ट (DPR) इंजन',
      selectPrompt: 'जारी रखने के लिए अपनी पसंदीदा भाषा चुनें:',
      knTitle: 'ಕನ್ನಡ (Kannada)',
      knDesc: 'ಕರ್ನಾಟಕದ ಗ್ರಾಮೀಣ ಹಾಗೂ ಸಣ್ಣ ಉದ್ಯಮಿಗಳಿಗೆ ಬ್ಯಾಂಕ್ ಸಾಲ ಮತ್ತು ಸಬ್ಸಿಡಿ DPR ವರದಿ',
      hiTitle: 'हिंदी (Hindi)',
      hiDesc: 'एमएसएमई, पीएमईजीपी एवं बैंक ऋण हेतु संस्थागत डीपीआर रिपोर्ट',
      enTitle: 'English',
      enDesc: 'Institutional credit appraisal format for banks, NBFCs, and investors',
      continueBtn: 'हिंदी में जारी रखें →',
    },
    hero: {
      headline: 'अपनी फंडिंग-रेडी डीपीआर बनाएं, अधिक स्मार्ट तरीके से।',
      manualPrep: '3 सप्ताह की मैन्युअल तैयारी',
      speedBadge: '⚡ < 10 मिनट की सरल प्रक्रिया',
      subtitle: 'अपने व्यवसाय, परियोजना और वित्तीय विवरण को संस्थागत बैंक ऋण स्वीकृति हेतु पेशेवर रूप से संरचित विस्तृत परियोजना रिपोर्ट (DPR) में बदलें।',
      forHeading: 'अपनी डीपीआर किस उद्देश्य हेतु तैयार करें?',
      summaryLine: 'स्वचालित वित्तीय अनुमान, फंडिंग विश्लेषण और संरचित दस्तावेज़ीकरण के साथ।',
      viewPlansBtn: 'परियोजना आकार के अनुसार प्लान देखें',
      contactTeamBtn: 'टीम से संपर्क करें',
      highlights: {
        speed: '10 मिनट में त्वरित रिपोर्ट निर्माण',
        bankReady: 'बैंक क्रेडिट मूल्यांकन मानकों के अनुरूप',
        schemes: 'पीएमईजीपी / पीएमएफएमई और राज्य सरकारी योजनाएं',
        caNorms: 'आरबीआई दिशानिर्देश और सीए मानक',
      },
    },
    challenge: {
      kicker: 'चुनौती',
      title: 'आपकी फंडिंग को दस्तावेज़ीकरण के लिए रुकना न पड़े।',
      desc: 'मैन्युअल रूप से डीपीआर तैयार करने में विभिन्न फाइलों से डेटा एकत्र करना, वित्तीय मॉडल बनाना, बार-बार संशोधन करना और हफ्तों का समय गंवाना पड़ता है।',
      quote: '“आपका व्यवसाय आगे बढ़ने के लिए तैयार है। आपकी डीपीआर भी तैयार होनी चाहिए।”',
      traditionalTitle: 'पारंपरिक चुनौतियां:',
      challenges: [
        { icon: '🕒', text: 'दस्तावेज़ों को मैन्युअल रूप से तैयार करने में हफ्तों का समय' },
        { icon: '📊', text: 'जटिल वित्तीय अनुमान और गणनाएं तैयार करना' },
        { icon: '📄', text: 'एक्सेल स्प्रेडशीट और वर्ड फाइलों में दोहराव वाला काम' },
        { icon: '👥', text: 'बाहरी सलाहकारों के समय पर अत्यधिक निर्भरता' },
        { icon: '⚠️', text: 'परियोजना लागत या ऋण राशि बदलने पर होने वाली देरी' },
      ],
    },
    workflow: {
      kicker: 'कार्यप्रवाह मॉड्यूल',
      title: 'व्यावसायिक डेटा से संस्थागत बैंक डीपीआर तक',
      desc: 'VKF DPR Studio आपके कच्चे परियोजना मापदंडों और वित्तीय इनपुट को बैंक स्वीकृति योग्य संस्थागत रिपोर्ट में बदलता है।',
      modules: [
        { num: '01', title: 'व्यवसाय एवं परियोजना प्रोफ़ाइल', desc: 'अपने व्यवसाय प्रोफ़ाइल, प्रवर्तक ट्रैक रिकॉर्ड और परिसंपत्तियों को एक मंच पर लाएं।' },
        { num: '02', title: 'वित्तीय अनुमान', desc: 'बहु-वर्षीय लाभ-हानि विवरण, बैलेंस शीट और कैश फ्लो मॉडल तुरंत तैयार करें।' },
        { num: '03', title: 'फंडिंग आवंटन विश्लेषण', desc: 'सावधि ऋण, कार्यशील पूंजी मार्जिन, प्रवर्तक अंशदान और सरकारी सब्सिडी का सटीक ढांचा तैयार करें।' },
        { num: '04', title: 'व्यवहार्यता एवं जोखिम ऑडिट', desc: 'DSCR अनुपात, संवेदनशीलता तनाव परीक्षण और टंडन समिति के कार्यशील पूंजी नियमों की जांच करें।' },
        { num: '05', title: 'आधिकारिक डीपीआर आउटपुट', desc: 'बैंक प्रस्तुति हेतु तैयार आधिकारिक एवं प्रमाणिक उच्च गुणवत्ता पीडीएफ (PDF) रिपोर्ट तुरंत प्राप्त करें।' },
      ],
    },
    speedBand: {
      title: '3 सप्ताह का काम।\nअब केवल 10 मिनट में।',
      tagline: 'वित्तीय मॉडल को मैन्युअल रूप से दोबारा बनाना बंद करें।',
      desc: 'किसी भी परियोजना इनपुट — जैसे मशीनरी लागत या कार्यशील पूंजी — को बदलें और आपका पूरा 10-वर्षीय पीएंडएल, बैलेंस शीट और डीएससीआर स्वतः अपडेट हो जाएगा।',
      point1: 'शुरुआत से शुरू करने की कोई आवश्यकता नहीं।',
      point2: 'एक्सेल फॉर्मूला टूटने का कोई डर नहीं।',
      steps: [
        { step: 'चरण 1', title: 'अपने व्यवसाय का विवरण दर्ज करें' },
        { step: 'चरण 2', title: 'स्वचालित वित्तीय मॉडल तैयार करें' },
        { step: 'चरण 3', title: 'ऋण एवं सब्सिडी मार्जिन की समीक्षा करें' },
        { step: 'चरण 4', title: 'बैंक-तैयार डीपीआर डाउनलोड करें' },
      ],
    },
    fundingNeeds: {
      kicker: 'उपयोग के मामले',
      title: 'एक डीपीआर। एकाधिक फंडिंग लक्ष्य।',
      subtitle: 'चाहे आप व्यवसाय विस्तार की तैयारी कर रहे हों या संस्थागत वित्त की तलाश में हों, अपने विशिष्ट उद्देश्य के अनुसार दस्तावेज़ तैयार करें।',
      bankLoansTitle: 'बैंक एवं एनबीएफसी ऋण',
      bankLoansDesc: 'ऋण स्वीकृति के लिए अपने व्यवसाय, वित्तीय अनुमानों और ऋण अदायगी अनुसूची को एक संरचित रिपोर्ट में प्रस्तुत करें।',
      bankLoansBtn: 'ऋण डीपीआर बनाएं →',
      govtSubsidiesTitle: 'सरकारी सब्सिडी',
      govtSubsidiesDesc: 'पीएमईजीपी, पीएमएफएमई, राज्य औद्योगिक नीतियों और एमएसएमई पूंजी सब्सिडी दावों के लिए संरचित रिपोर्ट तैयार करें।',
      govtSubsidiesBtn: 'सब्सिडी डीपीआर तैयार करें →',
      investorTitle: 'इन्वेस्टर फंडिंग',
      investorDesc: 'अपनी इकाई प्रोफ़ाइल, यूनिट अर्थशास्त्र और संवेदनशीलता को एक सम्मोहक पिच दस्तावेज़ में समेकित करें।',
      investorBtn: 'इन्वेस्टर डीपीआर बनाएं →',
    },
    features: {
      kicker: 'प्लेटफ़ॉर्म की विशेषताएं',
      title: 'गति और सटीकता के लिए निर्मित।',
      items: [
        { title: 'लाइव पुनर्गणना', desc: 'लागत बदलें और तुरंत पीएंडएल, बैलेंस शीट और अनुपातों में अपडेट देखें।' },
        { title: 'ऑडिट-तैयार मॉडल', desc: 'आरबीआई ऋण दिशानिर्देशों और सीए मानकों के अनुसार वित्तीय गणनाएं।' },
        { title: 'मानकीकृत प्रारूप', desc: 'बिना मैन्युअल स्वरूपण झंझट के बैंक प्रस्तुति योग्य रिपोर्ट।' },
        { title: 'बहु-क्षेत्रीय बुद्धिमत्ता', desc: 'डेयरी, खाद्य प्रसंस्करण, सौर, विनिर्माण, वस्त्र आदि के लिए पूर्व-कॉन्फ़िगर मॉडल।' },
        { title: 'एक-क्लिक डाउनलोड', desc: 'कस्टम लोगो के साथ आधिकारिक पीडीएफ (PDF) रिपोर्ट तुरंत डाउनलोड करें।' },
      ],
    },
    financialStudio: {
      kicker: 'इंटरैक्टिव वित्तीय सिम्युलेटर',
      title: 'रीयल-टाइम कैलकुलेशन इंजन का अनुभव करें',
      subtitle: 'मशीनरी लागत स्लाइडर को समायोजित करें और देखें कि हमारा इंजन पीएंडएल अनुमान, डीएससीआर कवरेज और ऋण सीमाओं को लाइव कैसे अपडेट करता है।',
      sliderLabel: 'मशीनरी निवेश लागत समायोजित करें:',
      totalCost: 'कुल परियोजना लागत',
      bankLoan: 'बैंक ऋण (70%)',
      subsidy: 'पात्र सब्सिडी',
      avgDscr: 'औसत DSCR',
      particulars: 'विवरण (₹ लाख में)',
      year1: 'वर्ष 1',
      year3: 'वर्ष 3',
      year5: 'वर्ष 5',
      turnover: 'सकल कारोबार',
      opex: 'परिचालन व्यय',
      netProfit: 'अनुमानित शुद्ध लाभ',
      tableHeadingProjections: '5-वर्षीय अनुमानित लाभप्रदता अवलोकन',
      tableHeadingRatios: 'वित्तीय जोखिम एवं ऋण सेवा कवरेज (DSCR)',
      tableHeadingRepayments: 'ऋण मूलधन एवं ब्याज परिशोधन अनुसूची',
      tableHeadingSensitivities: 'क्षमता उपयोग एवं संवेदनशीलता सीमाएं',
      tabs: {
        projections: { label: 'अनुमान', desc: '5-वर्षीय लाभ एवं हानि पूर्वानुमान' },
        ratios: { label: 'प्रमुख अनुपात', desc: 'DSCR, ऋण-इक्विटी एवं मार्जिन' },
        repayments: { label: 'ऋण चुकौती', desc: 'मूलधन एवं ब्याज परिशोधन अनुसूची' },
        sensitivities: { label: 'संवेदनशीलता विश्लेषण', desc: 'ब्रेक-इवन एवं क्षमता उपयोग' },
      },
    },
    sectors: {
      kicker: 'समर्थित व्यावसायिक क्षेत्र',
      title: 'प्रत्येक व्यावसायिक क्षेत्र के लिए निर्मित',
      subtitle: 'हमारा AI इंजन उद्योग मानकों, मशीनरी शीर्षों और बेंचमार्क परिचालन मेट्रिक्स के अनुसार संस्थागत स्तर की रिपोर्ट तैयार करता है।',
      keyAnalysis: 'प्रमुख डीपीआर अनुभाग एवं विश्लेषण:',
      generateBtn: 'डीपीआर बनाएं →',
      generateSectorDpr: 'बनाएं',
      items: {
        manufacturing: {
          title: 'विनिर्माण एवं इंजीनियरिंग',
          badge: 'उच्च मांग',
          desc: 'ऑटो घटक, धातु निर्माण, सीएनसी मशीनिंग, प्लास्टिक मोल्डिंग, पैकेजिंग और औद्योगिक उपकरण।',
          activities: ['कच्चा माल BOQ', 'संयंत्र एवं मशीनरी कैपेक्स', 'क्षमता एवं शिफ्ट योजना', 'बिजली एवं उपयोगिता']
        },
        food_processing: {
          title: 'खाद्य प्रसंस्करण एवं कृषि',
          badge: 'पीएमईजीपी / पीएमएफएमई तैयार',
          desc: 'आटा एवं चावल मिल, मसाला पिसाई, कोल्ड स्टोरेज, डेयरी प्रसंस्करण, खाद्य तेल इकाइयां।',
          activities: ['FSSAI एवं गुणवत्ता कैपेक्स', 'मौसमी फसल कार्यशील पूंजी', 'कोल्ड स्टोरेज लॉजिस्टिक्स', 'उपज हानि अनुमान']
        },
        agriculture: {
          title: 'कृषि एवं खेती',
          badge: 'AIF योजना पात्र',
          desc: 'हाइड्रोपोनिक्स, हाई-टेक ग्रीनहाउस खेती, पोल्ट्री एवं डेयरी फार्मिंग, पॉलीहाउस, जैविक खाद।',
          activities: ['भूमि तैयारी एवं सिंचाई', 'फसल चक्र राजस्व अनुसूची', 'सब्सिडी मार्जिन विवरण', 'पॉलीहाउस कैपेक्स']
        },
        textile: {
          title: 'वस्त्र एवं परिधान',
          badge: 'निर्यात उन्मुख',
          desc: 'परिधान निर्माण, बुनाई एवं कताई मिलें, रेशम प्रसंस्करण, रेडीमेड वस्त्र और कढ़ाई।',
          activities: ['लूम एवं सिलाई कैपेक्स', 'धागा एवं कपड़ा कार्यशील पूंजी', 'श्रम एवं ओवरहेड अनुसूची', 'ऑर्डर निष्पादन चक्र']
        },
        healthcare: {
          title: 'स्वास्थ्य सेवा एवं फार्मा',
          badge: 'NABH / ISO मानक',
          desc: 'डायग्नोस्टिक केंद्र, चिकित्सा उपकरण निर्माण, फार्मा फॉर्मूलेशन, अस्पताल और आयुष।',
          activities: ['चिकित्सा उपकरण कैपेक्स', 'क्लीनरूम स्थापना', 'उपभोग्य सूची', 'बेड क्षमता एवं उपयोग']
        },
        it_services: {
          title: 'आईटी एवं सॉफ्टवेयर सेवाएं',
          badge: 'त्वरित स्वीकृति',
          desc: 'SaaS उत्पाद, आईटी परामर्श, हार्डवेयर असेंबली, डेटा सेंटर और AI/ML तकनीकी समाधान।',
          activities: ['क्लाउड एवं वर्कस्टेशन कैपेक्स', 'सॉफ्टवेयर प्रतिभा लागत मॉडल', 'SaaS आवर्ती राजस्व', 'आईपी एवं लाइसेंस मूल्यांकन']
        },
        renewable_energy: {
          title: 'नवीकरणीय ऊर्जा एवं ईवी',
          badge: 'पीएम-कुसुम तैयार',
          desc: 'रूफटॉप व ग्राउंड सोलर प्लांट, ईवी चार्जिंग हब, बैटरी स्वैपिंग स्टेशन और बायोमास पेलेट्स।',
          activities: ['पीपीए टैरिफ गणना', 'सौर पैनल एवं इन्वर्टर BOQ', 'रखरखाव एवं मरम्मत', 'ग्रिड कनेक्शन खर्च']
        },
        tourism: {
          title: 'पर्यटन एवं आतिथ्य',
          badge: 'राज्य नीति पात्र',
          desc: 'इको-रिसॉर्ट्स, बुटीक होटल, थीम पार्क, वेलनेस केंद्र और साहसिक पर्यटन इकाइयां।',
          activities: ['कमरे का निर्माण एवं इंटीरियर', 'मौसमी ऑक्यूपेंसी दर', 'खानपान राजस्व विवरण', 'संपत्ति लीज अनुसूचियां']
        },
        infrastructure: {
          title: 'बुनियादी ढांचा एवं लॉजिस्टिक्स',
          badge: 'संस्थागत पैमाना',
          desc: 'लॉजिस्टिक्स हब, ड्राई वेयरहाउस, कोल्ड चेन नेटवर्क, वाणिज्यिक स्थान और परिवहन बेड़े।',
          activities: ['गोदाम निर्माण BOQ', 'वाहन कैपेक्स एवं रखरखाव', 'किराया पट्टा छूट', 'थ्रूपुट क्षमता']
        },
        services: {
          title: 'वाणिज्यिक सेवाएं',
          badge: 'एमएसएमई स्वीकृत',
          desc: 'शैक्षणिक संस्थान, फिटनेस चेन, खुदरा सुपरमार्केट, स्वचालित लॉन्ड्रोमैट और को-वर्किंग स्पेस।',
          activities: ['इंटीरियर फिट-आउट कैपेक्स', 'सदस्यता एवं शुल्क नकदी प्रवाह', 'कार्यशील पूंजी चक्र', 'कर्मचारी वेतन संरचना']
        },
        custom: {
          title: 'कस्टम एवं उभरते क्षेत्र',
          badge: 'अनुकूलित मॉडल',
          desc: 'अद्वितीय व्यापार मॉडल, नई तकनीकों और विशेष उपक्रमों के लिए अनुकूलित डीपीआर संरचना।',
          activities: ['कस्टम कैपेक्स बिल्डर', 'परिवर्तनीय लागत चालक', 'लचीला DSCR कैलकुलेटर', 'गतिशील राजस्व परिदृश्य']
        }
      }
    },
    pricing: {
      title: 'अपना पसंदीदा',
      highlight: 'फंडिंग मार्ग चुनें',
      subtitle: 'चुनें कि आप अपनी परियोजना के लिए पूंजी कैसे जुटाना चाहते हैं। अगली स्क्रीन पर, परियोजना आकार के अनुसार डीपीआर प्लान चुनें।',
      tagPill: '3 फंडिंग मार्ग • कीमतें ₹3,999 से शुरू',
      viewPlansBtn: 'परियोजना आकार के अनुसार प्लान देखें →',
      routes: {
        govt: {
          label: 'सरकारी योजनाएं',
          tag: 'सरकारी योजनाएं एवं सब्सिडी',
          title: 'पीएमईजीपी, पीएमएफएमई और राज्य नीतियां',
          desc: 'सरकारी अनुदान, मार्जिन मनी या पूंजीगत सब्सिडी के लिए आवेदन करने वाले उद्यमियों के लिए।',
          checks: [
            'योजना अनुरूप डीपीआर प्रारूप एवं लेआउट',
            'सब्सिडी पात्रता एवं मार्जिन मनी विवरण',
            'बैंक एवं नोडल एजेंसी प्रस्तुति हेतु तैयार',
            'विस्तृत 5-10 वर्ष का वित्तीय अनुमान'
          ],
          projectSizeText: 'परियोजना आकार ₹5 लाख से ₹25 करोड़+',
          modalTitle: 'सरकारी योजना एवं सब्सिडी डीपीआर प्लान'
        },
        bank: {
          label: 'बैंक ऋण',
          tag: 'बैंक एवं एनबीएफसी ऋण',
          title: 'सावधि ऋण एवं कार्यशील पूंजी',
          desc: 'सार्वजनिक, निजी या सहकारी बैंकों से ऋण वित्तपोषण चाहने वाले व्यवसायों के लिए।',
          checks: [
            'बैंक क्रेडिट मूल्यांकन मानकों के अनुसार डीपीआर',
            'DSCR, ऋण-इक्विटी एवं टंडन समिति परीक्षण',
            '36-माह का कैश फ्लो एवं सीएमए अनुसूचियां',
            'आईआरआर, एनपीवी, बीईपी एवं संवेदनशीलता विश्लेषण'
          ],
          projectSizeText: 'परियोजना आकार ₹5 लाख से ₹25 करोड़+',
          modalTitle: 'बैंक एवं एनबीएफसी ऋण डीपीआर प्लान'
        },
        inv: {
          label: 'इन्वेस्टर पिच',
          tag: 'इन्वेस्टर फंडिंग',
          title: 'पिच डीपीआर एवं इक्विटी विस्तार',
          desc: 'एंजेल निवेशकों, वीसी फंड या रणनीतिक साझेदारों को पिच करने वाले स्टार्टअप्स के लिए।',
          checks: [
            'निवेशक-ग्रेड कार्यकारी सारांश एवं डेक',
            'यूनिट अर्थशास्त्र एवं विकास अनुमान',
            'मूल्यांकन मानक एवं कैप टेबल सारांश',
            'धन का उपयोग एवं निकास रणनीति'
          ],
          projectSizeText: 'परियोजना आकार ₹5 लाख से ₹25 करोड़+',
          modalTitle: 'इन्वेस्टर पिच डीपीआर प्लान'
        }
      },
      plans: {
        entry: { name: 'प्रारंभिक (Entry)', sub: 'शुरुआती परियोजनाएं (₹5 लाख – ₹25 लाख)', cta: 'डीपीआर बनाएं' },
        core: { name: 'कोर (Core)', sub: 'मानक एमएसएमई परियोजनाएं (₹25 लाख – ₹2 करोड़)', cta: 'डीपीआर बनाएं' },
        team: { name: 'टीम (Team)', sub: 'मध्यम आकार के उद्यम (₹2 करोड़ – ₹10 करोड़)', cta: 'डीपीआर बनाएं' },
        ent: { name: 'एंटरप्राइज', sub: 'बड़े पैमाने की परियोजनाएं (₹10 करोड़+)', cta: 'डीपीआर बनाएं' },
      },
    },
    contact: {
      kicker: 'हमारी टीम से संपर्क करें',
      title: 'अपनी परियोजना के बारे में बताएं।',
      subtitle: 'अपनी परियोजना का विवरण साझा करें। हमारी सलाहकार टीम बैंक योग्य डीपीआर तैयार करने में आपकी सहायता करेगी।',
      sendInquiry: 'पूछताछ भेजें',
      accountLogin: 'खाता लॉगिन',
      register: 'नया पंजीकरण',
      fullName: 'पूरा नाम',
      businessName: 'व्यवसाय / उद्यम का नाम',
      email: 'ईमेल पता',
      phone: 'फ़ोन नंबर (10 अंक)',
      city: 'शहर / जिला',
      businessType: 'व्यावसायिक क्षेत्र (जैसे विनिर्माण, खाद्य, डेयरी...)',
      dprPurpose: 'डीपीआर का उद्देश्य',
      purposeLoan: 'बैंक / एनबीएफसी सावधि ऋण एवं कार्यशील पूंजी',
      purposeSubsidy: 'सरकारी सब्सिडी (पीएमईजीपी, पीएमएफएमई, राज्य नीति)',
      purposeInvestor: 'इन्वेस्टर पिच एवं इक्विटी विस्तार',
      submitBtn: 'पूछताछ भेजें →',
      submittedMsg: '✓ धन्यवाद! आपकी पूछताछ दर्ज कर ली गई है। हमारी सलाहकार टीम जल्द ही आपसे संपर्क करेगी।',
    },
    faq: {
      title: 'अक्सर पूछे जाने वाले प्रश्न',
      items: [
        {
          q: 'विस्तृत परियोजना रिपोर्ट (DPR) क्या है?',
          a: 'डीपीआर एक आधिकारिक व्यापक दस्तावेज़ है जो उद्यम की पूंजीगत लागत, परिचालन मापदंडों, 10-वर्षीय वित्तीय अनुमानों और ऋण सेवा व्यवहार्यता का विवरण देता है।'
        },
        {
          q: 'इस डीपीआर टूल का उपयोग कौन कर सकता है?',
          a: 'यह उपकरण एमएसएमई, उद्यमियों, चार्टर्ड एकाउंटेंट्स और सलाहकारों के लिए बनाया गया है जो बैंक ऋण, सब्सिडी और निवेशक प्रस्तुति तैयार कर रहे हैं।'
        },
        {
          q: 'कौन सी सरकारी सब्सिडी योजनाएं समर्थित हैं?',
          a: 'यह इंजन पीएमईजीपी, पीएमएफएमई, राज्य औद्योगिक नीति पूंजीगत सब्सिडी, एआईएफ और पीएम-कुसुम जैसी योजनाओं का समर्थन करता है।'
        },
        {
          q: 'मैं अपनी डीपीआर किन प्रारूपों में डाउनलोड कर सकता हूँ?',
          a: 'आप तुरंत बैंक प्रस्तुति हेतु तैयार आधिकारिक एवं प्रमाणिक उच्च गुणवत्ता पीडीएफ (PDF) दस्तावेज कस्टम लोगो के साथ डाउनलोड कर सकते हैं।'
        }
      ]
    },
    footer: {
      rights: '© 2026 Vision Karnataka Foundation. सर्वाधिकार सुरक्षित।',
      institution: 'संस्थागत स्तर का डीपीआर एवं प्रोजेक्ट अप्रेजल इंजन।',
      links: {
        home: 'होम',
        overview: 'अवलोकन',
        fundingNeeds: 'फंडिंग आवश्यकताएं',
        sectors: 'व्यावसायिक क्षेत्र',
        financialStudio: 'वित्तीय स्टूडियो',
        pricing: 'मूल्य निर्धारण',
        faq: 'अक्सर पूछे जाने वाले प्रश्न',
      }
    },
    dashboard: {
      step1: '01. बुनियादी जानकारी',
      step2: '02. सदस्य एवं प्रबंधन',
      step3: '03. उत्पाद विनिर्देश',
      step4: '04. संयंत्र और मशीनरी',
      step5: '05. बाजार रणनीति',
      step6: '06. जनशक्ति योजना',
      generatingDpr: 'संस्थागत डीपीआर तैयार हो रही है...',
      generatingDesc: 'वित्तीय अनुमान, बैंक क्रेडिट अनुपात और कार्यकारी विवरण संकलित किए जा रहे हैं।',
    },
  },
};
