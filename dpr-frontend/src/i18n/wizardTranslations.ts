import { Language } from './translations';

export interface WizardSectorTranslation {
  title: string;
  subtitle: string;
  questions?: Record<string, { title: string; desc: string }>;
}

export interface WizardTranslations {
  header: {
    progress: string;
    step: (curr: number, total: number) => string;
    service: string;
    services: {
      bank: string;
      govt: string;
      investor: string;
    };
    depth: string;
    depths: {
      summary: string;
      standard: string;
      detailed: string;
    };
  };
  autoFill: {
    title: string;
    desc: string;
    resetBtn: string;
    uploadBtn: string;
    loadSampleBtn: string;
    parsing: string;
  };
  progressive: {
    showAll: string;
    showSingle: string;
    questionOf: (curr: number, total: number) => string;
    completed: (pct: number) => string;
    prevQuestion: string;
    nextQuestion: string;
    saveComplete: string;
    saving: string;
    previous: string;
    saveContinue: string;
  };
  advisor: {
    title: string;
    askQuery: string;
    placeholder: string;
  };
  sectors: Record<number, WizardSectorTranslation>;
  s1Fields: {
    q1_title: string;
    q1_desc: string;
    sectorLabel: string;
    activityLabel: string;
    classificationLabel: string;
    otherSector: string;
    otherActivity: string;
    otherClassification: string;
    q2_title: string;
    q2_desc: string;
    businessName: string;
    groupName: string;
    businessDesc: string;
    q3_title: string;
    q3_desc: string;
    entityType: string;
    cin: string;
    gst: string;
    pan: string;
    udyam: string;
    fssai: string;
    q4_title: string;
    q4_desc: string;
    village: string;
    district: string;
    state: string;
    contactName: string;
    contactNumber: string;
    email: string;
    bankName: string;
    bankBranch: string;
    ifsc: string;
    q5_title: string;
    q5_desc: string;
    primaryBank: string;
    loanScheme: string;
    collateral: string;
    moratorium: string;
    tenure: string;
    interestRate: string;
    targetGovtScheme: string;
    nodalAgency: string;
    locationSubsidy: string;
    socialCategory: string;
    edpStatus: string;
    subsidyClaim: string;
    investmentAsk: string;
    equityOffered: string;
    valuation: string;
  };
  masterSectors: Record<string, string>;
  masterActivities: Record<string, string>;
  masterProjectTypes: Record<string, string>;
  entityTypes: Record<string, string>;
  collateralOptions: Record<string, string>;
  govtSchemeOptions: Record<string, string>;
  nodalAgencyOptions: Record<string, string>;
  locationOptions: Record<string, string>;
  socialOptions: Record<string, string>;
  edpOptions: Record<string, string>;
  labels: Record<string, string>;
}

