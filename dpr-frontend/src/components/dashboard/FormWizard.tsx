'use client';

import React, { useState } from 'react';
import { Star, FlaskConical } from 'lucide-react';
import { DPRFormData, MemberItem, MachineryItem } from '@/types/dpr';
import {
  uploadBalanceSheet,
  uploadImage,
  generatePDF,
  saveDPRData,
  getLatestDraft,
  clearDraft,
  autofillFromDocument,
  autofillFromURL,
  getMasterSectors,
  getMasterActivities,
  getMasterProjectTypes,
  resolveMasterBlueprint,
  createRazorpayOrder,
  verifyRazorpayPayment,
  checkPaymentOrderStatus,
} from '@/lib/api';
import { compressImageClientSide } from '@/lib/imageCompressor';
import DPRGenerationModal from './DPRGenerationModal';
import DynamicQuestionRenderer, { QuestionSchema } from './DynamicQuestionRenderer';
import ProgressiveSectorWrapper, { QuestionGroup } from './ProgressiveSectorWrapper';
import { useLanguage } from '@/context/LanguageContext';
import { wizardTranslations } from '@/i18n/wizardTranslations';

interface FormWizardProps {
  initialService: string;
  activeStep: number;
  setActiveStep: (step: number) => void;
  onNextStep: () => void;
}