export const wizardTranslations: Record<Language, WizardTranslations> = {
  en: {
    header: {
      progress: 'Progress',
      step: (curr, total) => `Step ${curr}/${total}`,
      service: 'Service:',
      services: {
        bank: 'Bank Loan DPR',
        govt: 'Govt Subsidy DPR',
        investor: 'Investor / Business Pitch DPR',
      },
      depth: 'Depth:',
      depths: {
        summary: 'Summary (10–15 pgs)',
        standard: 'Standard (20–30 pgs)',
        detailed: 'Detailed (40–60 pgs)',
      },
    },
    autoFill: {
      title: 'Smart Document Auto-Fill',
      desc: 'Upload GST Certificate, Udyam MSME, Quotations, Bank Statements, or Proposal PDF/Image. The engine will auto-fill your fields below!',
      resetBtn: 'Reset Form',
      uploadBtn: 'Upload Document to Auto-Fill',
      loadSampleBtn: '⚡ Auto-Fill Sample Data (1-Click Demo)',
      parsing: 'Parsing & Auto-Filling...',
    },
    progressive: {
      showAll: 'Show All Questions',
      showSingle: 'Show Question-by-Question',
      questionOf: (curr, total) => `Question ${curr} of ${total}`,
      completed: (pct) => `${pct}% Completed`,
      prevQuestion: 'Previous Question',
      nextQuestion: 'Next Question',
      saveComplete: 'Save & Complete Sector',
      saving: 'Saving...',
      previous: 'Previous',
      saveContinue: 'Save & Continue',
    },
    advisor: {
      title: 'DPR AI Advisor',
      askQuery: 'Ask any query',
      placeholder: 'Ask any query (download, edit, DSCR, PMEGP)...',
    },
    sectors: {
      0: {
        title: 'Sector 1: Basic Information & Business Identity',
        subtitle: 'Complete business registration, sector selection, and location details',
        questions: {
          sector_activity: { title: 'Business Sector & Activity Selection', desc: 'Select your sector & sub-activity for dynamic schema resolution' },
          business_identity: { title: 'Business Identity & Overview', desc: 'Legal business name, group name, and operational overview' },
          tax_registrations: { title: 'Entity Type & Tax Registrations', desc: 'Entity constitution (Proprietorship/Pvt Ltd), CIN, GST, PAN, Udyam, FSSAI' },
          location_contact: { title: 'Location, Contact & Bank Account Details', desc: 'Village/Town, District, State, contact details, and banking information' },
          track_specific_questions: { title: 'DPR Service Specific Questions', desc: 'Tailored questions for your selected DPR service' },
        },
      },
      1: {
        title: 'Sector 2: Members & Promoter Profile',
        subtitle: 'Enter details of promoters, managing directors, and key management team',
        questions: {
          promoters_list: { title: 'Promoter & Management Team Schedule', desc: 'Add members, designation, qualification, experience, and gender details' },
        },
      },
      2: {
        title: 'Sector 3: Product & Production Details',
        subtitle: 'Define manufactured goods or services, specifications, and plant capacity',
        questions: {
          primary_product: { title: 'Primary Product / Service Description', desc: 'Product specifications, uses, and applications' },
          capacity_pricing: { title: 'Production Capacity & Pricing', desc: 'Annual installed capacity, capacity utilization, and unit pricing' },
          raw_materials_cost: { title: 'Key Raw Materials & Monthly Cost', desc: 'Major raw materials required, sourcing, and monthly expenditure' },
          usp: { title: 'Value Proposition & Competitive USP', desc: 'Unique selling points, market advantage, and quality differentiators' },
        },
      },
      3: {
        title: 'Sector 4: Machinery & Equipment Schedule',
        subtitle: 'Specify plant machinery, indigenous/imported equipment, and civil foundation',
        questions: {
          machinery_table: { title: 'Plant Machinery & Capital Equipment Schedule', desc: 'List major machinery, capacity, suppliers, and purchase cost' },
          supplier_details: { title: 'Machinery Quotations & Vendor Details', desc: 'Supplier name, quotations status, and delivery lead time' },
        },
      },
      4: {
        title: 'Sector 5: Market Analysis & Competitor Study',
        subtitle: 'Target customer segments, demand-supply gap, pricing, and distribution model',
        questions: {
          target_customers: { title: 'Target Customer Segments', desc: 'Retail, B2B, wholesale, government, and institutional buyers' },
          sales_channels: { title: 'Sales & Distribution Channels', desc: 'Direct marketing, dealer network, e-commerce, and export channels' },
          competitors: { title: 'Key Competitors & Market Share', desc: 'Local and regional competitors, market share, and pricing comparison' },
        },
      },
      5: {
        title: 'Sector 6: Human Resource & Manpower Expenses',
        subtitle: 'Technical staff, administrative team, skilled workers, and monthly payroll budget',
        questions: {
          hr_breakdown: { title: 'Manpower Breakdown & Monthly Payroll Schedule', desc: 'Management, supervisors, skilled, unskilled, and administrative personnel' },
        },
      },
      6: {
        title: 'Sector 7: Financial Estimates & Capital Outlay',
        subtitle: 'Total capital expenditure, promoter equity, bank term loan, and subsidy margin',
        questions: {
          project_cost_capex: { title: 'Total Project Cost Breakdown (CAPEX)', desc: 'Land, civil works, machinery, working capital margin, and contingencies' },
          means_of_finance: { title: 'Means of Finance & Capital Structure', desc: 'Promoter equity, bank term loan, working capital CC, and capital subsidy' },
        },
      },
      7: {
        title: 'Sector 8: 5-Year Financial Projections',
        subtitle: 'Projected revenue, operating profit, DSCR, break-even analysis, and repayment schedule',
        questions: {
          financial_projections: { title: '5-Year Financial Projections & Viability', desc: 'Revenue forecast, gross profit, EBITDA, DSCR, and break-even point' },
        },
      },
      8: {
        title: 'Sector 9: Infrastructure & Utilities Requirements',
        subtitle: 'Land ownership, factory shed, power load, water consumption, and effluent treatment',
        questions: {
          workspace_area: { title: 'Land & Civil Works / Built-up Area', desc: 'Total land area, shed built-up area, ownership type, and lease terms' },
          water_rent_timeline: { title: 'Power, Water, Rent & Commercial Operations Timeline', desc: 'Connected power load, daily water requirement, rent, and COD date' },
        },
      },
      9: {
        title: 'Sector 10: SWOT Analysis',
        subtitle: 'Internal strengths, operational weaknesses, market opportunities, and external threats',
        questions: {
          strengths_weaknesses: { title: 'Strengths & Weaknesses Analysis', desc: 'Internal operational advantages and constraints' },
          opportunities_threats: { title: 'Opportunities & Threats Analysis', desc: 'External market opportunities and potential business risks' },
        },
      },
      10: {
        title: 'Sector 11: Social & Environmental Impact',
        subtitle: 'Employment generation for local community, women, and youth, plus green initiatives',
        questions: {
          social_impact: { title: 'Direct Employment Generation', desc: 'Number of jobs created for local residents, women, and youth' },
          environmental_impact: { title: 'Environmental Sustainability & Skill Training', desc: 'Eco-friendly manufacturing, waste management, and employee training' },
          employment_breakdown: { title: 'Direct Employment Generation', desc: 'Number of jobs created for local residents, women, and youth' },
          eco_practices: { title: 'Environmental Sustainability & Skill Training', desc: 'Eco-friendly manufacturing, waste management, and employee training' },
        },
      },
      11: {
        title: 'Sector 12: Credit Standing & History Profile',
        subtitle: 'CIBIL profile, prior loan history, existing liabilities, or scheme standing',
        questions: {
          credit_facilities: { title: 'Existing Credit Facilities & Borrowing History', desc: 'Existing loans with banks/NBFCs, repayment track record, and CIBIL score' },
          bank_accounts: { title: 'Primary Banking Relationships & Repayment Track Record', desc: 'Current account bank, average monthly balance, and turnover' },
          credit_standing: { title: 'Credit Score & Past Loan History', desc: 'CIBIL score, prior borrowing experience, and existing loan balances' },
        },
      },
      12: {
        title: 'Sector 13: Report Image & Photo Uploads',
        subtitle: 'Company logo, product sample photo, facility machinery, and promoter team images',
        questions: {
          site_photos: { title: 'Upload Company & Product Photos', desc: 'Logo, product photos, plant facility, and management team pictures' },
          images_upload: { title: 'Upload Company & Product Photos', desc: 'Logo, product photos, plant facility, and management team pictures' },
        },
      },
      13: {
        title: 'Sector 14: Declaration & Final Report Generation',
        subtitle: 'Authorised signatory details, report depth selection, and official PDF report compilation',
        questions: {
          declaration_submission: { title: 'Authorised Signatory Declaration', desc: 'Enter declarant name, designation, and location' },
          declaration_statement: { title: 'Authorised Signatory Declaration', desc: 'Enter declarant name, designation, and location' },
          report_depth: { title: 'Target DPR Report Length & Depth', desc: 'Choose Standard (15-20 Pgs), Comprehensive (25-35 Pgs), or Enterprise (40-60 Pgs)' },
          approve_compile: { title: 'User Approval & Report Generation', desc: 'Compile publication-ready official bankable PDF report' },
        },
      },
    },
    s1Fields: {
      q1_title: 'Business Sector & Activity Selection',
      q1_desc: 'Select your sector & sub-activity for dynamic schema resolution',
      sectorLabel: '1. Business Sector',
      activityLabel: '2. Business Activity / Sub-Sector',
      classificationLabel: '3. Project Classification',
      otherSector: 'Other (Specify Custom Sector)',
      otherActivity: 'Other (Specify Custom Activity)',
      otherClassification: 'Other (Specify Custom Classification)',
      q2_title: 'Business Identity & Overview',
      q2_desc: 'Legal business name, group name, and operational overview',
      businessName: 'Business Name',
      groupName: 'Group / Organization Name',
      businessDesc: 'Business Overview',
      q3_title: 'Entity Type & Tax Registrations',
      q3_desc: 'Entity constitution (Proprietorship/Pvt Ltd), CIN, GST, PAN, Udyam, FSSAI',
      entityType: 'Entity Type',
      cin: 'CIN No.',
      gst: 'GST No.',
      pan: 'PAN No.',
      udyam: 'MSME / Udyam No.',
      fssai: 'FSSAI No.',
      q4_title: 'Location, Contact & Bank Account Details',
      q4_desc: 'Village/Town, District, State, contact details, and banking information',
      village: 'Village / Town',
      district: 'District',
      state: 'State',
      contactName: 'Contact Person Name',
      contactNumber: 'Contact Number',
      email: 'Email Address',
      bankName: 'Bank Name',
      bankBranch: 'Bank Branch',
      ifsc: 'IFSC Code',
      q5_title: 'DPR Service Specific Questions',
      q5_desc: 'Tailored questions for your selected DPR service',
      primaryBank: 'Primary Lending Bank',
      loanScheme: 'Bank Loan Scheme',
      collateral: 'Collateral Offered',
      moratorium: 'Repayment Moratorium (Months)',
      tenure: 'Repayment Tenure (Years)',
      interestRate: 'Interest Rate % (p.a.)',
      targetGovtScheme: 'Target Government Scheme',
      nodalAgency: 'Nodal Implementing Agency',
      locationSubsidy: 'Location Subsidy Category',
      socialCategory: 'Social Beneficiary Category',
      edpStatus: 'EDP Training Status',
      subsidyClaim: 'Subsidy Margin Claim (₹)',
      investmentAsk: 'Investment Ask Amount (₹)',
      equityOffered: 'Equity Offered (%)',
      valuation: 'Pre-Money Valuation (₹)',
    },
    masterSectors: {
      manufacturing: 'Manufacturing',
      food_processing: 'Food Processing',
      agriculture: 'Agriculture & Farming',
      textile: 'Textile & Garments',
      healthcare: 'Healthcare & Pharma',
      it_services: 'IT & ITES',
      renewable_energy: 'Renewable Energy & EV',
      tourism: 'Tourism & Hospitality',
      services: 'Services & Enterprise',
      infrastructure: 'Infrastructure & Logistics',
      other: 'Other (Specify Custom Sector)',
    },
    masterActivities: {
      cnc_machining: 'Precision CNC & Sheet Metal Components',
      spice_processing: 'Spice Processing & Packaging',
      dairy_processing: 'Dairy Pasteurization & Value Addition',
      garment_manufacturing: 'Readymade Apparel & Workwear Unit',
      solar_installation: 'Commercial Solar Power & Microgrid',
      software_services: 'Cloud Software & Enterprise Solutions',
      cold_storage_hub: 'Multi-Commodity Cold Storage Warehouse',
      other: 'Other (Specify Custom Activity)',
    },
    masterProjectTypes: {
      new_project: 'New Greenfield Project',
      expansion: 'Expansion & Capacity Upgrade',
      modernization: 'Modernization & Technology Upgrade',
      diversification: 'Product Diversification',
      startup: 'Tech Startup / Innovation Venture',
      other: 'Other (Specify Custom Classification)',
    },
    entityTypes: {
      Proprietorship: 'Proprietorship',
      Partnership: 'Partnership',
      LLP: 'LLP',
      'Private Limited Company': 'Private Limited Company',
      JLG: 'JLG',
      SHG: 'SHG',
    },
    collateralOptions: {
      'CGTMSE Guarantee (Collateral Free)': 'CGTMSE Guarantee (Collateral Free)',
      'Property Mortgage (Residential/Commercial)': 'Property Mortgage (Residential/Commercial)',
      'Fixed Deposit Pledged': 'Fixed Deposit Pledged',
      'Industrial Shed Land Mortgage': 'Industrial Shed Land Mortgage',
    },
    govtSchemeOptions: {
      'PMEGP (Prime Minister Employment Generation Programme)': 'PMEGP (Prime Minister Employment Generation Programme)',
      'MUDRA Loan Scheme': 'MUDRA Loan Scheme',
      'PMFME (PM Formalisation of Micro Food Processing)': 'PMFME (PM Formalisation of Micro Food Processing)',
      'KVIC / KVIB Rural Enterprise Subsidy': 'KVIC / KVIB Rural Enterprise Subsidy',
      'District Industries Centre (DIC) State Subsidy': 'District Industries Centre (DIC) State Subsidy',
    },
    nodalAgencyOptions: {
      'KVIC (Khadi & Village Industries Commission)': 'KVIC (Khadi & Village Industries Commission)',
      'KVIB (Karnataka State KVIB)': 'KVIB (Karnataka State KVIB)',
      'DIC (District Industries Centre)': 'DIC (District Industries Centre)',
    },
    locationOptions: {
      'Rural Area (35% Special / 25% General Subsidy)': 'Rural Area (35% Special / 25% General Subsidy)',
      'Urban Area (25% Special / 15% General Subsidy)': 'Urban Area (25% Special / 15% General Subsidy)',
    },
    socialOptions: {
      'Special Category (Women / SC / ST / OBC / Ex-Servicemen)': 'Special Category (Women / SC / ST / OBC / Ex-Servicemen)',
      'General Category': 'General Category',
    },
    edpOptions: {
      'Completed (10-Day Online/Offline Training Certificate)': 'Completed (10-Day Online/Offline Training Certificate)',
      'Registered / Pending Training Slot': 'Registered / Pending Training Slot',
      'Exempted (Technical Degree / Diploma Holder)': 'Exempted (Technical Degree / Diploma Holder)',
    },
    labels: {
      category: 'Category',
      numberOfPersons: 'Number of Persons',
      monthlySalary: 'Monthly Salary (₹)',
      monthlyCost: 'Monthly Cost (₹)',
      management: 'Management',
      supervisory: 'Supervisory',
      skilledWorkers: 'Skilled Workers',
      unskilledWorkers: 'Unskilled Workers',
      administrative: 'Administrative',
      total: 'TOTAL',
      persons: 'Persons',
      perMonth: '/ month',
      landCost: 'Land Cost (₹)',
      buildingCost: 'Building Cost (₹)',
      machineryTotal: 'Plant & Machinery Total (₹)',
      furnitureCost: 'Furniture & Fixtures (₹)',
      workingCapital: 'Working Capital (₹)',
      otherCost: 'Other Preliminary Expenses (₹)',
      totalProjectCost: 'TOTAL PROJECT COST',
      promoterContribution: 'Promoter Contribution (₹)',
      bankLoanRequired: 'Bank Loan Required (₹)',
      subsidyGrant: 'Subsidy / Grant (₹)',
      particulars: 'Particulars',
      capacityUtilization: 'Capacity Utilization (%)',
      interestExpense: 'Interest Expense (₹)',
      depreciation: 'Depreciation (₹)',
      year1: 'Year 1',
      year2: 'Year 2',
      year3: 'Year 3',
      year4: 'Year 4',
      year5: 'Year 5',
      workspaceStatus: 'Workspace Status',
      builtupArea: 'Built-up Area (sq.ft.)',
      powerRequired: 'Power Required (HP / KVA)',
      waterRequired: 'Water Required (L/day)',
      monthlyRent: 'Monthly Rent (₹)',
      timeToStartOps: 'Time to Start Operations (months)',
      ownedRented: 'Owned / Rented',
      strengths: 'Strengths',
      weaknesses: 'Weaknesses',
      opportunities: 'Opportunities',
      threats: 'Threats',
      localEmployment: 'Local Employment (Persons)',
      womenEmployment: 'Women Employment (Persons)',
      youthEmployment: 'Youth Employment (Persons)',
      ecoPractices: 'Eco-friendly Practices (Yes/No)',
      skillTraining: 'Skill Training Provided (Yes/No)',
      ecoDescription: 'Eco-friendly Initiatives Description',
      cibilScore: 'CIBIL Score',
      takenLoanBefore: 'Taken Loan Before? (Yes/No)',
      existingLoanAmount: 'Existing Loan Amount (₹)',
      outstandingAmount: 'Outstanding Amount (₹)',
      defaultHistory: 'Default History (Yes/No)',
      targetScheme: 'Target Scheme',
      dicJurisdiction: 'DIC Office Jurisdiction',
      applicantCategory: 'Social Category',
      pitchStage: 'Venture Growth Stage',
      preMoneyValuation: 'Pre-Money Valuation (₹)',
      currentMrr: 'Current Monthly MRR (₹)',
      companyLogo: 'Company Logo',
      productSample: 'Product Sample Image',
      facilityMachinery: 'Facility / Machinery Image',
      teamPhoto: 'Team Photo',
      savedApplied: '✓ Saved & Applied to Report',
      declarantName: 'Declarant Name',
      yourName: 'Your name',
      designation: 'Designation',
      place: 'Place',
      // Pricing plans
      entryPlanName: 'Entry Plan',
      entryPages: '15 – 20 Pages',
      entryProjects: 'Projects ₹5L – ₹25L',
      entryDesc: '16 Core Chapters, 5-Yr Financials, DSCR Analysis, Standard Bankable PDF.',
      corePlanName: 'Core Plan',
      corePages: '25 – 35 Pages',
      coreProjects: 'Projects ₹25L – ₹1Cr',
      coreDesc: '22 Chapters, 36-Mo Cash Flow, Tandon Assessment, Risk Matrix, Credit Appraisal Norms.',
      teamPlanName: 'Team Plan (Advanced)',
      teamPages: '35 – 45 Pages',
      teamProjects: 'Projects ₹1Cr – ₹5Cr',
      teamDesc: 'Advanced DPR with sensitivity stress tests, milestone roadmap, and subsidy claims.',
      mostUsedBadge: 'MOST USED',
      enterprisePlanName: 'Enterprise Bankable',
      enterprisePages: '45 – 60 Pages',
      enterpriseProjects: 'Projects ₹5Cr – ₹25Cr+',
      enterpriseDesc: '30 Chapters + 10 Annexure Schedules, 10-Yr Extended Modeling, Raw Material BOQ, ESG.',
      enterpriseBadge: 'ENTERPRISE GRADE',
      // Payment Order Summary
      orderSummaryTitle: 'Payment Order Summary',
      selectedServiceLabel: 'Selected DPR Service:',
      selectedPlanLabel: 'Selected Pricing Plan:',
      reportScopeLabel: 'Report Scope:',
      totalPayableLabel: 'Total Amount Payable:',
      secureGatewayNote: 'Secured by Razorpay — Supports UPI (Google Pay, PhonePe, Paytm), All Debit/Credit Cards & NetBanking',
      changePlanBtn: 'Change Plan',
      associatedVkf: 'Associated / Partnered with VKF',
      testRupeeMode: 'Test ₹1 Payment Mode (Live Razorpay Receipt Test)',
      paymentVerified: 'PAYMENT VERIFIED! YOUR REPORT IS FULLY UNLOCKED',
      downloadPdfUnlocked: 'DOWNLOAD FINAL PDF REPORT (UNLOCKED)',
      compilingPdf: 'Compiling PDF Engine Report...',
      payPdf: 'PAY & UNLOCK FINAL PDF REPORT',
      verifyUpi: 'Already completed payment on UPI / QR? Click here to verify & unlock report →',
      checkingPayment: 'Checking Live Razorpay Payment Status...',
    },
  },
  kn: {
    header: {
      progress: 'ಪ್ರಗತಿ',
      step: (curr, total) => `ಹಂತ ${curr}/${total}`,
      service: 'ಸೇವೆ:',
      services: {
        bank: 'ಬ್ಯಾಂಕ್ ಸಾಲ DPR',
        govt: 'ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ DPR',
        investor: 'ಹೂಡಿಕೆದಾರರ ಪಿಚ್ DPR',
      },
      depth: 'ವ್ಯಾಪ್ತಿ:',
      depths: {
        summary: 'ಸಂಕ್ಷಿಪ್ತ (10–15 ಪುಟಗಳು)',
        standard: 'ಪ್ರಮಾಣಿತ (20–30 ಪುಟಗಳು)',
        detailed: 'ವಿವರವಾದ (40–60 ಪುಟಗಳು)',
      },
    },
    autoFill: {
      title: 'ಸ್ಮಾರ್ಟ್ ದಾಖಲೆ ಸ್ವಯಂ ಭರ್ತಿ',
      desc: 'ಜಿಎಸ್‌ಟಿ ಪ್ರಮಾಣಪತ್ರ, ಉದ್ಯಮ್ ಎಂಎಸ್‌ಎಂಇ, ಕೊಟೇಶನ್‌ಗಳು, ಬ್ಯಾಂಕ್ ಸ್ಟೇಟ್‌ಮೆಂಟ್‌ಗಳು ಅಥವಾ ಪ್ರಸ್ತಾವನೆ ಪಿಡಿಎಫ್/ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ಇಂಜಿನ್ ನಿಮ್ಮ ಕ್ಷೇತ್ರಗಳನ್ನು ಕೆಳಗೆ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಭರ್ತಿ ಮಾಡುತ್ತದೆ!',
      resetBtn: 'ಫಾರ್ಮ್ ಮರುಹೊಂದಿಸಿ',
      uploadBtn: 'ದಾಖಲೆ ಅಪ್‌ಲೋಡ್ ಮೂಲಕ ಸ್ವಯಂ ಭರ್ತಿ',
      loadSampleBtn: '⚡ ಮಾದರಿ ಮಾಹಿತಿ ಭರ್ತಿ ಮಾಡಿ (ಪರೀಕ್ಷೆ & ಮುನ್ನೋಟ)',
      parsing: 'ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ & ಭರ್ತಿ ಮಾಡಲಾಗುತ್ತಿದೆ...',
    },
    progressive: {
      showAll: 'ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳನ್ನು ತೋರಿಸಿ',
      showSingle: 'ಪ್ರಶ್ನೆ-ವಾರು ತೋರಿಸಿ',
      questionOf: (curr, total) => `ಪ್ರಶ್ನೆ ${curr} / ${total}`,
      completed: (pct) => `${pct}% ಪೂರ್ಣಗೊಂಡಿದೆ`,
      prevQuestion: 'ಹಿಂದಿನ ಪ್ರಶ್ನೆ',
      nextQuestion: 'ಮುಂದಿನ ಪ್ರಶ್ನೆ',
      saveComplete: 'ವಿಭಾಗ ಉಳಿಸಿ & ಪೂರ್ಣಗೊಳಿಸಿ',
      saving: 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...',
      previous: 'ಹಿಂದಿನದು',
      saveContinue: 'ಉಳಿಸಿ & ಮುಂದುವರಿಯಿರಿ',
    },
    advisor: {
      title: 'DPR AI ಸಲಹೆಗಾರ',
      askQuery: 'ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ',
      placeholder: 'ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ (ಡೌನ್‌ಲೋಡ್, ತಿದ್ದುಪಡಿ, DSCR, PMEGP)...',
    },
    sectors: {
      0: {
        title: 'ವಿಭಾಗ 1: ಮೂಲ ಮಾಹಿತಿ ಮತ್ತು ವ್ಯಾಪಾರ ಗುರುತು',
        subtitle: 'ವ್ಯಾಪಾರ ನೋಂದಣಿ, ವಲಯ ಆಯ್ಕೆ ಮತ್ತು ಸ್ಥಳ ವಿವರಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ',
        questions: {
          sector_activity: { title: 'ವ್ಯಾಪಾರ ವಲಯ ಮತ್ತು ಚಟುವಟಿಕೆ ಆಯ್ಕೆ', desc: 'ಸ್ಕೀಮಾ ರೆಸಲ್ಯೂಶನ್‌ಗಾಗಿ ನಿಮ್ಮ ವಲಯ ಮತ್ತು ಉಪ-ಚಟುವಟಿಕೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ' },
          business_identity: { title: 'ವ್ಯಾಪಾರ ಗುರುತು ಮತ್ತು ಅವಲೋಕನ', desc: 'ಕಾನೂನುಬದ್ಧ ವ್ಯಾಪಾರದ ಹೆಸರು, ಗುಂಪಿನ ಹೆಸರು ಮತ್ತು ಕಾರ್ಯಾಚರಣೆಯ ವಿವರ' },
          tax_registrations: { title: 'ಸಂಸ್ಥೆ ಪ್ರಕಾರ & ತೆರಿಗೆ ನೋಂದಣಿ ವಿವರಗಳು', desc: 'ಸಂಸ್ಥೆಯ ಸಂವಿಧಾನ, CIN, GST, PAN, ಉದ್ಯಮ್, FSSAI ವಿವರಗಳು' },
          location_contact: { title: 'ಸ್ಥಳ, ಸಂಪರ್ಕ & ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರಗಳು', desc: 'ಗ್ರಾಮ/ಪಟ್ಟಣ, ಜಿಲ್ಲೆ, ರಾಜ್ಯ, ಸಂಪರ್ಕ ಮಾಹಿತಿ ಮತ್ತು ಬ್ಯಾಂಕಿಂಗ್ ವಿವರಗಳು' },
          track_specific_questions: { title: 'DPR ಸೇವಾ ನಿರ್ದಿಷ್ಟ ಪ್ರಶ್ನೆಗಳು', desc: 'ನಿಮ್ಮ ಆಯ್ಕೆಯ DPR ಸೇವೆಗೆ ಅನುಗುಣವಾದ ಪ್ರಶ್ನೆಗಳು' },
        },
      },
      1: {
        title: 'ವಿಭಾಗ 2: ಸದಸ್ಯರು ಮತ್ತು ಪ್ರವರ್ತಕರ ವಿವರ',
        subtitle: 'ಪ್ರವರ್ತಕರು, ವ್ಯವಸ್ಥಾಪಕ ನಿರ್ದೇಶಕರು ಮತ್ತು ನಿರ್ವಹಣಾ ತಂಡದ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ',
        questions: {
          promoters_list: { title: 'ಪ್ರವರ್ತಕರು ಮತ್ತು ನಿರ್ವಹಣಾ ತಂಡದ ಪಟ್ಟಿ', desc: 'ಸದಸ್ಯರು, ಹುದ್ದೆ, ವಿದ್ಯಾರ್ಹತೆ, ಅನುಭವ ಮತ್ತು ಲಿಂಗ ವಿವರಗಳನ್ನು ಸೇರಿಸಿ' },
        },
      },
      2: {
        title: 'ವಿಭಾಗ 3: ಉತ್ಪನ್ನ ಮತ್ತು ಉತ್ಪಾದನಾ ವಿವರಗಳು',
        subtitle: 'ಉತ್ಪಾದಿತ ಸರಕುಗಳು ಅಥವಾ ಸೇವೆಗಳು, ವಿಶೇಷತೆಗಳು ಮತ್ತು ಸ್ಥಾವರ ಸಾಮರ್ಥ್ಯವನ್ನು ವಿವರಿಸಿ',
        questions: {
          primary_product: { title: 'ಪ್ರಾಥಮಿಕ ಉತ್ಪನ್ನ / ಸೇವಾ ವಿವರಣೆ', desc: 'ಉತ್ಪನ್ನದ ವಿಶೇಷತೆಗಳು, ಉಪಯೋಗಗಳು ಮತ್ತು ಅನ್ವಯಗಳು' },
          capacity_pricing: { title: 'ಉತ್ಪಾದನಾ ಸಾಮರ್ಥ್ಯ ಮತ್ತು ಬೆಲೆ ನಿಗದಿ', desc: 'ವಾರ್ಷಿಕ ಸ್ಥಾಪಿತ ಸಾಮರ್ಥ್ಯ, ಸಾಮರ್ಥ್ಯ ಬಳಕೆ ಮತ್ತು ಪ್ರತಿ ಯೂನಿಟ್ ಬೆಲೆ' },
          raw_materials_cost: { title: 'ಪ್ರಮುಖ ಕಚ್ಚಾ ಸಾಮಗ್ರಿಗಳು ಮತ್ತು ಮಾಸಿಕ ವೆಚ್ಚ', desc: 'ಅಗತ್ಯವಿರುವ ಕಚ್ಚಾ ವಸ್ತುಗಳು, ಪೂರೈಕೆ ಮೂಲ ಮತ್ತು ಮಾಸಿಕ ವೆಚ್ಚ' },
          usp: { title: 'ಮೌಲ್ಯ ಪ್ರಸ್ತಾಪ ಮತ್ತು ಸ್ಪರ್ಧಾತ್ಮಕ USP', desc: 'ವಿಶಿಷ್ಟ ಮಾರಾಟ ಅಂಶಗಳು, ಮಾರುಕಟ್ಟೆ ಪ್ರಯೋಜನ ಮತ್ತು ಗುಣಮಟ್ಟದ ವ್ಯತ್ಯಾಸಗಳು' },
        },
      },
      3: {
        title: 'ವಿಭಾಗ 4: ಯಂತ್ರೋಪಕರಣಗಳು ಮತ್ತು ಸಲಕರಣೆಗಳ ಪಟ್ಟಿ',
        subtitle: 'ಸ್ಥಾವರ ಯಂತ್ರೋಪಕರಣಗಳು, ದೇಶೀಯ/ಆಮದು ಉಪಕರಣಗಳು ಮತ್ತು ಸಿವಿಲ್ ಕಾಮಗಾರಿಗಳನ್ನು ನಮೂದಿಸಿ',
        questions: {
          machinery_table: { title: 'ಸ್ಥಾವರ ಯಂತ್ರೋಪಕರಣಗಳು ಮತ್ತು ಬಂಡವಾಳ ಸಲಕರಣೆಗಳು', desc: 'ಪ್ರಮುಖ ಯಂತ್ರೋಪಕರಣಗಳು, ಸಾಮರ್ಥ್ಯ, ಪೂರೈಕೆದಾರರು ಮತ್ತು ಖರೀದಿ ವೆಚ್ಚ' },
          supplier_details: { title: 'ಯಂತ್ರೋಪಕರಣಗಳ ಕೊಟೇಶನ್ ಮತ್ತು ಮಾರಾಟಗಾರರ ವಿವರ', desc: 'ಪೂರೈಕೆದಾರರ ಹೆಸರು, ಕೊಟೇಶನ್ ಸ್ಥಿತಿ ಮತ್ತು ವಿತರಣಾ ಸಮಯ' },
        },
      },
      4: {
        title: 'ವಿಭಾಗ 5: ಮಾರುಕಟ್ಟೆ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಸ್ಪರ್ಧಾತ್ಮಕ ಅಧ್ಯಯನ',
        subtitle: 'ಗುರಿ ಗ್ರಾಹಕರು, ಬೇಡಿಕೆ-ಪೂರೈಕೆ ಅಂತರ, ಬೆಲೆ ನಿಗದಿ ಮತ್ತು ವಿತರಣಾ ಮಾದರಿ',
        questions: {
          target_customers: { title: 'ಗುರಿ ಗ್ರಾಹಕರ ವರ್ಗಗಳು', desc: 'ಚಿಲ್ಲರೆ, ಬಿ2ಬಿ, ಸಗಟು, ಸರ್ಕಾರಿ ಮತ್ತು ಸಾಂಸ್ಥಿಕ ಖರೀದಿದಾರರು' },
          sales_channels: { title: 'ಮಾರಾಟ ಮತ್ತು ವಿತರಣಾ ಚಾನೆಲ್‌ಗಳು', desc: 'ನೇರ ಮಾರುಕಟ್ಟೆ, ಡೀಲರ್ ಜಾಲ, ಇ-ಕಾಮರ್ಸ್ ಮತ್ತು ರಫ್ತು ಚಾನೆಲ್‌ಗಳು' },
          competitors: { title: 'ಪ್ರಮುಖ ಸ್ಪರ್ಧಿಗಳು ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಪಾಲು', desc: 'ಸ್ಥಳೀಯ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಸ್ಪರ್ಧಿಗಳು, ಮಾರುಕಟ್ಟೆ ಪಾಲು ಮತ್ತು ಬೆಲೆ ಹೋಲಿಕೆ' },
        },
      },
      5: {
        title: 'ವಿಭಾಗ 6: ಮಾನವ ಸಂಪನ್ಮೂಲ ಮತ್ತು ಸಿಬ್ಬಂದಿ ವೆಚ್ಚಗಳು',
        subtitle: 'ತಾಂತ್ರಿಕ ಸಿಬ್ಬಂದಿ, ಆಡಳಿತ ತಂಡ, ನುರಿತ ಕಾರ್ಮಿಕರು ಮತ್ತು ಮಾಸಿಕ ವೇತನ ಬಜೆಟ್',
        questions: {
          hr_breakdown: { title: 'ಸಿಬ್ಬಂದಿ ವಿವರ ಮತ್ತು ಮಾಸಿಕ ವೇತನ ವೇಳಾಪಟ್ಟಿ', desc: 'ವ್ಯವಸ್ಥಾಪಕರು, ಮೇಲ್ವಿಚಾರಕರು, ನುರಿತ, ಕುಶಲಕರ್ಮಿಗಳು ಮತ್ತು ಆಡಳಿತ ಸಿಬ್ಬಂದಿ' },
        },
      },
      6: {
        title: 'ವಿಭಾಗ 7: ಹಣಕಾಸು ಅಂದಾಜುಗಳು ಮತ್ತು ಬಂಡವಾಳ ವೆಚ್ಚ',
        subtitle: 'ಒಟ್ಟು ಯೋಜನಾ ವೆಚ್ಚ, ಪ್ರವರ್ತಕರ ಪಾಲು, ಬ್ಯಾಂಕ್ ಸಾಲ ಮತ್ತು ಸಬ್ಸಿಡಿ ಮೊತ್ತ',
        questions: {
          project_cost_capex: { title: 'ಒಟ್ಟು ಯೋಜನಾ ವೆಚ್ಚದ ವಿವರ (CAPEX)', desc: 'ಭೂಮಿ, ಸಿವಿಲ್ ಕಾಮಗಾರಿ, ಯಂತ್ರೋಪಕರಣಗಳು, ದುಡಿಯುವ ಬಂಡವಾಳ ಮತ್ತು ಅನಿಶ್ಚಿತ ವೆಚ್ಚ' },
          means_of_finance: { title: 'ಹಣಕಾಸು ಮೂಲಗಳು ಮತ್ತು ಬಂಡವಾಳ ರಚನೆ', desc: 'ಪ್ರವರ್ತಕರ ಇಕ್ವಿಟಿ, ಬ್ಯಾಂಕ್ ಮುದ್ದತು ಸಾಲ, ದುಡಿಯುವ ಬಂಡವಾಳ ಸಿಸಿ ಮತ್ತು ಸಬ್ಸಿಡಿ' },
        },
      },
      7: {
        title: 'ವಿಭಾಗ 8: 5-ವರ್ಷಗಳ ಆರ್ಥಿಕ ಮುನ್ಸೂಚನೆ',
        subtitle: 'ಅಂದಾಜು ಆದಾಯ, ಕಾರ್ಯಾಚರಣಾ ಲಾಭ, DSCR, ಬ್ರೇಕ್-ಈವನ್ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಮರುಪಾವತಿ ವೇಳಾಪಟ್ಟಿ',
        questions: {
          financial_projections: { title: '5-ವರ್ಷಗಳ ಆರ್ಥಿಕ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಕಾರ್ಯಸಾಧ್ಯತೆ', desc: 'ಆದಾಯ ಮುನ್ಸೂಚನೆ, ಒಟ್ಟು ಲಾಭ, EBITDA, DSCR ಮತ್ತು ಬ್ರೇಕ್-ಈವನ್ ಪಾಯಿಂಟ್' },
        },
      },
      8: {
        title: 'ವಿಭಾಗ 9: ಮೂಲಸೌಕರ್ಯ ಮತ್ತು ಸೌಲಭ್ಯಗಳ ಅಗತ್ಯತೆಗಳು',
        subtitle: 'ಭೂಮಾಲೀಕತ್ವ, ಕಾರ್ಖಾನೆ ಶೆಡ್, ವಿದ್ಯುತ್ ಲೋಡ್, ನೀರಿನ ಬಳಕೆ ಮತ್ತು ತ್ಯಾಜ್ಯ ಸಂಸ್ಕರಣೆ',
        questions: {
          workspace_area: { title: 'ಭೂಮಿ ಮತ್ತು ಸಿವಿಲ್ ಕಾಮಗಾರಿ / ಕಟ್ಟಡ ಪ್ರದೇಶ', desc: 'ಒಟ್ಟು ಭೂಮಿ ವಿಸ್ತೀರ್ಣ, ಶೆಡ್ ನಿರ್ಮಿತ ಪ್ರದೇಶ, ಮಾಲೀಕತ್ವದ ಪ್ರಕಾರ ಮತ್ತು ಗುತ್ತಿಗೆ ನಿಯಮಗಳು' },
          water_rent_timeline: { title: 'ವಿದ್ಯುತ್, ನೀರು, ಬಾಡಿಗೆ ಮತ್ತು ವಾಣಿಜ್ಯ ಕಾರ್ಯಾಚರಣೆಯ ವೇಳಾಪಟ್ಟಿ', desc: 'ಸಂಪರ್ಕಿತ ವಿದ್ಯುತ್ ಲೋಡ್, ದೈನಂದಿನ ನೀರಿನ ಅಗತ್ಯ, ಬಾಡಿಗೆ ಮತ್ತು COD ದಿನಾಂಕ' },
        },
      },
      9: {
        title: 'ವಿಭಾಗ 10: SWOT ವಿಶ್ಲೇಷಣೆ',
        subtitle: 'ಆಂತರಿಕ ಸಾಮರ್ಥ್ಯಗಳು, ಕಾರ್ಯಾಚರಣೆಯ ದೌರ್ಬಲ್ಯಗಳು, ಮಾರುಕಟ್ಟೆ ಅವಕಾಶಗಳು ಮತ್ತು ಬಾಹ್ಯ ಅಪಾಯಗಳು',
        questions: {
          strengths_weaknesses: { title: 'ಸಾಮರ್ಥ್ಯಗಳು ಮತ್ತು ದೌರ್ಬಲ್ಯಗಳ ವಿಶ್ಲೇಷಣೆ', desc: 'ಆಂತರಿಕ ಕಾರ್ಯಾಚರಣೆಯ ಅನುಕೂಲಗಳು ಮತ್ತು ನಿರ್ಬಂಧಗಳು' },
          opportunities_threats: { title: 'ಅವಕಾಶಗಳು ಮತ್ತು ಅಪಾಯಗಳ ವಿಶ್ಲೇಷಣೆ', desc: 'ಬಾಹ್ಯ ಮಾರುಕಟ್ಟೆ ಅವಕಾಶಗಳು ಮತ್ತು ಸಂಭಾವ್ಯ ವ್ಯಾಪಾರ ಅಪಾಯಗಳು' },
        },
      },
      10: {
        title: 'ವಿಭಾಗ 11: ಸಾಮಾಜಿಕ ಮತ್ತು ಪರಿಸರ ಪ್ರಭಾವ',
        subtitle: 'ಸ್ಥಳೀಯ ಸಮುದಾಯ, ಮಹಿಳೆಯರು ಮತ್ತು ಯುವಕರಿಗೆ ಉದ್ಯೋಗ ಸೃಷ್ಟಿ, ಜೊತೆಗೆ ಹಸಿರು ಉಪಕ್ರಮಗಳು',
        questions: {
          social_impact: { title: 'ನೇರ ಉದ್ಯೋಗ ಸೃಷ್ಟಿ', desc: 'ಸ್ಥಳೀಯ ನಿವಾಸಿಗಳು, ಮಹಿಳೆಯರು ಮತ್ತು ಯುವಕರಿಗೆ ಸೃಷ್ಟಿಸಲಾದ ಉದ್ಯೋಗಗಳ ಸಂಖ್ಯೆ' },
          environmental_impact: { title: 'ಪರಿಸರ ಸುಸ್ಥಿರತೆ ಮತ್ತು ಕೌಶಲ್ಯ ತರಬೇತಿ', desc: 'ಪರಿಸರ ಸ್ನೇಹಿ ಉತ್ಪಾದನೆ, ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ ಮತ್ತು ಸಿಬ್ಬಂದಿ ತರಬೇತಿ' },
          employment_breakdown: { title: 'ನೇರ ಉದ್ಯೋಗ ಸೃಷ್ಟಿ', desc: 'ಸ್ಥಳೀಯ ನಿವಾಸಿಗಳು, ಮಹಿಳೆಯರು ಮತ್ತು ಯುವಕರಿಗೆ ಸೃಷ್ಟಿಸಲಾದ ಉದ್ಯೋಗಗಳ ಸಂಖ್ಯೆ' },
          eco_practices: { title: 'ಪರಿಸರ ಸುಸ್ಥಿರತೆ ಮತ್ತು ಕೌಶಲ್ಯ ತರಬೇತಿ', desc: 'ಪರಿಸರ ಸ್ನೇಹಿ ಉತ್ಪಾದನೆ, ತ್ಯಾಜ್ಯ ನಿರ್ವಹಣೆ ಮತ್ತು ಸಿಬ್ಬಂದಿ ತರಬೇತಿ' },
        },
      },
      11: {
        title: 'ವಿಭಾಗ 12: ಕ್ರೆಡಿಟ್ ಸ್ಥಿತಿ ಮತ್ತು ಸಾಲದ ಇತಿಹಾಸ',
        subtitle: 'CIBIL ಪ್ರೊಫೈಲ್, ಹಿಂದಿನ ಸಾಲದ ಇತಿಹಾಸ, ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಹೊಣೆಗಾರಿಕೆಗಳು ಅಥವಾ ಯೋಜನೆ ವಿವರ',
        questions: {
          credit_facilities: { title: 'ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಸಾಲ ಸೌಲಭ್ಯಗಳು & ಇತಿಹಾಸ', desc: 'ಬ್ಯಾಂಕ್/NBFC ಗಳೊಂದಿಗಿನ ಹಿಂದಿನ ಸಾಲಗಳು, ಮರುಪಾವತಿ ದಾಖಲೆ ಮತ್ತು CIBIL ಸ್ಕೋರ್' },
          bank_accounts: { title: 'ಪ್ರಾಥಮಿಕ ಬ್ಯಾಂಕಿಂಗ್ ಸಂಬಂಧಗಳು & ವಹಿವಾಟು', desc: 'ಚಾಲ್ತಿ ಖಾತೆ ಬ್ಯಾಂಕ್, ಸರಾಸರಿ ಮಾಸಿಕ ಬ್ಯಾಲೆನ್ಸ್ ಮತ್ತು ವಹಿವಾಟು' },
          credit_standing: { title: 'ಕ್ರೆಡಿಟ್ ಸ್ಕೋರ್ ಮತ್ತು ಹಿಂದಿನ ಸಾಲದ ಇತಿಹಾಸ', desc: 'CIBIL ಸ್ಕೋರ್, ಹಿಂದಿನ ಸಾಲದ ಅನುಭವ ಮತ್ತು ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಬಾಕಿ ಮೊತ್ತ' },
        },
      },
      12: {
        title: 'ವಿಭಾಗ 13: ವರದಿ ಚಿತ್ರಗಳು ಮತ್ತು ಫೋಟೋಗಳ ಅಪ್‌ಲೋಡ್',
        subtitle: 'ಕಂಪನಿಯ ಲೋಗೋ, ಉತ್ಪನ್ನ ಮಾದರಿ ಫೋಟೋ, ಸ್ಥಾವರ ಯಂತ್ರೋಪಕರಣಗಳು ಮತ್ತು ಪ್ರವರ್ತಕರ ತಂಡದ ಚಿತ್ರಗಳು',
        questions: {
          site_photos: { title: 'ಸಂಸ್ಥೆ ಮತ್ತು ಉತ್ಪನ್ನಗಳ ಫೋಟೋಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ', desc: 'ಲೋಗೋ, ಉತ್ಪನ್ನ ಮಾದರಿಗಳು, ಘಟಕದ ಯಂತ್ರಗಳು ಮತ್ತು ತಂಡದ ಫೋಟೋಗಳು' },
          images_upload: { title: 'ಸಂಸ್ಥೆ ಮತ್ತು ಉತ್ಪನ್ನಗಳ ಫೋಟೋಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ', desc: 'ಲೋಗೋ, ಉತ್ಪನ್ನ ಮಾದರಿಗಳು, ಘಟಕದ ಯಂತ್ರಗಳು ಮತ್ತು ತಂಡದ ಫೋಟೋಗಳು' },
        },
      },
      13: {
        title: 'ವಿಭಾಗ 14: ಶಾಸನಬದ್ಧ ಘೋಷಣೆ ಮತ್ತು ಅಂತಿಮ ವರದಿ ತಯಾರಿಕೆ',
        subtitle: 'ಅಧಿಕೃತ ಸಹಿದಾರರ ವಿವರಗಳು, ವರದಿಯ ಗಾತ್ರದ ಆಯ್ಕೆ ಮತ್ತು ಅಧಿಕೃತ ಪಿಡಿಎಫ್ (PDF) ಸಂಕಲನ',
        questions: {
          declaration_submission: { title: 'ಅಧಿಕೃತ ಸಹಿದಾರರ ಘೋಷಣೆ', desc: 'ಘೋಷಕರ ಹೆಸರು, ಹುದ್ದೆ ಮತ್ತು ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ' },
          declaration_statement: { title: 'ಅಧಿಕೃತ ಸಹಿದಾರರ ಘೋಷಣೆ', desc: 'ಘೋಷಕರ ಹೆಸರು, ಹುದ್ದೆ ಮತ್ತು ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ' },
          report_depth: { title: 'ಉದ್ದೇಶಿತ DPR ವರದಿಯ ಪುಟಗಳ ಸಂಖ್ಯೆ ಮತ್ತು ಆಳ', desc: 'ಸ್ಟ್ಯಾಂಡರ್ಡ್ (15-20 ಪುಟಗಳು), ಸಮಗ್ರ (25-35 ಪುಟಗಳು), ಅಥವಾ ಎಂಟರ್‌ಪ್ರೈಸ್ (40-60 ಪುಟಗಳು) ಆಯ್ಕೆಮಾಡಿ' },
          approve_compile: { title: 'ಬಳಕೆದಾರರ ಅನುಮೋದನೆ ಮತ್ತು ವರದಿ ತಯಾರಿಕೆ', desc: 'ಪ್ರಕಟಣೆಗೆ ಸಿದ್ಧವಾಗಿರುವ ಬ್ಯಾಂಕಿಂಗ್ ಗುಣಮಟ್ಟದ ಅಧಿಕೃತ ಪಿಡಿಎಫ್ (PDF) ವರದಿಯನ್ನು ರಚಿಸಿ' },
        },
      },
    },
    s1Fields: {
      q1_title: 'ವ್ಯಾಪಾರ ವಲಯ ಮತ್ತು ಚಟುವಟಿಕೆ ಆಯ್ಕೆ',
      q1_desc: 'ಸ್ಕೀಮಾ ರೆಸಲ್ಯೂಶನ್‌ಗಾಗಿ ನಿಮ್ಮ ವಲಯ ಮತ್ತು ಉಪ-ಚಟುವಟಿಕೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      sectorLabel: '1. ವ್ಯಾಪಾರ ವಲಯ',
      activityLabel: '2. ವ್ಯವಹಾರ ಚಟುವಟಿಕೆ / ಉಪ-ವಲಯ',
      classificationLabel: '3. ಯೋಜನೆಯ ವರ್ಗೀಕರಣ',
      otherSector: 'ಇತರೆ (ಕಸ್ಟಮ್ ವಲಯವನ್ನು ನಮೂದಿಸಿ)',
      otherActivity: 'ಇತರೆ (ಕಸ್ಟಮ್ ಚಟುವಟಿಕೆಯನ್ನು ನಮೂದಿಸಿ)',
      otherClassification: 'ಇತರೆ (ಕಸ್ಟಮ್ ವರ್ಗೀಕರಣವನ್ನು ನಮೂದಿಸಿ)',
      q2_title: 'ವ್ಯಾಪಾರ ಗುರುತು ಮತ್ತು ಅವಲೋಕನ',
      q2_desc: 'ಕಾನೂನುಬದ್ಧ ವ್ಯಾಪಾರದ ಹೆಸರು, ಗುಂಪಿನ ಹೆಸರು ಮತ್ತು ಕಾರ್ಯಾಚರಣೆಯ ವಿವರ',
      businessName: 'ವ್ಯಾಪಾರದ ಹೆಸರು',
      groupName: 'ಗುಂಪು / ಸಂಸ್ಥೆಯ ಹೆಸರು',
      businessDesc: 'ವ್ಯಾಪಾರದ ಸಂಕ್ಷಿಪ್ತ ಅವಲೋಕನ',
      q3_title: 'ಸಂಸ್ಥೆ ಪ್ರಕಾರ & ತೆರಿಗೆ ನೋಂದಣಿ ವಿವರಗಳು',
      q3_desc: 'ಸಂಸ್ಥೆಯ ಸಂವಿಧಾನ (ಪ್ರೊಪ್ರೈಟರ್‌ಶಿಪ್/ಲಿಮಿಟೆಡ್), CIN, GST, PAN, ಉದ್ಯಮ್, FSSAI',
      entityType: 'ಸಂಸ್ಥೆಯ ಪ್ರಕಾರ',
      cin: 'CIN ಸಂಖ್ಯೆ',
      gst: 'GST ಸಂಖ್ಯೆ',
      pan: 'PAN ಸಂಖ್ಯೆ',
      udyam: 'MSME / ಉದ್ಯಮ್ ಸಂಖ್ಯೆ',
      fssai: 'FSSAI ಪರವಾನಗಿ ಸಂಖ್ಯೆ',
      q4_title: 'ಸ್ಥಳ, ಸಂಪರ್ಕ & ಬ್ಯಾಂಕ್ ಖಾತೆ ವಿವರಗಳು',
      q4_desc: 'ಗ್ರಾಮ/ಪಟ್ಟಣ, ಜಿಲ್ಲೆ, ರಾಜ್ಯ, ಸಂಪರ್ಕ ಮಾಹಿತಿ ಮತ್ತು ಬ್ಯಾಂಕಿಂಗ್ ವಿವರಗಳು',
      village: 'ಗ್ರಾಮ / ಪಟ್ಟಣ',
      district: 'ಜಿಲ್ಲೆ',
      state: 'ರಾಜ್ಯ',
      contactName: 'ಸಂಪರ್ಕ ವ್ಯಕ್ತಿಯ ಹೆಸರು',
      contactNumber: 'ಸಂಪರ್ಕ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
      email: 'ಇಮೇಲ್ ವಿಳಾಸ',
      bankName: 'ಬ್ಯಾಂಕಿನ ಹೆಸರು',
      bankBranch: 'ಬ್ಯಾಂಕ್ ಶಾಖೆ',
      ifsc: 'IFSC ಕೋಡ್',
      q5_title: 'DPR ಸೇವಾ ನಿರ್ದಿಷ್ಟ ಪ್ರಶ್ನೆಗಳು',
      q5_desc: 'ನಿಮ್ಮ ಆಯ್ಕೆಯ DPR ಸೇವೆಗೆ ಅನುಗುಣವಾದ ಪ್ರಶ್ನೆಗಳು',
      primaryBank: 'ಪ್ರಮುಖ ಸಾಲ ನೀಡುವ ಬ್ಯಾಂಕ್',
      loanScheme: 'ಬ್ಯಾಂಕ್ ಸಾಲದ ಯೋಜನೆ',
      collateral: 'ನೀಡಲಾದ ಭದ್ರತೆ / ಕೊಲ್ಯಾಟರಲ್',
      moratorium: 'ಮರುಪಾವತಿ ಮೊರಟೋರಿಯಂ (ತಿಂಗಳುಗಳಲ್ಲಿ)',
      tenure: 'ಮರುಪಾವತಿ ಅವಧಿ (ವರ್ಷಗಳಲ್ಲಿ)',
      interestRate: 'ಬಡ್ಡಿ ದರ % (ವಾರ್ಷಿಕ)',
      targetGovtScheme: 'ಉದ್ದೇಶಿತ ಸರ್ಕಾರಿ ಯೋಜನೆ',
      nodalAgency: 'ನೋಡಲ್ ಅನುಷ್ಠಾನ ಸಂಸ್ಥೆ',
      locationSubsidy: 'ಸ್ಥಳ ಸಬ್ಸಿಡಿ ವರ್ಗ',
      socialCategory: 'ಸಾಮಾಜಿಕ ಫಲಾನುಭವಿ ವರ್ಗ',
      edpStatus: 'EDP ತರಬೇತಿ ಸ್ಥಿತಿ',
      subsidyClaim: 'ಸಬ್ಸಿಡಿ ಮಾರ್ಜಿನ್ ಕ್ಲೈಮ್ (₹)',
      investmentAsk: 'ಅಪೇಕ್ಷಿತ ಹೂಡಿಕೆ ಮೊತ್ತ (₹)',
      equityOffered: 'ನೀಡಲಾದ ಇಕ್ವಿಟಿ ಪಾಲು (%)',
      valuation: 'ಪ್ರೀ-ಮನಿ ಮೌಲ್ಯಮಾಪನ (₹)',
    },
    masterSectors: {
      manufacturing: 'ಉತ್ಪಾದನೆ (Manufacturing)',
      food_processing: 'ಆಹಾರ ಸಂಸ್ಕರಣೆ (Food Processing)',
      agriculture: 'ಕೃಷಿ ಮತ್ತು ಕೃಷಿ ಸಂಬಂಧಿತ (Agriculture)',
      textile: 'ಜವಳಿ ಮತ್ತು ಸಿದ್ಧ ಉಡುಪುಗಳು (Textile)',
      healthcare: 'ಆರೋಗ್ಯ ಮತ್ತು ಫಾರ್ಮಾ (Healthcare)',
      it_services: 'ಮಾಹಿತಿ ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಸೇವೆಗಳು (IT & ITES)',
      renewable_energy: 'ನವೀಕರಿಸಬಹುದಾದ ಇಂಧನ & ಇವಿ (Renewable Energy)',
      tourism: 'ಪ್ರವಾಸೋದ್ಯಮ ಮತ್ತು ಆತಿಥ್ಯ (Tourism)',
      services: 'ಸೇವೆಗಳು ಮತ್ತು ಉದ್ಯಮ (Services)',
      infrastructure: 'ಮೂಲಸೌಕರ್ಯ ಮತ್ತು ಲಾಜಿಸ್ಟಿಕ್ಸ್ (Infrastructure)',
      other: 'ಇತರೆ (ಕಸ್ಟಮ್ ವಲಯವನ್ನು ನಮೂದಿಸಿ)',
    },
    masterActivities: {
      cnc_machining: 'ನಿಖರ ಸಿಎನ್‌ಸಿ & ಶೀಟ್ ಮೆಟಲ್ ಘಟಕಗಳು',
      spice_processing: 'ಮಸಾಲೆ ಸಂಸ್ಕರಣೆ ಮತ್ತು ಪ್ಯಾಕೇಜಿಂಗ್',
      dairy_processing: 'ಡೈರಿ ಪಾಶ್ಚರೀಕರಣ ಮತ್ತು ಮೌಲ್ಯವರ್ಧನೆ',
      garment_manufacturing: 'ಸಿದ್ಧ ಉಡುಪು ಮತ್ತು ಕೆಲಸದ ಉಡುಪು ಘಟಕ',
      solar_installation: 'ವಾಣಿಜ್ಯ ಸೌರ ವಿದ್ಯುತ್ & ಮೈಕ್ರೋಗ್ರಿಡ್',
      software_services: 'ಕ್ಲೌಡ್ ಸಾಫ್ಟ್‌ವೇರ್ ಮತ್ತು ಎಂಟರ್‌ಪ್ರೈಸ್ ಪರಿಹಾರಗಳು',
      cold_storage_hub: 'ಬಹು-ಸರಕು ಕೋಲ್ಡ್ ಸ್ಟೋರೇಜ್ ಗೋದಾಮು',
      other: 'ಇತರೆ (ಕಸ್ಟಮ್ ಚಟುವಟಿಕೆಯನ್ನು ನಮೂದಿಸಿ)',
    },
    masterProjectTypes: {
      new_project: 'ಹೊಸ ಗ್ರೀನ್‌ಫೀಲ್ಡ್ ಯೋಜನೆ (New Project)',
      expansion: 'ವಿಸ್ತರಣೆ ಮತ್ತು ಸಾಮರ್ಥ್ಯ ಹೆಚ್ಚಳ (Expansion)',
      modernization: 'ಆಧುನೀಕರಣ ಮತ್ತು ತಂತ್ರಜ್ಞಾನ ನವೀಕರಣ (Modernization)',
      diversification: 'ಉತ್ಪನ್ನ ವೈವಿಧ್ಯೀಕರಣ (Diversification)',
      startup: 'ಟೆಕ್ ಸ್ಟಾರ್ಟಪ್ / ನವೀನ ಉದ್ಯಮ (Startup)',
      other: 'ಇತರೆ (ಕಸ್ಟಮ್ ವರ್ಗೀಕರಣ)',
    },
    entityTypes: {
      Proprietorship: 'ಏಕಮಾತ್ರ ಮಾಲೀಕತ್ವ (Proprietorship)',
      Partnership: 'ಪಾಲುದಾರಿಕೆ (Partnership)',
      LLP: 'ಸೀಮಿತ ಹೊಣೆಗಾರಿಕೆ ಪಾಲುದಾರಿಕೆ (LLP)',
      'Private Limited Company': 'ಪ್ರೈವೇಟ್ ಲಿಮಿಟೆಡ್ ಕಂಪನಿ (Pvt Ltd)',
      JLG: 'ಜಂಟಿ ಹೊಣೆಗಾರಿಕೆ ಗುಂಪು (JLG)',
      SHG: 'ಸ್ವಸಹಾಯ ಗುಂಪು (SHG)',
    },
    collateralOptions: {
      'CGTMSE Guarantee (Collateral Free)': 'CGTMSE ಗ್ಯಾರಂಟಿ (ಭದ್ರತೆ ಮುಕ್ತ)',
      'Property Mortgage (Residential/Commercial)': 'ಆಸ್ತಿ ಅಡಮಾನ (ವಸತಿ/ವಾಣಿಜ್ಯ)',
      'Fixed Deposit Pledged': 'ಸ್ಥಿರ ಠೇವಣಿ ಮೇಲಾಧಾರ',
      'Industrial Shed Land Mortgage': 'ಕೈಗಾರಿಕಾ ಶೆಡ್ ಭೂಮಿ ಅಡಮಾನ',
    },
    govtSchemeOptions: {
      'PMEGP (Prime Minister Employment Generation Programme)': 'PMEGP (ಪ್ರಧಾನ ಮಂತ್ರಿ ಉದ್ಯೋಗ ಸೃಷ್ಟಿ ಕಾರ್ಯಕ್ರಮ)',
      'MUDRA Loan Scheme': 'ಮುದ್ರಾ ಸಾಲ ಯೋಜನೆ (MUDRA)',
      'PMFME (PM Formalisation of Micro Food Processing)': 'PMFME (ಆಹಾರ ಸಂಸ್ಕರಣಾ ಕಿರು ಉದ್ಯಮ ಯೋಜನೆ)',
      'KVIC / KVIB Rural Enterprise Subsidy': 'KVIC / KVIB ಗ್ರಾಮೀಣ ಉದ್ಯಮ ಸಬ್ಸಿಡಿ',
      'District Industries Centre (DIC) State Subsidy': 'ಜಿಲ್ಲಾ ಕೈಗಾರಿಕಾ ಕೇಂದ್ರ (DIC) ರಾಜ್ಯ ಸಬ್ಸಿಡಿ',
    },
    nodalAgencyOptions: {
      'KVIC (Khadi & Village Industries Commission)': 'KVIC (ಖಾದಿ ಮತ್ತು ಗ್ರಾಮೋದ್ಯೋಗ ಆಯೋಗ)',
      'KVIB (Karnataka State KVIB)': 'KVIB (ಕರ್ನಾಟಕ ರಾಜ್ಯ ಖಾದಿ ಮತ್ತು ಗ್ರಾಮೋದ್ಯೋಗ ಮಂಡಳಿ)',
      'DIC (District Industries Centre)': 'DIC (ಜಿಲ್ಲಾ ಕೈಗಾರಿಕಾ ಕೇಂದ್ರ)',
    },
    locationOptions: {
      'Rural Area (35% Special / 25% General Subsidy)': 'ಗ್ರಾಮೀಣ ಪ್ರದೇಶ (35% ವಿಶೇಷ / 25% ಸಾಮಾನ್ಯ ಸಬ್ಸಿಡಿ)',
      'Urban Area (25% Special / 15% General Subsidy)': 'ನಗರ ಪ್ರದೇಶ (25% ವಿಶೇಷ / 15% ಸಾಮಾನ್ಯ ಸಬ್ಸಿಡಿ)',
    },
    socialOptions: {
      'Special Category (Women / SC / ST / OBC / Ex-Servicemen)': 'ವಿಶೇಷ ವರ್ಗ (ಮಹಿಳೆಯರು / SC / ST / OBC / ಮಾಜಿ ಸೈನಿಕರು)',
      'General Category': 'ಸಾಮಾನ್ಯ ವರ್ಗ (General)',
    },
    edpOptions: {
      'Completed (10-Day Online/Offline Training Certificate)': 'ಪೂರ್ಣಗೊಂಡಿದೆ (10-ದಿನಗಳ ತರಬೇತಿ ಪ್ರಮಾಣಪತ್ರ)',
      'Registered / Pending Training Slot': 'ನೋಂದಾಯಿಸಲಾಗಿದೆ / ತರಬೇತಿ ಬಾಕಿ ಇದೆ',
      'Exempted (Technical Degree / Diploma Holder)': 'ವಿನಾಯಿತಿ ಪಡೆದಿದೆ (ತಾಂತ್ರಿಕ ಪದವಿ/ಡಿಪ್ಲೊಮಾ)',
    },
    labels: {
      category: 'ವರ್ಗ',
      numberOfPersons: 'ವ್ಯಕ್ತಿಗಳ ಸಂಖ್ಯೆ',
      monthlySalary: 'ಮಾಸಿಕ ವೇತನ (₹)',
      monthlyCost: 'ಮಾಸಿಕ ವೆಚ್ಚ (₹)',
      management: 'ವ್ಯವಸ್ಥಾಪಕ ಮಂಡಳಿ',
      supervisory: 'ಮೇಲ್ವಿಚಾರಕರು',
      skilledWorkers: 'ನುರಿತ ಕಾರ್ಮಿಕರು',
      unskilledWorkers: 'ಕುಶಲವಲ್ಲದ ಕಾರ್ಮಿಕರು',
      administrative: 'ಆಡಳಿತ ಸಿಬ್ಬಂದಿ',
      total: 'ಒಟ್ಟು (TOTAL)',
      persons: 'ವ್ಯಕ್ತಿಗಳು',
      perMonth: '/ ತಿಂಗಳಿಗೆ',
      landCost: 'ಭೂಮಿ ವೆಚ್ಚ (₹)',
      buildingCost: 'ಕಟ್ಟಡ ನಿರ್ಮಾಣ ವೆಚ್ಚ (₹)',
      machineryTotal: 'ಪ್ಲಾಂಟ್ & ಯಂತ್ರೋಪಕರಣಗಳ ಒಟ್ಟು ವೆಚ್ಚ (₹)',
      furnitureCost: 'ಪೀಠೋಪಕರಣಗಳು ಮತ್ತು ಫಿಟ್ಟಿಂಗ್‌ಗಳು (₹)',
      workingCapital: 'ದುಡಿಯುವ ಬಂಡವಾಳ (₹)',
      otherCost: 'ಇತರೆ ಪ್ರಾಥಮಿಕ ವೆಚ್ಚಗಳು (₹)',
      totalProjectCost: 'ಒಟ್ಟು ಯೋಜನಾ ವೆಚ್ಚ (TOTAL PROJECT COST)',
      promoterContribution: 'ಪ್ರವರ್ತಕರ ಪಾಲು (₹)',
      bankLoanRequired: 'ಅಗತ್ಯವಿರುವ ಬ್ಯಾಂಕ್ ಸಾಲ (₹)',
      subsidyGrant: 'ಸಬ್ಸಿಡಿ / ಅನುದಾನ (₹)',
      particulars: 'ವಿವರಗಳು',
      capacityUtilization: 'ಸಾಮರ್ಥ್ಯ ಬಳಕೆ (%)',
      interestExpense: 'ಬಡ್ಡಿ ವೆಚ್ಚ (₹)',
      depreciation: 'ಸವಕಳಿ ವೆಚ್ಚ (₹)',
      year1: 'ವರ್ಷ 1',
      year2: 'ವರ್ಷ 2',
      year3: 'ವರ್ಷ 3',
      year4: 'ವರ್ಷ 4',
      year5: 'ವರ್ಷ 5',
      workspaceStatus: 'ಕಾರ್ಯಸ್ಥಳದ ಸ್ಥಿತಿ',
      builtupArea: 'ನಿರ್ಮಿತ ವಿಸ್ತೀರ್ಣ (ಚದರ ಅಡಿ)',
      powerRequired: 'ವಿದ್ಯುತ್ ಅಗತ್ಯತೆ (HP / KVA)',
      waterRequired: 'ನೀರಿನ ಅಗತ್ಯತೆ (ಲೀಟರ್/ದಿನ)',
      monthlyRent: 'ಮಾಸಿಕ ಬಾಡಿಗೆ (₹)',
      timeToStartOps: 'ಕಾರ್ಯಾಚರಣೆ ಆರಂಭಿಸಲು ಸಮಯ (ತಿಂಗಳುಗಳಲ್ಲಿ)',
      ownedRented: 'ಸ್ವಂತ / ಬಾಡಿಗೆ',
      strengths: 'ಸಾಮರ್ಥ್ಯಗಳು (Strengths)',
      weaknesses: 'ದೌರ್ಬಲ್ಯಗಳು (Weaknesses)',
      opportunities: 'ಅವಕಾಶಗಳು (Opportunities)',
      threats: 'ಅಪಾಯಗಳು (Threats)',
      localEmployment: 'ಸ್ಥಳೀಯ ಉದ್ಯೋಗ (ವ್ಯಕ್ತಿಗಳು)',
      womenEmployment: 'ಮಹಿಳಾ ಉದ್ಯೋಗ (ವ್ಯಕ್ತಿಗಳು)',
      youthEmployment: 'ಯುವಕರ ಉದ್ಯೋಗ (ವ್ಯಕ್ತಿಗಳು)',
      ecoPractices: 'ಪರಿಸರ ಸ್ನೇಹಿ ಪದ್ಧತಿಗಳು (ಹೌದು/ಇಲ್ಲ)',
      skillTraining: 'ಕೌಶಲ್ಯ ತರಬೇತಿ ನೀಡಲಾಗುವುದೇ (ಹೌದು/ಇಲ್ಲ)',
      ecoDescription: 'ಪರಿಸರ ಸ್ನೇಹಿ ಉಪಕ್ರಮಗಳ ವಿವರಣೆ',
      cibilScore: 'CIBIL ಸ್ಕೋರ್',
      takenLoanBefore: 'ಹಿಂದೆ ಸಾಲ ಪಡೆದಿದ್ದೀರಾ? (ಹೌದು/ಇಲ್ಲ)',
      existingLoanAmount: 'ಅಸ್ತಿತ್ವದಲ್ಲಿರುವ ಸಾಲದ ಮೊತ್ತ (₹)',
      outstandingAmount: 'ಬಾಕಿ ಇರುವ ಮೊತ್ತ (₹)',
      defaultHistory: 'ಡೀಫಾಲ್ಟ್ ಇತಿಹಾಸವಿದೆಯೇ (ಹೌದು/ಇಲ್ಲ)',
      targetScheme: 'ಉದ್ದೇಶಿತ ಯೋಜನೆ',
      dicJurisdiction: 'DIC ಕಚೇರಿ ವ್ಯಾಪ್ತಿ',
      applicantCategory: 'ಸಾಮಾಜಿಕ ವರ್ಗ',
      pitchStage: 'ಉದ್ಯಮ ಬೆಳವಣಿಗೆಯ ಹಂತ',
      preMoneyValuation: 'ಪ್ರೀ-ಮನಿ ಮೌಲ್ಯಮಾಪನ (₹)',
      currentMrr: 'ಪ್ರಸ್ತುತ ಮಾಸಿಕ MRR (₹)',
      companyLogo: 'ಸಂಸ್ಥೆಯ ಲೋಗೋ',
      productSample: 'ಉತ್ಪನ್ನ ಮಾದರಿ ಚಿತ್ರ',
      facilityMachinery: 'ಸ್ಥಾವರ / ಯಂತ್ರೋಪಕರಣ ಚಿತ್ರ',
      teamPhoto: 'ತಂಡದ ಫೋಟೋ',
      savedApplied: '✓ ವರದಿಗೆ ಯಶಸ್ವಿಯಾಗಿ ಅನ್ವಯಿಸಲಾಗಿದೆ',
      declarantName: 'ಘೋಷಕರ ಹೆಸರು',
      yourName: 'ನಿಮ್ಮ ಹೆಸರು',
      designation: 'ಹುದ್ದೆ',
      place: 'ಸ್ಥಳ',
      // Pricing plans
      entryPlanName: 'ಪ್ರಾರಂಭಿಕ ಪ್ಲಾನ್ (Entry)',
      entryPages: '15 – 20 ಪುಟಗಳು',
      entryProjects: 'ಯೋಜನೆಗಳು ₹5 ಲಕ್ಷ – ₹25 ಲಕ್ಷ',
      entryDesc: '16 ಪ್ರಮುಖ ಅಧ್ಯಾಯಗಳು, 5-ವರ್ಷಗಳ ಹಣಕಾಸು ವಿವರ, DSCR ವಿಶ್ಲೇಷಣೆ, ಪ್ರಮಾಣಿತ ಬ್ಯಾಂಕೇಬಲ್ PDF.',
      corePlanName: 'ಮುಖ್ಯ ಪ್ಲಾನ್ (Core)',
      corePages: '25 – 35 ಪುಟಗಳು',
      coreProjects: 'ಯೋಜನೆಗಳು ₹25 ಲಕ್ಷ – ₹1 ಕೋಟಿ',
      coreDesc: '22 ಅಧ್ಯಾಯಗಳು, 36-ತಿಂಗಳ ನಗದು ಹರಿವು, ಟಂಡನ್ ಮೌಲ್ಯಮಾಪನ, ಕ್ರೆಡಿಟ್ ಅಪ್ರೈಸಲ್ ಮಾನದಂಡಗಳು.',
      teamPlanName: 'ಟೀಮ್ ಪ್ಲಾನ್ (Advanced)',
      teamPages: '35 – 45 ಪುಟಗಳು',
      teamProjects: 'ಯೋಜನೆಗಳು ₹1 ಕೋಟಿ – ₹5 ಕೋಟಿ',
      teamDesc: 'ಸೂಕ್ಷ್ಮತೆ ಒತ್ತಡ ಪರೀಕ್ಷೆಗಳು, ಮೈಲಿಗಲ್ಲು ಯೋಜನೆ ಮತ್ತು ಸಬ್ಸಿಡಿ ವಿವರಗಳೊಂದಿಗೆ ಮುಂದುವರಿದ ಡಿಪಿಆರ್.',
      mostUsedBadge: 'ಹೆಚ್ಚು ಜನಪ್ರಿಯ',
      enterprisePlanName: 'ಎಂಟರ್‌ಪ್ರೈಸ್ ಬ್ಯಾಂಕೇಬಲ್',
      enterprisePages: '45 – 60 ಪುಟಗಳು',
      enterpriseProjects: 'ಯೋಜನೆಗಳು ₹5 ಕೋಟಿ – ₹25 ಕೋಟಿ+',
      enterpriseDesc: '30 ಅಧ್ಯಾಯಗಳು + 10 ಹಣಕಾಸು ಅನುಬಂಧಗಳು, 10-ವರ್ಷಗಳ ಮುನ್ನೋಟ, BOQ, ESG.',
      enterpriseBadge: 'ಸಾಂಸ್ಥಿಕ ಶ್ರೇಣಿ',
      // Payment Order Summary
      orderSummaryTitle: 'ಪಾವತಿ ಆದೇಶದ ಸಾರಾಂಶ',
      selectedServiceLabel: 'ಆಯ್ಕೆಮಾಡಿದ ಡಿಪಿಆರ್ ಸೇವೆ:',
      selectedPlanLabel: 'ಆಯ್ಕೆಮಾಡಿದ ದರಪಟ್ಟಿ ಪ್ಲಾನ್:',
      reportScopeLabel: 'ವರದಿಯ ವ್ಯಾಪ್ತಿ:',
      totalPayableLabel: 'ಪಾವತಿಸಬೇಕಾದ ಒಟ್ಟು ಮೊತ್ತ:',
      secureGatewayNote: 'ರೇಜರ್‌ಪೇ ಸುರಕ್ಷತೆ — ಯುಪಿಐ (Google Pay, PhonePe, Paytm), ಎಲ್ಲಾ ಡೆಬಿಟ್/ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್‌ಗಳು & ನೆಟ್‌ಬ್ಯಾಂಕಿಂಗ್ ಬೆಂಬಲಿತವಾಗಿದೆ',
      changePlanBtn: 'ಪ್ಲಾನ್ ಬದಲಾಯಿಸಿ',
      associatedVkf: 'VKF ನೊಂದಿಗೆ ಸಂಯೋಜಿತ / ಪಾಲುದಾರಿಕೆ',
      testRupeeMode: 'ಪ್ರಾಯೋಗಿಕ ₹1 ಪಾವತಿ ವಿಧಾನ (ಲೈವ್ ರೇಜರ್‌ಪೇ ರಶೀದಿ ಪರೀಕ್ಷೆ)',
      paymentVerified: 'ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ! ನಿಮ್ಮ ವರದಿ ಸಂಪೂರ್ಣವಾಗಿ ಅನ್‌ಲಾಕ್ ಆಗಿದೆ',
      downloadPdfUnlocked: 'ಅಂತಿಮ PDF ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ (ಅನ್‌ಲಾಕ್ ಆಗಿದೆ)',
      compilingPdf: 'PDF ಎಂಜಿನ್ ವರದಿ ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...',
      payPdf: 'ಪಾವತಿಸಿ & ಅಂತಿಮ PDF ವರದಿ ಅನ್‌ಲಾಕ್ ಮಾಡಿ',
      verifyUpi: 'ಈಗಾಗಲೇ ಯುಪಿಐ / ಕ್ಯೂಆರ್ ಮೂಲಕ ಪಾವತಿಸಿದ್ದೀರಾ? ಪರಿಶೀಲಿಸಲು ಮತ್ತು ವರದಿ ಅನ್‌ಲಾಕ್ ಮಾಡಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ →',
      checkingPayment: 'ಲೈವ್ ರೇಜರ್‌ಪೇ ಪಾವತಿ ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    },
  },
  hi: {
    header: {
      progress: 'प्रगति',
      step: (curr, total) => `चरण ${curr}/${total}`,
      service: 'सेवा:',
      services: {
        bank: 'बैंक ऋण DPR',
        govt: 'सरकारी सब्सिडी DPR',
        investor: 'निवेशक पिच DPR',
      },
      depth: 'विस्तार:',
      depths: {
        summary: 'संक्षिप्त (10–15 पृष्ठ)',
        standard: 'मानक (20–30 पृष्ठ)',
        detailed: 'विस्तृत (40–60 पृष्ठ)',
      },
    },
    autoFill: {
      title: 'स्मार्ट दस्तावेज़ ऑटो-फ़िल',
      desc: 'जीएसटी प्रमाणपत्र, उद्यम एमएसएमई, कोटेशन, बैंक विवरण या प्रस्ताव पीडीएफ/छवि अपलोड करें। इंजन नीचे आपके फ़ील्ड को स्वचालित रूप से भर देगा!',
      resetBtn: 'फ़ॉर्म रीसेट करें',
      uploadBtn: 'ऑटो-फ़िल के लिए दस्तावेज़ अपलोड करें',
      loadSampleBtn: '⚡ नमूना डेटा भरें (परीक्षण एवं पूर्वावलोकन)',
      parsing: 'विश्लेषण एवं ऑटो-फ़िल जारी है...',
    },
    progressive: {
      showAll: 'सभी प्रश्न दिखाएं',
      showSingle: 'बारी-बारी से प्रश्न दिखाएं',
      questionOf: (curr, total) => `प्रश्न ${curr} / ${total}`,
      completed: (pct) => `${pct}% पूर्ण`,
      prevQuestion: 'पिछला प्रश्न',
      nextQuestion: 'अगला प्रश्न',
      saveComplete: 'विभाग सहेजें और पूरा करें',
      saving: 'सहेजा जा रहा है...',
      previous: 'पिछला',
      saveContinue: 'सहेजें और आगे बढ़ें',
    },
    advisor: {
      title: 'DPR AI सलाहकार',
      askQuery: 'कोई भी प्रश्न पूछें',
      placeholder: 'कोई भी प्रश्न पूछें (डाउनलोड, संपादन, DSCR, PMEGP)...',
    },
    sectors: {
      0: {
        title: 'भाग 1: बुनियादी जानकारी और व्यावसायिक पहचान',
        subtitle: 'व्यावसायिक पंजीकरण, क्षेत्र चयन और स्थान विवरण पूरा करें',
        questions: {
          sector_activity: { title: 'व्यापार क्षेत्र और गतिविधि चयन', desc: 'स्कीमा रिज़ॉल्यूशन के लिए अपना क्षेत्र और उप-गतिविधि चुनें' },
          business_identity: { title: 'व्यावसायिक पहचान और विवरण', desc: 'कानूनी व्यावसायिक नाम, समूह का नाम और परिचालन विवरण' },
          tax_registrations: { title: 'संस्था प्रकार एवं कर पंजीकरण विवरण', desc: 'संस्था का संविधान, CIN, GST, PAN, उद्यम, FSSAI विवरण' },
          location_contact: { title: 'स्थान, संपर्क एवं बैंक खाता विवरण', desc: 'गांव/शहर, जिला, राज्य, संपर्क जानकारी और बैंकिंग विवरण' },
          track_specific_questions: { title: 'DPR सेवा विशिष्ट प्रश्न', desc: 'आपकी चयनित DPR सेवा के अनुसार विशेष प्रश्न' },
        },
      },
      1: {
        title: 'भाग 2: सदस्य एवं प्रमोटर प्रोफाइल',
        subtitle: 'प्रमोटरों, प्रबंध निदेशकों और प्रमुख प्रबंधन टीम का विवरण दर्ज करें',
        questions: {
          promoters_list: { title: 'प्रमोटर एवं प्रबंधन टीम अनुसूची', desc: 'सदस्य, पद, योग्यता, अनुभव और लिंग का विवरण जोड़ें' },
        },
      },
      2: {
        title: 'भाग 3: उत्पाद एवं उत्पादन विवरण',
        subtitle: 'निर्मित सामान या सेवाएं, विनिर्देश और संयंत्र क्षमता परिभाषित करें',
        questions: {
          primary_product: { title: 'प्राथमिक उत्पाद / सेवा विवरण', desc: 'उत्पाद विनिर्देश, उपयोग और अनुप्रयोग' },
          capacity_pricing: { title: 'उत्पादन क्षमता और मूल्य निर्धारण', desc: 'वार्षिक स्थापित क्षमता, क्षमता उपयोग और प्रति इकाई मूल्य' },
          raw_materials_cost: { title: 'प्रमुख कच्चा माल और मासिक लागत', desc: 'आवश्यक कच्चा माल, स्रोत और मासिक खर्च' },
          usp: { title: 'मूल्य प्रस्ताव और प्रतिस्पर्धी USP', desc: 'अनोखे विक्रय बिंदु, बाजार लाभ और गुणवत्ता अंतर' },
        },
      },
      3: {
        title: 'भाग 4: मशीनरी एवं उपकरण अनुसूची',
        subtitle: 'संयंत्र मशीनरी, स्वदेशी/आयातित उपकरण और निर्माण कार्य निर्दिष्ट करें',
        questions: {
          machinery_table: { title: 'संयंत्र मशीनरी एवं पूंजीगत उपकरण अनुसूची', desc: 'प्रमुख मशीनरी, क्षमता, आपूर्तिकर्ता और खरीद लागत' },
          supplier_details: { title: 'मशीनरी कोटेशन एवं विक्रेता विवरण', desc: 'आपूर्तिकर्ता का नाम, कोटेशन स्थिति और डिलीवरी समय' },
        },
      },
      4: {
        title: 'भाग 5: बाजार विश्लेषण एवं प्रतिस्पर्धी अध्ययन',
        subtitle: 'लक्षित ग्राहक वर्ग, मांग-आपूर्ति अंतर, मूल्य निर्धारण और वितरण मॉडल',
        questions: {
          target_customers: { title: 'लक्षित ग्राहक वर्ग', desc: 'खुदरा, बी2बी, थोक, सरकारी और संस्थागत खरीदार' },
          sales_channels: { title: 'बिक्री और वितरण चैनल', desc: 'प्रत्यक्ष विपणन, डीलर नेटवर्क, ई-कॉमर्स और निर्यात चैनल' },
          competitors: { title: 'प्रमुख प्रतिस्पर्धी और बाजार हिस्सेदारी', desc: 'स्थानीय और क्षेत्रीय प्रतिस्पर्धी, बाजार हिस्सेदारी और मूल्य तुलना' },
        },
      },
      5: {
        title: 'भाग 6: मानव संसाधन और जनशक्ति खर्च',
        subtitle: 'तकनीकी कर्मचारी, प्रशासनिक टीम, कुशल श्रमिक और मासिक वेतन बजट',
        questions: {
          hr_breakdown: { title: 'जनशक्ति विवरण और मासिक वेतन अनुसूची', desc: 'प्रबंधन, पर्यवेक्षक, कुशल, अकुशल और प्रशासनिक कर्मचारी' },
        },
      },
      6: {
        title: 'भाग 7: वित्तीय अनुमान और पूंजी परिव्यय',
        subtitle: 'कुल परियोजना लागत, प्रमोटर इक्विटी, बैंक ऋण और सब्सिडी राशि',
        questions: {
          project_cost_capex: { title: 'कुल परियोजना लागत विवरण (CAPEX)', desc: 'भूमि, निर्माण, मशीनरी, कार्यशील पूंजी और आकस्मिक व्यय' },
          means_of_finance: { title: 'वित्तपोषण के साधन और पूंजी संरचना', desc: 'प्रमोटर इक्विटी, बैंक मियादी ऋण, कार्यशील पूंजी सीसी और पूंजीगत सब्सिडी' },
        },
      },
      7: {
        title: 'भाग 8: 5-वर्षीय वित्तीय अनुमान',
        subtitle: 'अनुमानित राजस्व, परिचालन लाभ, DSCR, ब्रेक-ईवन विश्लेषण और पुनर्भुगतान अनुसूची',
        questions: {
          financial_projections: { title: '5-वर्षीय वित्तीय अनुमान एवं व्यवहार्यता', desc: 'राजस्व पूर्वानुमान, सकल लाभ, EBITDA, DSCR और ब्रेक-ईवन बिंदु' },
        },
      },
      8: {
        title: 'भाग 9: बुनियादी ढांचा और उपयोगिता आवश्यकताएं',
        subtitle: 'भूमि स्वामित्व, फैक्ट्री शेड, बिजली लोड, पानी की खपत और अपशिष्ट उपचार',
        questions: {
          workspace_area: { title: 'भूमि और निर्माण कार्य / निर्मित क्षेत्र', desc: 'कुल भूमि क्षेत्र, शेड निर्मित क्षेत्र, स्वामित्व प्रकार और पट्टा शर्तें' },
          water_rent_timeline: { title: 'बिजली, पानी, किराया और वाणिज्यिक संचालन समयरेखा', desc: 'कनेक्टेड बिजली लोड, दैनिक पानी की आवश्यकता, किराया और COD तिथि' },
        },
      },
      9: {
        title: 'भाग 10: स्वाट (SWOT) विश्लेषण',
        subtitle: 'आंतरिक ताकत, परिचालन कमजोरियां, बाजार के अवसर और बाहरी खतरे',
        questions: {
          strengths_weaknesses: { title: 'ताकत और कमजोरियों का विश्लेषण', desc: 'आंतरिक परिचालन लाभ और सीमाएं' },
          opportunities_threats: { title: 'अवसरों और खतरों का विश्लेषण', desc: 'बाहरी बाजार के अवसर और संभावित व्यावसायिक जोखिम' },
        },
      },
      10: {
        title: 'भाग 11: सामाजिक और पर्यावरणीय प्रभाव',
        subtitle: 'स्थानीय समुदाय, महिलाओं और युवाओं के लिए रोजगार सृजन, साथ ही हरित पहल',
        questions: {
          social_impact: { title: 'प्रत्यक्ष रोजगार सृजन', desc: 'स्थानीय निवासियों, महिलाओं और युवाओं के लिए सृजित नौकरियों की संख्या' },
          environmental_impact: { title: 'पर्यावरण स्थिरता और कौशल प्रशिक्षण', desc: 'पर्यावरण-अनुकूल निर्माण, अपशिष्ट प्रबंधन और कर्मचारी प्रशिक्षण' },
          employment_breakdown: { title: 'प्रत्यक्ष रोजगार सृजन', desc: 'स्थानीय निवासियों, महिलाओं और युवाओं के लिए सृजित नौकरियों की संख्या' },
          eco_practices: { title: 'पर्यावरण स्थिरता और कौशल प्रशिक्षण', desc: 'पर्यावरण-अनुकूल निर्माण, अपशिष्ट प्रबंधन और कर्मचारी प्रशिक्षण' },
        },
      },
      11: {
        title: 'भाग 12: साख स्थिति और ऋण इतिहास',
        subtitle: 'CIBIL प्रोफाइल, पिछला ऋण इतिहास, मौजूदा देनदारियां या योजना विवरण',
        questions: {
          credit_facilities: { title: 'मौजूदा ऋण सुविधाएं एवं इतिहास', desc: 'बैंकों/एनबीएफसी के साथ मौजूदा ऋण, पुनर्भुगतान रिकॉर्ड और सिबिल स्कोर' },
          bank_accounts: { title: 'प्राथमिक बैंकिंग संबंध एवं कारोबार', desc: 'चालू खाता बैंक, औसत मासिक शेष और टर्नओवर' },
          credit_standing: { title: 'क्रेडिट स्कोर और पिछला ऋण इतिहास', desc: 'सिबिल स्कोर, पिछला उधार अनुभव और मौजूदा ऋण शेष' },
        },
      },
      12: {
        title: 'भाग 13: रिपोर्ट तस्वीरें एवं चित्र अपलोड',
        subtitle: 'कंपनी लोगो, उत्पाद नमूना फोटो, संयंत्र मशीनरी और प्रमोटर टीम की तस्वीरें',
        questions: {
          site_photos: { title: 'कंपनी एवं उत्पाद तस्वीरें अपलोड करें', desc: 'लोगो, उत्पाद तस्वीरें, संयंत्र सुविधा और प्रबंधन टीम की तस्वीरें' },
          images_upload: { title: 'कंपनी एवं उत्पाद तस्वीरें अपलोड करें', desc: 'लोगो, उत्पाद तस्वीरें, संयंत्र सुविधा और प्रबंधन टीम की तस्वीरें' },
        },
      },
      13: {
        title: 'भाग 14: वैधानिक घोषणा और अंतिम रिपोर्ट उत्पादन',
        subtitle: 'अधिकृत हस्ताक्षरकर्ता विवरण, रिपोर्ट प्रारूप का चयन और आधिकारिक पीडीएफ (PDF) संकलन',
        questions: {
          declaration_submission: { title: 'अधिकृत हस्ताक्षरकर्ता घोषणा', desc: 'घोषक का नाम, पद और स्थान दर्ज करें' },
          declaration_statement: { title: 'अधिकृत हस्ताक्षरकर्ता घोषणा', desc: 'घोषक का नाम, पद और स्थान दर्ज करें' },
          report_depth: { title: 'लक्षित DPR रिपोर्ट की लंबाई और विस्तार', desc: 'मानक (15-20 पृष्ठ), व्यापक (25-35 पृष्ठ), या उद्यम (40-60 पृष्ठ) चुनें' },
          approve_compile: { title: 'उपयोगकर्ता अनुमोदन एवं रिपोर्ट उत्पादन', desc: 'प्रकाशन हेतु तैयार आधिकारिक एवं प्रमाणिक पीडीएफ (PDF) रिपोर्ट तैयार करें' },
        },
      },
    },
    s1Fields: {
      q1_title: 'व्यापार क्षेत्र और गतिविधि चयन',
      q1_desc: 'स्कीमा रिज़ॉल्यूशन के लिए अपना क्षेत्र और उप-गतिविधि चुनें',
      sectorLabel: '1. व्यवसाय क्षेत्र',
      activityLabel: '2. व्यावसायिक गतिविधि / उप-क्षेत्र',
      classificationLabel: '3. परियोजना वर्गीकरण',
      otherSector: 'अन्य (कस्टम क्षेत्र निर्दिष्ट करें)',
      otherActivity: 'अन्य (कस्टम गतिविधि निर्दिष्ट करें)',
      otherClassification: 'अन्य (कस्टम वर्गीकरण निर्दिष्ट करें)',
      q2_title: 'व्यावसायिक पहचान और विवरण',
      q2_desc: 'कानूनी व्यावसायिक नाम, समूह का नाम और परिचालन विवरण',
      businessName: 'व्यवसाय का नाम',
      groupName: 'समूह / संगठन का नाम',
      businessDesc: 'व्यवसाय का संक्षिप्त विवरण',
      q3_title: 'संस्था प्रकार एवं कर पंजीकरण विवरण',
      q3_desc: 'संस्था का संविधान (प्रोपराइटरशिप/लिमिटेड), CIN, GST, PAN, उद्यम, FSSAI',
      entityType: 'संस्था का प्रकार',
      cin: 'CIN संख्या',
      gst: 'GST संख्या',
      pan: 'PAN संख्या',
      udyam: 'MSME / उद्यम संख्या',
      fssai: 'FSSAI लाइसेंस संख्या',
      q4_title: 'स्थान, संपर्क एवं बैंक खाता विवरण',
      q4_desc: 'गांव/शहर, जिला, राज्य, संपर्क जानकारी और बैंकिंग विवरण',
      village: 'गांव / शहर',
      district: 'जिला',
      state: 'राज्य',
      contactName: 'संपर्क व्यक्ति का नाम',
      contactNumber: 'संपर्क मोबाइल नंबर',
      email: 'ईमेल पता',
      bankName: 'बैंक का नाम',
      bankBranch: 'बैंक शाखा',
      ifsc: 'IFSC कोड',
      q5_title: 'DPR सेवा विशिष्ट प्रश्न',
      q5_desc: 'आपकी चयनित DPR सेवा के अनुसार विशेष प्रश्न',
      primaryBank: 'प्रमुख ऋणदाता बैंक',
      loanScheme: 'बैंक ऋण योजना',
      collateral: 'प्रस्तावित सुरक्षा / संपार्श्विक',
      moratorium: 'पुनर्भुगतान अधिस्थगन (महीनों में)',
      tenure: 'पुनर्भुगतान अवधि (वर्षों में)',
      interestRate: 'ब्याज दर % (वार्षिक)',
      targetGovtScheme: 'लक्षित सरकारी योजना',
      nodalAgency: 'नोडल कार्यान्वयन एजेंसी',
      locationSubsidy: 'स्थान सब्सिडी श्रेणी',
      socialCategory: 'सामाजिक लाभार्थी श्रेणी',
      edpStatus: 'EDP प्रशिक्षण स्थिति',
      subsidyClaim: 'सब्सिडी मार्जिन दावा (₹)',
      investmentAsk: 'वांछित निवेश राशि (₹)',
      equityOffered: 'प्रस्तावित इक्विटी हिस्सा (%)',
      valuation: 'प्री-मनी मूल्यांकन (₹)',
    },
    masterSectors: {
      manufacturing: 'विनिर्माण (Manufacturing)',
      food_processing: 'खाद्य प्रसंस्करण (Food Processing)',
      agriculture: 'कृषि एवं संबद्ध (Agriculture)',
      textile: 'वस्त्र एवं परिधान (Textile)',
      healthcare: 'स्वास्थ्य एवं फार्मा (Healthcare)',
      it_services: 'सूचना प्रौद्योगिकी (IT & ITES)',
      renewable_energy: 'नवीकरणीय ऊर्जा एवं ईवी (Renewable Energy)',
      tourism: 'पर्यटन एवं आतिथ्य (Tourism)',
      services: 'सेवाएं एवं उद्यम (Services)',
      infrastructure: 'बुनियादी ढांचा एवं लॉजिस्टिक्स (Infrastructure)',
      other: 'अन्य (कस्टम क्षेत्र निर्दिष्ट करें)',
    },
    masterActivities: {
      cnc_machining: 'प्रिसिजन सीएनसी और शीट मेटल कंपोनेंट्स',
      spice_processing: 'मसाला प्रसंस्करण एवं पैकेजिंग',
      dairy_processing: 'डेयरी पाश्चुरीकरण एवं मूल्य संवर्धन',
      garment_manufacturing: 'तैयार परिधान एवं कार्य वस्त्र इकाई',
      solar_installation: 'वाणिज्यिक सौर ऊर्जा एवं माइक्रोग्रिड',
      software_services: 'क्लाउड सॉफ्टवेयर एवं एंटरप्राइज सॉल्यूशंस',
      cold_storage_hub: 'मल्टी-कमोडिटी कोल्ड स्टोरेज वेयरहाउस',
      other: 'अन्य (कस्टम गतिविधि निर्दिष्ट करें)',
    },
    masterProjectTypes: {
      new_project: 'नई ग्रीनफील्ड परियोजना (New Project)',
      expansion: 'विस्तार एवं क्षमता उन्नयन (Expansion)',
      modernization: 'आधुनिकीकरण एवं प्रौद्योगिकी उन्नयन (Modernization)',
      diversification: 'उत्पाद विविधीकरण (Diversification)',
      startup: 'टेक स्टार्टअप / नवाचार उद्यम (Startup)',
      other: 'अन्य (कस्टम वर्गीकरण)',
    },
    entityTypes: {
      Proprietorship: 'एकल स्वामित्व (Proprietorship)',
      Partnership: 'साझेदारी (Partnership)',
      LLP: 'सीमित देयता साझेदारी (LLP)',
      'Private Limited Company': 'प्राइवेट लिमिटेड कंपनी (Pvt Ltd)',
      JLG: 'संयुक्त देयता समूह (JLG)',
      SHG: 'स्वयं सहायता समूह (SHG)',
    },
    collateralOptions: {
      'CGTMSE Guarantee (Collateral Free)': 'CGTMSE गारंटी (संपार्श्विक मुक्त)',
      'Property Mortgage (Residential/Commercial)': 'संपत्ति बंधक (आवासीय/वाणिज्यिक)',
      'Fixed Deposit Pledged': 'सावधि जमा गिरवी',
      'Industrial Shed Land Mortgage': 'औद्योगिक शेड भूमि बंधक',
    },
    govtSchemeOptions: {
      'PMEGP (Prime Minister Employment Generation Programme)': 'PMEGP (प्रधानमंत्री रोजगार सृजन कार्यक्रम)',
      'MUDRA Loan Scheme': 'मुद्रा ऋण योजना (MUDRA)',
      'PMFME (PM Formalisation of Micro Food Processing)': 'PMFME (खाद्य प्रसंस्करण सूक्ष्म उद्यम योजना)',
      'KVIC / KVIB Rural Enterprise Subsidy': 'KVIC / KVIB ग्रामीण उद्यम सब्सिडी',
      'District Industries Centre (DIC) State Subsidy': 'जिला उद्योग केंद्र (DIC) राज्य सब्सिडी',
    },
    nodalAgencyOptions: {
      'KVIC (Khadi & Village Industries Commission)': 'KVIC (खादी और ग्रामोद्योग आयोग)',
      'KVIB (Karnataka State KVIB)': 'KVIB (कर्नाटक राज्य खादी और ग्रामोद्योग बोर्ड)',
      'DIC (District Industries Centre)': 'DIC (जिला उद्योग केंद्र)',
    },
    locationOptions: {
      'Rural Area (35% Special / 25% General Subsidy)': 'ग्रामीण क्षेत्र (35% विशेष / 25% सामान्य सब्सिडी)',
      'Urban Area (25% Special / 15% General Subsidy)': 'शहरी क्षेत्र (25% विशेष / 15% सामान्य सब्सिडी)',
    },
    socialOptions: {
      'Special Category (Women / SC / ST / OBC / Ex-Servicemen)': 'विशेष श्रेणी (महिलाएं / SC / ST / OBC / पूर्व सैनिक)',
      'General Category': 'सामान्य श्रेणी (General)',
    },
    edpOptions: {
      'Completed (10-Day Online/Offline Training Certificate)': 'पूर्ण (10-दिवसीय प्रशिक्षण प्रमाणपत्र)',
      'Registered / Pending Training Slot': 'पंजीकृत / प्रशिक्षण स्लॉट लंबित',
      'Exempted (Technical Degree / Diploma Holder)': 'छूट प्राप्त (तकनीकी डिग्री/डिप्लोमा धारक)',
    },
    labels: {
      category: 'श्रेणी',
      numberOfPersons: 'व्यक्तियों की संख्या',
      monthlySalary: 'मासिक वेतन (₹)',
      monthlyCost: 'मासिक लागत (₹)',
      management: 'प्रबंधन',
      supervisory: 'पर्यवेक्षी',
      skilledWorkers: 'कुशल श्रमिक',
      unskilledWorkers: 'अकुशल श्रमिक',
      administrative: 'प्रशासनिक',
      total: 'कुल (TOTAL)',
      persons: 'व्यक्ति',
      perMonth: '/ माह',
      landCost: 'भूमि लागत (₹)',
      buildingCost: 'भवन निर्माण लागत (₹)',
      machineryTotal: 'संयंत्र और मशीनरी कुल (₹)',
      furnitureCost: 'फर्नीचर और फिक्स्चर (₹)',
      workingCapital: 'कार्यशील पूंजी (₹)',
      otherCost: 'अन्य प्रारंभिक व्यय (₹)',
      totalProjectCost: 'कुल परियोजना लागत (TOTAL PROJECT COST)',
      promoterContribution: 'प्रमोटर अंशदान (₹)',
      bankLoanRequired: 'आवश्यक बैंक ऋण (₹)',
      subsidyGrant: 'सब्सिडी / अनुदान (₹)',
      particulars: 'विवरण',
      capacityUtilization: 'क्षमता उपयोग (%)',
      interestExpense: 'ब्याज व्यय (₹)',
      depreciation: 'मूल्यह्रास (₹)',
      year1: 'वर्ष 1',
      year2: 'वर्ष 2',
      year3: 'वर्ष 3',
      year4: 'वर्ष 4',
      year5: 'वर्ष 5',
      workspaceStatus: 'कार्यस्थल की स्थिति',
      builtupArea: 'निर्मित क्षेत्र (वर्ग फीट)',
      powerRequired: 'आवश्यक बिजली (HP / KVA)',
      waterRequired: 'आवश्यक पानी (लीटर/दिन)',
      monthlyRent: 'मासिक किराया (₹)',
      timeToStartOps: 'संचालन शुरू करने में समय (माह)',
      ownedRented: 'स्वामित्व / किराए पर',
      strengths: 'ताकत (Strengths)',
      weaknesses: 'कमजोरियां (Weaknesses)',
      opportunities: 'अवसर (Opportunities)',
      threats: 'खतरे (Threats)',
      localEmployment: 'स्थानीय रोजगार (व्यक्ति)',
      womenEmployment: 'महिला रोजगार (व्यक्ति)',
      youthEmployment: 'युवा रोजगार (व्यक्ति)',
      ecoPractices: 'पर्यावरण-अनुकूल प्रथाएं (हाँ/नहीं)',
      skillTraining: 'कौशल प्रशिक्षण प्रदान किया गया (हाँ/नहीं)',
      ecoDescription: 'पर्यावरण-अनुकूल पहलों का विवरण',
      cibilScore: 'सिबिल (CIBIL) स्कोर',
      takenLoanBefore: 'क्या पहले ऋण लिया है? (हाँ/नहीं)',
      existingLoanAmount: 'मौजूदा ऋण राशि (₹)',
      outstandingAmount: 'बकाया राशि (₹)',
      defaultHistory: 'डिफ़ॉल्ट इतिहास (हाँ/नहीं)',
      targetScheme: 'लक्षित योजना',
      dicJurisdiction: 'DIC कार्यालय क्षेत्राधिकार',
      applicantCategory: 'सामाजिक श्रेणी',
      pitchStage: 'उद्यम विकास चरण',
      preMoneyValuation: 'प्री-मनी मूल्यांकन (₹)',
      currentMrr: 'वर्तमान मासिक MRR (₹)',
      companyLogo: 'कंपनी का लोगो',
      productSample: 'उत्पाद नमूना छवि',
      facilityMachinery: 'संयंत्र / मशीनरी छवि',
      teamPhoto: 'टीम की तस्वीर',
      savedApplied: '✓ रिपोर्ट में सफलतापूर्वक सहेजा और लागू किया गया',
      declarantName: 'घोषक का नाम',
      yourName: 'आपका नाम',
      designation: 'पद',
      place: 'स्थान',
      // Pricing plans
      entryPlanName: 'प्रारंभिक प्लान (Entry)',
      entryPages: '15 – 20 पृष्ठ',
      entryProjects: 'परियोजनाएं ₹5 लाख – ₹25 लाख',
      entryDesc: '16 मुख्य अध्याय, 5-वर्षीय वित्तीय विवरण, DSCR विश्लेषण, मानक बैंकेबल PDF।',
      corePlanName: 'कोर प्लान (Core)',
      corePages: '25 – 35 पृष्ठ',
      coreProjects: 'परियोजनाएं ₹25 लाख – ₹1 करोड़',
      coreDesc: '22 अध्याय, 36-माह का नकदी प्रवाह, टंडन मूल्यांकन, ऋण मूल्यांकन मानदंड।',
      teamPlanName: 'टीम प्लान (Advanced)',
      teamPages: '35 – 45 पृष्ठ',
      teamProjects: 'परियोजनाएं ₹1 करोड़ – ₹5 करोड़',
      teamDesc: 'संवेदनशीलता स्ट्रेस-टेस्ट, कार्यान्वयन रोडमैप और सब्सिडी विवरणों के साथ उन्नत डीपीआर।',
      mostUsedBadge: 'सर्वाधिक लोकप्रिय',
      enterprisePlanName: 'एंटरप्राइज बैंकेबल',
      enterprisePages: '45 – 60 पृष्ठ',
      enterpriseProjects: 'परियोजनाएं ₹5 करोड़ – ₹25 करोड़+',
      enterpriseDesc: '30 अध्याय + 10 वित्तीय अनुसूचियां, 10-वर्षीय अनुमान, BOQ, ESG।',
      enterpriseBadge: 'संस्थागत श्रेणी',
      // Payment Order Summary
      orderSummaryTitle: 'भुगतान आदेश सारांश',
      selectedServiceLabel: 'चयनित डीपीआर सेवा:',
      selectedPlanLabel: 'चयनित मूल्य निर्धारण योजना:',
      reportScopeLabel: 'रिपोर्ट का दायरा:',
      totalPayableLabel: 'देय कुल राशि:',
      secureGatewayNote: 'रेज़रपे द्वारा सुरक्षित — यूपीआई (Google Pay, PhonePe, Paytm), सभी डेबिट/क्रेडिट कार्ड एवं नेटबैंकिंग समर्थित',
      changePlanBtn: 'प्लान बदलें',
      associatedVkf: 'VKF के साथ संबद्ध / भागीदार',
      testRupeeMode: 'परीक्षण ₹1 भुगतान मोड (लाइव रेज़रपे रसीद परीक्षण)',
      paymentVerified: 'भुगतान सत्यापित! आपकी रिपोर्ट पूरी तरह से अनलॉक है',
      downloadPdfUnlocked: 'अंतिम PDF रिपोर्ट डाउनलोड करें (अनलॉक)',
      compilingPdf: 'PDF इंजन रिपोर्ट तैयार हो रही है...',
      payPdf: 'भुगतान करें और अंतिम PDF रिपोर्ट अनलॉक करें',
      verifyUpi: 'क्या आपने UPI / QR पर भुगतान कर दिया है? सत्यापित करने और रिपोर्ट अनलॉक करने के लिए यहां क्लिक करें →',
      checkingPayment: 'लाइव रेज़रपे भुगतान स्थिति की जांच की जा रही है...',
    },
  },
};