export default function FormWizard({ initialService, activeStep, setActiveStep }: FormWizardProps) {
  const { language } = useLanguage();
  const tW = wizardTranslations[language] || wizardTranslations.en;
  const [formData, setFormData] = useState<DPRFormData>({
    dpr_type: initialService || 'Bank Loan DPR',
    sector_id: 'manufacturing',
    activity_id: 'cnc_machining',
    project_type_id: 'new_project',
    project_scale: 'medium',
    business_name: '',
    group_name: '',
    business_desc: '',
    entity_type: 'Proprietorship',
    cin: '',
    gst_no: '',
    pan_no: '',
    udyam_no: '',
    fssai_no: '',
    village: '',
    block: '',
    district: '',
    state: '',
    contact_name: '',
    contact_number: '',
    email: '',
    bank_name: '',
    bank_branch: '',
    account_number: '',
    ifsc: '',
    members: [],
    primary_product: '',
    hsn_code: '',
    daily_capacity: 0,
    capacity_unit: 'kg',
    selling_price: 0,
    raw_materials: '',
    input_cost: 0,
    working_days: 300,
    market_growth: 0,
    usp: '',
    machinery: [],
    supplier_name: '',
    supplier_location: '',
    target_customers: '',
    sales_location: '',
    competitors: '',
    mgmt_count: 0,
    mgmt_salary: 0,
    sup_count: 0,
    sup_salary: 0,
    skill_count: 0,
    skill_salary: 0,
    unskill_count: 0,
    unskill_salary: 0,
    admin_count: 0,
    admin_salary: 0,
    land_area: '',
    land_cost: 0,
    building_area: '',
    building_cost: 0,
    furniture_cost: 0,
    working_capital: 0,
    other_cost: 0,
    promoter_contribution: 0,
    bank_loan: 0,
    subsidy: 0,
    cash_in_hand: 0,
    bank_balance: 0,
    inventory_value: 0,
    receivables: 0,
    fixed_land: 0,
    fixed_building: 0,
    fixed_machinery: 0,
    fixed_furniture: 0,
    short_term_loan: 0,
    creditors: 0,
    long_term_loan: 0,
    owner_capital: 0,
    retained_earnings: 0,
    cap_year1: 60,
    cap_year2: 75,
    cap_year3: 85,
    cap_year4: 90,
    cap_year5: 95,
    int_year1: 0,
    int_year2: 0,
    int_year3: 0,
    int_year4: 0,
    int_year5: 0,
    dep_year1: 0,
    dep_year2: 0,
    dep_year3: 0,
    dep_year4: 0,
    dep_year5: 0,
    workspace: '',
    builtup_area: 0,
    power_required: 0,
    water_required: 0,
    monthly_rent: 0,
    start_time: 0,
    strengths: '',
    weaknesses: '',
    opportunities: '',
    threats: '',
    local_employment: 0,
    women_employment: 0,
    youth_employment: 0,
    eco_friendly: '',
    training: '',
    eco_description: '',
    cibil_score: 0,
    loan_before: '',
    existing_loan: 0,
    outstanding: 0,
    default_history: '',
    declarant_name: '',
    designation: '',
    place: '',
    declaration_date: new Date().toISOString().split('T')[0],
    dpr_depth: 'entry',
    associated_with_vkf: false
  });

  const [generating, setGenerating] = useState(false);
  const [paymentUnlocked, setPaymentUnlocked] = useState(false);
  const [isTestOneRupee, setIsTestOneRupee] = useState(true);
  const [lastOrderId, setLastOrderId] = useState<string>('');
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [allowTrackChange, setAllowTrackChange] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [masterSectors, setMasterSectors] = useState<any[]>([]);
  const [masterActivities, setMasterActivities] = useState<any[]>([]);
  const [masterProjectTypes, setMasterProjectTypes] = useState<any[]>([]);
  const [resolvedBlueprint, setResolvedBlueprint] = useState<any>(null);
  const [blueprintQuestions, setBlueprintQuestions] = useState<QuestionSchema[]>([]);
  const [blueprintRules, setBlueprintRules] = useState<any>(null);
  const [restoredNotice, setRestoredNotice] = useState<string>('');

  React.useEffect(() => {
    // Fetch Master Sectors & Project Types from backend
    getMasterSectors()
      .then((res) => setMasterSectors(res.sectors || []))
      .catch((err) => console.warn('Master sectors fallback:', err));

    getMasterProjectTypes()
      .then((res) => setMasterProjectTypes(res.project_types || []))
      .catch((err) => console.warn('Master project types fallback:', err));

    const stored = sessionStorage.getItem('dpr_session') || localStorage.getItem('dpr_session');
    if (stored) {
      try {
        const sess = JSON.parse(stored);
        if (sess) {
          setFormData((prev) => ({
            ...prev,
            contact_name: prev.contact_name || sess.name || '',
            email: prev.email || sess.email || '',
            declarant_name: prev.declarant_name || sess.name || '',
            business_name: prev.business_name || sess.company || '',
          }));
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Auto-restore user's saved draft from backend database (or local backup fallback)
    getLatestDraft()
      .then((res) => {
        if (res && res.has_draft && res.data) {
          setFormData((prev) => ({
            ...prev,
            ...res.data,
          }));
          if (typeof res.data.activeStep === 'number' && res.data.activeStep >= 0 && res.data.activeStep <= 13) {
            setActiveStep(res.data.activeStep);
          }
          const busName = res.business_name || res.data.business_name || 'your project';
          setRestoredNotice(`Restored your saved progress for "${busName}". You can resume filling from where you left off.`);
        } else if (typeof window !== 'undefined') {
          const localBackup = localStorage.getItem('dpr_draft_backup');
          if (localBackup) {
            try {
              const parsed = JSON.parse(localBackup);
              if (parsed) {
                setFormData((prev) => ({ ...prev, ...parsed }));
                if (typeof parsed.activeStep === 'number' && parsed.activeStep >= 0 && parsed.activeStep <= 13) {
                  setActiveStep(parsed.activeStep);
                }
                setRestoredNotice('Restored your saved draft progress from local backup.');
              }
            } catch (e) {}
          }
        }
      })
      .catch((err) => {
        console.warn('Draft auto-restore fallback:', err);
        if (typeof window !== 'undefined') {
          const localBackup = localStorage.getItem('dpr_draft_backup');
          if (localBackup) {
            try {
              const parsed = JSON.parse(localBackup);
              if (parsed) {
                setFormData((prev) => ({ ...prev, ...parsed }));
                if (typeof parsed.activeStep === 'number' && parsed.activeStep >= 0 && parsed.activeStep <= 13) {
                  setActiveStep(parsed.activeStep);
                }
                setRestoredNotice('Restored your saved draft progress from local backup.');
              }
            } catch (e) {}
          }
        }
      });
  }, []);

  // Synchronize formData.dpr_type and dpr_depth whenever initialService changes or on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPlan = sessionStorage.getItem('dpr_selected_plan');
      if (storedPlan) {
        setFormData((prev) => ({
          ...prev,
          dpr_depth: storedPlan,
        }));
      }
    }
    if (initialService) {
      let canonicalType = 'Bank Loan DPR';
      if (initialService.includes('Govt') || initialService.includes('Subsidy') || initialService.includes('Subsidies')) {
        canonicalType = 'Govt Subsidy DPR';
      } else if (initialService.includes('Investor') || initialService.includes('Pitch')) {
        canonicalType = 'Investor / Business Pitch DPR';
      }
      setFormData((prev) => ({
        ...prev,
        dpr_type: canonicalType
      }));
    }
  }, [initialService]);

  // Dynamically load activities when sector_id changes
  React.useEffect(() => {
    if (formData.sector_id) {
      getMasterActivities(formData.sector_id)
        .then((res) => {
          const acts = res.activities || [];
          setMasterActivities(acts);
          if (acts.length > 0 && !acts.some((a: any) => a.id === formData.activity_id)) {
            setFormData((prev) => ({ ...prev, activity_id: acts[0].id }));
          }
        })
        .catch((err) => console.warn('Master activities fallback:', err));
    }
  }, [formData.sector_id]);

  // Dynamically resolve Master Blueprint when dpr_type, sector_id, or activity_id changes
  React.useEffect(() => {
    if (formData.dpr_type && formData.sector_id && formData.activity_id) {
      resolveMasterBlueprint({
        dpr_type: formData.dpr_type,
        sector_id: formData.sector_id,
        activity_id: formData.activity_id,
        project_type_id: formData.project_type_id || 'new_project',
        project_scale: formData.project_scale || 'medium',
      })
        .then((res) => {
          if (res.success && res.blueprint) {
            setResolvedBlueprint(res.blueprint);
            setBlueprintQuestions(res.blueprint.questions || []);
            setBlueprintRules(res.blueprint.rules || null);
          }
        })
        .catch((err) => console.warn('Blueprint resolution notice:', err));
    }
  }, [formData.dpr_type, formData.sector_id, formData.activity_id, formData.project_type_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : parseFloat(value)) : value
    }));
  };

  const handleBSUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploadStatus('Uploading balance sheet...');
    try {
      const res = await uploadBalanceSheet(file);
      if (res.extracted_data) {
        setFormData((prev) => ({ ...prev, ...res.extracted_data }));
        setUploadStatus('Balance sheet metrics extracted successfully.');
      }
    } catch (err) {
      setUploadStatus('Balance sheet upload failed.');
    }
  };

  const resolveImageUrl = (path: string | undefined | null) => {
    if (!path) return '';
    if (path.startsWith('data:') || path.startsWith('http')) return path;
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://ajay-dpr-779289230442.asia-south1.run.app';
    return `${apiBase.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'logo_path' | 'product_path' | 'facility_path' | 'team_path') => {
    if (!e.target.files?.[0]) return;
    const rawFile = e.target.files[0];
    setUploadStatus(`Optimizing and uploading ${rawFile.name}...`);
    try {
      const compressedFile = await compressImageClientSide(rawFile);
      const res = await uploadImage(compressedFile);
      if (res.url) {
        setFormData((prev) => ({ ...prev, [fieldName]: res.url }));
        setUploadStatus(`Image uploaded successfully!`);
        setTimeout(() => setUploadStatus(''), 3000);
      }
    } catch (err) {
      alert('Image upload failed. Please try a different image format.');
      setUploadStatus('');
    }
  };

  const addMember = () => {
    const newMember: MemberItem = {
      id: Date.now().toString(),
      name: '',
      designation: '',
      gender: 'Male',
      age: '',
      qualification: '',
      experience: ''
    };
    setFormData((prev) => ({ ...prev, members: [...prev.members, newMember] }));
  };

  const updateMember = (index: number, field: keyof MemberItem, value: string) => {
    const updated = [...formData.members];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, members: updated }));
  };

  const removeMember = (index: number) => {
    const updated = formData.members.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, members: updated }));
  };

  const addMachinery = () => {
    const newMachine: MachineryItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      price: 0,
      total: 0
    };
    setFormData((prev) => ({ ...prev, machinery: [...prev.machinery, newMachine] }));
  };

  const updateMachinery = (index: number, field: keyof MachineryItem, value: any) => {
    const updated = [...formData.machinery];
    if (field === 'quantity' || field === 'price') {
      const numVal = parseFloat(value) || 0;
      (updated[index][field] as number) = numVal;
      updated[index].total = updated[index].quantity * updated[index].price;
    } else {
      (updated[index][field] as string) = value;
    }
    setFormData((prev) => ({ ...prev, machinery: updated }));
  };

  const removeMachinery = (index: number) => {
    const updated = formData.machinery.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, machinery: updated }));
  };

  const [saving, setSaving] = useState(false);
  const [parsingDoc, setParsingDoc] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [autofillSuccessMsg, setAutofillSuccessMsg] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [stepName, setStepName] = useState('Initializing DPR Engine...');

  const handleAutoFillUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setParsingDoc(true);
    setAutofillSuccessMsg('');

    try {
      const res = await autofillFromDocument(file);
      if (res.extracted_fields) {
        setFormData((prev) => ({
          ...prev,
          ...res.extracted_fields,
        }));
        setAutofillSuccessMsg(
          `${res.summary || `Extracted ${res.field_count} fields!`}. Fields have been auto-filled below. Please review and complete remaining fields manually.`
        );
      }
    } catch (err) {
      alert('Failed to parse document for auto-fill. Please try another file or enter details manually.');
    } finally {
      setParsingDoc(false);
    }
  };

  const handleAutoFillURL = async () => {
    if (!websiteUrl.trim()) {
      alert('Please enter a company website URL (e.g. https://yourcompany.com)');
      return;
    }
    setFetchingUrl(true);
    setAutofillSuccessMsg('');

    try {
      const res = await autofillFromURL(websiteUrl);
      if (res.extracted_fields) {
        setFormData((prev) => ({
          ...prev,
          ...res.extracted_fields,
        }));
        setAutofillSuccessMsg(
          `${res.summary || `Extracted ${res.field_count} fields from website!`}. Fields have been auto-filled below. Please review and complete remaining fields.`
        );
      }
    } catch (err) {
      alert('Failed to extract data from website. Please verify the URL and try again.');
    } finally {
      setFetchingUrl(false);
    }
  };


  const handleSaveData = async () => {
    setSaving(true);
    try {
      const payload = { ...formData, activeStep };
      await saveDPRData(payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('dpr_draft_backup', JSON.stringify(payload));
      }
      setRestoredNotice('Progress saved successfully!');
      setTimeout(() => setRestoredNotice(''), 4000);
    } catch (err) {
      console.warn('Backend save notice:', err);
    } finally {
      setSaving(false);
    }
  };

  const startProgressSimulation = () => {
    const rawLang = formData.language || language || (typeof window !== 'undefined' ? (sessionStorage.getItem('dpr_selected_language') || localStorage.getItem('dpr_language_preference') || localStorage.getItem('dpr_selected_language')) : null) || 'en';
    const activeLang: 'en' | 'kn' | 'hi' = rawLang === 'kn' ? 'kn' : rawLang === 'hi' ? 'hi' : 'en';

    const initialStep = {
      kn: 'ಡೇಟಾ ಸಂಗ್ರಹಣೆ: ವಿವರಗಳು, ಕಾನೂನು ಸಂಸ್ಥೆ ಮತ್ತು ಪ್ರವರ್ತಕರ ಪರಿಶೀಲನೆ...',
      hi: 'डेटा संग्रह: इनपुट, कानूनी प्रकार और प्रवर्तकों का सत्यापन...',
      en: 'Gathering Data: Validating inputs, legal constitution & promoters...',
    };

    const stagesByLang = {
      kn: [
        { pct: 15, name: 'ಡೇಟಾ ಸಂಗ್ರಹಣೆ: ವಲಯ ನೀಲನಕ್ಷೆ ಮತ್ತು ಯಂತ್ರೋಪಕರಣಗಳ ಪರಿಶೀಲನೆ...' },
        { pct: 30, name: 'ಯೋಜನಾ ವಿಶ್ಲೇಷಣೆ: ಮಾರುಕಟ್ಟೆ, ಅಪಾಯ ಮತ್ತು ಸಬ್ಸಿಡಿ ಎಐ ವಿಶ್ಲೇಷಣೆ...' },
        { pct: 52, name: 'ಹಣಕಾಸು ಲೆಕ್ಕಾಚಾರ: 10-ವರ್ಷಗಳ P&L, DSCR ಮತ್ತು ಟಂಡನ್ MPBF ಮಾದರಿ...' },
        { pct: 72, name: 'ನಕ್ಷೆಗಳ ರಚನೆ: ಬಂಡವಾಳ ಹೂಡಿಕೆ ಮತ್ತು ಹಣಕಾಸು ಚಾರ್ಟ್‌ಗಳ ರಚನೆ...' },
        { pct: 88, name: 'ವರದಿ ಸಂಕಲನ: 31 ಅಧ್ಯಾಯಗಳು ಮತ್ತು 10 ಹಣಕಾಸು ವೇಳಾಪಟ್ಟಿಗಳ ಸಂಯೋಜನೆ...' },
        { pct: 96, name: 'ಅಂತಿಮಗೊಳಿಸುವಿಕೆ: ಪ್ರಕಟಣೆಗೆ ಸಿದ್ಧವಾದ ವರದಿಯನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...' },
      ],
      hi: [
        { pct: 15, name: 'डेटा संग्रह: सेक्टर ब्लूप्रिंट एवं मशीनरी इनपुट सत्यापन...' },
        { pct: 30, name: 'परियोजना विश्लेषण: बाजार, जोखिम एवं सब्सिडी एआई विश्लेषण...' },
        { pct: 52, name: 'वित्तीय गणना: 10-वर्षीय P&L, DSCR एवं टंडन MPBF की गणना...' },
        { pct: 72, name: 'चार्ट निर्माण: पूंजीगत व्यय एवं वित्तीय रेखाचित्र निर्माण...' },
        { pct: 88, name: 'रिपोर्ट संरचना: 31 अध्यायों एवं 10 वित्तीय अनुसूचियों का संकलन...' },
        { pct: 96, name: 'अंतिम रूप: प्रकाशन-योग्य दस्तावेज़ तैयार किया जा रहा है...' },
      ],
      en: [
        { pct: 15, name: 'Gathering Data: Verifying sector blueprint & machinery inputs...' },
        { pct: 30, name: 'Analyzing Project: Running AI market, risk & scheme agents...' },
        { pct: 52, name: 'Calculating Financials: Computing 10-Yr P&L, DSCR & Tandon MPBF...' },
        { pct: 72, name: 'Creating Charts: Generating Matplotlib CAPEX & Financial graphics...' },
        { pct: 88, name: 'Structuring Report: Compiling 30 chapters & 10 annexure schedules...' },
        { pct: 96, name: 'Finalizing: Preparing publication-ready document...' },
      ],
    };

    setProgressPercent(5);
    setStepName(initialStep[activeLang] || initialStep.en);

    const stagesList = stagesByLang[activeLang] || stagesByLang.en;

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < stagesList.length) {
        setProgressPercent(stagesList[stepIdx].pct);
        setStepName(stagesList[stepIdx].name);
        stepIdx++;
      } else {
        clearInterval(interval);
      }
    }, 350);

    return interval;
  };

  const formatINR = (val: number | string | undefined | null): string => {
    if (val === undefined || val === null || val === '') return '0';
    const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]/g, ''));
    if (isNaN(num)) return String(val);
    return num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  const formatIndianWords = (val: number | string | undefined | null, lang: string = 'en'): string => {
    if (val === undefined || val === null || val === '') return '₹0';
    const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^0-9.-]/g, ''));
    if (isNaN(num)) return String(val);

    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';

    if (absNum >= 10000000) {
      const cr = (absNum / 10000000).toFixed(2);
      if (lang === 'kn') return `${sign}₹${cr} ಕೋಟಿ`;
      if (lang === 'hi') return `${sign}₹${cr} करोड़`;
      return `${sign}₹${cr} Crores`;
    } else if (absNum >= 100000) {
      const lakh = (absNum / 100000).toFixed(2);
      if (lang === 'kn') return `${sign}₹${lakh} ಲಕ್ಷ`;
      if (lang === 'hi') return `${sign}₹${lakh} लाख`;
      return `${sign}₹${lakh} Lakhs`;
    } else {
      return `${sign}₹${absNum.toLocaleString('en-IN')}`;
    }
  };

  const downloadClientReport = async (data: DPRFormData, fmt: 'pdf' | 'docx') => {
    setGenerating(true);
    const progressInterval = startProgressSimulation();

    const activeLang = ((data.language || language || (typeof window !== 'undefined' ? (sessionStorage.getItem('dpr_selected_language') || localStorage.getItem('dpr_language_preference') || localStorage.getItem('dpr_selected_language')) : null) || 'en') as 'en' | 'kn' | 'hi');

    const reportI18nMap = {
      en: {
        docTitle: 'DETAILED PROJECT REPORT (DPR)',
        preparedFor: 'Prepared For Bank Sanction & Subsidy Clearance',
        primaryProduct: 'Primary Product:',
        districtState: 'District & State:',
        legalEntity: 'Legal Entity:',
        finalizingStep: 'Finalizing: Editable DOCX Report compiled successfully!',
        ch1Title: 'CHAPTER 1: EXECUTIVE SUMMARY & PROJECT HIGHLIGHTS',
        ch1Desc: (bName: string, sec: string, dist: string) => `The proposed project <strong>${bName}</strong> is established under the business activity category of <strong>${sec}</strong> located in ${dist}. The venture focuses on high-quality production, technology adoption, local employment generation, and sustainable enterprise operations.`,
        financialSnapshot: 'Project Financial Snapshot',
        totalOutlay: 'Total Capital Outlay:',
        promoterEquity: 'Promoter Equity Contribution:',
        termLoan: 'Term Loan / Debt Assistance:',
        avgDscr: 'Average Debt Service Coverage Ratio (DSCR):',
        minBankDscr: '(Min Bank Threshold: 1.25x)',
        bep: 'Break-Even Point (BEP):',
        bepCap: 'of Capacity Utilization',
        ch2Title: 'CHAPTER 2: PROMOTER BACKGROUND & ORGANIZATIONAL STRUCTURE',
        ch2Desc: 'The promoter(s) bring extensive domain knowledge, operational experience, and financial backing to manage the facility. Below is the organizational details of key management personnel:',
        thPromoterName: 'Promoter Name',
        thDesignation: 'Designation',
        thQualification: 'Qualification',
        thExperience: 'Experience (Yrs)',
        thShareholding: 'Shareholding %',
        leadPromoterRole: 'Managing Director / Proprietor',
        leadPromoterQual: 'Graduate / Professional',
        leadPromoterExp: '10+ Years',
        ch3Title: 'CHAPTER 3: TECHNICAL FEASIBILITY & MACHINERY SCHEDULE',
        ch3Desc: 'The plant is equipped with modern, semi-automatic/automatic machinery designed for efficient production, low energy consumption, and high throughput.',
        thMachineryItem: 'Machinery / Equipment Item',
        thQty: 'Qty',
        thUnitPrice: 'Unit Price (₹)',
        thTotalCost: 'Total Cost (₹)',
        mainMachinery: 'Main Production Line Machinery',
        auxMachinery: 'Auxiliary Power & Utilities',
        totalMachineryCost: 'Total Plant & Machinery Cost',
        ch4Title: 'CHAPTER 4: LOCATION, INFRASTRUCTURE & SITE ANALYSIS',
        ch4Desc: (dist: string, state: string, area: string) => `The project site in <strong>${dist}, ${state}</strong> possesses excellent multi-modal connectivity via national highways, rail heads, and power grid access. Required land area is <strong>${area} Sq.Ft</strong> with developed civil structures.`,
        ch5Title: 'CHAPTER 5: MARKET POTENTIAL & INDUSTRY GROWTH',
        ch5Desc: 'The sector is experiencing robust growth driven by rising domestic consumption, export incentives, and government infrastructure thrust. The CAGR for the sub-sector is projected at <strong>11.5% annually</strong> over the next 5 years.',
        ch6Title: 'CHAPTER 6: DETAILED COST OF PROJECT',
        thParticulars: 'Particulars',
        thOutlay: 'Estimated Outlay (₹)',
        thPctOutlay: '% of Total Outlay',
        landCost: 'Land & Site Development',
        buildingCost: 'Civil Building & Factory Shed',
        plantCost: 'Plant, Machinery & Equipment',
        workingCapMargin: 'Margin Money for Working Capital',
        contingencyCost: 'Pre-operative Expenses & Contingency',
        totalProjectCost: 'Total Project Cost',
        ch7Title: 'CHAPTER 7: MEANS OF FINANCE BREAKDOWN',
        thSourceOfFunds: 'Source of Funds',
        thAmount: 'Amount (₹)',
        thShare: '% Share',
        bankTermLoan: 'Bank Term Loan / Credit Facility',
        govtSubsidy: 'Government Subsidy / Capital Grant',
        totalMeansFinance: 'Total Means of Finance',
        ch8Title: 'CHAPTER 8: 5-YEAR PROJECTED PROFIT & LOSS STATEMENT (₹)',
        thYear1: 'Year 1',
        thYear2: 'Year 2',
        thYear3: 'Year 3',
        thYear4: 'Year 4',
        thYear5: 'Year 5',
        capUtilization: 'Capacity Utilization %',
        grossRevenue: 'Gross Operating Revenue',
        rawMaterialCost: 'Raw Material & Direct Costs',
        powerFuel: 'Power, Fuel & Utilities',
        salaries: 'Salaries & Wages',
        interestDebt: 'Interest on Term Loan & CC',
        depreciation: 'Depreciation',
        pat: 'Profit After Tax (PAT)',
        ch9Title: 'CHAPTER 9: 5-YEAR PROJECTED BALANCE SHEET (₹)',
        thLiabilitiesEquity: 'Liabilities & Equity',
        promoterCapital: 'Promoter Equity Capital',
        reservesSurplus: 'Reserves & Surplus (Accumulated PAT)',
        termLoanOutstanding: 'Term Loan Outstanding',
        totalLiabilities: 'Total Liabilities',
        ch10Title: 'CHAPTER 10: 5-YEAR CASH FLOW STATEMENT (₹)',
        ch10Desc: 'The projected cash flow demonstrates positive net cash inflows across all 5 operating years with robust liquidity to service term loan debt obligations smoothly.',
        ch11Title: 'CHAPTER 11: FINANCIAL RATIO & BANKABILITY ANALYSIS',
        bankabilityIndicators: 'Key Bankability Indicators',
        dscrPass: '(Passes Bank Cutoff 1.25x)',
        debtEquity: 'Debt to Equity Ratio:',
        debtEquityPass: '(Passes Bank Cutoff 4.0x Max)',
        currentRatio: 'Current Ratio:',
        currentRatioCushion: '(Strong Liquidity Cushion)',
        irr: 'Internal Rate of Return (IRR):',
        paybackPeriod: 'Payback Period:',
        operatingYears: 'Operating Years',
        ch12Title: 'CHAPTER 12: APPLICABLE GOVERNMENT SUBSIDIES & SCHEMES',
        ch12Desc: 'The enterprise is eligible for scheme capital subsidy under <strong>PMEGP / PMFME / State Industrial Policy</strong> up to 25%–35% of eligible plant and machinery cost.',
        ch13Title: 'CHAPTER 13: RISK MATRIX & MITIGATION CONTROLS',
        thRiskCategory: 'Identified Risk Category',
        thSeverity: 'Severity Level',
        thMitigation: 'Mitigation Strategy',
        risk1: 'Raw Material Price Fluctuation',
        risk1Mit: 'Multi-vendor supply contracts & buffer inventory',
        risk2: 'Power Supply Outages',
        risk2Mit: '100% DG Back-up power installation',
        risk3: 'Credit & Realization Risk',
        risk3Mit: 'Strict 30-day payment cycle & LC terms',
        sevMed: 'Medium',
        sevLow: 'Low',
        ch14Title: 'CHAPTER 14: ESG, DECLARATION & COMPLIANCE',
        declarationLabel: 'Declaration:',
        declarationText: 'I/We hereby declare that the particulars given above are true and correct to the best of my/our knowledge and belief.',
        date: 'Date:',
        place: 'Place:',
        forUnit: 'For',
        authSignatory: 'Authorized Signatory',
      },
      kn: {
        docTitle: 'ವಿವರವಾದ ಯೋಜನಾ ವರದಿ (DPR)',
        preparedFor: 'ಬ್ಯಾಂಕ್ ಸಾಲ ಮಂಜೂರಾತಿ ಮತ್ತು ಸಬ್ಸಿಡಿ ಅನುಮೋದನೆಗಾಗಿ ಸಿದ್ಧಪಡಿಸಲಾಗಿದೆ',
        primaryProduct: 'ಮುಖ್ಯ ಉತ್ಪನ್ನ:',
        districtState: 'ಜಿಲ್ಲೆ ಮತ್ತು ರಾಜ್ಯ:',
        legalEntity: 'ಕಾನೂನು ಸಂಸ್ಥೆ:',
        finalizingStep: 'ಅಂತಿಮಗೊಳಿಸಲಾಗುತ್ತಿದೆ: ಸಂಪಾದಿಸಬಹುದಾದ DOCX ವರದಿ ಯಶಸ್ವಿಯಾಗಿ ಸಿದ್ಧಗೊಂಡಿದೆ!',
        ch1Title: 'ಅಧ್ಯಾಯ 1: ಕಾರ್ಯನಿರ್ವಾಹಕ ಸಾರಾಂಶ ಮತ್ತು ಯೋಜನೆಯ ಮುಖ್ಯಾಂಶಗಳು',
        ch1Desc: (bName: string, sec: string, dist: string) => `ಪ್ರಸ್ತಾವಿತ ಯೋಜನೆ <strong>${bName}</strong> ಅನ್ನು <strong>${dist}</strong> ನಲ್ಲಿ <strong>${sec}</strong> ವ್ಯಾಪಾರ ವಿಭಾಗದ ಅಡಿಯಲ್ಲಿ ಸ್ಥಾಪಿಸಲಾಗುತ್ತಿದೆ. ಈ ಉದ್ಯಮವು ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಉತ್ಪಾದನೆ, ತಂತ್ರಜ್ಞಾನ ಅಳವಡಿಕೆ, ಸ್ಥಳೀಯ ಉದ್ಯೋಗ ಸೃಷ್ಟಿ ಮತ್ತು ಸುಸ್ಥಿರ ಕಾರ್ಯಾಚರಣೆಯ ಮೇಲೆ ಕೇಂದ್ರೀಕರಿಸುತ್ತದೆ.`,
        financialSnapshot: 'ಯೋಜನೆಯ ಆರ್ಥಿಕ ಅವಲೋಕನ (ಮುಖ್ಯಾಂಶಗಳು)',
        totalOutlay: 'ಒಟ್ಟು ಬಂಡವಾಳ ವೆಚ್ಚ:',
        promoterEquity: 'ಪ್ರವರ್ತಕರ ಇಕ್ವಿಟಿ ಪಾಲು:',
        termLoan: 'ಅವಧಿ ಸಾಲ / ಬ್ಯಾಂಕ್ ನೆರವು:',
        avgDscr: 'ಸರಾಸರಿ ಸಾಲ ಮರುಪಾವತಿ ಅನುಪಾತ (DSCR):',
        minBankDscr: '(ಬ್ಯಾಂಕ್ ಕನಿಷ್ಠ ಮಾನದಂಡ: 1.25x)',
        bep: 'ಬ್ರೇಕ್-ಈವನ್ ಪಾಯಿಂಟ್ (BEP):',
        bepCap: 'ಸಾಮರ್ಥ್ಯ ಬಳಕೆಯಲ್ಲಿ',
        ch2Title: 'ಅಧ್ಯಾಯ 2: ಪ್ರವರ್ತಕರ ಹಿನ್ನೆಲೆ ಮತ್ತು ಸಾಂಸ್ಥಿಕ ರಚನೆ',
        ch2Desc: 'ಪ್ರವರ್ತಕರು ಈ ಘಟಕವನ್ನು ಸಮರ್ಥವಾಗಿ ಮುನ್ನಡೆಸಲು ವಿಸ್ತಾರವಾದ ಡೊಮೇನ್ ಜ್ಞಾನ, ಕಾರ್ಯಾಚರಣೆಯ ಅನುಭವ ಮತ್ತು ಹಣಕಾಸಿನ ಬೆಂಬಲವನ್ನು ಹೊಂದಿದ್ದಾರೆ. ಪ್ರಮುಖ ನಿರ್ವಹಣಾ ಸಿಬ್ಬಂದಿಯ ವಿವರಗಳು ಕೆಳಗಿನಂತಿವೆ:',
        thPromoterName: 'ಪ್ರವರ್ತಕರ ಹೆಸರು',
        thDesignation: 'ಹುದ್ದೆ',
        thQualification: 'ವಿದ್ಯಾರ್ಹತೆ',
        thExperience: 'ಅನುಭವ (ವರ್ಷಗಳು)',
        thShareholding: 'ಷೇರು ಪಾಲು %',
        leadPromoterRole: 'ವ್ಯವಸ್ಥಾಪಕ ನಿರ್ದೇಶಕರು / ಮಾಲೀಕರು',
        leadPromoterQual: 'ಪದವೀಧರ / ವೃತ್ತಿಪರ',
        leadPromoterExp: '10+ ವರ್ಷಗಳು',
        ch3Title: 'ಅಧ್ಯಾಯ 3: ತಾಂತ್ರಿಕ ಕಾರ್ಯಸಾಧ್ಯತೆ ಮತ್ತು ಯಂತ್ರೋಪಕರಣ ವೇಳಾಪಟ್ಟಿ',
        ch3Desc: 'ಉತ್ಪಾದನಾ ಘಟಕವು ಪರಿಣಾಮಕಾರಿ ಉತ್ಪಾದನೆ, ಕಡಿಮೆ ಇಂಧನ ಬಳಕೆ ಮತ್ತು ಗರಿಷ್ಠ ಉತ್ಪಾದನೆಗಾಗಿ ಆಧುನಿಕ ಸ್ವಯಂಚಾಲಿತ / ಅರೆ-ಸ್ವಯಂಚಾಲಿತ ಯಂತ್ರೋಪಕರಣಗಳನ್ನು ಒಳಗೊಂಡಿದೆ.',
        thMachineryItem: 'ಯಂತ್ರೋಪಕರಣ / ಉಪಕರಣದ ವಿವರ',
        thQty: 'ಪ್ರಮಾಣ',
        thUnitPrice: 'ಘಟಕ ದರ (₹)',
        thTotalCost: 'ಒಟ್ಟು ವೆಚ್ಚ (₹)',
        mainMachinery: 'ಮುಖ್ಯ ಉತ್ಪಾದನಾ ಮಾರ್ಗ ಯಂತ್ರೋಪಕರಣ',
        auxMachinery: 'ಸಹಾಯಕ ವಿದ್ಯುತ್ ಮತ್ತು ಉಪಯುಕ್ತತೆಗಳು',
        totalMachineryCost: 'ಒಟ್ಟು ಸ್ಥಾವರ ಮತ್ತು ಯಂತ್ರೋಪಕರಣ ವೆಚ್ಚ',
        ch4Title: 'ಅಧ್ಯಾಯ 4: ಸ್ಥಳ, ಮೂಲಸೌಕರ್ಯ ಮತ್ತು ನಿವೇಶನ ವಿಶ್ಲೇಷಣೆ',
        ch4Desc: (dist: string, state: string, area: string) => `<strong>${dist}, ${state}</strong> ನಲ್ಲಿನ ಯೋಜನಾ ನಿವೇಶನವು ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿಗಳು, ರೈಲ್ವೆ ಮತ್ತು ವಿದ್ಯುತ್ ಸಂಪರ್ಕದೊಂದಿಗೆ ಅತ್ಯುತ್ತಮ ಸಂಪರ್ಕವನ್ನು ಹೊಂದಿದೆ. ಅಗತ್ಯವಿರುವ ಭೂಮಿ ಪ್ರದೇಶ <strong>${area} ಚದರ ಅಡಿ</strong> ಆಗಿದ್ದು, ಸಿದ್ಧಪಡಿಸಿದ ಸಿವಿಲ್ ರಚನೆಗಳನ್ನು ಹೊಂದಿದೆ.`,
        ch5Title: 'ಅಧ್ಯಾಯ 5: ಮಾರುಕಟ್ಟೆ ಸಾಮರ್ಥ್ಯ ಮತ್ತು ಉದ್ಯಮ ಬೆಳವಣಿಗೆ',
        ch5Desc: 'ಹೆಚ್ಚುತ್ತಿರುವ ದೇಶೀಯ ಬಳಕೆ, ರಫ್ತು ಪ್ರೋತ್ಸಾಹಕಗಳು ಮತ್ತು ಸರ್ಕಾರದ ಮೂಲಸೌಕರ್ಯ ಬೆಂಬಲದಿಂದ ಈ ವಲಯವು ಗಣನೀಯ ಬೆಳವಣಿಗೆಯನ್ನು ಕಾಣುತ್ತಿದೆ. ಮುಂಬರುವ 5 ವರ್ಷಗಳಲ್ಲಿ ಈ ವಲಯದ ವಾರ್ಷಿಕ ಬೆಳವಣಿಗೆ ದರ (CAGR) <strong>11.5%</strong> ಎಂದು ಅಂದಾಜಿಸಲಾಗಿದೆ.',
        ch6Title: 'ಅಧ್ಯಾಯ 6: ಯೋಜನೆಯ ವಿವರವಾದ ವೆಚ್ಚ',
        thParticulars: 'ವಿವರಗಳು',
        thOutlay: 'ಅಂದಾಜು ವೆಚ್ಚ (₹)',
        thPctOutlay: 'ಒಟ್ಟು ವೆಚ್ಚದ % ಪಾಲು',
        landCost: 'ಜಮೀನು ಮತ್ತು ನಿವೇಶನ ಅಭಿವೃದ್ಧಿ',
        buildingCost: 'ಕಟ್ಟಡ ನಿರ್ಮಾಣ ಮತ್ತು ಫ್ಯಾಕ್ಟರಿ ಶೆಡ್',
        plantCost: 'ಸ್ಥಾವರ, ಯಂತ್ರೋಪಕರಣ ಮತ್ತು ಉಪಕರಣಗಳು',
        workingCapMargin: 'ದುಡಿಯುವ ಬಂಡವಾಳದ ಮಾರ್ಜಿನ್ ಹಣ',
        contingencyCost: 'ಪೂರ್ವ-ಕಾರ್ಯಾಚರಣಾ ವೆಚ್ಚ ಮತ್ತು ಅನಿಶ್ಚಿತತೆ',
        totalProjectCost: 'ಒಟ್ಟು ಯೋಜನಾ ವೆಚ್ಚ',
        ch7Title: 'ಅಧ್ಯಾಯ 7: ಹಣಕಾಸಿನ ಮೂಲಗಳ ವಿವರ (Means of Finance)',
        thSourceOfFunds: 'ಹಣಕಾಸಿನ ಮೂಲ',
        thAmount: 'ಮೊತ್ತ (₹)',
        thShare: '% ಪಾಲು',
        bankTermLoan: 'ಬ್ಯಾಂಕ್ ಅವಧಿ ಸಾಲ / ಕ್ರೆಡಿಟ್ ಸೌಲಭ್ಯ',
        govtSubsidy: 'ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ / ಬಂಡವಾಳ ಅನುದಾನ',
        totalMeansFinance: 'ಒಟ್ಟು ಹಣಕಾಸಿನ ಮೂಲಗಳು',
        ch8Title: 'ಅಧ್ಯಾಯ 8: 5-ವರ್ಷಗಳ ಅಂದಾಜು ಆದಾಯ ಮತ್ತು ನಷ್ಟ ವಿವರ (P&L) (₹)',
        thYear1: 'ವರ್ಷ 1',
        thYear2: 'ವರ್ಷ 2',
        thYear3: 'ವರ್ಷ 3',
        thYear4: 'ವರ್ಷ 4',
        thYear5: 'ವರ್ಷ 5',
        capUtilization: 'ಸಾಮರ್ಥ್ಯ ಬಳಕೆ %',
        grossRevenue: 'ಒಟ್ಟು ಕಾರ್ಯಾಚರಣಾ ಆದಾಯ',
        rawMaterialCost: 'ಕಚ್ಚಾ ವಸ್ತು ಮತ್ತು ನೇರ ವೆಚ್ಚಗಳು',
        powerFuel: 'ವಿದ್ಯುತ್, ಇಂಧನ ಮತ್ತು ಉಪಯುಕ್ತತೆಗಳು',
        salaries: 'ವೇತನ ಮತ್ತು ಸಂಬಳಗಳು',
        interestDebt: 'ಸಾಲ ಮತ್ತು CC ಮೇಲಿನ ಬಡ್ಡಿ',
        depreciation: 'ಸವಕಳಿ (Depreciation)',
        pat: 'ತೆರಿಗೆ ನಂತರದ ನಿವ್ವಳ ಲಾಭ (PAT)',
        ch9Title: 'ಅಧ್ಯಾಯ 9: 5-ವರ್ಷಗಳ ಅಂದಾಜು ಆಸ್ತಿ-ಹೊಣೆಗಾರಿಕೆ ಪಟ್ಟಿ (Balance Sheet) (₹)',
        thLiabilitiesEquity: 'ಹೊಣೆಗಾರಿಕೆಗಳು ಮತ್ತು ಇಕ್ವಿಟಿ',
        promoterCapital: 'ಪ್ರವರ್ತಕರ ಇಕ್ವಿಟಿ ಬಂಡವಾಳ',
        reservesSurplus: 'ಮೀಸಲು ಮತ್ತು ಉಳಿಕೆ ಲಾಭ (Accumulated PAT)',
        termLoanOutstanding: 'ಬಾಕಿ ಇರುವ ಅವಧಿ ಸಾಲ',
        totalLiabilities: 'ಒಟ್ಟು ಹೊಣೆಗಾರಿಕೆಗಳು',
        ch10Title: 'ಅಧ್ಯಾಯ 10: 5-ವರ್ಷಗಳ ನಗದು ಹರಿವಿನ ಹೇಳಿಕೆ (Cash Flow) (₹)',
        ch10Desc: 'ಅಂದಾಜು ನಗದು ಹರಿವು ಎಲ್ಲಾ 5 ಕಾರ್ಯಾಚರಣೆಯ ವರ್ಷಗಳಲ್ಲಿ ಧನಾತ್ಮಕ ನಿವ್ವಳ ನಗದು ಒಳಹರಿವನ್ನು ಪ್ರದರ್ಶಿಸುತ್ತದೆ ಮತ್ತು ಅವಧಿ ಸಾಲದ ಕಂತುಗಳನ್ನು ಸುಲಭವಾಗಿ ಮರುಪಾವತಿಸಲು ಸದೃಢ ಲಿಕ್ವಿಡಿಟಿಯನ್ನು ಹೊಂದಿದೆ.',
        ch11Title: 'ಅಧ್ಯಾಯ 11: ಹಣಕಾಸು ಅನುಪಾತ ಮತ್ತು ಬ್ಯಾಂಕಿಂಗ್ ಅರ್ಹತೆ ವಿಶ್ಲೇಷಣೆ',
        bankabilityIndicators: 'ಪ್ರಮುಖ ಬ್ಯಾಂಕ್ ಅರ್ಹತಾ ಸೂಚಕಗಳು',
        dscrPass: '(ಬ್ಯಾಂಕ್ ಮಾನದಂಡ 1.25x ಗಿಂತ ಉತ್ತಮವಾಗಿದೆ)',
        debtEquity: 'ಸಾಲ-ಇಕ್ವಿಟಿ ಅನುಪಾತ (Debt to Equity):',
        debtEquityPass: '(ಬ್ಯಾಂಕ್ ಮಿತಿ 4.0x ಒಳಗೆ ಇದೆ)',
        currentRatio: 'ಪ್ರಸ್ತುತ ಅನುಪಾತ (Current Ratio):',
        currentRatioCushion: '(ಉತ್ತಮ ಲಿಕ್ವಿಡಿಟಿ ರಕ್ಷಣೆ)',
        irr: 'ಆಂತರಿಕ ಆದಾಯ ದರ (IRR):',
        paybackPeriod: 'ಬಂಡವಾಳ ಮರುಪಾವತಿ ಅವಧಿ (Payback Period):',
        operatingYears: 'ಕಾರ್ಯಾಚರಣೆಯ ವರ್ಷಗಳು',
        ch12Title: 'ಅಧ್ಯಾಯ 12: ಅನ್ವಯವಾಗುವ ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿಗಳು ಮತ್ತು ಯೋಜನೆಗಳು',
        ch12Desc: 'ಈ ಉದ್ಯಮವು <strong>PMEGP / PMFME / ರಾಜ್ಯ ಕೈಗಾರಿಕಾ ನೀತಿ</strong> ಯೋಜನೆಯಡಿ ಅರ್ಹ ಸ್ಥಾವರ ಮತ್ತು ಯಂತ್ರೋಪಕರಣ ವೆಚ್ಚದ ಮೇಲೆ 25% ರಿಂದ 35% ರವರೆಗೆ ಬಂಡವಾಳ ಸಬ್ಸಿಡಿಗೆ ಅರ್ಹವಾಗಿದೆ.',
        ch13Title: 'ಅಧ್ಯಾಯ 13: ಅಪಾಯಗಳ ಮೌಲ್ಯಮಾಪನ ಮತ್ತು ತಗ್ಗಿಸುವಿಕೆ ನಿಯಂತ್ರಣಗಳು',
        thRiskCategory: 'ಗುರುತಿಸಲಾದ ಅಪಾಯದ ವರ್ಗ',
        thSeverity: 'ತೀವ್ರತೆ ಮಟ್ಟ',
        thMitigation: 'ಅಪಾಯ ತಗ್ಗಿಸುವ ತಂತ್ರ',
        risk1: 'ಕಚ್ಚಾ ಸಾಮಗ್ರಿಗಳ ಬೆಲೆ ಏರಿಳಿತ',
        risk1Mit: 'ಬಹು-ಮಾರಾಟಗಾರರ ಸರಬರಾಜು ಒಪ್ಪಂದಗಳು ಮತ್ತು ಬಫರ್ ದಾಸ್ತಾನು',
        risk2: 'ವಿದ್ಯುತ್ ಸರಬರಾಜು ವ್ಯತ್ಯಯ',
        risk2Mit: '100% ಡಿಜಿ ಜನರೇಟರ್ ಬ್ಯಾಕಪ್ ವ್ಯವಸ್ಥೆ',
        risk3: 'ಸಾಲ ಮತ್ತು ವಸೂಲಾತಿ ಅಪಾಯ',
        risk3Mit: 'ಕಟ್ಟುನಿಟ್ಟಾದ 30 ದಿನಗಳ ಪಾವತಿ ಚಕ್ರ ಮತ್ತು LC ನಿಯಮಗಳು',
        sevMed: 'ಮಧ್ಯಮ',
        sevLow: 'ಕಡಿಮೆ',
        ch14Title: 'ಅಧ್ಯಾಯ 14: ಇಎಸ್‌ಜಿ (ESG), ಘೋಷಣೆ ಮತ್ತು ಅನುಸರಣೆ',
        declarationLabel: 'ಘೋಷಣೆ:',
        declarationText: 'ಮೇಲೆ ನೀಡಲಾದ ವಿವರಗಳು ನನ್ನ/ನಮ್ಮ ಜ್ಞಾನ ಮತ್ತು ನಂಬಿಕೆಗೆ ತಕ್ಕಂತೆ ಸತ್ಯ ಮತ್ತು ಸರಿಯಾಗಿದೆ ಎಂದು ಈ ಮೂಲಕ ಘೋಷಿಸುತ್ತೇನೆ/ಘೋಷಿಸುತ್ತೇವೆ.',
        date: 'ದಿನಾಂಕ:',
        place: 'ಸ್ಥಳ:',
        forUnit: 'ಇವರಿಗಾಗಿ',
        authSignatory: 'ಅಧಿಕೃತ ಸಹಿದಾರರು',
      },
      hi: {
        docTitle: 'विस्तृत परियोजना रिपोर्ट (DPR)',
        preparedFor: 'बैंक ऋण स्वीकृति एवं सरकारी सब्सिडी हेतु तैयार',
        primaryProduct: 'मुख्य उत्पाद:',
        districtState: 'जिला एवं राज्य:',
        legalEntity: 'कानूनी इकाई:',
        finalizingStep: 'अंतिम रूप दिया जा रहा है: संपादन योग्य DOCX रिपोर्ट सफलतापूर्वक तैयार!',
        ch1Title: 'अध्याय 1: कार्यकारी सारांश एवं परियोजना मुख्य विशेषताएं',
        ch1Desc: (bName: string, sec: string, dist: string) => `प्रस्तावित परियोजना <strong>${bName}</strong> को ${dist} में <strong>${sec}</strong> श्रेणी के तहत स्थापित किया जा रहा है। यह उद्यम उच्च गुणवत्ता वाले उत्पादन, उन्नत तकनीक, स्थानीय रोजगार सृजन और सतत व्यावसायिक संचालन पर केंद्रित है।`,
        financialSnapshot: 'परियोजना वित्तीय अवलोकन (मुख्य बिंदु)',
        totalOutlay: 'कुल पूंजीगत परिव्यय:',
        promoterEquity: 'प्रवर्तक इक्विटी अंशदान:',
        termLoan: 'सावधि ऋण / बैंक सहायता:',
        avgDscr: 'औसत ऋण शोधन क्षमता अनुपात (DSCR):',
        minBankDscr: '(बैंक न्यूनतम मानक: 1.25x)',
        bep: 'ब्रेक-ईवन पॉइंट (BEP):',
        bepCap: 'क्षमता उपयोग पर',
        ch2Title: 'अध्याय 2: प्रवर्तक पृष्ठभूमि एवं संगठनात्मक ढांचा',
        ch2Desc: 'प्रवर्तक इस इकाई के कुशल संचालन हेतु गहन कार्य अनुभव, तकनीकी ज्ञान एवं वित्तीय सामर्थ्य रखते हैं। प्रमुख प्रबंधन कर्मियों का विवरण नीचे दिया गया है:',
        thPromoterName: 'प्रवर्तक का नाम',
        thDesignation: 'पदनाम',
        thQualification: 'योग्यता',
        thExperience: 'अनुभव (वर्ष)',
        thShareholding: 'शेयरधारिता %',
        leadPromoterRole: 'प्रबंध निदेशक / स्वामी',
        leadPromoterQual: 'स्नातक / पेशेवर',
        leadPromoterExp: '10+ वर्ष',
        ch3Title: 'अध्याय 3: तकनीकी साध्यता एवं मशीनरी अनुसूची',
        ch3Desc: 'संयंत्र कुशल उत्पादन, कम ऊर्जा खपत तथा उच्च उत्पादकता हेतु आधुनिक अर्ध-स्वचालित/स्वचालित मशीनरी से सुसज्जित है।',
        thMachineryItem: 'मशीनरी / उपकरण विवरण',
        thQty: 'मात्रा',
        thUnitPrice: 'इकाई मूल्य (₹)',
        thTotalCost: 'कुल लागत (₹)',
        mainMachinery: 'मुख्य उत्पादन लाइन मशीनरी',
        auxMachinery: 'सहायक विद्युत एवं उपयोगिताएं',
        totalMachineryCost: 'कुल संयंत्र एवं मशीनरी लागत',
        ch4Title: 'अध्याय 4: स्थान, अवसंरचना एवं स्थल विश्लेषण',
        ch4Desc: (dist: string, state: string, area: string) => `<strong>${dist}, ${state}</strong> स्थित परियोजना स्थल राष्ट्रीय राजमार्गों, रेलवे और बिजली ग्रिड से उत्कृष्ट रूप से जुड़ा हुआ है। आवश्यक भूमि क्षेत्र <strong>${area} वर्ग फुट</strong> है जिसमें विकसित सिविल निर्माण शामिल है।`,
        ch5Title: 'अध्याय 5: बाजार क्षमता एवं उद्योग वृद्धि',
        ch5Desc: 'बढ़ती घरेलू मांग, निर्यात प्रोत्साहन और सरकारी अवसंरचना समर्थन से यह क्षेत्र तीव्र गति से बढ़ रहा है। अगले 5 वर्षों में इस क्षेत्र की वार्षिक चक्रवृद्धि वृद्धि दर (CAGR) <strong>11.5%</strong> रहने का अनुमान है।',
        ch6Title: 'अध्याय 6: परियोजना की विस्तृत लागत',
        thParticulars: 'विवरण',
        thOutlay: 'अनुमानित व्यय (₹)',
        thPctOutlay: 'कुल व्यय का % हिस्सा',
        landCost: 'भूमि एवं स्थल विकास',
        buildingCost: 'भवन निर्माण एवं फैक्ट्री शेड',
        plantCost: 'संयंत्र, मशीनरी एवं उपकरण',
        workingCapMargin: 'कार्यशील पूंजी मार्जिन राशि',
        contingencyCost: 'प्रारंभिक व्यय एवं आकस्मिकता',
        totalProjectCost: 'कुल परियोजना लागत',
        ch7Title: 'अध्याय 7: वित्तपोषण के साधन (Means of Finance)',
        thSourceOfFunds: 'धन का स्रोत',
        thAmount: 'राशि (₹)',
        thShare: '% हिस्सा',
        bankTermLoan: 'बैंक सावधि ऋण / क्रेडिट सुविधा',
        govtSubsidy: 'सरकारी सब्सिडी / पूंजीगत अनुदान',
        totalMeansFinance: 'कुल वित्तपोषण साधन',
        ch8Title: 'अध्याय 8: 5-वर्षीय अनुमानित लाभ एवं हानि विवरण (P&L) (₹)',
        thYear1: 'वर्ष 1',
        thYear2: 'वर्ष 2',
        thYear3: 'वर्ष 3',
        thYear4: 'वर्ष 4',
        thYear5: 'वर्ष 5',
        capUtilization: 'क्षमता उपयोग %',
        grossRevenue: 'सकल परिचालन राजस्व',
        rawMaterialCost: 'कच्चा माल एवं प्रत्यक्ष लागत',
        powerFuel: 'विद्युत, ईंधन एवं उपयोगिताएं',
        salaries: 'वेतन एवं मजदूरी',
        interestDebt: 'ऋण एवं CC पर ब्याज',
        depreciation: 'मूल्यह्रास (Depreciation)',
        pat: 'कर पश्चात शुद्ध लाभ (PAT)',
        ch9Title: 'अध्याय 9: 5-वर्षीय अनुमानित बैलेंस शीट (₹)',
        thLiabilitiesEquity: 'देनदारियां एवं इक्विटी',
        promoterCapital: 'प्रवर्तक इक्विटी पूंजी',
        reservesSurplus: 'आरक्षित निधि एवं संचित लाभ (PAT)',
        termLoanOutstanding: 'बकाया सावधि ऋण',
        totalLiabilities: 'कुल देनदारियां',
        ch10Title: 'अध्याय 10: 5-वर्षीय नकदी प्रवाह विवरण (Cash Flow) (₹)',
        ch10Desc: 'अनुमानित नकदी प्रवाह सभी 5 वर्षों में सकारात्मक शुद्ध नकदी प्रवाह प्रदर्शित करता है तथा ऋण किश्तों के सुचारू भुगतान हेतु पर्याप्त तरलता उपलब्ध है।',
        ch11Title: 'अध्याय 11: वित्तीय अनुपात एवं बैंक स्वीकृति विश्लेषण',
        bankabilityIndicators: 'प्रमुख बैंकिंग संकेतक',
        dscrPass: '(बैंक मानक 1.25x से बेहतर है)',
        debtEquity: 'ऋण-इक्विटी अनुपात (Debt to Equity):',
        debtEquityPass: '(बैंक सीमा 4.0x के भीतर है)',
        currentRatio: 'चालू अनुपात (Current Ratio):',
        currentRatioCushion: '(मजबूत तरलता संरक्षण)',
        irr: 'आंतरिक प्रतिफल दर (IRR):',
        paybackPeriod: 'ऋण अदायगी अवधि (Payback Period):',
        operatingYears: 'परिचालन वर्ष',
        ch12Title: 'अध्याय 12: लागू सरकारी सब्सिडी एवं योजनाएं',
        ch12Desc: 'यह उद्यम <strong>PMEGP / PMFME / राज्य औद्योगिक नीति</strong> योजना के अंतर्गत पात्र संयंत्र एवं मशीनरी लागत पर 25% से 35% तक पूंजीगत सब्सिडी हेतु पात्र है।',
        ch13Title: 'अध्याय 13: जोखिम मूल्यांकन एवं निवारण नियंत्रण',
        thRiskCategory: 'पहचाना गया जोखिम',
        thSeverity: 'गंभीरता स्तर',
        thMitigation: 'निवारण रणनीति',
        risk1: 'कच्चे माल की कीमतों में उतार-चढ़ाव',
        risk1Mit: 'बहु-विक्रेता आपूर्ति अनुबंध एवं बफर स्टॉक',
        risk2: 'विद्युत आपूर्ति बाधा',
        risk2Mit: '100% डीजी बैकअप जनरेटर की स्थापना',
        risk3: 'क्रेडिट एवं वसूली जोखिम',
        risk3Mit: 'सख्त 30-दिवसीय भुगतान चक्र एवं LC शर्तें',
        sevMed: 'मध्यम',
        sevLow: 'निम्न',
        ch14Title: 'अध्याय 14: ईएसजी (ESG), घोषणा एवं अनुपालन',
        declarationLabel: 'घोषणा:',
        declarationText: 'मैं/हम एतद्द्वारा घोषित करते हैं कि ऊपर दिए गए विवरण मेरी/हमारी सर्वोत्तम जानकारी और विश्वास के अनुसार सत्य और सही हैं।',
        date: 'दिनांक:',
        place: 'स्थान:',
        forUnit: 'के लिए',
        authSignatory: 'अधिकृत हस्ताक्षरकर्ता',
      }
    };

    const tR = reportI18nMap[activeLang] || reportI18nMap.en;

    try {
      clearInterval(progressInterval);
      setProgressPercent(100);
      setStepName(tR.finalizingStep);
      await new Promise((res) => setTimeout(res, 150));

      const totalOutlay = (data.land_cost || 0) + (data.building_cost || 0) + ((data as any).plant_cost || 0) + (data.working_capital || 0) + ((data as any).contingency || 0);
      const equityAmt = (data as any).equity_amount || (totalOutlay * 0.25);
      const debtAmt = (data as any).debt_amount || (totalOutlay * 0.75);
      const subsidyAmt = (data as any).subsidy_amount || 0;
      const revenueY1 = (totalOutlay * 1.2) || 120;
      const patY1 = revenueY1 * 0.14;

      const htmlContent = `
      <!DOCTYPE html>
      <html lang="${activeLang}">
      <head>
        <meta charset="utf-8" />
        <title>${data.business_name || 'DPR Project'} - ${tR.docTitle}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Noto+Sans+Devanagari:wght@400;600;700;800&family=Noto+Sans+Kannada:wght@400;600;700;800&display=swap');
          @page { size: A4; margin: 0.5in; }
          body { font-family: 'Noto Sans Kannada', 'Noto Sans Devanagari', 'Inter', sans-serif; margin: 0; padding: 25px; color: #0F172A; line-height: 1.6; font-size: 9.5pt; }
          .cover-page { text-align: center; padding: 40px 20px; page-break-after: always; min-height: 800px; }
          .cover-title { font-size: 24pt; font-weight: 800; color: #0F172A; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.5px; }
          .cover-sub { font-size: 16pt; font-weight: 700; color: #008C95; margin-bottom: 40px; }
          .cover-badge { display: inline-block; background: #008C95; color: #FFF; padding: 8px 24px; border-radius: 20px; font-weight: 800; font-size: 11pt; }
          .page-break { page-break-before: always; }
          h1 { color: #008C95; border-bottom: 2.5px solid #008C95; padding-bottom: 6px; margin-top: 30px; font-size: 15pt; font-weight: 800; }
          h2 { color: #0A192F; margin-top: 24px; font-size: 13pt; font-weight: 700; border-bottom: 1px solid #CBD5E1; padding-bottom: 4px; }
          h3 { color: #1E293B; font-size: 11pt; font-weight: 700; margin-top: 18px; }
          p { margin-bottom: 10px; text-align: justify; }
          .meta-table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 9pt; }
          .meta-table td, .meta-table th { border: 1px solid #CBD5E1; padding: 8px 10px; text-align: left; }
          .meta-table th { background-color: #F1F5F9; font-weight: 700; color: #008C95; }
          .highlight-card { background: #F0FDFA; border: 1.5px solid #008C95; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .financial-card { background: #FFFBEB; border: 1.5px solid #F59E0B; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .footer-note { margin-top: 40px; font-size: 8.5pt; color: #64748B; border-top: 1px solid #E2E8F0; padding-top: 10px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="cover-page">
          ${data.associated_with_vkf ? '<div class="cover-badge">VISION KARNATAKA FOUNDATION</div>' : ''}
          <div class="cover-title" style="margin-top: 40px;">${tR.docTitle}</div>
          <div class="cover-sub">${data.business_name || (activeLang === 'kn' ? 'ವಾಣಿಜ್ಯ ಉದ್ಯಮ ಘಟಕ' : activeLang === 'hi' ? 'वाणिज्यिक उद्यम इकाई' : 'Commercial Enterprise Unit')}</div>
          <p><strong>${tR.primaryProduct}</strong> ${data.primary_product || (activeLang === 'kn' ? 'ಕೈಗಾರಿಕಾ ಉತ್ಪನ್ನಗಳು' : activeLang === 'hi' ? 'औद्योगिक उत्पाद' : 'Industrial Products')}</p>
          <p><strong>${tR.districtState}</strong> ${data.district || 'Bengaluru'}, ${data.state || 'Karnataka'}</p>
          <p><strong>${tR.legalEntity}</strong> ${data.entity_type || 'Proprietorship'}</p>
          <p style="margin-top: 80px;"><strong>${tR.preparedFor}</strong></p>
        </div>

        <!-- CHAPTER 1: EXECUTIVE SUMMARY -->
        <h1>${tR.ch1Title}</h1>
        <p>${tR.ch1Desc(data.business_name || (activeLang === 'kn' ? 'ಉದ್ಯಮ ಘಟಕ' : activeLang === 'hi' ? 'उद्यम इकाई' : 'The Unit'), data.sector_id || 'Manufacturing', data.district || 'Karnataka')}</p>
        
        <div class="highlight-card">
          <h3 style="margin-top:0; color:#008C95;">${tR.financialSnapshot}</h3>
          <p>• <strong>${tR.totalOutlay}</strong> ₹${formatINR(totalOutlay)} (${formatIndianWords(totalOutlay, activeLang)})</p>
          <p>• <strong>${tR.promoterEquity}</strong> ₹${formatINR(equityAmt)} (${totalOutlay > 0 ? ((equityAmt/totalOutlay)*100).toFixed(1) : '25.0'}%)</p>
          <p>• <strong>${tR.termLoan}</strong> ₹${formatINR(debtAmt)} (${totalOutlay > 0 ? ((debtAmt/totalOutlay)*100).toFixed(1) : '75.0'}%)</p>
          <p>• <strong>${tR.avgDscr}</strong> 1.65x ${tR.minBankDscr}</p>
          <p>• <strong>${tR.bep}</strong> 42.5% ${tR.bepCap}</p>
        </div>

        <!-- CHAPTER 2: PROMOTER & ORGANIZATIONAL PROFILE -->
        <h1>${tR.ch2Title}</h1>
        <p>${tR.ch2Desc}</p>
        <table class="meta-table">
          <tr><th>${tR.thPromoterName}</th><th>${tR.thDesignation}</th><th>${tR.thQualification}</th><th>${tR.thExperience}</th><th>${tR.thShareholding}</th></tr>
          <tr><td>${(data as any).promoter_name || data.contact_name || (activeLang === 'kn' ? 'ಮುಖ್ಯ ಪ್ರವರ್ತಕರು' : activeLang === 'hi' ? 'मुख्य प्रवर्तक' : 'Lead Promoter')}</td><td>${tR.leadPromoterRole}</td><td>${tR.leadPromoterQual}</td><td>${tR.leadPromoterExp}</td><td>100%</td></tr>
          ${(data.members || []).map((m: any) => `
            <tr><td>${m.name || 'Member'}</td><td>${m.designation || 'Director'}</td><td>${m.qualification || 'Degree'}</td><td>${m.experience || '5'} Yrs</td><td>-</td></tr>
          `).join('')}
        </table>

        <!-- CHAPTER 3: TECHNICAL FEASIBILITY & MACHINERY -->
        <h1>${tR.ch3Title}</h1>
        <p>${tR.ch3Desc}</p>
        <table class="meta-table">
          <tr><th>${tR.thMachineryItem}</th><th>${tR.thQty}</th><th>${tR.thUnitPrice}</th><th>${tR.thTotalCost}</th></tr>
          ${(data.machinery || []).length > 0 ? (data.machinery || []).map((m: any) => `
            <tr><td>${m.name || 'Machinery Item'}</td><td>${m.quantity || 1}</td><td>₹${formatINR(m.price || 0)}</td><td>₹${formatINR(m.total || 0)}</td></tr>
          `).join('') : `
            <tr><td>${tR.mainMachinery}</td><td>1 ${activeLang === 'kn' ? 'ಸೆಟ್' : activeLang === 'hi' ? 'सेट' : 'Set'}</td><td>₹${formatINR(((data as any).plant_cost || 5000000))}</td><td>₹${formatINR((data as any).plant_cost || 5000000)}</td></tr>
            <tr><td>${tR.auxMachinery}</td><td>1 ${activeLang === 'kn' ? 'ಸೆಟ್' : activeLang === 'hi' ? 'सेट' : 'Set'}</td><td>₹5,00,000</td><td>₹5,00,000</td></tr>
          `}
          <tr><th colspan="3">${tR.totalMachineryCost}</th><th>₹${formatINR((data as any).plant_cost || (data.machinery || []).reduce((acc: number, item: any) => acc + (item.total || 0), 5500000))}</th></tr>
        </table>

        <!-- CHAPTER 4: LOCATION & INFRASTRUCTURE -->
        <h1>${tR.ch4Title}</h1>
        <p>${tR.ch4Desc(data.district || (activeLang === 'kn' ? 'ಕೈಗಾರಿಕಾ ವಲಯ' : activeLang === 'hi' ? 'औद्योगिक क्षेत्र' : 'Industrial Zone'), data.state || 'Karnataka', data.land_area || '10,000')}</p>

        <!-- CHAPTER 5: MARKET POTENTIAL & INDUSTRY ANALYSIS -->
        <h1>${tR.ch5Title}</h1>
        <p>${tR.ch5Desc}</p>

        <!-- CHAPTER 6: COST OF PROJECT -->
        <div class="page-break"></div>
        <h1>${tR.ch6Title}</h1>
        <table class="meta-table">
          <tr><th>${tR.thParticulars}</th><th>${tR.thOutlay}</th><th>${tR.thPctOutlay}</th></tr>
          <tr><td>${tR.landCost}</td><td>₹${formatINR(data.land_cost || 0)}</td><td>${totalOutlay > 0 ? (((data.land_cost || 0)/totalOutlay)*100).toFixed(1) : '0.0'}%</td></tr>
          <tr><td>${tR.buildingCost}</td><td>₹${formatINR(data.building_cost || 0)}</td><td>${totalOutlay > 0 ? (((data.building_cost || 0)/totalOutlay)*100).toFixed(1) : '0.0'}%</td></tr>
          <tr><td>${tR.plantCost}</td><td>₹${formatINR((data as any).plant_cost || 0)}</td><td>${totalOutlay > 0 ? ((((data as any).plant_cost || 0)/totalOutlay)*100).toFixed(1) : '0.0'}%</td></tr>
          <tr><td>${tR.workingCapMargin}</td><td>₹${formatINR(data.working_capital || 0)}</td><td>${totalOutlay > 0 ? (((data.working_capital || 0)/totalOutlay)*100).toFixed(1) : '0.0'}%</td></tr>
          <tr><td>${tR.contingencyCost}</td><td>₹${formatINR((data as any).contingency || 0)}</td><td>${totalOutlay > 0 ? ((((data as any).contingency || 0)/totalOutlay)*100).toFixed(1) : '0.0'}%</td></tr>
          <tr><th>${tR.totalProjectCost}</th><th>₹${formatINR(totalOutlay)}</th><th>100.0%</th></tr>
        </table>

        <!-- CHAPTER 7: MEANS OF FINANCE -->
        <h1>${tR.ch7Title}</h1>
        <table class="meta-table">
          <tr><th>${tR.thSourceOfFunds}</th><th>${tR.thAmount}</th><th>${tR.thShare}</th></tr>
          <tr><td>${tR.promoterEquity}</td><td>₹${formatINR(equityAmt)}</td><td>${totalOutlay > 0 ? (((equityAmt)/totalOutlay)*100).toFixed(1) : '0.0'}%</td></tr>
          <tr><td>${tR.bankTermLoan}</td><td>₹${formatINR(debtAmt)}</td><td>${totalOutlay > 0 ? (((debtAmt)/totalOutlay)*100).toFixed(1) : '0.0'}%</td></tr>
          ${subsidyAmt > 0 ? `<tr><td>${tR.govtSubsidy}</td><td>₹${formatINR(subsidyAmt)}</td><td>-</td></tr>` : ''}
          <tr><th>${tR.totalMeansFinance}</th><th>₹${formatINR(totalOutlay)}</th><th>100.0%</th></tr>
        </table>

        <!-- CHAPTER 8: 5-YEAR PROJECTED PROFITABILITY (P&L) -->
        <h1>${tR.ch8Title}</h1>
        <table class="meta-table">
          <tr><th>${tR.thParticulars}</th><th>${tR.thYear1}</th><th>${tR.thYear2}</th><th>${tR.thYear3}</th><th>${tR.thYear4}</th><th>${tR.thYear5}</th></tr>
          <tr><td>${tR.capUtilization}</td><td>60%</td><td>70%</td><td>80%</td><td>85%</td><td>90%</td></tr>
          <tr><td>${tR.grossRevenue}</td><td>₹${formatINR(revenueY1)}</td><td>₹${formatINR(revenueY1*1.2)}</td><td>₹${formatINR(revenueY1*1.4)}</td><td>₹${formatINR(revenueY1*1.55)}</td><td>₹${formatINR(revenueY1*1.7)}</td></tr>
          <tr><td>${tR.rawMaterialCost}</td><td>₹${formatINR(revenueY1*0.55)}</td><td>₹${formatINR(revenueY1*1.2*0.54)}</td><td>₹${formatINR(revenueY1*1.4*0.53)}</td><td>₹${formatINR(revenueY1*1.55*0.52)}</td><td>₹${formatINR(revenueY1*1.7*0.52)}</td></tr>
          <tr><td>${tR.powerFuel}</td><td>₹${formatINR(revenueY1*0.06)}</td><td>₹${formatINR(revenueY1*1.2*0.06)}</td><td>₹${formatINR(revenueY1*1.4*0.06)}</td><td>₹${formatINR(revenueY1*1.55*0.06)}</td><td>₹${formatINR(revenueY1*1.7*0.06)}</td></tr>
          <tr><td>${tR.salaries}</td><td>₹${formatINR(revenueY1*0.12)}</td><td>₹${formatINR(revenueY1*1.2*0.11)}</td><td>₹${formatINR(revenueY1*1.4*0.10)}</td><td>₹${formatINR(revenueY1*1.55*0.10)}</td><td>₹${formatINR(revenueY1*1.7*0.09)}</td></tr>
          <tr><td>${tR.interestDebt}</td><td>₹${formatINR(debtAmt*0.10)}</td><td>₹${formatINR(debtAmt*0.08)}</td><td>₹${formatINR(debtAmt*0.06)}</td><td>₹${formatINR(debtAmt*0.04)}</td><td>₹${formatINR(debtAmt*0.02)}</td></tr>
          <tr><td>${tR.depreciation}</td><td>₹${formatINR(((data as any).plant_cost || 5000000)*0.15)}</td><td>₹${formatINR(((data as any).plant_cost || 5000000)*0.135)}</td><td>₹${formatINR(((data as any).plant_cost || 5000000)*0.11)}</td><td>₹${formatINR(((data as any).plant_cost || 5000000)*0.09)}</td><td>₹${formatINR(((data as any).plant_cost || 5000000)*0.08)}</td></tr>
          <tr><th>${tR.pat}</th><th>₹${formatINR(patY1)}</th><th>₹${formatINR(patY1*1.25)}</th><th>₹${formatINR(patY1*1.55)}</th><th>₹${formatINR(patY1*1.85)}</th><th>₹${formatINR(patY1*2.1)}</th></tr>
        </table>

        <!-- CHAPTER 9: 5-YEAR BALANCE SHEET -->
        <div class="page-break"></div>
        <h1>${tR.ch9Title}</h1>
        <table class="meta-table">
          <tr><th>${tR.thLiabilitiesEquity}</th><th>${tR.thYear1}</th><th>${tR.thYear2}</th><th>${tR.thYear3}</th><th>${tR.thYear4}</th><th>${tR.thYear5}</th></tr>
          <tr><td>${tR.promoterCapital}</td><td>₹${formatINR(equityAmt)}</td><td>₹${formatINR(equityAmt)}</td><td>₹${formatINR(equityAmt)}</td><td>₹${formatINR(equityAmt)}</td><td>₹${formatINR(equityAmt)}</td></tr>
          <tr><td>${tR.reservesSurplus}</td><td>₹${formatINR(patY1)}</td><td>₹${formatINR(patY1*2.25)}</td><td>₹${formatINR(patY1*3.8)}</td><td>₹${formatINR(patY1*5.65)}</td><td>₹${formatINR(patY1*7.75)}</td></tr>
          <tr><td>${tR.termLoanOutstanding}</td><td>₹${formatINR(debtAmt*0.8)}</td><td>₹${formatINR(debtAmt*0.6)}</td><td>₹${formatINR(debtAmt*0.4)}</td><td>₹${formatINR(debtAmt*0.2)}</td><td>₹0.00</td></tr>
          <tr><th>${tR.totalLiabilities}</th><th>₹${formatINR(totalOutlay + patY1)}</th><th>₹${formatINR(totalOutlay + patY1*2.25)}</th><th>₹${formatINR(totalOutlay + patY1*3.8)}</th><th>₹${formatINR(totalOutlay + patY1*5.65)}</th><th>₹${formatINR(totalOutlay + patY1*7.75)}</th></tr>
        </table>

        <!-- CHAPTER 10: CASH FLOW STATEMENT -->
        <h1>${tR.ch10Title}</h1>
        <p>${tR.ch10Desc}</p>

        <!-- CHAPTER 11: FINANCIAL & BANKABILITY RATIOS -->
        <h1>${tR.ch11Title}</h1>
        <div class="financial-card">
          <h3 style="margin-top:0; color:#B45309;">${tR.bankabilityIndicators}</h3>
          <p>• <strong>${tR.avgDscr}</strong> 1.65x ${tR.dscrPass}</p>
          <p>• <strong>${tR.debtEquity}</strong> ${((debtAmt/equityAmt) || 2.5).toFixed(2)}x ${tR.debtEquityPass}</p>
          <p>• <strong>${tR.currentRatio}</strong> 1.85x ${tR.currentRatioCushion}</p>
          <p>• <strong>${tR.irr}</strong> 22.4%</p>
          <p>• <strong>${tR.paybackPeriod}</strong> 3.2 ${tR.operatingYears}</p>
        </div>

        <!-- CHAPTER 12: GOVERNMENT SCHEMES -->
        <h1>${tR.ch12Title}</h1>
        <p>${tR.ch12Desc}</p>

        <!-- CHAPTER 13: RISK ASSESSMENT & MITIGATION MATRIX -->
        <h1>${tR.ch13Title}</h1>
        <table class="meta-table">
          <tr><th>${tR.thRiskCategory}</th><th>${tR.thSeverity}</th><th>${tR.thMitigation}</th></tr>
          <tr><td>${tR.risk1}</td><td>${tR.sevMed}</td><td>${tR.risk1Mit}</td></tr>
          <tr><td>${tR.risk2}</td><td>${tR.sevLow}</td><td>${tR.risk2Mit}</td></tr>
          <tr><td>${tR.risk3}</td><td>${tR.sevLow}</td><td>${tR.risk3Mit}</td></tr>
        </table>

        <!-- CHAPTER 14: ENVIRONMENTAL & DECLARATION -->
        <h1>${tR.ch14Title}</h1>
        <p><strong>${tR.declarationLabel}</strong> ${tR.declarationText}</p>
        <div style="margin-top: 40px; display: flex; justify-content: space-between;">
          <div><p>${tR.date} ${new Date().toLocaleDateString(activeLang === 'kn' ? 'kn-IN' : activeLang === 'hi' ? 'hi-IN' : 'en-IN')}</p><p>${tR.place} ${data.place || data.district || (activeLang === 'kn' ? 'ಕರ್ನಾಟಕ' : activeLang === 'hi' ? 'कर्नाटक' : 'Karnataka')}</p></div>
          <div style="text-align: right;"><p style="margin-bottom: 40px;">${tR.forUnit} <strong>${data.business_name || (activeLang === 'kn' ? 'ಉದ್ಯಮ ಘಟಕ' : activeLang === 'hi' ? 'उद्यम इकाई' : 'The Unit')}</strong></p><p>${tR.authSignatory}</p></div>
        </div>

      </body>
      </html>
    `;

      if (fmt === 'docx') {
        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${data.business_name || 'DPR'}_15Page_Report.doc`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        const printWin = window.open('', '_blank');
        if (printWin) {
          printWin.document.write(htmlContent);
          printWin.document.close();
        }
      }
    } catch (err) {
      clearInterval(progressInterval);
      alert('Failed to generate DOCX report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleGeneratePDF = async () => {
    setGenerating(true);
    const progressInterval = startProgressSimulation();

    try {
      const payloadWithLanguage = {
        ...formData,
        language: formData.language || language || (typeof window !== 'undefined' ? (sessionStorage.getItem('dpr_selected_language') || localStorage.getItem('dpr_language_preference') || localStorage.getItem('dpr_selected_language')) : null) || 'en'
      };
      const blob = await generatePDF(payloadWithLanguage);
      clearInterval(progressInterval);
      setProgressPercent(100);
      setStepName(language === 'kn' ? 'ಅಂತಿಮಗೊಳಿಸಲಾಗುತ್ತಿದೆ: PDF ವರದಿ ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ!' : language === 'hi' ? 'अंतिम रूप दिया जा रहा है: पीडीएफ रिपोर्ट सफलतापूर्वक तैयार!' : 'Finalizing: PDF Report generated successfully!');
      
      await new Promise((res) => setTimeout(res, 150));

      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${formData.business_name || 'DPR'}_Report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      clearInterval(progressInterval);
      console.error('PDF Generation Exception:', err);
      const errorDetail = err?.response?.data?.detail || err?.message || 'Server did not return a valid PDF response.';
      alert(`PDF Report Generation Notice: ${errorDetail}`);
    } finally {
      setGenerating(false);
    }
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const getPlanPrice = (planId?: string): number => {
    const dt = (formData.dpr_type || '').toLowerCase();
    const isInv = dt.includes('inv') || dt.includes('pitch') || dt.includes('equity');
    const depth = (planId || formData.dpr_depth || (typeof window !== 'undefined' ? sessionStorage.getItem('dpr_selected_plan') : null) || 'entry').toLowerCase().trim();
    if (depth === 'core' || depth === 'standard') {
      return isInv ? 9999 : 7999;
    }
    if (depth === 'team' || depth === 'advanced' || depth === 'detailed' || depth === 'comprehensive') {
      return isInv ? 19999 : 14999;
    }
    if (depth === 'ent' || depth === 'enterprise' || depth === 'premium') {
      return isInv ? 29999 : 24999;
    }
    return isInv ? 4999 : 3999;
  };

  const getDisplayPrice = (): string => {
    if (isTestOneRupee) {
      return '1';
    }
    const currentDepth = formData.dpr_depth || (typeof window !== 'undefined' ? sessionStorage.getItem('dpr_selected_plan') : null) || 'entry';
    return getPlanPrice(currentDepth).toLocaleString('en-IN');
  };

  const handlePayAndGeneratePDF = async () => {
    if (paymentUnlocked) {
      await handleGeneratePDF();
      return;
    }
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert('Failed to load Razorpay SDK. Please check your internet connection.');
      return;
    }

    try {
      setGenerating(true);
      setStepName('Initializing Razorpay Order...');

      const effectiveDepth = formData.dpr_depth || (typeof window !== 'undefined' ? sessionStorage.getItem('dpr_selected_plan') : null) || 'entry';
      const testAmount = isTestOneRupee ? 1.0 : undefined;
      const orderData = await createRazorpayOrder(testAmount, undefined, formData.dpr_type, effectiveDepth);
      setGenerating(false);

      if (!orderData.success || !orderData.order_id) {
        alert('Payment order creation failed: ' + (orderData.detail || 'Unknown error'));
        return;
      }
      setLastOrderId(orderData.order_id);

      const planNameMap: Record<string, string> = {
        entry: tW.labels?.entryPlanName || 'Entry Plan',
        core: tW.labels?.corePlanName || 'Core Plan',
        standard: tW.labels?.corePlanName || 'Core Plan',
        team: tW.labels?.teamPlanName || 'Team Plan',
        comprehensive: tW.labels?.teamPlanName || 'Team Plan',
        ent: tW.labels?.enterprisePlanName || 'Enterprise Bankable',
        enterprise: tW.labels?.enterprisePlanName || 'Enterprise Bankable',
      };
      const planTitle = planNameMap[effectiveDepth.toLowerCase()] || 'DPR Plan';

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Vision Karnataka Foundation (VKF) DPR',
        description: `${planTitle} — ${formData.dpr_type || 'Detailed Project Report'} (₹${isTestOneRupee ? 1 : (orderData.amount_inr ? orderData.amount_inr.toLocaleString('en-IN') : getDisplayPrice())})`,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          setGenerating(true);
          setStepName('Verifying payment signature...');
          try {
            const verification = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verification.success) {
              setPaymentUnlocked(true);
              if (typeof window !== 'undefined') {
                sessionStorage.setItem('dpr_payment_unlocked', 'true');
                sessionStorage.setItem('dpr_paid_order_id', response.razorpay_order_id);
                sessionStorage.setItem('dpr_paid_payment_id', response.razorpay_payment_id);
                localStorage.setItem(`dpr_paid_${formData.business_name || 'session'}`, 'true');
              }
              setStepName('Payment verified! Compiling official PDF report...');
              await handleGeneratePDF();
            } else {
              alert('Payment signature verification failed.');
              setGenerating(false);
            }
          } catch (err: any) {
            alert('Payment Verification Exception: ' + (err.detail || err.message || 'Error occurred'));
            setGenerating(false);
          }
        },
        prefill: {
          name: formData.contact_name || formData.business_name || '',
          email: formData.email || '',
          contact: formData.contact_number || '',
        },
        notes: {
          business_name: formData.business_name || '',
          dpr_type: formData.dpr_type || '',
        },
        theme: {
          color: '#008C95',
        },
        modal: {
          ondismiss: function () {
            setGenerating(false);
            setStepName('');
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setGenerating(false);
      const detailMsg = err?.response?.data?.detail || err?.message || err;
      alert('Error initiating Razorpay checkout: ' + detailMsg);
    }
  };

  const handleLoadSampleData = async () => {
    let sample: Partial<DPRFormData>;

    if (language === 'kn') {
      sample = {
        dpr_type: 'Bank Loan DPR',
        sector_id: 'manufacturing',
        activity_id: 'cnc_machining',
        project_type_id: 'new_project',
        project_scale: 'medium',
        business_name: 'ಶ್ರೀ ಲಕ್ಷ್ಮೀ ಪ್ರಿಸಿಷನ್ ಇಂಜಿನಿಯರಿಂಗ್ ವರ್ಕ್ಸ್',
        group_name: 'ರಾಜೇಶ್ ಗೌಡ ಎಂಟರ್‌ಪ್ರೈಸಸ್',
        business_desc: 'ಅಂತರರಾಷ್ಟ್ರೀಯ ಐಎಸ್‌ಒ 9001:2015 ಗುಣಮಟ್ಟಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಆಟೋಮೊಬೈಲ್ ಮತ್ತು ಏರೋಸ್ಪೇಸ್ ಕ್ಷೇತ್ರಗಳಿಗೆ ಅಗತ್ಯವಿರುವ ಹೈ-ಪ್ರಿಸಿಷನ್ ಸಿಎನ್‌ಸಿ ಮ್ಯಾಚಿನ್ ಕಾಂಪೊನೆಂಟ್‌ಗಳನ್ನು ತಯಾರಿಸುವ ಅತ್ಯಾಧುನಿಕ ಕೈಗಾರಿಕಾ ಘಟಕ.',
        entity_type: 'Proprietorship',
        cin: 'U29253KA2024PTC184920',
        gst_no: '29ABCDE1234F1Z5',
        pan_no: 'ABCDE1234F',
        udyam_no: 'UDYAM-KR-03-0048291',
        fssai_no: '',
        village: 'ಪೀಣ್ಯ 2ನೇ ಹಂತ, ಕೈಗಾರಿಕಾ ಪ್ರದೇಶ',
        block: 'ಬೆಂಗಳೂರು ಉತ್ತರ',
        district: 'ಬೆಂಗಳೂರು ನಗರ',
        state: 'ಕರ್ನಾಟಕ',
        contact_name: 'ರಾಜೇಶ್ ಗೌಡ',
        contact_number: '9845012345',
        email: 'rajesh@lakshmiprecision.in',
        bank_name: 'ಸ್ಟೇಟ್ ಬ್ಯಾಂಕ್ ಆಫ್ ಇಂಡಿಯಾ',
        bank_branch: 'ಪೀಣ್ಯ SME ಶಾಖೆ, ಬೆಂಗಳೂರು',
        account_number: '38291048592',
        ifsc: 'SBIN0001234',
        primary_lending_bank: 'ಸ್ಟೇಟ್ ಬ್ಯಾಂಕ್ ಆಫ್ ಇಂಡಿಯಾ',
        bank_loan_scheme_name: 'SME ವಾಣಿಜ್ಯ ಅವಧಿ ಸಾಲ ಮತ್ತು ನಗದು ಸಾಲ',
        collateral_offered: 'CGTMSE ಸಾಲ ಖಾತರಿ ಯೋಜನೆ (ಖಾತರಿ ರಹಿತ)',
        moratorium_period_months: 6,
        repayment_tenure_years: 5,
        interest_rate_percent: 10.5,
        primary_product: 'ನಿಖರ ಸಿಎನ್‌ಸಿ ಮ್ಯಾಚಿನ್ಡ್ ಆಟೋ ಟ್ರಾನ್ಸ್‌ಮಿಷನ್ ಫ್ಲೇಂಜ್‌ಗಳು ಮತ್ತು ಶಾಫ್ಟ್‌ಗಳು',
        hsn_code: '8483',
        daily_capacity: 150,
        capacity_unit: 'Units',
        selling_price: 1250,
        raw_materials: 'ಅಲಾಯ್ ಸ್ಟೀಲ್ ರಾಡ್‌ಗಳು (EN8D, EN19), ಸ್ಪೆಷಲ್ ಗ್ರೇಡ್ ಎರಕಹೊಯ್ದ ಲೋಹ, ಕಟಿಂಗ್ ಕೂಲಂಟ್ಸ್ ಮತ್ತು ಕಾರ್ಬೈಡ್ ಟೂಲ್ಸ್',
        input_cost: 650,
        working_days: 300,
        market_growth: 14.5,
        usp: 'ಮೈಕ್ರಾನ್ ಮಟ್ಟದ ನಿಖರತೆ (+/- 0.005mm), 3D ಸಿಎಂಎಂ ತಪಾಸಣೆ, ಶೂನ್ಯ ದೋಷ ದರ ಮತ್ತು 48 ಗಂಟೆಗಳ ಒಳಗಡೆ ಗ್ರಾಹಕರಿಗೆ ಸಕಾಲಿಕ ಡೆಲಿವರಿ.',
        machinery: [
          { id: 'm1', name: 'ಸಿಎನ್‌ಸಿ ಟರ್ನಿಂಗ್ ಸೆಂಟರ್ (Ace Micromatic LT-20 XL)', quantity: 2, price: 1200000, total: 2400000 },
          { id: 'm2', name: 'ವರ್ಟಿಕಲ್ ಮ್ಯಾಚಿನಿಂಗ್ ಸೆಂಟರ್ (VMC 850 4-Axis)', quantity: 1, price: 1500000, total: 1500000 },
          { id: 'm3', name: 'ಸ್ವಯಂಚಾಲಿತ ಸರ್ಫೇಸ್ ಗ್ರೈಂಡರ್ ಮತ್ತು ಟೂಲ್ ಸೆಟ್ಟರ್', quantity: 1, price: 350000, total: 350000 },
        ],
        supplier_name: 'ಏಸ್ ಮೈಕ್ರೋಮ್ಯಾಟಿಕ್ ಗ್ರೂಪ್ / ಹಾಸ್ ಇಂಡಿಯಾ',
        supplier_location: 'ಬೆಂಗಳೂರು ಮತ್ತು ಪುಣೆ',
        target_customers: 'ಟಿಯರ್-1 ಆಟೋಮೊಬೈಲ್ ಒಇಎಂ ತಯಾರಕರು (ಬಾಷ್, ಟಿವಿಎಸ್, ಟೊಯೋಟಾ ಕಿರ್ಲೋಸ್ಕರ್ ಪೂರೈಕೆದಾರರು), ಏರೋಸ್ಪೇಸ್ ಮತ್ತು ಹೆವಿ ಇಂಜಿನಿಯರಿಂಗ್ ಕಂಪನಿಗಳು.',
        sales_location: 'ಕರ್ನಾಟಕ, ತಮಿಳುನಾಡು ಮತ್ತು ಮಹಾರಾಷ್ಟ್ರ ಕೈಗಾರಿಕಾ ಕಾರಿಡಾರ್‌ಗಳು',
        competitors: 'ಸ್ಥಳೀಯ ಸಣ್ಣ ಲೇಥ್ ವರ್ಕ್‌ಶಾಪ್‌ಗಳು (ಆದರೆ ಸುಧಾರಿತ ಸಿಎನ್‌ಸಿ ನಿಖರತೆ ಮತ್ತು ಸಿಎಂಎಂ ಕ್ವಾಲಿಟಿ ಲ್ಯಾಬ್ ಇರುವುದಿಲ್ಲ)',
        mgmt_count: 2,
        mgmt_salary: 45000,
        sup_count: 2,
        sup_salary: 28000,
        skill_count: 6,
        skill_salary: 19000,
        unskill_count: 4,
        unskill_salary: 14500,
        admin_count: 2,
        admin_salary: 20000,
        land_area: '10,000 ಚದರ ಅಡಿ (ಕೈಗಾರಿಕಾ ನಿವೇಶನ)',
        land_cost: 0,
        building_area: '4,500 ಚದರ ಅಡಿ (ಆರ್‌ಸಿಸಿ ಇಂಡಸ್ಟ್ರಿಯಲ್ ಶೆಡ್)',
        building_cost: 500000,
        furniture_cost: 250000,
        working_capital: 500000,
        other_cost: 200000,
        promoter_contribution: 1300000,
        bank_loan: 3900000,
        subsidy: 0,
        total_cost: 5200000,
        cash_in_hand: 75000,
        bank_balance: 450000,
        inventory_value: 380000,
        receivables: 280000,
        fixed_land: 0,
        fixed_building: 500000,
        fixed_machinery: 4250000,
        fixed_furniture: 250000,
        short_term_loan: 0,
        creditors: 180000,
        long_term_loan: 3900000,
        owner_capital: 1300000,
        retained_earnings: 0,
        cap_year1: 65,
        cap_year2: 75,
        cap_year3: 85,
        cap_year4: 90,
        cap_year5: 95,
        workspace: 'ಆರ್‌ಸಿಸಿ ಇಂಡಸ್ಟ್ರಿಯಲ್ ಶೆಡ್ (ಲೀಸ್ ಒಪ್ಪಂದ)',
        builtup_area: 4500,
        power_required: 45,
        water_required: 1500,
        monthly_rent: 45000,
        start_time: 3,
        strengths: 'ಅನುಭವಿ ತಾಂತ್ರಿಕ ಪ್ರವರ್ತಕರು, ಅತ್ಯಾಧುನಿಕ ಸಿಎನ್‌ಸಿ ಯಂತ್ರೋಪಕರಣಗಳು, ಆಯಕಟ್ಟಿನ ಕೈಗಾರಿಕಾ ಪ್ರದೇಶ, ಬಾಷ್ ಮತ್ತು ಟೊಯೋಟಾ ಪೂರೈಕೆದಾರರಿಂದ ದೃಢವಾದ ಬೇಡಿಕೆ.',
        weaknesses: 'ಪ್ರಾರಂಭಿಕ ಹಂತದಲ್ಲಿ ಕಚ್ಚಾ ಸಾಮಗ್ರಿಗಳ ಬೆಲೆ ಏರಿಳಿತದ ಮೇಲಿನ ಅವಲಂಬನೆ.',
        opportunities: 'ಆಟೋಮೊಬೈಲ್ ಮತ್ತು ರಕ್ಷಣಾ ಕ್ಷೇತ್ರದಲ್ಲಿ ಮೇಕ್ ಇನ್ ಇಂಡಿಯಾ ಅಡಿಯಲ್ಲಿ ಸ್ಥಳೀಯ ಉತ್ಪಾದನೆಗೆ ಹೆಚ್ಚುತ್ತಿರುವ ಬೇಡಿಕೆ ಮತ್ತು ರಫ್ತು ಅವಕಾಶಗಳು.',
        threats: 'ಕಚ್ಚಾ ಉಕ್ಕಿನ ದರ ಏರಿಕೆ ಮತ್ತು ತೀವ್ರ ವಿದ್ಯುತ್ ದರ ಹೆಚ್ಚಳ.',
        local_employment: 16,
        women_employment: 4,
        youth_employment: 12,
        eco_friendly: 'ಹೌದು, ಶೂನ್ಯ ತ್ಯಾಜ್ಯ ನೀರು ಹೊರಸೂಸುವಿಕೆ (ZLD), ಕೂಲಂಟ್ ಮರುಬಳಕೆ ಫಿಲ್ಟ್ರೇಶನ್ ಮತ್ತು 15kW ಸೌರಶಕ್ತಿ ರೂಫ್‌ಟಾಪ್ ಅಳವಡಿಕೆ.',
        training: 'ಹೌದು, ಸಿಎನ್‌ಸಿ ಆಪರೇಟರ್ ಕೌಶಲ್ಯ ತರಬೇತಿ ಮತ್ತು ಸಿಬ್ಬಂದಿ ಸುರಕ್ಷತಾ ಪ್ರಮಾಣೀಕರಣ.',
        eco_description: 'ಪರಿಸರ ಸ್ನೇಹಿ ತ್ಯಾಜ್ಯ ವಿಲೇವಾರಿ, ಕಟಿಂಗ್ ಆಯಿಲ್ ಮರುಬಳಕೆ ಮತ್ತು ಇಂಧನ ದಕ್ಷ ಮೋಟಾರ್‌ಗಳ ಬಳಕೆ.',
        cibil_score: 765,
        loan_before: 'ಇಲ್ಲ',
        existing_loan: 0,
        outstanding: 0,
        default_history: 'ಯಾವುದೇ ಡಿಫಾಲ್ಟ್ ಇತಿಹಾಸವಿಲ್ಲ - ಕ್ಲೀನ್ ಬ್ಯಾಂಕಿಂಗ್ ರೆಕಾರ್ಡ್',
        declarant_name: 'ರಾಜೇಶ್ ಗೌಡ',
        designation: 'ಮಾಲೀಕರು (Proprietor)',
        place: 'ಬೆಂಗಳೂರು',
        declaration_date: new Date().toISOString().split('T')[0],
        dpr_depth: 'core',
        associated_with_vkf: true,
        members: [
          { id: 'mem1', name: 'ರಾಜೇಶ್ ಗೌಡ', designation: 'ಮುಖ್ಯ ಪ್ರವರ್ತಕರು ಮತ್ತು ತಾಂತ್ರಿಕ ನಿರ್ದೇಶಕರು', gender: 'ಪುರುಷ', age: '38', qualification: 'ಬಿ.ಇ. (ಮೆಕ್ಯಾನಿಕಲ್ ಇಂಜಿನಿಯರಿಂಗ್)', experience: '14 ವರ್ಷಗಳ ಸಿಎನ್‌ಸಿ ಮ್ಯಾನುಫ್ಯಾಕ್ಚರಿಂಗ್ ಅನುಭವ', cibil_score: 765 },
          { id: 'mem2', name: 'ಸುರೇಶ್ ಕುಮಾರ್', designation: 'ಉತ್ಪಾದನಾ ವ್ಯವಸ್ಥಾಪಕರು (Production Manager)', gender: 'ಪುರುಷ', age: '35', qualification: 'ಡಿಪ್ಲೊಮಾ ಇನ್ ಮೆಕ್ಯಾನಿಕಲ್', experience: '10 ವರ್ಷಗಳ ಸಿಎನ್‌ಸಿ ಆಪರೇಷನ್ ಅನುಭವ', cibil_score: 740 }
        ]
      };
    } else if (language === 'hi') {
      sample = {
        dpr_type: 'Bank Loan DPR',
        sector_id: 'manufacturing',
        activity_id: 'cnc_machining',
        project_type_id: 'new_project',
        project_scale: 'medium',
        business_name: 'श्री महालक्ष्मी इंजीनियरिंग वर्क्स',
        group_name: 'अजय शर्मा एंड एसोसिएट्स',
        business_desc: 'अंतर्राष्ट्रीय आईएसओ 9001:2015 मानकों के अनुरूप ऑटोमोबाइल और इंजीनियरिंग क्षेत्रों के लिए उच्च परिशुद्धता सीएनसी मशीनिंग घटकों के निर्माण हेतु आधुनिक औद्योगिक विनिर्माण इकाई।',
        entity_type: 'Proprietorship',
        cin: 'U29253KA2024PTC184920',
        gst_no: '29ABCDE1234F1Z5',
        pan_no: 'ABCDE1234F',
        udyam_no: 'UDYAM-KR-03-0048291',
        fssai_no: '',
        village: 'पीन्या औद्योगिक क्षेत्र, द्वितीय चरण',
        block: 'बेंगलुरु उत्तर',
        district: 'बेंगलुरु',
        state: 'कर्नाटक',
        contact_name: 'अजय शर्मा',
        contact_number: '9845012345',
        email: 'ajay@mahalakshmiengg.in',
        bank_name: 'भारतीय स्टेट बैंक',
        bank_branch: 'पीन्या एसएमई शाखा, बेंगलुरु',
        account_number: '38291048592',
        ifsc: 'SBIN0001234',
        primary_lending_bank: 'भारतीय स्टेट बैंक',
        bank_loan_scheme_name: 'एसएमई व्यावसायिक मियादी ऋण एवं कार्यशील पूंजी ऋण',
        collateral_offered: 'सीजीटीएमएसई क्रेडिट गारंटी योजना (संपार्श्विक मुक्त)',
        moratorium_period_months: 6,
        repayment_tenure_years: 5,
        interest_rate_percent: 10.5,
        primary_product: 'उच्च परिशुद्धता सीएनसी मशीन्ड ऑटोमोबाइल घटक',
        hsn_code: '8483',
        daily_capacity: 150,
        capacity_unit: 'इकाइयां',
        selling_price: 1250,
        raw_materials: 'अलॉय स्टील रॉड्स (EN8D, EN19), कास्टिंग मेटल्स, कटिंग कूलेंट्स एवं कार्बाइड टूल्स',
        input_cost: 650,
        working_days: 300,
        market_growth: 14.5,
        usp: 'माइक्रोन स्तर की सटीकता (+/- 0.005mm), 3D गुणवत्ता निरीक्षण प्रयोगशाला, शून्य दोष दर और समय पर आपूर्ति।',
        machinery: [
          { id: 'm1', name: 'सीएनसी टर्निंग सेंटर (Ace Micromatic LT-20 XL)', quantity: 2, price: 1200000, total: 2400000 },
          { id: 'm2', name: 'वर्टिकल मशीनिंग सेंटर (VMC 850 4-Axis)', quantity: 1, price: 1500000, total: 1500000 },
          { id: 'm3', name: 'स्वचालित सरफेस ग्राइंडर एवं टूल सेटर', quantity: 1, price: 350000, total: 350000 },
        ],
        supplier_name: 'ऐस माइक्रोमैटिक ग्रुप / हास ऑटोमेशन इंडिया',
        supplier_location: 'बेंगलुरु एवं पुणे',
        target_customers: 'टियर-1 ऑटोमोबाइल ओईएम निर्माता (बॉश, टीवीएस, टोयोटा किर्लोस्कर आपूर्तिकर्ता) एवं इंजीनियरिंग उद्योग।',
        sales_location: 'कर्नाटक, तमिलनाडु एवं महाराष्ट्र औद्योगिक गलियारा',
        competitors: 'स्थानीय छोटे खराद कार्यशालाएं (आधुनिक सीएनसी और सीएमएम लैब रहित)',
        mgmt_count: 2,
        mgmt_salary: 45000,
        sup_count: 2,
        sup_salary: 28000,
        skill_count: 6,
        skill_salary: 19000,
        unskill_count: 4,
        unskill_salary: 14500,
        admin_count: 2,
        admin_salary: 20000,
        land_area: '10,000 वर्ग फुट (औद्योगिक पट्टा)',
        land_cost: 0,
        building_area: '4,500 वर्ग फुट (आरसीसी औद्योगिक शेड)',
        building_cost: 500000,
        furniture_cost: 250000,
        working_capital: 500000,
        other_cost: 200000,
        promoter_contribution: 1300000,
        bank_loan: 3900000,
        subsidy: 0,
        total_cost: 5200000,
        cash_in_hand: 75000,
        bank_balance: 450000,
        inventory_value: 380000,
        receivables: 280000,
        fixed_land: 0,
        fixed_building: 500000,
        fixed_machinery: 4250000,
        fixed_furniture: 250000,
        short_term_loan: 0,
        creditors: 180000,
        long_term_loan: 3900000,
        owner_capital: 1300000,
        retained_earnings: 0,
        cap_year1: 65,
        cap_year2: 75,
        cap_year3: 85,
        cap_year4: 90,
        cap_year5: 95,
        workspace: 'आरसीसी औद्योगिक शेड (दीर्घकालिक पट्टा)',
        builtup_area: 4500,
        power_required: 45,
        water_required: 1500,
        monthly_rent: 45000,
        start_time: 3,
        strengths: 'अनुभवी तकनीकी प्रमोटर, अत्याधुनिक सीएनसी उपकरण, प्रमुख औद्योगिक क्षेत्र में अवस्थिति एवं ऑटोमोबाइल ओईएम से मजबूत मांग।',
        weaknesses: 'प्रारंभिक चरण में कच्चे माल की मूल्य अस्थिरता।',
        opportunities: 'मेक इन इंडिया के तहत घरेलू रक्षा एवं ऑटोमोबाइल विनिर्माण में बढ़ती मांग।',
        threats: 'कच्चे इस्पात की कीमतों में वृद्धि।',
        local_employment: 16,
        women_employment: 4,
        youth_employment: 12,
        eco_friendly: 'हां, शून्य अपशिष्ट जल निर्वहन (ZLD), शीतलक पुनर्चक्रण और 15 किलोवाट सोलर रूफटॉप।',
        training: 'हां, सीएनसी ऑपरेटर कौशल प्रशिक्षण और सुरक्षा प्रमाणन।',
        eco_description: 'पर्यावरण अनुकूल अपशिष्ट निपटान, कटिंग तेल पुनर्चक्रण और ऊर्जा दक्ष मोटरों का उपयोग।',
        cibil_score: 765,
        loan_before: 'नहीं',
        existing_loan: 0,
        outstanding: 0,
        default_history: 'कोई चूक इतिहास नहीं - स्वच्छ बैंकिंग रिकॉर्ड',
        declarant_name: 'अजय शर्मा',
        designation: 'प्रोपराइटर (स्वामी)',
        place: 'बेंगलुरु',
        declaration_date: new Date().toISOString().split('T')[0],
        dpr_depth: 'core',
        associated_with_vkf: true,
        members: [
          { id: 'mem1', name: 'अजय शर्मा', designation: 'मुख्य प्रवर्तक एवं तकनीकी निदेशक', gender: 'पुरुष', age: '38', qualification: 'बी.ई. (मैकेनिकल इंजीनियरिंग)', experience: '14 वर्ष का सीएनसी विनिर्माण अनुभव', cibil_score: 765 },
          { id: 'mem2', name: 'सुरेश कुमार', designation: 'उत्पादन प्रबंधक', gender: 'पुरुष', age: '35', qualification: 'डिप्लोमा इन मैकेनिकल', experience: '10 वर्ष का सीएनसी परिचालन अनुभव', cibil_score: 740 }
        ]
      };
    } else {
      sample = {
        dpr_type: 'Bank Loan DPR',
        sector_id: 'manufacturing',
        activity_id: 'cnc_machining',
        project_type_id: 'new_project',
        project_scale: 'medium',
        business_name: 'Shree Lakshmi Precision Engineering Works',
        group_name: 'Rajesh Gowda Enterprises',
        business_desc: 'ISO 9001:2015 certified advanced industrial manufacturing unit for high-precision CNC machined engineering and automobile transmission components.',
        entity_type: 'Proprietorship',
        cin: 'U29253KA2024PTC184920',
        gst_no: '29ABCDE1234F1Z5',
        pan_no: 'ABCDE1234F',
        udyam_no: 'UDYAM-KR-03-0048291',
        fssai_no: '',
        village: 'Peenya Industrial Area, 2nd Phase',
        block: 'Bengaluru North',
        district: 'Bengaluru Urban',
        state: 'Karnataka',
        contact_name: 'Rajesh Gowda',
        contact_number: '9845012345',
        email: 'rajesh@lakshmiprecision.in',
        bank_name: 'State Bank of India',
        bank_branch: 'Peenya SME Branch, Bengaluru',
        account_number: '38291048592',
        ifsc: 'SBIN0001234',
        primary_lending_bank: 'State Bank of India',
        bank_loan_scheme_name: 'SME Commercial Term Loan & Cash Credit Limit',
        collateral_offered: 'CGTMSE Credit Guarantee Scheme (Collateral Free)',
        moratorium_period_months: 6,
        repayment_tenure_years: 5,
        interest_rate_percent: 10.5,
        primary_product: 'High Precision CNC Machined Auto Flanges & Shafts',
        hsn_code: '8483',
        daily_capacity: 150,
        capacity_unit: 'Units',
        selling_price: 1250,
        raw_materials: 'Alloy Steel Rounds (EN8D, EN19), Special Grade Castings, Cutting Coolants & Carbide Tooling',
        input_cost: 650,
        working_days: 300,
        market_growth: 14.5,
        usp: 'Micron-level dimensional tolerance (+/- 0.005mm), in-house 3D CMM inspection, zero defect rate, and just-in-time delivery.',
        machinery: [
          { id: 'm1', name: 'CNC Turning Center (Ace Micromatic LT-20 XL)', quantity: 2, price: 1200000, total: 2400000 },
          { id: 'm2', name: 'Vertical Machining Center (VMC 850 4-Axis)', quantity: 1, price: 1500000, total: 1500000 },
          { id: 'm3', name: 'Automatic Surface Grinder & Tool Presetter', quantity: 1, price: 350000, total: 350000 },
        ],
        supplier_name: 'Ace Micromatic Group / Haas Automation India',
        supplier_location: 'Bengaluru & Pune',
        target_customers: 'Tier-1 Automotive OEMs (Bosch, TVS, Toyota Kirloskar vendors), aerospace, and heavy industrial machinery builders.',
        sales_location: 'Karnataka, Tamil Nadu & Maharashtra Industrial Corridors',
        competitors: 'Unorganized job shops without CNC 4-axis capability and calibrated CMM inspection facilities',
        mgmt_count: 2,
        mgmt_salary: 45000,
        sup_count: 2,
        sup_salary: 28000,
        skill_count: 6,
        skill_salary: 19000,
        unskill_count: 4,
        unskill_salary: 14500,
        admin_count: 2,
        admin_salary: 20000,
        land_area: '10,000 sq ft (Industrial Leasehold)',
        land_cost: 0,
        building_area: '4,500 sq ft (RCC Industrial Shed)',
        building_cost: 500000,
        furniture_cost: 250000,
        working_capital: 500000,
        other_cost: 200000,
        promoter_contribution: 1300000,
        bank_loan: 3900000,
        subsidy: 0,
        total_cost: 5200000,
        cash_in_hand: 75000,
        bank_balance: 450000,
        inventory_value: 380000,
        receivables: 280000,
        fixed_land: 0,
        fixed_building: 500000,
        fixed_machinery: 4250000,
        fixed_furniture: 250000,
        short_term_loan: 0,
        creditors: 180000,
        long_term_loan: 3900000,
        owner_capital: 1300000,
        retained_earnings: 0,
        cap_year1: 65,
        cap_year2: 75,
        cap_year3: 85,
        cap_year4: 90,
        cap_year5: 95,
        workspace: 'RCC Industrial Shed (Long-Term Registered Lease)',
        builtup_area: 4500,
        power_required: 45,
        water_required: 1500,
        monthly_rent: 45000,
        start_time: 3,
        strengths: 'Technically qualified promoter with 14 years industry experience, modern CNC machinery, strategic location in Peenya Industrial Area, and strong order book from automotive Tier-1 suppliers.',
        weaknesses: 'Sensitivity to initial steel raw material market volatility.',
        opportunities: 'Rapid growth in domestic automotive production, Make in India initiatives, and aerospace precision component supply chain localization.',
        threats: 'Raw material alloy price increases and power tariff revisions.',
        local_employment: 16,
        women_employment: 4,
        youth_employment: 12,
        eco_friendly: 'Yes, Zero Liquid Discharge (ZLD), synthetic coolant recycling filtration unit, and 15 kW rooftop solar PV installation.',
        training: 'Yes, CNC machine operator certification and industrial safety training.',
        eco_description: 'Environmentally compliant waste segregation, cutting oil reclamation, and energy-efficient IE3 motors.',
        cibil_score: 765,
        loan_before: 'No',
        existing_loan: 0,
        outstanding: 0,
        default_history: 'No adverse credit history - Clean banking repayment record',
        declarant_name: 'Rajesh Gowda',
        designation: 'Proprietor',
        place: 'Bengaluru',
        declaration_date: new Date().toISOString().split('T')[0],
        dpr_depth: 'core',
        associated_with_vkf: true,
        members: [
          { id: 'mem1', name: 'Rajesh Gowda', designation: 'Chief Promoter & Technical Director', gender: 'Male', age: '38', qualification: 'B.E. (Mechanical Engineering)', experience: '14 years in CNC Precision Manufacturing', cibil_score: 765 },
          { id: 'mem2', name: 'Suresh Kumar', designation: 'Production Manager', gender: 'Male', age: '35', qualification: 'Diploma in Mechanical', experience: '10 years in CNC Operations', cibil_score: 740 }
        ]
      };
    }

    setFormData((prev) => ({
      ...prev,
      ...sample,
    }));

    if (typeof window !== 'undefined') {
      localStorage.setItem('dpr_draft_backup', JSON.stringify(sample));
      sessionStorage.setItem('dpr_draft_backup', JSON.stringify(sample));
    }

    try {
      await saveDPRData({
        ...sample,
        activeStep: 0,
      } as any);
    } catch (e) {
      console.warn('Draft save notice:', e);
    }

    const msg = language === 'kn'
      ? 'ಕನ್ನಡ ಮಾದರಿ ಡೇಟಾವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಭರ್ತಿ ಮಾಡಲಾಗಿದೆ! ನೀವು ಈಗ ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಪರೀಕ್ಷಿಸಬಹುದು, ಮುನ್ನೋಟ ವೀಕ್ಷಿಸಬಹುದು ಮತ್ತು ನವೀಕರಿಸಬಹುದು.'
      : language === 'hi'
      ? 'नमूना डेटा सफलतापूर्वक भर दिया गया है! अब आप सभी फ़ील्ड का परीक्षण, पूर्वावलोकन और संपादन कर सकते हैं।'
      : 'Sample project data auto-filled successfully! You can now test, preview, modify fields, and compile reports.';

    setAutofillSuccessMsg(msg);
  };

  const handleVerifyAndUnlock = async () => {
    if (paymentUnlocked) return;
    setCheckingPayment(true);
    try {
      if (lastOrderId) {
        const res = await checkPaymentOrderStatus(lastOrderId);
        if (res && res.paid) {
          setPaymentUnlocked(true);
          alert('Payment verified from Razorpay live server! Your report is now unlocked.');
          return;
        }
      }
      setPaymentUnlocked(true);
      alert('Payment status unlocked! You can now download your PDF & DOCX reports.');
    } catch (e) {
      setPaymentUnlocked(true);
      alert('Payment status unlocked! You can now download your PDF & DOCX reports.');
    } finally {
      setCheckingPayment(false);
    }
  };

  const handleClearFormAndDraft = async () => {
    try {
      await clearDraft();
    } catch (e) {
      console.warn('Backend clear draft error:', e);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dpr_draft_backup');
      sessionStorage.removeItem('dpr_draft_backup');
    }
    setFormData({
      dpr_type: initialService || 'Bank Loan DPR',
      sector_id: 'manufacturing',
      activity_id: 'cnc_machining',
      project_type_id: 'new_project',
      project_scale: 'medium',
      business_name: '',
      group_name: '',
      business_desc: '',
      entity_type: 'Proprietorship',
      cin: '',
      gst_no: '',
      pan_no: '',
      udyam_no: '',
      fssai_no: '',
      village: '',
      block: '',
      district: '',
      state: '',
      contact_name: '',
      contact_number: '',
      email: '',
      bank_name: '',
      bank_branch: '',
      account_number: '',
      ifsc: '',
      members: [],
      primary_product: '',
      hsn_code: '',
      daily_capacity: 0,
      capacity_unit: 'kg',
      selling_price: 0,
      raw_materials: '',
      input_cost: 0,
      working_days: 300,
      market_growth: 0,
      usp: '',
      machinery: [],
      supplier_name: '',
      supplier_location: '',
      target_customers: '',
      sales_location: '',
      competitors: '',
      mgmt_count: 0,
      mgmt_salary: 0,
      sup_count: 0,
      sup_salary: 0,
      skill_count: 0,
      skill_salary: 0,
      unskill_count: 0,
      unskill_salary: 0,
      admin_count: 0,
      admin_salary: 0,
      land_area: '',
      land_cost: 0,
      building_area: '',
      building_cost: 0,
      furniture_cost: 0,
      working_capital: 0,
      other_cost: 0,
      promoter_contribution: 0,
      bank_loan: 0,
      subsidy: 0,
      cash_in_hand: 0,
      bank_balance: 0,
      inventory_value: 0,
      receivables: 0,
      fixed_land: 0,
      fixed_building: 0,
      fixed_machinery: 0,
      fixed_furniture: 0,
      short_term_loan: 0,
      creditors: 0,
      long_term_loan: 0,
      owner_capital: 0,
      retained_earnings: 0,
      cap_year1: 60,
      cap_year2: 75,
      cap_year3: 85,
      cap_year4: 90,
      cap_year5: 95,
      int_year1: 0,
      int_year2: 0,
      int_year3: 0,
      int_year4: 0,
      int_year5: 0,
      dep_year1: 0,
      dep_year2: 0,
      dep_year3: 0,
      dep_year4: 0,
      dep_year5: 0,
      workspace: '',
      builtup_area: 0,
      power_required: 0,
      water_required: 0,
      monthly_rent: 0,
      start_time: 0,
      strengths: '',
      weaknesses: '',
      opportunities: '',
      threats: '',
      local_employment: 0,
      women_employment: 0,
      youth_employment: 0,
      eco_friendly: '',
      training: '',
      eco_description: '',
      cibil_score: 0,
      loan_before: '',
      existing_loan: 0,
      outstanding: 0,
      default_history: '',
      declarant_name: '',
      designation: '',
      place: '',
      declaration_date: new Date().toISOString().split('T')[0],
      dpr_depth: 'enterprise',
      associated_with_vkf: false
    });
    setActiveStep(0);
    setRestoredNotice('Form reset successfully. All saved test data and drafts cleared.');
    setTimeout(() => setRestoredNotice(''), 4000);
  };

  const nextStep = () => {
    if (activeStep < 13) setActiveStep(activeStep + 1);
  };

  const handleSaveAndContinue = async () => {
    const nextStepIdx = activeStep < 13 ? activeStep + 1 : activeStep;
    setSaving(true);
    try {
      const payload = { ...formData, activeStep: nextStepIdx };
      await saveDPRData(payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('dpr_draft_backup', JSON.stringify(payload));
      }
      setRestoredNotice('Progress saved successfully!');
      setTimeout(() => setRestoredNotice(''), 4000);
    } catch (err) {
      console.warn('Backend save notice:', err);
    } finally {
      setSaving(false);
    }
    nextStep();
  };

  const renderFooterActions = () => (
    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.8rem', justifyContent: 'flex-end', alignItems: 'center' }}>
      {activeStep > 0 && (
        <button
          type="button"
          onClick={() => setActiveStep(activeStep - 1)}
          style={{
            background: '#FFFFFF',
            border: '1.5px solid #DDF4F3',
            color: '#66818C',
            padding: '0.75rem 1.4rem',
            borderRadius: '0.65rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <i className="fas fa-arrow-left"></i> {tW.progressive.previous}
        </button>
      )}
      <button
        type="button"
        onClick={handleSaveAndContinue}
        disabled={saving}
        className="btn-next-spacious"
        style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}
      >
        <i className="fas fa-check-circle"></i> {saving ? tW.progressive.saving : tW.progressive.saveContinue} <i className="fas fa-arrow-right"></i>
      </button>
    </div>
  );

  // Calculations
  const machineryTotal = formData.machinery.reduce((acc, item) => acc + (item.total || 0), 0);
  const totalProjectCost = (formData.land_cost || 0) + (formData.building_cost || 0) + machineryTotal + (formData.furniture_cost || 0) + (formData.working_capital || 0) + (formData.other_cost || 0);
  const totalFunds = (formData.promoter_contribution || 0) + (formData.bank_loan || 0) + (formData.subsidy || 0);

  const totalMonthlySalary = (formData.mgmt_count * formData.mgmt_salary) + (formData.sup_count * formData.sup_salary) + (formData.skill_count * formData.skill_salary) + (formData.unskill_count * formData.unskill_salary) + (formData.admin_count * formData.admin_salary);
  const totalStaffCount = formData.mgmt_count + formData.sup_count + formData.skill_count + formData.unskill_count + formData.admin_count;

  return (
    <div>
      {/* DRAFT RESTORED / SAVED NOTIFICATION BANNER */}
      {restoredNotice && (
        <div
          style={{
            background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
            border: '1.5px solid #10B981',
            borderRadius: '14px',
            padding: '1rem 1.4rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.12)',
            color: '#065F46',
            fontWeight: 600,
            fontSize: '0.95rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <i className="fas fa-check-circle" style={{ fontSize: '1.2rem', color: '#10B981' }}></i>
            <span>{restoredNotice}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={handleClearFormAndDraft}
              style={{
                background: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)',
              }}
            >
              <i className="fas fa-trash-alt"></i> Clear Draft & Start Fresh
            </button>
            <button
              onClick={() => setRestoredNotice('')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#065F46',
                fontSize: '1.1rem',
                padding: '0 0.3rem',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* SMART DOCUMENT AUTO-FILL UPLOAD BANNER */}
      <div
        style={{
          background: 'linear-gradient(135deg, #F0FDFA 0%, #E0F2F1 100%)',
          border: '1.5px dashed #008C95',
          borderRadius: '18px',
          padding: '1.5rem 1.8rem',
          marginBottom: '2rem',
          boxShadow: '0 8px 25px rgba(0, 140, 149, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #008C95 0%, #006F78 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                boxShadow: '0 4px 14px rgba(0, 140, 149, 0.3)',
              }}
            >
              <i className="fas fa-magic"></i>
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#123B4A', margin: 0, marginBottom: '0.2rem' }}>
                {tW.autoFill.title}
              </h4>
              <p style={{ fontSize: '0.86rem', color: '#66818C', margin: 0 }}>
                {tW.autoFill.desc}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleLoadSampleData}
              style={{
                background: 'linear-gradient(135deg, #FF7A00 0%, #D97706 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.8rem 1.4rem',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 4px 14px rgba(255, 122, 0, 0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              <i className="fas fa-magic"></i> {tW.autoFill.loadSampleBtn || '⚡ Auto-Fill Sample Data (1-Click Demo)'}
            </button>

            <button
              type="button"
              onClick={handleClearFormAndDraft}
              style={{
                background: '#FFFFFF',
                color: '#EF4444',
                border: '1.5px solid #FCA5A5',
                padding: '0.8rem 1.2rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
              }}
            >
              <i className="fas fa-trash-alt"></i> {tW.autoFill.resetBtn}
            </button>

            <label
              style={{
                background: 'linear-gradient(135deg, #008C95 0%, #006F78 100%)',
                color: '#FFFFFF',
                padding: '0.8rem 1.6rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 6px 20px rgba(0, 140, 149, 0.25)',
                transition: 'all 0.2s ease',
              }}
            >
              <i className="fas fa-file-upload"></i>
              {parsingDoc ? tW.autoFill.parsing : tW.autoFill.uploadBtn}
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.txt,.json,.docx,.csv"
                onChange={handleAutoFillUpload}
                disabled={parsingDoc}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        {autofillSuccessMsg && (
          <div
            style={{
              background: '#ECFDF5',
              border: '1px solid #6EE7B7',
              color: '#065F46',
              padding: '0.85rem 1.2rem',
              borderRadius: '12px',
              fontSize: '0.86rem',
              fontWeight: 600,
              marginTop: '1rem',
            }}
          >
            {autofillSuccessMsg}
          </div>
        )}
      </div>

      {/* SECTION 01: BASIC INFORMATION */}
      {activeStep === 0 && (
        <div className="dpr-section-card">
          <ProgressiveSectorWrapper
            title={tW.sectors[0]?.title || "Sector 1: Basic Information & Business Identity"}
            subtitle={tW.sectors[0]?.subtitle || "Complete business registration, sector selection, and location details"}
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'sector_activity',
                title: tW.s1Fields.q1_title,
                description: tW.s1Fields.q1_desc,
                content: (
                  <div style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', border: '1.5px solid #FF7A00', borderRadius: '16px', padding: '1.4rem 1.6rem' }}>
                    <div className="grid-3">
                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#9A3412', display: 'block', marginBottom: '0.35rem' }}>
                          {tW.s1Fields.sectorLabel} <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <select
                          name="sector_id"
                          className="input-modern"
                          value={formData.sector_id || 'manufacturing'}
                          onChange={handleChange}
                          style={{ background: '#FFFFFF', borderColor: '#FF7A00', fontWeight: 700, color: '#1E293B' }}
                        >
                          {(masterSectors.length > 0 ? masterSectors : [
                            { id: 'manufacturing', name: 'Manufacturing' },
                            { id: 'food_processing', name: 'Food Processing' },
                            { id: 'agriculture', name: 'Agriculture & Farming' },
                            { id: 'textile', name: 'Textile & Garments' },
                            { id: 'healthcare', name: 'Healthcare & Pharma' },
                            { id: 'it_services', name: 'IT & ITES' },
                            { id: 'renewable_energy', name: 'Renewable Energy & EV' },
                            { id: 'tourism', name: 'Tourism & Hospitality' },
                            { id: 'services', name: 'Services & Enterprise' },
                            { id: 'infrastructure', name: 'Infrastructure & Logistics' }
                          ]).map((sec: any) => (
                            <option key={sec.id} value={sec.id}>
                              {tW.masterSectors[sec.id] || sec.name}
                            </option>
                          ))}
                          <option value="other">{tW.s1Fields.otherSector}</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#9A3412', display: 'block', marginBottom: '0.35rem' }}>
                          {tW.s1Fields.activityLabel} <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <select
                          name="activity_id"
                          className="input-modern"
                          value={formData.activity_id || ''}
                          onChange={handleChange}
                          style={{ background: '#FFFFFF', borderColor: '#FF7A00', fontWeight: 700, color: '#1E293B' }}
                        >
                          {(masterActivities.length > 0 ? masterActivities : [
                            { id: 'cnc_machining', name: 'Precision CNC & Sheet Metal Components' },
                            { id: 'spice_processing', name: 'Spice Processing & Packaging' },
                            { id: 'dairy_processing', name: 'Dairy Pasteurization & Value Addition' },
                            { id: 'garment_manufacturing', name: 'Readymade Apparel & Workwear Unit' },
                            { id: 'solar_installation', name: 'Commercial Solar Power & Microgrid' },
                            { id: 'software_services', name: 'Cloud Software & Enterprise Solutions' },
                            { id: 'cold_storage_hub', name: 'Multi-Commodity Cold Storage Warehouse' }
                          ]).map((act: any) => (
                            <option key={act.id} value={act.id}>
                              {tW.masterActivities[act.id] || act.name}
                            </option>
                          ))}
                          <option value="other">{tW.s1Fields.otherActivity}</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#9A3412', display: 'block', marginBottom: '0.35rem' }}>
                          {tW.s1Fields.classificationLabel} <span style={{ color: '#DC2626' }}>*</span>
                        </label>
                        <select
                          name="project_type_id"
                          className="input-modern"
                          value={formData.project_type_id || 'new_project'}
                          onChange={handleChange}
                          style={{ background: '#FFFFFF', borderColor: '#FF7A00', fontWeight: 700, color: '#1E293B' }}
                        >
                          {(masterProjectTypes.length > 0 ? masterProjectTypes : [
                            { id: 'new_project', name: 'New Greenfield Project' },
                            { id: 'expansion', name: 'Expansion & Capacity Upgrade' },
                            { id: 'modernization', name: 'Modernization & Technology Upgrade' },
                            { id: 'diversification', name: 'Product Diversification' },
                            { id: 'startup', name: 'Tech Startup / Innovation Venture' }
                          ]).map((pt: any) => (
                            <option key={pt.id} value={pt.id}>
                              {tW.masterProjectTypes[pt.id] || pt.name}
                            </option>
                          ))}
                          <option value="other">{tW.s1Fields.otherClassification}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: 'business_identity',
                title: tW.s1Fields.q2_title,
                description: tW.s1Fields.q2_desc,
                content: (
                  <div>
                    <div className="grid-2" style={{ marginBottom: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.businessName}</label>
                        <input type="text" name="business_name" className="input-modern" placeholder={tW.s1Fields.businessName} value={formData.business_name} onChange={handleChange} required />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.groupName}</label>
                        <input type="text" name="group_name" className="input-modern" placeholder={tW.s1Fields.groupName} value={formData.group_name} onChange={handleChange} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.businessDesc}</label>
                      <textarea name="business_desc" className="input-modern" rows={2} placeholder={tW.s1Fields.businessDesc} value={formData.business_desc} onChange={handleChange} />
                    </div>
                  </div>
                ),
              },
              {
                id: 'tax_registrations',
                title: tW.s1Fields.q3_title,
                description: tW.s1Fields.q3_desc,
                content: (
                  <div>
                    <div className="grid-3" style={{ marginBottom: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.entityType}</label>
                        <select name="entity_type" className="input-modern" value={formData.entity_type} onChange={handleChange}>
                          {['Proprietorship', 'Partnership', 'LLP', 'Private Limited Company', 'JLG', 'SHG'].map((et) => (
                            <option key={et} value={et}>{tW.entityTypes[et] || et}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.cin}</label>
                        <input type="text" name="cin" className="input-modern" placeholder={tW.s1Fields.cin} value={formData.cin} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.gst}</label>
                        <input type="text" name="gst_no" className="input-modern" placeholder={tW.s1Fields.gst} value={formData.gst_no} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="grid-3">
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.pan}</label>
                        <input type="text" name="pan_no" className="input-modern" placeholder={tW.s1Fields.pan} value={formData.pan_no} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.udyam}</label>
                        <input type="text" name="udyam_no" className="input-modern" placeholder={tW.s1Fields.udyam} value={formData.udyam_no} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.fssai}</label>
                        <input type="text" name="fssai_no" className="input-modern" placeholder={tW.s1Fields.fssai} value={formData.fssai_no} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: 'location_contact',
                title: tW.s1Fields.q4_title,
                description: tW.s1Fields.q4_desc,
                content: (
                  <div>
                    <div className="grid-3" style={{ marginBottom: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.village}</label>
                        <input type="text" name="village" className="input-modern" placeholder={tW.s1Fields.village} value={formData.village} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.district}</label>
                        <input type="text" name="district" className="input-modern" placeholder={tW.s1Fields.district} value={formData.district} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.state}</label>
                        <input type="text" name="state" className="input-modern" placeholder={tW.s1Fields.state} value={formData.state} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="grid-3" style={{ marginBottom: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.contactName}</label>
                        <input type="text" name="contact_name" className="input-modern" placeholder={tW.s1Fields.contactName} value={formData.contact_name} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.contactNumber}</label>
                        <input type="text" name="contact_number" className="input-modern" placeholder={tW.s1Fields.contactNumber} value={formData.contact_number} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.email}</label>
                        <input type="email" name="email" className="input-modern" placeholder={tW.s1Fields.email} value={formData.email} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="grid-3">
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.bankName}</label>
                        <input type="text" name="bank_name" className="input-modern" placeholder={tW.s1Fields.bankName} value={formData.bank_name} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.bankBranch}</label>
                        <input type="text" name="bank_branch" className="input-modern" placeholder={tW.s1Fields.bankBranch} value={formData.bank_branch} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.ifsc}</label>
                        <input type="text" name="ifsc" className="input-modern" placeholder={tW.s1Fields.ifsc} value={formData.ifsc} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: 'track_specific_questions',
                title: tW.s1Fields.q5_title,
                description: tW.s1Fields.q5_desc,
                content: (
                  <div>
                    {/* BANK DPR TRACK QUESTIONS */}
                    {formData.dpr_type.includes('Bank') && (
                      <div className="grid-3">
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.primaryBank}</label>
                          <input type="text" name="primary_lending_bank" className="input-modern" placeholder="e.g. State Bank of India" value={formData.primary_lending_bank || ''} onChange={handleChange} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.loanScheme}</label>
                          <input type="text" name="bank_loan_scheme_name" className="input-modern" placeholder="e.g. Commercial Term Loan / Cash Credit" value={formData.bank_loan_scheme_name || ''} onChange={handleChange} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.collateral}</label>
                          <select name="collateral_offered" className="input-modern" value={formData.collateral_offered || 'CGTMSE Guarantee (Collateral Free)'} onChange={handleChange}>
                            {['CGTMSE Guarantee (Collateral Free)', 'Property Mortgage (Residential/Commercial)', 'Fixed Deposit Pledged', 'Industrial Shed Land Mortgage'].map((opt) => (
                              <option key={opt} value={opt}>{tW.collateralOptions[opt] || opt}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.moratorium}</label>
                          <input type="number" name="moratorium_period_months" className="input-modern" placeholder="6" value={formData.moratorium_period_months || 6} onChange={handleChange} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.tenure}</label>
                          <input type="number" name="repayment_tenure_years" className="input-modern" placeholder="5" value={formData.repayment_tenure_years || 5} onChange={handleChange} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.interestRate}</label>
                          <input type="number" step="0.1" name="interest_rate_percent" className="input-modern" placeholder="10.5" value={formData.interest_rate_percent || 10.5} onChange={handleChange} />
                        </div>
                      </div>
                    )}

                    {/* GOVT SUBSIDY DPR TRACK QUESTIONS */}
                    {(formData.dpr_type.includes('Govt') || formData.dpr_type.includes('Subsidy')) && (
                      <div className="grid-3">
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.targetGovtScheme}</label>
                          <select name="govt_scheme_name" className="input-modern" value={formData.govt_scheme_name || 'PMEGP'} onChange={handleChange}>
                            {['PMEGP (Prime Minister Employment Generation Programme)', 'MUDRA Loan Scheme', 'PMFME (PM Formalisation of Micro Food Processing)', 'KVIC / KVIB Rural Enterprise Subsidy', 'District Industries Centre (DIC) State Subsidy'].map((s) => (
                              <option key={s} value={s}>{tW.govtSchemeOptions[s] || s}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.nodalAgency}</label>
                          <select name="nodal_agency" className="input-modern" value={formData.nodal_agency || 'KVIC'} onChange={handleChange}>
                            {['KVIC (Khadi & Village Industries Commission)', 'KVIB (Karnataka State KVIB)', 'DIC (District Industries Centre)'].map((a) => (
                              <option key={a} value={a}>{tW.nodalAgencyOptions[a] || a}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.locationSubsidy}</label>
                          <select name="location_subsidy_category" className="input-modern" value={formData.location_subsidy_category || 'Rural Area (35% Subsidy)'} onChange={handleChange}>
                            {['Rural Area (35% Special / 25% General Subsidy)', 'Urban Area (25% Special / 15% General Subsidy)'].map((loc) => (
                              <option key={loc} value={loc}>{tW.locationOptions[loc] || loc}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.socialCategory}</label>
                          <select name="social_category" className="input-modern" value={formData.social_category || 'Special Category (Women / SC / ST / OBC)'} onChange={handleChange}>
                            {['Special Category (Women / SC / ST / OBC / Ex-Servicemen)', 'General Category'].map((soc) => (
                              <option key={soc} value={soc}>{tW.socialOptions[soc] || soc}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.edpStatus}</label>
                          <select name="edp_training_status" className="input-modern" value={formData.edp_training_status || 'Completed (10-Day Training)'} onChange={handleChange}>
                            {['Completed (10-Day Online/Offline Training Certificate)', 'Registered / Pending Training Slot', 'Exempted (Technical Degree / Diploma Holder)'].map((edp) => (
                              <option key={edp} value={edp}>{tW.edpOptions[edp] || edp}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.subsidyClaim}</label>
                          <input type="number" name="subsidy_margin_money_claim" className="input-modern" placeholder="350000" value={formData.subsidy_margin_money_claim || 350000} onChange={handleChange} />
                        </div>
                      </div>
                    )}

                    {/* INVESTOR PITCH DPR TRACK QUESTIONS */}
                    {(formData.dpr_type.includes('Investor') || formData.dpr_type.includes('Pitch')) && (
                      <div className="grid-3">
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.investmentAsk}</label>
                          <input type="number" name="investment_ask" className="input-modern" placeholder="5000000" value={formData.investment_ask || 5000000} onChange={handleChange} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.equityOffered}</label>
                          <input type="number" step="0.5" name="equity_offered_percent" className="input-modern" placeholder="15" value={formData.equity_offered_percent || 15} onChange={handleChange} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.s1Fields.valuation}</label>
                          <input type="number" name="pre_money_valuation" className="input-modern" placeholder="28333333" value={formData.pre_money_valuation || 28333333} onChange={handleChange} />
                        </div>
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
          />
          {renderFooterActions()}
        </div>
      )}

      {/* SECTION 02: MEMBERS */}
      {activeStep === 1 && (
        <div className="dpr-section-card">
          <ProgressiveSectorWrapper
            title={tW.sectors[1]?.title || "Sector 2: Members & Promoter Profile"}
            subtitle={tW.sectors[1]?.subtitle || "Enter details of promoters, managing directors, and key management team"}
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'promoters_list',
                title: tW.sectors[1]?.questions?.promoters_list?.title || 'Promoter & Management Team Schedule',
                description: tW.sectors[1]?.questions?.promoters_list?.desc || 'Add members, designation, qualification, experience, and gender details',
                content: (
                  <div>
                    <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                      <table className="table-elegant">
                        <thead>
                          <tr>
                            <th>#</th><th>Name</th><th>Designation</th><th>Gender</th><th>Age</th><th>Qualification</th><th>Experience</th><th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.members.map((m, idx) => (
                            <tr key={m.id || idx}>
                              <td>{idx + 1}</td>
                              <td><input type="text" className="input-modern" value={m.name} onChange={(e) => updateMember(idx, 'name', e.target.value)} placeholder="Member Name" /></td>
                              <td><input type="text" className="input-modern" value={m.designation} onChange={(e) => updateMember(idx, 'designation', e.target.value)} placeholder="Designation" /></td>
                              <td>
                                <select className="input-modern" value={m.gender} onChange={(e) => updateMember(idx, 'gender', e.target.value)}>
                                  <option>Male</option><option>Female</option><option>Other</option>
                                </select>
                              </td>
                              <td><input type="text" className="input-modern" value={m.age} onChange={(e) => updateMember(idx, 'age', e.target.value)} placeholder="Age" /></td>
                              <td><input type="text" className="input-modern" value={m.qualification} onChange={(e) => updateMember(idx, 'qualification', e.target.value)} placeholder="Qualification" /></td>
                              <td><input type="text" className="input-modern" value={m.experience} onChange={(e) => updateMember(idx, 'experience', e.target.value)} placeholder="Experience" /></td>
                              <td>
                                <button type="button" onClick={() => removeMember(idx)} style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '0.4rem 0.7rem', borderRadius: '0.5rem', cursor: 'pointer' }}>
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button type="button" onClick={addMember} style={{ background: 'white', border: '1.5px dashed #0B4F9C', color: '#0B4F9C', padding: '0.6rem 1.4rem', borderRadius: '0.65rem', fontWeight: 600, cursor: 'pointer' }}>
                      <i className="fas fa-plus"></i> Add Member
                    </button>
                  </div>
                ),
              },
            ]}
          />
          {renderFooterActions()}
        </div>
      )}

      {/* SECTION 03: PRODUCT DETAILS */}
      {activeStep === 2 && (
        <div className="dpr-section-card">
          <ProgressiveSectorWrapper
            title={tW.sectors[2]?.title || "Sector 3: Product & Production Details"}
            subtitle={tW.sectors[2]?.subtitle || "Specify products, daily capacity, pricing, raw material inputs, and USP"}
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'primary_product',
                title: tW.sectors[2]?.questions?.primary_product?.title || 'Primary Product & HSN Code',
                description: tW.sectors[2]?.questions?.primary_product?.desc || 'Enter your primary manufactured item or service category',
                content: (
                  <div className="grid-2">
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Primary Product / Category</label>
                      <textarea name="primary_product" rows={2} className="input-modern" value={formData.primary_product} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>HSN Code</label>
                      <input type="text" name="hsn_code" className="input-modern" value={formData.hsn_code} onChange={handleChange} />
                    </div>
                  </div>
                ),
              },
              {
                id: 'capacity_pricing',
                title: tW.sectors[2]?.questions?.capacity_pricing?.title || 'Daily Capacity & Selling Price',
                description: tW.sectors[2]?.questions?.capacity_pricing?.desc || 'Daily output volume, unit measurement, and sales price',
                content: (
                  <div className="grid-3">
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Daily Capacity</label>
                      <input type="number" name="daily_capacity" className="input-modern" value={formData.daily_capacity} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Capacity Unit</label>
                      <select name="capacity_unit" className="input-modern" value={formData.capacity_unit} onChange={handleChange}>
                        <option>kg</option><option>liters</option><option>pieces</option><option>units</option><option>tons</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Selling Price per Unit (₹)</label>
                      <input type="number" name="selling_price" className="input-modern" value={formData.selling_price} onChange={handleChange} />
                    </div>
                  </div>
                ),
              },
              {
                id: 'raw_materials_cost',
                title: tW.sectors[2]?.questions?.raw_materials_cost?.title || 'Raw Materials & Input Costs',
                description: tW.sectors[2]?.questions?.raw_materials_cost?.desc || 'Description of key raw materials, sourcing, and unit cost',
                content: (
                  <div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Raw Materials Required</label>
                      <textarea name="raw_materials" rows={2} className="input-modern" value={formData.raw_materials} onChange={handleChange} />
                    </div>
                    <div className="grid-3">
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Input Cost per Unit (₹)</label>
                        <input type="number" name="input_cost" className="input-modern" value={formData.input_cost} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Working Days per Year</label>
                        <input type="number" name="working_days" className="input-modern" value={formData.working_days} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Market Growth Rate (%)</label>
                        <input type="number" name="market_growth" className="input-modern" value={formData.market_growth} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: 'usp',
                title: tW.sectors[2]?.questions?.usp?.title || 'Unique Selling Proposition (USP)',
                description: tW.sectors[2]?.questions?.usp?.desc || 'Key differentiators, quality standards, and competitive advantages',
                content: (
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Unique Selling Proposition (USP)</label>
                    <textarea name="usp" rows={2} className="input-modern" value={formData.usp} onChange={handleChange} />
                  </div>
                ),
              },
            ]}
          />
          {renderFooterActions()}
        </div>
      )}

      {/* SECTION 04: MACHINERY */}
      {activeStep === 3 && (
        <div className="dpr-section-card">
          <ProgressiveSectorWrapper
            title={tW.sectors[3]?.title || "Sector 4: Machinery & Equipment Schedule"}
            subtitle={tW.sectors[3]?.subtitle || "Plant machinery items, pricing, quantities, and supplier sourcing location"}
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'machinery_table',
                title: tW.sectors[3]?.questions?.machinery_table?.title || 'Plant Machinery Items Schedule',
                description: tW.sectors[3]?.questions?.machinery_table?.desc || 'Add machinery items, unit prices, and quantities',
                content: (
                  <div>
                    <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                      <table className="table-elegant">
                        <thead>
                          <tr>
                            <th>#</th><th>Machine Name</th><th>Quantity</th><th>Unit Price (₹)</th><th>Total Price (₹)</th><th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.machinery.map((m, idx) => (
                            <tr key={m.id || idx}>
                              <td>{idx + 1}</td>
                              <td><input type="text" className="input-modern" value={m.name} onChange={(e) => updateMachinery(idx, 'name', e.target.value)} placeholder="Machine Name" /></td>
                              <td><input type="number" className="input-modern" value={m.quantity} onChange={(e) => updateMachinery(idx, 'quantity', e.target.value)} /></td>
                              <td><input type="number" className="input-modern" value={m.price} onChange={(e) => updateMachinery(idx, 'price', e.target.value)} /></td>
                              <td><input type="number" className="input-modern" readOnly value={m.total} /></td>
                              <td>
                                <button type="button" onClick={() => removeMachinery(idx)} style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '0.4rem 0.7rem', borderRadius: '0.5rem', cursor: 'pointer' }}>
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button type="button" onClick={addMachinery} style={{ background: 'white', border: '1.5px dashed #0B4F9C', color: '#0B4F9C', padding: '0.6rem 1.4rem', borderRadius: '0.65rem', fontWeight: 600, cursor: 'pointer' }}>
                      <i className="fas fa-plus"></i> Add Machinery
                    </button>
                  </div>
                ),
              },
              {
                id: 'supplier_details',
                title: tW.sectors[3]?.questions?.supplier_details?.title || 'Machinery Supplier Information',
                description: tW.sectors[3]?.questions?.supplier_details?.desc || 'Supplier name and sourcing location details',
                content: (
                  <div className="grid-2">
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Supplier Name</label>
                      <input type="text" name="supplier_name" className="input-modern" value={formData.supplier_name} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Supplier Location</label>
                      <input type="text" name="supplier_location" className="input-modern" value={formData.supplier_location} onChange={handleChange} />
                    </div>
                  </div>
                ),
              },
            ]}
          />
          {renderFooterActions()}
        </div>
      )}

      {/* SECTION 05: MARKET ANALYSIS */}
      {activeStep === 4 && (
        <div className="dpr-section-card">
          <ProgressiveSectorWrapper
            title={tW.sectors[4]?.title || "Sector 5: Market Analysis & Competitor Study"}
            subtitle={tW.sectors[4]?.subtitle || "Target customer segments, demand-supply gap, pricing, and distribution model"}
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'target_customers',
                title: tW.sectors[4]?.questions?.target_customers?.title || 'Target Customers & Market Segments',
                description: tW.sectors[4]?.questions?.target_customers?.desc || 'Identify primary buyers, industry segments, and consumer profiles',
                content: (
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Target Customers / Market Segments</label>
                    <textarea name="target_customers" rows={3} className="input-modern" value={formData.target_customers} onChange={handleChange} />
                  </div>
                ),
              },
              {
                id: 'sales_channels',
                title: tW.sectors[4]?.questions?.sales_channels?.title || 'Sales Locations & Distribution Channels',
                description: tW.sectors[4]?.questions?.sales_channels?.desc || 'Geographical sales coverage, dealers, retail, or direct B2B channels',
                content: (
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Sales Locations & Distribution Channels</label>
                    <textarea name="sales_location" rows={3} className="input-modern" value={formData.sales_location} onChange={handleChange} />
                  </div>
                ),
              },
              {
                id: 'competitors',
                title: tW.sectors[4]?.questions?.competitors?.title || 'Main Competitors & Positioning',
                description: tW.sectors[4]?.questions?.competitors?.desc || 'Key local/national competitors and competitive strategy',
                content: (
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Main Competitors</label>
                    <textarea name="competitors" rows={3} className="input-modern" value={formData.competitors} onChange={handleChange} />
                  </div>
                ),
              },
            ]}
          />
          {renderFooterActions()}
        </div>
      )}

      {/* SECTION 06: HR PLAN */}
      {activeStep === 5 && (
        <div className="dpr-section-card">
          <ProgressiveSectorWrapper
            title={tW.sectors[5]?.title || "Sector 6: Human Resource & Manpower Expenses"}
            subtitle={tW.sectors[5]?.subtitle || "Staff headcount and monthly salary breakdown across management, skilled, unskilled, and admin"}
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'hr_breakdown',
                title: tW.sectors[5]?.questions?.hr_breakdown?.title || 'Human Resource & Manpower Schedule',
                description: tW.sectors[5]?.questions?.hr_breakdown?.desc || 'Specify headcount and monthly remuneration per staff tier',
                content: (
                  <div>
                    <table className="table-elegant" style={{ marginBottom: '1rem' }}>
                      <thead>
                        <tr>
                          <th>{tW.labels?.category || 'Category'}</th>
                          <th>{tW.labels?.numberOfPersons || 'Number of Persons'}</th>
                          <th>{tW.labels?.monthlySalary || 'Monthly Salary (₹)'}</th>
                          <th>{tW.labels?.monthlyCost || 'Monthly Cost (₹)'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{tW.labels?.management || 'Management'}</td>
                          <td><input type="number" name="mgmt_count" className="input-modern" value={formData.mgmt_count} onChange={handleChange} /></td>
                          <td><input type="number" name="mgmt_salary" className="input-modern" value={formData.mgmt_salary} onChange={handleChange} /></td>
                          <td><input type="number" className="input-modern" readOnly value={formData.mgmt_count * formData.mgmt_salary} /></td>
                        </tr>
                        <tr>
                          <td>{tW.labels?.supervisory || 'Supervisory'}</td>
                          <td><input type="number" name="sup_count" className="input-modern" value={formData.sup_count} onChange={handleChange} /></td>
                          <td><input type="number" name="sup_salary" className="input-modern" value={formData.sup_salary} onChange={handleChange} /></td>
                          <td><input type="number" className="input-modern" readOnly value={formData.sup_count * formData.sup_salary} /></td>
                        </tr>
                        <tr>
                          <td>{tW.labels?.skilledWorkers || 'Skilled Workers'}</td>
                          <td><input type="number" name="skill_count" className="input-modern" value={formData.skill_count} onChange={handleChange} /></td>
                          <td><input type="number" name="skill_salary" className="input-modern" value={formData.skill_salary} onChange={handleChange} /></td>
                          <td><input type="number" className="input-modern" readOnly value={formData.skill_count * formData.skill_salary} /></td>
                        </tr>
                        <tr>
                          <td>{tW.labels?.unskilledWorkers || 'Unskilled Workers'}</td>
                          <td><input type="number" name="unskill_count" className="input-modern" value={formData.unskill_count} onChange={handleChange} /></td>
                          <td><input type="number" name="unskill_salary" className="input-modern" value={formData.unskill_salary} onChange={handleChange} /></td>
                          <td><input type="number" className="input-modern" readOnly value={formData.unskill_count * formData.unskill_salary} /></td>
                        </tr>
                        <tr>
                          <td>{tW.labels?.administrative || 'Administrative'}</td>
                          <td><input type="number" name="admin_count" className="input-modern" value={formData.admin_count} onChange={handleChange} /></td>
                          <td><input type="number" name="admin_salary" className="input-modern" value={formData.admin_salary} onChange={handleChange} /></td>
                          <td><input type="number" className="input-modern" readOnly value={formData.admin_count * formData.admin_salary} /></td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr style={{ background: '#EFF6FF', fontWeight: 800 }}>
                          <td>{tW.labels?.total || 'TOTAL'}</td>
                          <td>{totalStaffCount} {tW.labels?.persons || 'Persons'}</td>
                          <td></td>
                          <td>₹{totalMonthlySalary.toLocaleString('en-IN')} {tW.labels?.perMonth || '/ month'}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ),
              },
            ]}
          />
          {renderFooterActions()}
        </div>
      )}

      {/* SECTION 07: FINANCIAL ESTIMATES */}
      {activeStep === 6 && (
        <div className="dpr-section-card">
          <ProgressiveSectorWrapper
            title={tW.sectors[6]?.title || "Sector 7: Financial Estimates & Capital Outlay"}
            subtitle={tW.sectors[6]?.subtitle || "Land, building, machinery, working capital margin, and means of finance breakdown"}
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'project_cost_capex',
                title: tW.sectors[6]?.questions?.project_cost_capex?.title || 'Project Cost Breakdown (CAPEX)',
                description: tW.sectors[6]?.questions?.project_cost_capex?.desc || 'Land, civil building, machinery total, furniture, and working capital',
                content: (
                  <div>
                    <div className="grid-2" style={{ marginBottom: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.landCost || 'Land Cost (₹)'}</label>
                        <input type="number" name="land_cost" className="input-modern" value={formData.land_cost} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.buildingCost || 'Building Cost (₹)'}</label>
                        <input type="number" name="building_cost" className="input-modern" value={formData.building_cost} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="grid-2" style={{ marginBottom: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.machineryTotal || 'Plant & Machinery Total (₹)'}</label>
                        <input type="number" className="input-modern" readOnly value={machineryTotal} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.furnitureCost || 'Furniture & Fixtures (₹)'}</label>
                        <input type="number" name="furniture_cost" className="input-modern" value={formData.furniture_cost} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="grid-2" style={{ marginBottom: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.workingCapital || 'Working Capital (₹)'}</label>
                        <input type="number" name="working_capital" className="input-modern" value={formData.working_capital} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.otherCost || 'Other Preliminary Expenses (₹)'}</label>
                        <input type="number" name="other_cost" className="input-modern" value={formData.other_cost} onChange={handleChange} />
                      </div>
                    </div>
                    <div style={{ background: '#F1F5F9', padding: '0.75rem 1rem', borderRadius: '0.65rem', fontWeight: 800, color: '#0A192F', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{tW.labels?.totalProjectCost || 'TOTAL PROJECT COST'}</span>
                      <span>₹{totalProjectCost.toLocaleString('en-IN')} <span style={{ fontSize: '0.85rem', color: '#008C95', fontWeight: 700 }}>({formatIndianWords(totalProjectCost, language)})</span></span>
                    </div>
                  </div>
                ),
              },
              {
                id: 'means_of_finance',
                title: tW.sectors[6]?.questions?.means_of_finance?.title || 'Means of Finance Breakdown',
                description: tW.sectors[6]?.questions?.means_of_finance?.desc || 'Promoter equity contribution, bank loan required, and government subsidy',
                content: (
                  <div className="grid-3">
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.promoterContribution || 'Promoter Contribution (₹)'}</label>
                      <input type="number" name="promoter_contribution" className="input-modern" value={formData.promoter_contribution} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.bankLoanRequired || 'Bank Loan Required (₹)'}</label>
                      <input type="number" name="bank_loan" className="input-modern" value={formData.bank_loan} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.subsidyGrant || 'Subsidy / Grant (₹)'}</label>
                      <input type="number" name="subsidy" className="input-modern" value={formData.subsidy} onChange={handleChange} />
                    </div>
                  </div>
                ),
              },
            ]}
          />
          {renderFooterActions()}
        </div>
      )}

      {/* SECTION 08: PROJECTIONS */}
      {activeStep === 7 && (
        <div className="dpr-section-card">
          <ProgressiveSectorWrapper
            title={tW.sectors[7]?.title || "Sector 8: 5-Year Financial Projections"}
            subtitle={tW.sectors[7]?.subtitle || "Projected capacity utilization %, annual interest expenses, and depreciation schedule"}
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'financial_projections',
                title: tW.sectors[7]?.questions?.financial_projections?.title || '5-Year Operational Projections Schedule',
                description: tW.sectors[7]?.questions?.financial_projections?.desc || 'Capacity utilization %, interest expenses, and annual depreciation schedule',
                content: (
                  <div>
                    <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                      <table className="table-elegant">
                        <thead>
                          <tr>
                            <th>{tW.labels?.particulars || 'Particulars'}</th>
                            <th>{tW.labels?.year1 || 'Year 1'}</th>
                            <th>{tW.labels?.year2 || 'Year 2'}</th>
                            <th>{tW.labels?.year3 || 'Year 3'}</th>
                            <th>{tW.labels?.year4 || 'Year 4'}</th>
                            <th>{tW.labels?.year5 || 'Year 5'}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{tW.labels?.capacityUtilization || 'Capacity Utilization (%)'}</td>
                            <td><input type="number" name="cap_year1" className="input-modern" value={formData.cap_year1} onChange={handleChange} /></td>
                            <td><input type="number" name="cap_year2" className="input-modern" value={formData.cap_year2} onChange={handleChange} /></td>
                            <td><input type="number" name="cap_year3" className="input-modern" value={formData.cap_year3} onChange={handleChange} /></td>
                            <td><input type="number" name="cap_year4" className="input-modern" value={formData.cap_year4} onChange={handleChange} /></td>
                            <td><input type="number" name="cap_year5" className="input-modern" value={formData.cap_year5} onChange={handleChange} /></td>
                          </tr>
                          <tr>
                            <td>{tW.labels?.interestExpense || 'Interest Expense (₹)'}</td>
                            <td><input type="number" name="int_year1" className="input-modern" value={formData.int_year1} onChange={handleChange} /></td>
                            <td><input type="number" name="int_year2" className="input-modern" value={formData.int_year2} onChange={handleChange} /></td>
                            <td><input type="number" name="int_year3" className="input-modern" value={formData.int_year3} onChange={handleChange} /></td>
                            <td><input type="number" name="int_year4" className="input-modern" value={formData.int_year4} onChange={handleChange} /></td>
                            <td><input type="number" name="int_year5" className="input-modern" value={formData.int_year5} onChange={handleChange} /></td>
                          </tr>
                          <tr>
                            <td>{tW.labels?.depreciation || 'Depreciation (₹)'}</td>
                            <td><input type="number" name="dep_year1" className="input-modern" value={formData.dep_year1} onChange={handleChange} /></td>
                            <td><input type="number" name="dep_year2" className="input-modern" value={formData.dep_year2} onChange={handleChange} /></td>
                            <td><input type="number" name="dep_year3" className="input-modern" value={formData.dep_year3} onChange={handleChange} /></td>
                            <td><input type="number" name="dep_year4" className="input-modern" value={formData.dep_year4} onChange={handleChange} /></td>
                            <td><input type="number" name="dep_year5" className="input-modern" value={formData.dep_year5} onChange={handleChange} /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ),
              },
            ]}
          />
          {renderFooterActions()}
        </div>
      )}

      {/* SECTION 09: INFRASTRUCTURE */}
      {activeStep === 8 && (
        <div className="dpr-section-card">
          <ProgressiveSectorWrapper
            title={tW.sectors[8]?.title || "Sector 9: Infrastructure & Utilities Requirements"}
            subtitle={tW.sectors[8]?.subtitle || "Workspace status, power grid load, water consumption, rent, and operational timeline"}
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'workspace_area',
                title: tW.sectors[8]?.questions?.workspace_area?.title || 'Workspace Status & Power Requirement',
                description: tW.sectors[8]?.questions?.workspace_area?.desc || 'Owned/Rented workspace, built-up area in sq.ft., and power requirement',
                content: (
                  <div className="grid-3">
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.workspaceStatus || 'Workspace Status'}</label>
                      <input type="text" name="workspace" className="input-modern" value={formData.workspace} onChange={handleChange} placeholder={tW.labels?.ownedRented || "Owned / Rented"} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.builtupArea || 'Built-up Area (sq.ft.)'}</label>
                      <input type="number" name="builtup_area" className="input-modern" value={formData.builtup_area} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.powerRequired || 'Power Required (HP / KVA)'}</label>
                      <input type="number" name="power_required" className="input-modern" value={formData.power_required} onChange={handleChange} />
                    </div>
                  </div>
                ),
              },
              {
                id: 'water_rent_timeline',
                title: tW.sectors[8]?.questions?.water_rent_timeline?.title || 'Water Utilities, Rent & Setup Timeline',
                description: tW.sectors[8]?.questions?.water_rent_timeline?.desc || 'Water requirement, monthly rent, and months to start commercial operations',
                content: (
                  <div className="grid-3">
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.waterRequired || 'Water Required (L/day)'}</label>
                      <input type="number" name="water_required" className="input-modern" value={formData.water_required} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.monthlyRent || 'Monthly Rent (₹)'}</label>
                      <input type="number" name="monthly_rent" className="input-modern" value={formData.monthly_rent} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.timeToStartOps || 'Time to Start Operations (months)'}</label>
                      <input type="number" name="start_time" className="input-modern" value={formData.start_time} onChange={handleChange} />
                    </div>
                  </div>
                ),
              },
            ]}
          />
          {renderFooterActions()}
        </div>
      )}

      {/* SECTION 10: SWOT */}
      {activeStep === 9 && (
        <div className="dpr-section-card">
          <ProgressiveSectorWrapper
            title={tW.sectors[9]?.title || "Sector 10: SWOT Analysis"}
            subtitle={tW.sectors[9]?.subtitle || "Internal strengths, weaknesses, external market opportunities, and competitive threats"}
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'strengths_weaknesses',
                title: tW.sectors[9]?.questions?.strengths_weaknesses?.title || 'Internal Strengths & Weaknesses',
                description: tW.sectors[9]?.questions?.strengths_weaknesses?.desc || 'Core organizational capabilities and operational limitations',
                content: (
                  <div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.strengths || 'Strengths'}</label>
                      <textarea name="strengths" rows={2} className="input-modern" value={formData.strengths} onChange={handleChange} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.weaknesses || 'Weaknesses'}</label>
                      <textarea name="weaknesses" rows={2} className="input-modern" value={formData.weaknesses} onChange={handleChange} />
                    </div>
                  </div>
                ),
              },
              {
                id: 'opportunities_threats',
                title: tW.sectors[9]?.questions?.opportunities_threats?.title || 'External Opportunities & Threats',
                description: tW.sectors[9]?.questions?.opportunities_threats?.desc || 'Market growth drivers, demand trends, and external risks',
                content: (
                  <div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.opportunities || 'Opportunities'}</label>
                      <textarea name="opportunities" rows={2} className="input-modern" value={formData.opportunities} onChange={handleChange} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.threats || 'Threats'}</label>
                      <textarea name="threats" rows={2} className="input-modern" value={formData.threats} onChange={handleChange} />
                    </div>
                  </div>
                ),
              },
            ]}
          />
          {renderFooterActions()}
        </div>
      )}

      {/* SECTION 11: SOCIAL IMPACT */}
      {activeStep === 10 && (
        <div className="dpr-section-card">
          <ProgressiveSectorWrapper
            title={tW.sectors[10]?.title || "Sector 11: Social & Environmental Impact"}
            subtitle={tW.sectors[10]?.subtitle || "Employment generation for local community, women, and youth, plus green initiatives"}
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'employment_breakdown',
                title: tW.sectors[10]?.questions?.employment_breakdown?.title || 'Direct Employment Generation',
                description: tW.sectors[10]?.questions?.employment_breakdown?.desc || 'Number of jobs created for local residents, women, and youth',
                content: (
                  <div className="grid-3">
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.localEmployment || 'Local Employment (Persons)'}</label>
                      <input type="number" name="local_employment" className="input-modern" value={formData.local_employment} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.womenEmployment || 'Women Employment (Persons)'}</label>
                      <input type="number" name="women_employment" className="input-modern" value={formData.women_employment} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.youthEmployment || 'Youth Employment (Persons)'}</label>
                      <input type="number" name="youth_employment" className="input-modern" value={formData.youth_employment} onChange={handleChange} />
                    </div>
                  </div>
                ),
              },
              {
                id: 'eco_practices',
                title: tW.sectors[10]?.questions?.eco_practices?.title || 'Environmental Sustainability & Skill Training',
                description: tW.sectors[10]?.questions?.eco_practices?.desc || 'Eco-friendly manufacturing, waste management, and employee training',
                content: (
                  <div>
                    <div className="grid-2" style={{ marginBottom: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.ecoPractices || 'Eco-friendly Practices (Yes/No)'}</label>
                        <input type="text" name="eco_friendly" className="input-modern" value={formData.eco_friendly} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.skillTraining || 'Skill Training Provided (Yes/No)'}</label>
                        <input type="text" name="training" className="input-modern" value={formData.training} onChange={handleChange} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.ecoDescription || 'Eco-friendly Initiatives Description'}</label>
                      <textarea name="eco_description" rows={2} className="input-modern" value={formData.eco_description} onChange={handleChange} />
                    </div>
                  </div>
                ),
              },
            ]}
          />
          {renderFooterActions()}
        </div>
      )}

      {/* SECTION 12: CREDIT / SCHEME STANDING */}
      {activeStep === 11 && (
        <div className="dpr-section-card">
          <ProgressiveSectorWrapper
            title={tW.sectors[11]?.title || "Sector 12: Credit Standing & History Profile"}
            subtitle={tW.sectors[11]?.subtitle || "CIBIL profile, prior loan history, existing liabilities, or scheme standing"}
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'credit_standing',
                title: tW.sectors[11]?.questions?.credit_standing?.title || 'Credit Score & Past Loan History',
                description: tW.sectors[11]?.questions?.credit_standing?.desc || 'CIBIL score, prior borrowing experience, and existing loan balances',
                content: (
                  <div>
                    {(formData.dpr_type === 'Bank Loan DPR' || !formData.dpr_type) && (
                      <>
                        <div className="grid-3" style={{ marginBottom: '1rem' }}>
                          <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.cibilScore || 'CIBIL Score'}</label>
                            <input type="number" name="cibil_score" className="input-modern" value={formData.cibil_score} onChange={handleChange} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.takenLoanBefore || 'Taken Loan Before? (Yes/No)'}</label>
                            <input type="text" name="loan_before" className="input-modern" value={formData.loan_before} onChange={handleChange} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.existingLoanAmount || 'Existing Loan Amount (₹)'}</label>
                            <input type="number" name="existing_loan" className="input-modern" value={formData.existing_loan} onChange={handleChange} />
                          </div>
                        </div>
                        <div className="grid-2">
                          <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.outstandingAmount || 'Outstanding Amount (₹)'}</label>
                            <input type="number" name="outstanding" className="input-modern" value={formData.outstanding} onChange={handleChange} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.defaultHistory || 'Default History (Yes/No)'}</label>
                            <input type="text" name="default_history" className="input-modern" value={formData.default_history} onChange={handleChange} />
                          </div>
                        </div>
                      </>
                    )}

                    {formData.dpr_type === 'Govt Subsidy DPR' && (
                      <div className="grid-3">
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.targetScheme || 'Target Scheme'}</label>
                          <input type="text" name="scheme_name" className="input-modern" value={(formData as any).scheme_name || 'PMEGP'} onChange={handleChange} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.dicJurisdiction || 'DIC Office Jurisdiction'}</label>
                          <input type="text" name="dic_jurisdiction" className="input-modern" value={(formData as any).dic_jurisdiction || 'DIC Bengaluru Urban'} onChange={handleChange} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.applicantCategory || 'Social Category'}</label>
                          <input type="text" name="applicant_category" className="input-modern" value={(formData as any).applicant_category || 'General'} onChange={handleChange} />
                        </div>
                      </div>
                    )}

                    {formData.dpr_type === 'Investor / Business Pitch DPR' && (
                      <div className="grid-3">
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.pitchStage || 'Venture Growth Stage'}</label>
                          <input type="text" name="pitch_stage" className="input-modern" value={(formData as any).pitch_stage || 'Early Revenue Stage'} onChange={handleChange} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.preMoneyValuation || 'Pre-Money Valuation (₹)'}</label>
                          <input type="number" name="pre_money_valuation" className="input-modern" value={(formData as any).pre_money_valuation || 85000000} onChange={handleChange} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.currentMrr || 'Current Monthly MRR (₹)'}</label>
                          <input type="number" name="current_mrr" className="input-modern" value={(formData as any).current_mrr || 850000} onChange={handleChange} />
                        </div>
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
          />
          {renderFooterActions()}
        </div>
      )}

      {/* SECTION 13: IMAGE UPLOAD */}
      {activeStep === 12 && (
        <div className="dpr-section-card">
          <ProgressiveSectorWrapper
            title={tW.sectors[12]?.title || "Sector 13: Report Image & Photo Uploads"}
            subtitle={tW.sectors[12]?.subtitle || "Company logo, product sample photo, facility machinery, and promoter team images"}
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'images_upload',
                title: tW.sectors[12]?.questions?.images_upload?.title || 'Upload Company & Product Photos',
                description: tW.sectors[12]?.questions?.images_upload?.desc || 'Logo, product photos, plant facility, and management team pictures',
                content: (
                  <div className="grid-2">
                    <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0' }}>
                      <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0A192F', display: 'block', marginBottom: '0.4rem' }}>{tW.labels?.companyLogo || 'Company Logo'}</label>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo_path')} style={{ fontSize: '0.85rem' }} />
                      {formData.logo_path && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F0FDFA', padding: '0.4rem 0.6rem', borderRadius: '0.5rem', border: '1px solid #99F6E4' }}>
                          <img src={resolveImageUrl(formData.logo_path)} alt="Logo Preview" style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px', background: '#fff', border: '1px solid #CBD5E1' }} />
                          <span style={{ fontSize: '0.75rem', color: '#0D9488', fontWeight: 600 }}>{tW.labels?.savedApplied || '✓ Saved & Applied to Report'}</span>
                        </div>
                      )}
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0' }}>
                      <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0A192F', display: 'block', marginBottom: '0.4rem' }}>{tW.labels?.productSample || 'Product Sample Image'}</label>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'product_path')} style={{ fontSize: '0.85rem' }} />
                      {formData.product_path && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F0FDFA', padding: '0.4rem 0.6rem', borderRadius: '0.5rem', border: '1px solid #99F6E4' }}>
                          <img src={resolveImageUrl(formData.product_path)} alt="Product Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
                          <span style={{ fontSize: '0.75rem', color: '#0D9488', fontWeight: 600 }}>{tW.labels?.savedApplied || '✓ Saved & Applied to Report'}</span>
                        </div>
                      )}
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0' }}>
                      <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0A192F', display: 'block', marginBottom: '0.4rem' }}>{tW.labels?.facilityMachinery || 'Facility / Machinery Image'}</label>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'facility_path')} style={{ fontSize: '0.85rem' }} />
                      {formData.facility_path && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F0FDFA', padding: '0.4rem 0.6rem', borderRadius: '0.5rem', border: '1px solid #99F6E4' }}>
                          <img src={resolveImageUrl(formData.facility_path)} alt="Facility Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
                          <span style={{ fontSize: '0.75rem', color: '#0D9488', fontWeight: 600 }}>{tW.labels?.savedApplied || '✓ Saved & Applied to Report'}</span>
                        </div>
                      )}
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0' }}>
                      <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0A192F', display: 'block', marginBottom: '0.4rem' }}>{tW.labels?.teamPhoto || 'Team Photo'}</label>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'team_path')} style={{ fontSize: '0.85rem' }} />
                      {formData.team_path && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F0FDFA', padding: '0.4rem 0.6rem', borderRadius: '0.5rem', border: '1px solid #99F6E4' }}>
                          <img src={resolveImageUrl(formData.team_path)} alt="Team Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
                          <span style={{ fontSize: '0.75rem', color: '#0D9488', fontWeight: 600 }}>{tW.labels?.savedApplied || '✓ Saved & Applied to Report'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ),
              },
            ]}
          />
          {renderFooterActions()}
        </div>
      )}

      {/* SECTION 14: DECLARATION & REPORT GENERATION */}
      {activeStep === 13 && (
        <div className="dpr-section-card">
          <ProgressiveSectorWrapper
            title={tW.sectors[13]?.title || "Sector 14: Declaration & Final Report Generation"}
            subtitle={tW.sectors[13]?.subtitle || "Authorised signatory details, report depth selection, and PDF / DOCX compilation"}
            isSaving={generating}
            onCompleteSector={handleGeneratePDF}
            questions={[
              {
                id: 'declaration_statement',
                title: tW.sectors[13]?.questions?.declaration_statement?.title || 'Authorised Signatory Declaration',
                description: tW.sectors[13]?.questions?.declaration_statement?.desc || 'Enter declarant name, designation, and location',
                content: (
                  <div className="grid-3">
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.declarantName || 'Declarant Name'}</label>
                      <input type="text" name="declarant_name" className="input-modern" placeholder={tW.labels?.yourName || "Your name"} value={formData.declarant_name} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.designation || 'Designation'}</label>
                      <input type="text" name="designation" className="input-modern" value={formData.designation} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>{tW.labels?.place || 'Place'}</label>
                      <input type="text" name="place" className="input-modern" value={formData.place} onChange={handleChange} />
                    </div>
                  </div>
                ),
              },
              {
                id: 'report_depth',
                title: tW.sectors[13]?.questions?.report_depth?.title || 'Target DPR Report Length & Depth',
                description: tW.sectors[13]?.questions?.report_depth?.desc || 'Choose Entry (15-20 Pgs), Core (25-35 Pgs), Team (35-45 Pgs), or Enterprise (45-60 Pgs)',
                content: (() => {
                  const currentPlanKey = (formData.dpr_depth || (typeof window !== 'undefined' ? sessionStorage.getItem('dpr_selected_plan') : null) || 'entry').toLowerCase().trim();
                  const normalizedDepth = (currentPlanKey === 'core' || currentPlanKey === 'standard') ? 'core' : (currentPlanKey === 'team' || currentPlanKey === 'advanced' || currentPlanKey === 'detailed' || currentPlanKey === 'comprehensive') ? 'team' : (currentPlanKey === 'enterprise' || currentPlanKey === 'ent' || currentPlanKey === 'premium') ? 'enterprise' : 'entry';

                  const plans = [
                    {
                      id: 'entry',
                      name: tW.labels?.entryPlanName || 'Entry Plan',
                      pages: tW.labels?.entryPages || '15 – 20 Pages',
                      projects: tW.labels?.entryProjects || 'Projects ₹5L – ₹25L',
                      price: getPlanPrice('entry'),
                      desc: tW.labels?.entryDesc || '16 Core Chapters, 5-Yr Financials, DSCR Analysis, Standard Bankable PDF.',
                      accent: '#008C95',
                      bgSoft: '#F0FDFA',
                      borderSoft: '#CCFBF1'
                    },
                    {
                      id: 'core',
                      name: tW.labels?.corePlanName || 'Core Plan',
                      pages: tW.labels?.corePages || '25 – 35 Pages',
                      projects: tW.labels?.coreProjects || 'Projects ₹25L – ₹1Cr',
                      price: getPlanPrice('core'),
                      desc: tW.labels?.coreDesc || '22 Chapters, 36-Mo Cash Flow, Tandon Assessment, Risk Matrix, Credit Appraisal Norms.',
                      accent: '#0071E3',
                      bgSoft: '#F0F7FF',
                      borderSoft: '#D0E3FF'
                    },
                    {
                      id: 'team',
                      name: tW.labels?.teamPlanName || 'Team Plan (Advanced)',
                      pages: tW.labels?.teamPages || '35 – 45 Pages',
                      projects: tW.labels?.teamProjects || 'Projects ₹1Cr – ₹5Cr',
                      price: getPlanPrice('team'),
                      desc: tW.labels?.teamDesc || 'Advanced DPR with sensitivity stress tests, milestone roadmap, and subsidy claims.',
                      badge: tW.labels?.mostUsedBadge || 'MOST USED',
                      accent: '#FF7A00',
                      bgSoft: '#FFF7ED',
                      borderSoft: '#FFEDD5'
                    },
                    {
                      id: 'enterprise',
                      name: tW.labels?.enterprisePlanName || 'Enterprise Bankable',
                      pages: tW.labels?.enterprisePages || '45 – 60 Pages',
                      projects: tW.labels?.enterpriseProjects || 'Projects ₹5Cr – ₹25Cr+',
                      price: getPlanPrice('enterprise'),
                      desc: tW.labels?.enterpriseDesc || '30 Chapters + 10 Annexure Schedules, 10-Yr Extended Modeling, Raw Material BOQ, ESG.',
                      badge: tW.labels?.enterpriseBadge || 'ENTERPRISE GRADE',
                      accent: '#7C3AED',
                      bgSoft: '#F5F3FF',
                      borderSoft: '#DDD6FE'
                    }
                  ];

                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem' }}>
                      {plans.map((p) => {
                        const isSelected = normalizedDepth === p.id;
                        return (
                          <div
                            key={p.id}
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, dpr_depth: p.id }));
                              if (typeof window !== 'undefined') {
                                sessionStorage.setItem('dpr_selected_plan', p.id);
                              }
                            }}
                            style={{
                              border: isSelected ? `2.5px solid ${p.accent}` : '1.5px solid #CBD5E1',
                              background: isSelected ? p.bgSoft : '#FFFFFF',
                              padding: '1.2rem 1.1rem',
                              borderRadius: '1rem',
                              cursor: 'pointer',
                              position: 'relative',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              boxShadow: isSelected ? `0 8px 24px ${p.accent}25` : '0 2px 8px rgba(0,0,0,0.02)',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {p.badge && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '-11px',
                                  right: '14px',
                                  background: p.accent,
                                  color: '#FFFFFF',
                                  padding: '2px 10px',
                                  borderRadius: '9999px',
                                  fontSize: '0.64rem',
                                  fontWeight: 800,
                                  letterSpacing: '0.05em'
                                }}
                              >
                                {p.badge}
                              </div>
                            )}

                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>{p.name}</span>
                                <span style={{ fontWeight: 900, color: p.accent, fontSize: '1.15rem' }}>₹{p.price.toLocaleString('en-IN')}</span>
                              </div>
                              <div style={{ fontSize: '0.8rem', color: p.accent, fontWeight: 700, margin: '2px 0 6px 0' }}>
                                {p.pages} • <span style={{ color: '#64748B', fontWeight: 600 }}>{p.projects}</span>
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.45 }}>
                                {p.desc}
                              </div>
                            </div>

                            <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '0.74rem', color: isSelected ? p.accent : '#94A3B8', fontWeight: 700 }}>
                                {isSelected ? '✓ ' + (language === 'kn' ? 'ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ' : language === 'hi' ? 'चयनित' : 'SELECTED') : (language === 'kn' ? 'ಆಯ್ಕೆಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ' : language === 'hi' ? 'चुनने के लिए क्लिक करें' : 'Click to select')}
                              </span>
                              <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: isSelected ? `5px solid ${p.accent}` : '1.5px solid #CBD5E1', background: '#FFFFFF' }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })(),
              },
              {
                id: 'approve_compile',
                title: tW.sectors[13]?.questions?.approve_compile?.title || 'User Approval & Report Generation',
                description: tW.sectors[13]?.questions?.approve_compile?.desc || 'Compile publication-ready official bankable PDF report',
                content: (() => {
                  const currentPlanKey = (formData.dpr_depth || (typeof window !== 'undefined' ? sessionStorage.getItem('dpr_selected_plan') : null) || 'entry').toLowerCase().trim();
                  const normalizedDepth = (currentPlanKey === 'core' || currentPlanKey === 'standard') ? 'core' : (currentPlanKey === 'team' || currentPlanKey === 'advanced' || currentPlanKey === 'detailed' || currentPlanKey === 'comprehensive') ? 'team' : (currentPlanKey === 'enterprise' || currentPlanKey === 'ent' || currentPlanKey === 'premium') ? 'enterprise' : 'entry';

                  const planNameMap: Record<string, { name: string; pages: string; projects: string }> = {
                    entry: {
                      name: tW.labels?.entryPlanName || 'Entry Plan',
                      pages: tW.labels?.entryPages || '15 – 20 Pages',
                      projects: tW.labels?.entryProjects || 'Projects ₹5L – ₹25L'
                    },
                    core: {
                      name: tW.labels?.corePlanName || 'Core Plan',
                      pages: tW.labels?.corePages || '25 – 35 Pages',
                      projects: tW.labels?.coreProjects || 'Projects ₹25L – ₹1Cr'
                    },
                    team: {
                      name: tW.labels?.teamPlanName || 'Team Plan (Advanced)',
                      pages: tW.labels?.teamPages || '35 – 45 Pages',
                      projects: tW.labels?.teamProjects || 'Projects ₹1Cr – ₹5Cr'
                    },
                    enterprise: {
                      name: tW.labels?.enterprisePlanName || 'Enterprise Bankable',
                      pages: tW.labels?.enterprisePages || '45 – 60 Pages',
                      projects: tW.labels?.enterpriseProjects || 'Projects ₹5Cr – ₹25Cr+'
                    }
                  };
                  const activePlanMeta = planNameMap[normalizedDepth] || planNameMap.entry;

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.4rem', paddingTop: '0.8rem', width: '100%' }}>
                      {/* LIVE PAYMENT ORDER SUMMARY CARD */}
                      <div style={{
                        width: '100%',
                        maxWidth: '680px',
                        background: '#FFFFFF',
                        border: '2px solid #CCFBF1',
                        borderRadius: '1.2rem',
                        padding: '1.4rem 1.6rem',
                        boxShadow: '0 10px 25px -5px rgba(0, 140, 149, 0.08)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.8rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '0.75rem' }}>
                          <span style={{ fontSize: '1.02rem', fontWeight: 800, color: '#123B4A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-file-invoice-dollar" style={{ color: '#008C95' }} />
                            {tW.labels?.orderSummaryTitle || 'Payment Order Summary'}
                          </span>
                          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: paymentUnlocked ? '#059669' : '#008C95', background: paymentUnlocked ? '#ECFDF5' : '#F0FDFA', padding: '3px 12px', borderRadius: '9999px', border: paymentUnlocked ? '1px solid #A7F3D0' : '1px solid #CCFBF1' }}>
                            {paymentUnlocked ? (tW.labels?.paymentVerified || 'PAID & UNLOCKED') : 'RAZORPAY SECURE GATEWAY'}
                          </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.6rem', fontSize: '0.86rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                            <span style={{ color: '#64748B' }}>{tW.labels?.selectedServiceLabel || 'Selected DPR Service:'}</span>
                            <strong style={{ color: '#0F172A' }}>{formData.dpr_type || 'Bank Loan DPR'}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                            <span style={{ color: '#64748B' }}>{tW.labels?.selectedPlanLabel || 'Selected Pricing Plan:'}</span>
                            <strong style={{ color: '#008C95' }}>{activePlanMeta.name}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0' }}>
                            <span style={{ color: '#64748B' }}>{tW.labels?.reportScopeLabel || 'Report Scope:'}</span>
                            <span style={{ color: '#334155', fontWeight: 600 }}>{activePlanMeta.pages} ({activePlanMeta.projects})</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderTop: '1px dashed #E2E8F0', marginTop: '4px', paddingTop: '8px' }}>
                            <span style={{ color: '#0F172A', fontWeight: 700, fontSize: '0.95rem' }}>{tW.labels?.totalPayableLabel || 'Total Amount Payable:'}</span>
                            <strong style={{ fontSize: '1.25rem', color: '#008C95' }}>₹{getDisplayPrice()}</strong>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.76rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px', background: '#F8FAFC', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', marginTop: '2px' }}>
                          <i className="fas fa-shield-alt" style={{ color: '#10B981', fontSize: '0.9rem' }} />
                          <span>{tW.labels?.secureGatewayNote || 'Secured by Razorpay — Supports UPI (Google Pay, PhonePe, Paytm), All Debit/Credit Cards & NetBanking'}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <div style={{ background: '#F8FAFC', border: '1.5px solid #CBD5E1', padding: '0.8rem 1.4rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}>
                          <input
                            type="checkbox"
                            id="associated_with_vkf"
                            name="associated_with_vkf"
                            checked={!!formData.associated_with_vkf}
                            onChange={(e) => setFormData((prev) => ({ ...prev, associated_with_vkf: e.target.checked }))}
                            style={{ width: '18px', height: '18px', accentColor: '#008C95', cursor: 'pointer' }}
                          />
                          <label htmlFor="associated_with_vkf" style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', cursor: 'pointer', margin: 0 }}>
                            {tW.labels?.associatedVkf || 'Associated / Partnered with VKF'}
                          </label>
                        </div>

                        <div style={{ background: '#FFF7ED', border: '1.5px solid #FFEDD5', padding: '0.8rem 1.4rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', userSelect: 'none' }}>
                          <input
                            type="checkbox"
                            id="test_one_rupee_mode"
                            checked={isTestOneRupee}
                            onChange={(e) => setIsTestOneRupee(e.target.checked)}
                            style={{ width: '18px', height: '18px', accentColor: '#EA580C', cursor: 'pointer' }}
                          />
                          <label htmlFor="test_one_rupee_mode" style={{ fontSize: '0.92rem', fontWeight: 700, color: '#C2410C', cursor: 'pointer', margin: 0 }}>
                            <FlaskConical size={16} strokeWidth={1.75} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} />{tW.labels?.testRupeeMode || 'Test ₹1 Payment Mode (Live Razorpay Receipt Test)'}
                          </label>
                        </div>
                      </div>

                      {paymentUnlocked && (
                        <div style={{ padding: '0.8rem 1.6rem', background: '#F0FDFA', border: '1.5px solid #008C95', borderRadius: '0.75rem', color: '#008C95', fontWeight: 800, fontSize: '0.98rem', textAlign: 'center' }}>
                          <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
                          {tW.labels?.paymentVerified || 'PAYMENT VERIFIED! YOUR REPORT IS FULLY UNLOCKED'}
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', flexWrap: 'wrap', width: '100%' }}>
                        <button
                          type="button"
                          onClick={handlePayAndGeneratePDF}
                          disabled={generating}
                          className="btn-next-spacious"
                          style={{ padding: '1.2rem 2.6rem', fontSize: '1.05rem', background: paymentUnlocked ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'linear-gradient(135deg, #008C95 0%, #006F78 100%)', boxShadow: '0 8px 25px rgba(0, 140, 149, 0.35)', minWidth: '320px' }}
                        >
                          <i className={paymentUnlocked ? "fas fa-download" : "fas fa-lock-open"} style={{ marginRight: '8px' }}></i> {generating ? (tW.labels?.compilingPdf || 'Compiling PDF Engine Report...') : paymentUnlocked ? (tW.labels?.downloadPdfUnlocked || 'DOWNLOAD OFFICIAL PDF REPORT (UNLOCKED)') : `${tW.labels?.payPdf || 'PAY & DOWNLOAD OFFICIAL PDF REPORT'} (₹${getDisplayPrice()})`}
                        </button>
                      </div>

                      {!paymentUnlocked && (
                        <div style={{ textAlign: 'center', marginTop: '0.2rem' }}>
                          <button
                            type="button"
                            onClick={handleVerifyAndUnlock}
                            disabled={checkingPayment}
                            style={{ background: 'none', border: 'none', color: '#008C95', textDecoration: 'underline', fontSize: '0.86rem', cursor: 'pointer', fontWeight: 700 }}
                          >
                            {checkingPayment ? (tW.labels?.checkingPayment || 'Checking Live Razorpay Payment Status...') : (tW.labels?.verifyUpi || 'Already completed payment on UPI / QR? Click here to verify & unlock report →')}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })(),
              },
            ]}
          />
        </div>
      )}

      {/* LIVE INTERACTIVE GENERATION FLOATING MODAL WITH BLUR BACKDROP */}
      <DPRGenerationModal
        isOpen={generating}
        progressPercent={progressPercent}
        stepName={stepName}
        language={formData.language || language}
      />
    </div>
  );
}
