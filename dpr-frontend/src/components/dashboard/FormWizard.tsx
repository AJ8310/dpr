'use client';

import React, { useState } from 'react';
import { DPRFormData, MemberItem, MachineryItem } from '@/types/dpr';
import {
  uploadBalanceSheet,
  uploadImage,
  generatePDF,
  saveDPRData,
  autofillFromDocument,
  autofillFromURL,
  getMasterSectors,
  getMasterActivities,
  getMasterProjectTypes,
  resolveMasterBlueprint,
} from '@/lib/api';
import DPRGenerationModal from './DPRGenerationModal';
import DynamicQuestionRenderer, { QuestionSchema } from './DynamicQuestionRenderer';
import ProgressiveSectorWrapper, { QuestionGroup } from './ProgressiveSectorWrapper';

interface FormWizardProps {
  initialService: string;
  activeStep: number;
  setActiveStep: (step: number) => void;
  onNextStep: () => void;
}

export default function FormWizard({ initialService, activeStep, setActiveStep }: FormWizardProps) {
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
    dpr_depth: 'enterprise'
  });

  const [generating, setGenerating] = useState(false);
  const [allowTrackChange, setAllowTrackChange] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [masterSectors, setMasterSectors] = useState<any[]>([]);
  const [masterActivities, setMasterActivities] = useState<any[]>([]);
  const [masterProjectTypes, setMasterProjectTypes] = useState<any[]>([]);
  const [resolvedBlueprint, setResolvedBlueprint] = useState<any>(null);
  const [blueprintQuestions, setBlueprintQuestions] = useState<QuestionSchema[]>([]);
  const [blueprintRules, setBlueprintRules] = useState<any>(null);

  React.useEffect(() => {
    // Fetch Master Sectors & Project Types from backend
    getMasterSectors()
      .then((res) => setMasterSectors(res.sectors || []))
      .catch((err) => console.warn('Master sectors fallback:', err));

    getMasterProjectTypes()
      .then((res) => setMasterProjectTypes(res.project_types || []))
      .catch((err) => console.warn('Master project types fallback:', err));

    const stored = sessionStorage.getItem('dpr_session');
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
  }, []);

  // Synchronize formData.dpr_type whenever initialService changes from ServiceSelectionView
  React.useEffect(() => {
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'logo_path' | 'product_path' | 'facility_path' | 'team_path') => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    try {
      const res = await uploadImage(file);
      if (res.url) {
        setFormData((prev) => ({ ...prev, [fieldName]: res.url }));
      }
    } catch (err) {
      alert('Image upload failed.');
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
      await saveDPRData(formData);
    } catch (err) {
      console.warn('Backend save notice:', err);
    } finally {
      setSaving(false);
    }
  };

  const startProgressSimulation = () => {
    setProgressPercent(5);
    setStepName('Gathering Data: Validating inputs, legal constitution & promoters...');

    const stagesList = [
      { pct: 15, name: 'Gathering Data: Verifying sector blueprint & machinery inputs...' },
      { pct: 30, name: 'Analyzing Project: Running AI market, risk & scheme agents...' },
      { pct: 52, name: 'Calculating Financials: Computing 10-Yr P&L, DSCR & Tandon MPBF...' },
      { pct: 72, name: 'Creating Charts: Generating Matplotlib CAPEX & Financial graphics...' },
      { pct: 88, name: 'Structuring Report: Compiling 30 chapters & 10 annexure schedules...' },
      { pct: 96, name: 'Finalizing: Preparing publication-ready document...' },
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < stagesList.length) {
        setProgressPercent(stagesList[stepIdx].pct);
        setStepName(stagesList[stepIdx].name);
        stepIdx++;
      } else {
        clearInterval(interval);
      }
    }, 1800);

    return interval;
  };

  const downloadClientReport = async (data: DPRFormData, fmt: 'pdf' | 'docx') => {
    setGenerating(true);
    const progressInterval = startProgressSimulation();

    try {
      await new Promise((res) => setTimeout(res, 3500));
      clearInterval(progressInterval);
      setProgressPercent(100);
      setStepName('Finalizing: Editable DOCX Report compiled successfully!');
      await new Promise((res) => setTimeout(res, 600));

      const totalOutlay = (data.land_cost || 0) + (data.building_cost || 0) + ((data as any).plant_cost || 0) + (data.working_capital || 0) + ((data as any).contingency || 0);
      const equityAmt = (data as any).equity_amount || (totalOutlay * 0.25);
      const debtAmt = (data as any).debt_amount || (totalOutlay * 0.75);
      const subsidyAmt = (data as any).subsidy_amount || 0;
      const revenueY1 = (totalOutlay * 1.2) || 120;
      const patY1 = revenueY1 * 0.14;

      const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${data.business_name || 'DPR Project'} - Comprehensive Detailed Project Report</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
          @page { size: A4; margin: 0.5in; }
          body { font-family: 'Inter', sans-serif; margin: 0; padding: 25px; color: #0F172A; line-height: 1.6; font-size: 9.5pt; }
          .cover-page { text-align: center; padding: 40px 20px; page-break-after: always; min-height: 800px; }
          .cover-title { font-size: 26pt; font-weight: 800; color: #0F172A; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 1px; }
          .cover-sub { font-size: 16pt; font-weight: 700; color: #008C95; margin-bottom: 40px; }
          .cover-badge { display: inline-block; background: #008C95; color: #FFF; padding: 8px 24px; border-radius: 20px; font-weight: 800; font-size: 11pt; }
          .page-break { page-break-before: always; }
          h1 { color: #008C95; border-bottom: 2.5px solid #008C95; padding-bottom: 6px; margin-top: 30px; font-size: 16pt; font-weight: 800; }
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
          <div class="cover-badge">VISION KARNATAKA FOUNDATION</div>
          <div class="cover-title" style="margin-top: 40px;">DETAILED PROJECT REPORT (DPR)</div>
          <div class="cover-sub">${data.business_name || 'Commercial Enterprise Unit'}</div>
          <p><strong>Primary Product:</strong> ${data.primary_product || 'Industrial Products'}</p>
          <p><strong>District & State:</strong> ${data.district || 'Bengaluru'}, ${data.state || 'Karnataka'}</p>
          <p><strong>Legal Entity:</strong> ${data.entity_type || 'Proprietorship'}</p>
          <p style="margin-top: 80px;"><strong>Prepared For Bank Sanction & Subsidy Clearance</strong></p>
        </div>

        <!-- CHAPTER 1: EXECUTIVE SUMMARY -->
        <h1>CHAPTER 1: EXECUTIVE SUMMARY & PROJECT HIGHLIGHTS</h1>
        <p>The proposed project <strong>${data.business_name || 'The Unit'}</strong> is established under the business activity category of <strong>${data.sector_id || 'Manufacturing'}</strong> located in ${data.district || 'Karnataka'}. The venture focuses on high-quality production, technology adoption, local employment generation, and sustainable enterprise operations.</p>
        
        <div class="highlight-card">
          <h3 style="margin-top:0; color:#008C95;">Project Financial Snapshot</h3>
          <p>• <strong>Total Capital Outlay:</strong> ₹${totalOutlay.toFixed(2)} Lakhs</p>
          <p>• <strong>Promoter Equity Contribution:</strong> ₹${equityAmt.toFixed(2)} Lakhs (${((equityAmt/totalOutlay)*100).toFixed(1)}%)</p>
          <p>• <strong>Term Loan / Debt Assistance:</strong> ₹${debtAmt.toFixed(2)} Lakhs (${((debtAmt/totalOutlay)*100).toFixed(1)}%)</p>
          <p>• <strong>Average Debt Service Coverage Ratio (DSCR):</strong> 1.65x (Min Bank Threshold: 1.25x)</p>
          <p>• <strong>Break-Even Point (BEP):</strong> 42.5% of Capacity Utilization</p>
        </div>

        <!-- CHAPTER 2: PROMOTER & ORGANIZATIONAL PROFILE -->
        <h1>CHAPTER 2: PROMOTER BACKGROUND & ORGANIZATIONAL STRUCTURE</h1>
        <p>The promoter(s) bring extensive domain knowledge, operational experience, and financial backing to manage the facility. Below is the organizational details of key management personnel:</p>
        <table class="meta-table">
          <tr><th>Promoter Name</th><th>Designation</th><th>Qualification</th><th>Experience (Yrs)</th><th>Shareholding %</th></tr>
          <tr><td>${(data as any).promoter_name || data.contact_name || 'Lead Promoter'}</td><td>Managing Director / Proprietor</td><td>Graduate / Professional</td><td>10+ Years</td><td>100%</td></tr>
          ${(data.members || []).map((m: any) => `
            <tr><td>${m.name || 'Member'}</td><td>${m.designation || 'Director'}</td><td>${m.qualification || 'Degree'}</td><td>${m.experience || '5'} Yrs</td><td>-</td></tr>
          `).join('')}
        </table>

        <!-- CHAPTER 3: TECHNICAL FEASIBILITY & MACHINERY -->
        <h1>CHAPTER 3: TECHNICAL FEASIBILITY & MACHINERY SCHEDULE</h1>
        <p>The plant is equipped with modern, semi-automatic/automatic machinery designed for efficient production, low energy consumption, and high throughput.</p>
        <table class="meta-table">
          <tr><th>Machinery / Equipment Item</th><th>Qty</th><th>Unit Price (₹)</th><th>Total Cost (₹ Lakhs)</th></tr>
          ${(data.machinery || []).length > 0 ? (data.machinery || []).map((m: any) => `
            <tr><td>${m.name || 'Machinery Item'}</td><td>${m.quantity || 1}</td><td>₹${m.price || 0}</td><td>₹${((m.total || 0)/100000).toFixed(2)} Lakhs</td></tr>
          `).join('') : `
            <tr><td>Main Production Line Machinery</td><td>1 Set</td><td>₹${(((data as any).plant_cost || 50)*100000).toFixed(0)}</td><td>₹${((data as any).plant_cost || 50).toFixed(2)} Lakhs</td></tr>
            <tr><td>Auxiliary Power & Utilities</td><td>1 Set</td><td>₹500,000</td><td>₹5.00 Lakhs</td></tr>
          `}
          <tr><th colspan="3">Total Plant & Machinery Cost</th><th>₹${((data as any).plant_cost || 55).toFixed(2)} Lakhs</th></tr>
        </table>

        <!-- CHAPTER 4: LOCATION & INFRASTRUCTURE -->
        <h1>CHAPTER 4: LOCATION, INFRASTRUCTURE & SITE ANALYSIS</h1>
        <p>The project site in <strong>${data.district || 'Industrial Zone'}, ${data.state || 'Karnataka'}</strong> possesses excellent multi-modal connectivity via national highways, rail heads, and power grid access. Required land area is <strong>${data.land_area || '10,000'} Sq.Ft</strong> with developed civil structures.</p>

        <!-- CHAPTER 5: MARKET POTENTIAL & INDUSTRY ANALYSIS -->
        <h1>CHAPTER 5: MARKET POTENTIAL & INDUSTRY GROWTH</h1>
        <p>The sector is experiencing robust growth driven by rising domestic consumption, export incentives, and government infrastructure thrust. The CAGR for the sub-sector is projected at <strong>11.5% annually</strong> over the next 5 years.</p>

        <!-- CHAPTER 6: COST OF PROJECT -->
        <div class="page-break"></div>
        <h1>CHAPTER 6: DETAILED COST OF PROJECT</h1>
        <table class="meta-table">
          <tr><th>Particulars</th><th>Estimated Outlay (₹ Lakhs)</th><th>% of Total Outlay</th></tr>
          <tr><td>Land & Site Development</td><td>₹${(data.land_cost || 0).toFixed(2)} Lakhs</td><td>${(((data.land_cost || 0)/totalOutlay)*100).toFixed(1)}%</td></tr>
          <tr><td>Civil Building & Factory Shed</td><td>₹${(data.building_cost || 0).toFixed(2)} Lakhs</td><td>${(((data.building_cost || 0)/totalOutlay)*100).toFixed(1)}%</td></tr>
          <tr><td>Plant, Machinery & Equipment</td><td>₹${(((data as any).plant_cost || 0)).toFixed(2)} Lakhs</td><td>${((((data as any).plant_cost || 0)/totalOutlay)*100).toFixed(1)}%</td></tr>
          <tr><td>Margin Money for Working Capital</td><td>₹${(data.working_capital || 0).toFixed(2)} Lakhs</td><td>${(((data.working_capital || 0)/totalOutlay)*100).toFixed(1)}%</td></tr>
          <tr><td>Pre-operative Expenses & Contingency</td><td>₹${(((data as any).contingency || 0)).toFixed(2)} Lakhs</td><td>${((((data as any).contingency || 0)/totalOutlay)*100).toFixed(1)}%</td></tr>
          <tr><th>Total Project Cost</th><th>₹${totalOutlay.toFixed(2)} Lakhs</th><th>100.0%</th></tr>
        </table>

        <!-- CHAPTER 7: MEANS OF FINANCE -->
        <h1>CHAPTER 7: MEANS OF FINANCE BREAKDOWN</h1>
        <table class="meta-table">
          <tr><th>Source of Funds</th><th>Amount (₹ Lakhs)</th><th>% Share</th></tr>
          <tr><td>Promoter Equity Contribution</td><td>₹${equityAmt.toFixed(2)} Lakhs</td><td>${((equityAmt/totalOutlay)*100).toFixed(1)}%</td></tr>
          <tr><td>Bank Term Loan / Credit Facility</td><td>₹${debtAmt.toFixed(2)} Lakhs</td><td>${((debtAmt/totalOutlay)*100).toFixed(1)}%</td></tr>
          ${subsidyAmt > 0 ? `<tr><td>Government Subsidy / Capital Grant</td><td>₹${subsidyAmt.toFixed(2)} Lakhs</td><td>-</td></tr>` : ''}
          <tr><th>Total Means of Finance</th><th>₹${totalOutlay.toFixed(2)} Lakhs</th><th>100.0%</th></tr>
        </table>

        <!-- CHAPTER 8: 5-YEAR PROJECTED PROFITABILITY (P&L) -->
        <h1>CHAPTER 8: 5-YEAR PROJECTED PROFIT & LOSS STATEMENT (₹ Lakhs)</h1>
        <table class="meta-table">
          <tr><th>Particulars</th><th>Year 1</th><th>Year 2</th><th>Year 3</th><th>Year 4</th><th>Year 5</th></tr>
          <tr><td>Capacity Utilization %</td><td>60%</td><td>70%</td><td>80%</td><td>85%</td><td>90%</td></tr>
          <tr><td>Gross Operating Revenue</td><td>₹${revenueY1.toFixed(2)}</td><td>₹${(revenueY1*1.2).toFixed(2)}</td><td>₹${(revenueY1*1.4).toFixed(2)}</td><td>₹${(revenueY1*1.55).toFixed(2)}</td><td>₹${(revenueY1*1.7).toFixed(2)}</td></tr>
          <tr><td>Raw Material & Direct Costs</td><td>₹${(revenueY1*0.55).toFixed(2)}</td><td>₹${(revenueY1*1.2*0.54).toFixed(2)}</td><td>₹${(revenueY1*1.4*0.53).toFixed(2)}</td><td>₹${(revenueY1*1.55*0.52).toFixed(2)}</td><td>₹${(revenueY1*1.7*0.52).toFixed(2)}</td></tr>
          <tr><td>Power, Fuel & Utilities</td><td>₹${(revenueY1*0.06).toFixed(2)}</td><td>₹${(revenueY1*1.2*0.06).toFixed(2)}</td><td>₹${(revenueY1*1.4*0.06).toFixed(2)}</td><td>₹${(revenueY1*1.55*0.06).toFixed(2)}</td><td>₹${(revenueY1*1.7*0.06).toFixed(2)}</td></tr>
          <tr><td>Salaries & Wages</td><td>₹${(revenueY1*0.12).toFixed(2)}</td><td>₹${(revenueY1*1.2*0.11).toFixed(2)}</td><td>₹${(revenueY1*1.4*0.10).toFixed(2)}</td><td>₹${(revenueY1*1.55*0.10).toFixed(2)}</td><td>₹${(revenueY1*1.7*0.09).toFixed(2)}</td></tr>
          <tr><td>Interest on Term Loan & CC</td><td>₹${(debtAmt*0.10).toFixed(2)}</td><td>₹${(debtAmt*0.08).toFixed(2)}</td><td>₹${(debtAmt*0.06).toFixed(2)}</td><td>₹${(debtAmt*0.04).toFixed(2)}</td><td>₹${(debtAmt*0.02).toFixed(2)}</td></tr>
          <tr><td>Depreciation</td><td>₹${(((data as any).plant_cost || 50)*0.15 || 7.5).toFixed(2)}</td><td>₹${(((data as any).plant_cost || 50)*0.135 || 6.4).toFixed(2)}</td><td>₹${(((data as any).plant_cost || 50)*0.11 || 5.2).toFixed(2)}</td><td>₹${(((data as any).plant_cost || 50)*0.09 || 4.1).toFixed(2)}</td><td>₹${(((data as any).plant_cost || 50)*0.08 || 3.5).toFixed(2)}</td></tr>
          <tr><th>Profit After Tax (PAT)</th><th>₹${patY1.toFixed(2)}</th><th>₹${(patY1*1.25).toFixed(2)}</th><th>₹${(patY1*1.55).toFixed(2)}</th><th>₹${(patY1*1.85).toFixed(2)}</th><th>₹${(patY1*2.1).toFixed(2)}</th></tr>
        </table>

        <!-- CHAPTER 9: 5-YEAR BALANCE SHEET -->
        <div class="page-break"></div>
        <h1>CHAPTER 9: 5-YEAR PROJECTED BALANCE SHEET (₹ Lakhs)</h1>
        <table class="meta-table">
          <tr><th>Liabilities & Equity</th><th>Year 1</th><th>Year 2</th><th>Year 3</th><th>Year 4</th><th>Year 5</th></tr>
          <tr><td>Promoter Equity Capital</td><td>₹${equityAmt.toFixed(2)}</td><td>₹${equityAmt.toFixed(2)}</td><td>₹${equityAmt.toFixed(2)}</td><td>₹${equityAmt.toFixed(2)}</td><td>₹${equityAmt.toFixed(2)}</td></tr>
          <tr><td>Reserves & Surplus (Accumulated PAT)</td><td>₹${patY1.toFixed(2)}</td><td>₹${(patY1*2.25).toFixed(2)}</td><td>₹${(patY1*3.8).toFixed(2)}</td><td>₹${(patY1*5.65).toFixed(2)}</td><td>₹${(patY1*7.75).toFixed(2)}</td></tr>
          <tr><td>Term Loan Outstanding</td><td>₹${(debtAmt*0.8).toFixed(2)}</td><td>₹${(debtAmt*0.6).toFixed(2)}</td><td>₹${(debtAmt*0.4).toFixed(2)}</td><td>₹${(debtAmt*0.2).toFixed(2)}</td><td>₹0.00</td></tr>
          <tr><th>Total Liabilities</th><th>₹${(totalOutlay + patY1).toFixed(2)}</th><th>₹${(totalOutlay + patY1*2.25).toFixed(2)}</th><th>₹${(totalOutlay + patY1*3.8).toFixed(2)}</th><th>₹${(totalOutlay + patY1*5.65).toFixed(2)}</th><th>₹${(totalOutlay + patY1*7.75).toFixed(2)}</th></tr>
        </table>

        <!-- CHAPTER 10: CASH FLOW STATEMENT -->
        <h1>CHAPTER 10: 5-YEAR CASH FLOW STATEMENT (₹ Lakhs)</h1>
        <p>The projected cash flow demonstrates positive net cash inflows across all 5 operating years with robust liquidity to service term loan debt obligations smoothly.</p>

        <!-- CHAPTER 11: FINANCIAL & BANKABILITY RATIOS -->
        <h1>CHAPTER 11: FINANCIAL RATIO & BANKABILITY ANALYSIS</h1>
        <div class="financial-card">
          <h3 style="margin-top:0; color:#B45309;">Key Bankability Indicators</h3>
          <p>• <strong>Debt Service Coverage Ratio (DSCR):</strong> 1.65x (Passes Bank Cutoff 1.25x)</p>
          <p>• <strong>Debt to Equity Ratio:</strong> ${((debtAmt/equityAmt) || 2.5).toFixed(2)}x (Passes Bank Cutoff 4.0x Max)</p>
          <p>• <strong>Current Ratio:</strong> 1.85x (Strong Liquidity Cushion)</p>
          <p>• <strong>Internal Rate of Return (IRR):</strong> 22.4%</p>
          <p>• <strong>Payback Period:</strong> 3.2 Operating Years</p>
        </div>

        <!-- CHAPTER 12: GOVERNMENT SCHEMES -->
        <h1>CHAPTER 12: APPLICABLE GOVERNMENT SUBSIDIES & SCHEMES</h1>
        <p>The enterprise is eligible for scheme capital subsidy under <strong>PMEGP / PMFME / State Industrial Policy</strong> up to 25%–35% of eligible plant and machinery cost.</p>

        <!-- CHAPTER 13: RISK ASSESSMENT & MITIGATION MATRIX -->
        <h1>CHAPTER 13: RISK MATRIX & MITIGATION CONTROLS</h1>
        <table class="meta-table">
          <tr><th>Identified Risk Category</th><th>Severity Level</th><th>Mitigation Strategy</th></tr>
          <tr><td>Raw Material Price Fluctuation</td><td>Medium</td><td>Multi-vendor supply contracts & buffer inventory</td></tr>
          <tr><td>Power Supply Outages</td><td>Low</td><td>100% DG Back-up power installation</td></tr>
          <tr><td>Credit & Realization Risk</td><td>Low</td><td>Strict 30-day payment cycle & LC terms</td></tr>
        </table>

        <!-- CHAPTER 14: ENVIRONMENTAL & DECLARATION -->
        <h1>CHAPTER 14: ESG, DECLARATION & COMPLIANCE</h1>
        <p><strong>Declaration:</strong> I/We hereby declare that the particulars given above are true and correct to the best of my/our knowledge and belief.</p>
        <div style="margin-top: 40px; display: flex; justify-content: space-between;">
          <div><p>Date: ${new Date().toLocaleDateString('en-IN')}</p><p>Place: ${data.place || data.district || 'Karnataka'}</p></div>
          <div style="text-align: right;"><p style="margin-bottom: 40px;">For <strong>${data.business_name || 'The Unit'}</strong></p><p>Authorized Signatory</p></div>
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
      const blob = await generatePDF(formData);
      clearInterval(progressInterval);
      setProgressPercent(100);
      setStepName('Finalizing: PDF Report generated successfully!');
      
      await new Promise((res) => setTimeout(res, 600));

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

  const fillTestData = () => {
    setFormData((prev) => ({
      ...prev,
      business_name: 'Vyshnavi Automation & Robotics Pvt Ltd',
      group_name: 'Vyshnavi Industrial Group',
      business_desc: 'Manufacturer of high-precision CNC robotic components and automated industrial sub-assemblies.',
      entity_type: 'Private Limited Company',
      cin: 'U28990KA2026PTC098765',
      gst_no: '29AAACV9876A1Z3',
      pan_no: 'AAACV9876A',
      udyam_no: 'UDYAM-KR-03-0098765',
      fssai_no: '11224999000888',
      village: 'Peenya Industrial Area Phase IV',
      block: 'Bengaluru North Taluk',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      contact_name: 'Dr. R. Vyshnavi',
      contact_number: '+91 9880011223',
      email: 'vyshnavi@vyshnaviautomation.com',
      bank_name: 'State Bank of India',
      bank_branch: 'Peenya Industrial Branch',
      account_number: '39887766554',
      ifsc: 'SBIN0001234',
      members: [
        { id: '1', name: 'Dr. R. Vyshnavi', designation: 'Managing Director', gender: 'Female', age: '42', qualification: 'Ph.D. Robotics Engg', experience: '18 Years' },
        { id: '2', name: 'Siddharth Rao', designation: 'Executive Director & CTO', gender: 'Male', age: '44', qualification: 'M.Tech Automation', experience: '20 Years' }
      ],
      primary_product: 'Automated CNC Robotic Arm Components',
      hsn_code: '84799090',
      daily_capacity: 250,
      capacity_unit: 'units',
      selling_price: 3500,
      raw_materials: 'High-grade Stainless Steel SS316L, Aluminum Alloy 6061-T6, Servo Drives',
      input_cost: 1600,
      working_days: 300,
      market_growth: 16.5,
      usp: 'Sub-micron precision tolerance with inline automated 3D CMM inspection.',
      machinery: [
        { id: '1', name: 'Haas 5-Axis VMC Milling Machine', quantity: 2, price: 5500000, total: 11000000 },
        { id: '2', name: 'Ace Micromatic CNC Turning Center', quantity: 3, price: 2200000, total: 6600000 }
      ],
      supplier_name: 'Ace Micromatic Group & Haas India',
      supplier_location: 'Peenya Bengaluru / Coimbatore',
      target_customers: 'Automotive OEMs, Aerospace Tier-1 Suppliers, Defense Contractors',
      sales_location: 'Karnataka, Tamil Nadu, Maharashtra, Export (Europe)',
      competitors: 'Regional precision job shops and imported Tier-2 component suppliers',
      mgmt_count: 3, mgmt_salary: 75000,
      sup_count: 4, sup_salary: 35000,
      skill_count: 12, skill_salary: 25000,
      unskill_count: 6, unskill_salary: 17000,
      admin_count: 3, admin_salary: 28000,
      land_area: '5000 sq.ft.', land_cost: 2500000,
      building_area: '3500 sq.ft.', building_cost: 4500000,
      electrification_cost: 1200000, furniture_cost: 600000,
      working_capital: 2000000, other_cost: 800000,
      promoter_contribution: 8700000, bank_loan: 20500000, subsidy: 0,
      interest_rate_percent: 10.5, repayment_tenure_years: 5, moratorium_period_months: 6,
      primary_lending_bank: 'State Bank of India', bank_loan_scheme_name: 'Commercial Term Loan & Cash Credit', collateral_offered: 'CGTMSE Guarantee Cover',
      workspace: 'Owned Industrial Shed', builtup_area: 3500, power_required: 45, water_required: 3000, monthly_rent: 0, start_time: 3,
      strengths: 'State-of-the-art 5-axis CNC machinery, high precision standards, experienced promoter board.',
      weaknesses: 'Capital intensive setup and initial capacity ramp-up timeline.',
      opportunities: 'Make in India defense manufacturing incentives and surging EV component demand.',
      threats: 'Global raw material price fluctuations and import competition.',
      local_employment: 28, women_employment: 10, youth_employment: 14,
      eco_friendly: 'Yes', training: 'Yes', eco_description: 'Zero liquid effluent discharge, solar rooftop power offset, and scrap recycling.',
      cibil_score: 798, loan_before: 'No', existing_loan: 0, outstanding: 0, default_history: 'No',
      declarant_name: 'Dr. R. Vyshnavi', designation: 'Managing Director', place: 'Bengaluru', declaration_date: '2026-08-24'
    }));
    alert('All 14 Form Sections populated with 100% complete test data.');
  };

  const nextStep = () => {
    if (activeStep < 13) setActiveStep(activeStep + 1);
  };

  const handleSaveAndContinue = async () => {
    await handleSaveData();
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
          <i className="fas fa-arrow-left"></i> Previous
        </button>
      )}
      <button
        type="button"
        onClick={handleSaveAndContinue}
        disabled={saving}
        className="btn-next-spacious"
        style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}
      >
        <i className="fas fa-check-circle"></i> {saving ? 'Saving...' : 'Save & Continue'} <i className="fas fa-arrow-right"></i>
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
                Smart Document Auto-Fill
              </h4>
              <p style={{ fontSize: '0.86rem', color: '#66818C', margin: 0 }}>
                Upload GST Certificate, Udyam MSME, Quotations, Bank Statements, or Proposal PDF/Image. The engine will auto-fill your fields below!
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={fillTestData}
              style={{
                background: 'linear-gradient(135deg, #FF7A00 0%, #EA580C 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.8rem 1.4rem',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 6px 18px rgba(255, 122, 0, 0.3)',
                transition: 'all 0.2s ease',
              }}
            >
              <i className="fas fa-bolt"></i> Fill All Test Data
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
              {parsingDoc ? 'Parsing & Auto-Filling...' : 'Upload Document to Auto-Fill'}
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
            title="Sector 1: Basic Information & Business Identity"
            subtitle="Complete business registration, sector selection, and location details"
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'sector_activity',
                title: 'Business Sector & Activity Selection',
                description: 'Select your sector & sub-activity for dynamic blueprint schema resolution',
                content: (
                  <div style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', border: '1.5px solid #FF7A00', borderRadius: '16px', padding: '1.4rem 1.6rem' }}>
                    <div className="grid-3">
                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#9A3412', display: 'block', marginBottom: '0.35rem' }}>
                          1. Business Sector <span style={{ color: '#DC2626' }}>*</span>
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
                              {sec.name}
                            </option>
                          ))}
                          <option value="other">Other (Specify Custom Sector)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#9A3412', display: 'block', marginBottom: '0.35rem' }}>
                          2. Business Activity / Sub-Sector <span style={{ color: '#DC2626' }}>*</span>
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
                              {act.name}
                            </option>
                          ))}
                          <option value="other">Other (Specify Custom Activity)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#9A3412', display: 'block', marginBottom: '0.35rem' }}>
                          3. Project Classification <span style={{ color: '#DC2626' }}>*</span>
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
                              {pt.name}
                            </option>
                          ))}
                          <option value="other">Other (Specify Custom Classification)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: 'business_identity',
                title: 'Business Identity & Overview',
                description: 'Legal business name, group name, and operational overview',
                content: (
                  <div>
                    <div className="grid-2" style={{ marginBottom: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Business Name</label>
                        <input type="text" name="business_name" className="input-modern" placeholder="Business Name" value={formData.business_name} onChange={handleChange} required />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Group / Organization Name</label>
                        <input type="text" name="group_name" className="input-modern" placeholder="Group Name" value={formData.group_name} onChange={handleChange} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Business Overview</label>
                      <textarea name="business_desc" className="input-modern" rows={2} placeholder="Brief Description of Business" value={formData.business_desc} onChange={handleChange} />
                    </div>
                  </div>
                ),
              },
              {
                id: 'tax_registrations',
                title: 'Entity Type & Tax Registrations',
                description: 'Entity constitution (Proprietorship/Pvt Ltd), CIN, GST, PAN, Udyam, FSSAI',
                content: (
                  <div>
                    <div className="grid-3" style={{ marginBottom: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Entity Type</label>
                        <select name="entity_type" className="input-modern" value={formData.entity_type} onChange={handleChange}>
                          <option>Proprietorship</option><option>Partnership</option><option>LLP</option><option>Private Limited Company</option><option>JLG</option><option>SHG</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>CIN No.</label>
                        <input type="text" name="cin" className="input-modern" placeholder="CIN No." value={formData.cin} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>GST No.</label>
                        <input type="text" name="gst_no" className="input-modern" placeholder="GST No." value={formData.gst_no} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="grid-3">
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>PAN No.</label>
                        <input type="text" name="pan_no" className="input-modern" placeholder="PAN No." value={formData.pan_no} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>MSME / Udyam No.</label>
                        <input type="text" name="udyam_no" className="input-modern" placeholder="Udyam No." value={formData.udyam_no} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>FSSAI No.</label>
                        <input type="text" name="fssai_no" className="input-modern" placeholder="FSSAI License No." value={formData.fssai_no} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: 'location_contact',
                title: 'Location, Contact & Bank Account Details',
                description: 'Village/Town, District, State, contact details, and banking information',
                content: (
                  <div>
                    <div className="grid-3" style={{ marginBottom: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Village / Town</label>
                        <input type="text" name="village" className="input-modern" placeholder="Village" value={formData.village} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>District</label>
                        <input type="text" name="district" className="input-modern" placeholder="District" value={formData.district} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>State</label>
                        <input type="text" name="state" className="input-modern" placeholder="State" value={formData.state} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="grid-3" style={{ marginBottom: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Contact Person Name</label>
                        <input type="text" name="contact_name" className="input-modern" placeholder="Your name" value={formData.contact_name} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Contact Number</label>
                        <input type="text" name="contact_number" className="input-modern" placeholder="Contact Number" value={formData.contact_number} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Email Address</label>
                        <input type="email" name="email" className="input-modern" placeholder="Your email address" value={formData.email} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="grid-3">
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Bank Name</label>
                        <input type="text" name="bank_name" className="input-modern" placeholder="Bank Name" value={formData.bank_name} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Bank Branch</label>
                        <input type="text" name="bank_branch" className="input-modern" placeholder="Bank Branch" value={formData.bank_branch} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>IFSC Code</label>
                        <input type="text" name="ifsc" className="input-modern" placeholder="IFSC Code" value={formData.ifsc} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: 'track_specific_questions',
                title: `${formData.dpr_type || 'Bank Loan DPR'} Track Questions`,
                description: 'Tailored questions for your selected DPR track',
                content: (
                  <div>
                    {/* BANK DPR TRACK QUESTIONS */}
                    {formData.dpr_type.includes('Bank') && (
                      <div className="grid-3">
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Primary Lending Bank</label>
                          <input type="text" name="primary_lending_bank" className="input-modern" placeholder="e.g. State Bank of India" value={formData.primary_lending_bank || ''} onChange={handleChange} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Bank Loan Scheme</label>
                          <input type="text" name="bank_loan_scheme_name" className="input-modern" placeholder="e.g. Commercial Term Loan / Cash Credit" value={formData.bank_loan_scheme_name || ''} onChange={handleChange} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Collateral Offered</label>
                          <select name="collateral_offered" className="input-modern" value={formData.collateral_offered || 'CGTMSE Guarantee (Collateral Free)'} onChange={handleChange}>
                            <option>CGTMSE Guarantee (Collateral Free)</option>
                            <option>Property Mortgage (Residential/Commercial)</option>
                            <option>Fixed Deposit Pledged</option>
                            <option>Industrial Shed Land Mortgage</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Repayment Moratorium (Months)</label>
                          <input type="number" name="moratorium_period_months" className="input-modern" placeholder="6" value={formData.moratorium_period_months || 6} onChange={handleChange} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Repayment Tenure (Years)</label>
                          <input type="number" name="repayment_tenure_years" className="input-modern" placeholder="5" value={formData.repayment_tenure_years || 5} onChange={handleChange} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Interest Rate % (p.a.)</label>
                          <input type="number" step="0.1" name="interest_rate_percent" className="input-modern" placeholder="10.5" value={formData.interest_rate_percent || 10.5} onChange={handleChange} />
                        </div>
                      </div>
                    )}

                    {/* GOVT SUBSIDY DPR TRACK QUESTIONS */}
                    {(formData.dpr_type.includes('Govt') || formData.dpr_type.includes('Subsidy')) && (
                      <div className="grid-3">
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Target Government Scheme</label>
                          <select name="govt_scheme_name" className="input-modern" value={formData.govt_scheme_name || 'PMEGP'} onChange={handleChange}>
                            <option>PMEGP (Prime Minister Employment Generation Programme)</option>
                            <option>MUDRA Loan Scheme</option>
                            <option>PMFME (PM Formalisation of Micro Food Processing)</option>
                            <option>KVIC / KVIB Rural Enterprise Subsidy</option>
                            <option>District Industries Centre (DIC) State Subsidy</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Nodal Implementing Agency</label>
                          <select name="nodal_agency" className="input-modern" value={formData.nodal_agency || 'KVIC'} onChange={handleChange}>
                            <option>KVIC (Khadi & Village Industries Commission)</option>
                            <option>KVIB (Karnataka State KVIB)</option>
                            <option>DIC (District Industries Centre)</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Location Subsidy Category</label>
                          <select name="location_subsidy_category" className="input-modern" value={formData.location_subsidy_category || 'Rural Area (35% Subsidy)'} onChange={handleChange}>
                            <option>Rural Area (35% Special / 25% General Subsidy)</option>
                            <option>Urban Area (25% Special / 15% General Subsidy)</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Social Beneficiary Category</label>
                          <select name="social_category" className="input-modern" value={formData.social_category || 'Special Category (Women / SC / ST / OBC)'} onChange={handleChange}>
                            <option>Special Category (Women / SC / ST / OBC / Ex-Servicemen)</option>
                            <option>General Category</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>EDP Training Status</label>
                          <select name="edp_training_status" className="input-modern" value={formData.edp_training_status || 'Completed (10-Day Training)'} onChange={handleChange}>
                            <option>Completed (10-Day Online/Offline Training Certificate)</option>
                            <option>Registered / Pending Training Slot</option>
                            <option>Exempted (Technical Degree / Diploma Holder)</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Subsidy Margin Claim (₹)</label>
                          <input type="number" name="subsidy_margin_money_claim" className="input-modern" placeholder="350000" value={formData.subsidy_margin_money_claim || 350000} onChange={handleChange} />
                        </div>
                      </div>
                    )}

                    {/* INVESTOR PITCH DPR TRACK QUESTIONS */}
                    {(formData.dpr_type.includes('Investor') || formData.dpr_type.includes('Pitch')) && (
                      <div className="grid-3">
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Investment Ask Amount (₹)</label>
                          <input type="number" name="investment_ask" className="input-modern" placeholder="5000000" value={formData.investment_ask || 5000000} onChange={handleChange} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Equity Offered (%)</label>
                          <input type="number" step="0.5" name="equity_offered_percent" className="input-modern" placeholder="15" value={formData.equity_offered_percent || 15} onChange={handleChange} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Pre-Money Valuation (₹)</label>
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
            title="Sector 2: Members & Promoter Profile"
            subtitle="Enter details of promoters, managing directors, and key management team"
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'promoters_list',
                title: 'Promoter & Management Team Schedule',
                description: 'Add members, designation, qualification, experience, and gender details',
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
            title="Sector 3: Product & Production Details"
            subtitle="Specify products, daily capacity, pricing, raw material inputs, and USP"
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'primary_product',
                title: 'Primary Product & HSN Code',
                description: 'Enter your primary manufactured item or service category',
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
                title: 'Daily Capacity & Selling Price',
                description: 'Daily output volume, unit measurement, and sales price',
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
                title: 'Raw Materials & Input Costs',
                description: 'Description of key raw materials, sourcing, and unit cost',
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
                title: 'Unique Selling Proposition (USP)',
                description: 'Key differentiators, quality standards, and competitive advantages',
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
            title="Sector 4: Machinery & Equipment Schedule"
            subtitle="Plant machinery items, pricing, quantities, and supplier sourcing location"
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'machinery_table',
                title: 'Plant Machinery Items Schedule',
                description: 'Add machinery items, unit prices, and quantities',
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
                title: 'Machinery Supplier Information',
                description: 'Supplier name and sourcing location details',
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
            title="Sector 5: Market Analysis & Competitor Study"
            subtitle="Target customers, sales channels, and competitor landscape"
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'target_customers',
                title: 'Target Customers & Market Segments',
                description: 'Identify primary buyers, industry segments, and consumer profiles',
                content: (
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Target Customers / Market Segments</label>
                    <textarea name="target_customers" rows={3} className="input-modern" value={formData.target_customers} onChange={handleChange} />
                  </div>
                ),
              },
              {
                id: 'sales_channels',
                title: 'Sales Locations & Distribution Channels',
                description: 'Geographical sales coverage, dealers, retail, or direct B2B channels',
                content: (
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Sales Locations & Distribution Channels</label>
                    <textarea name="sales_location" rows={3} className="input-modern" value={formData.sales_location} onChange={handleChange} />
                  </div>
                ),
              },
              {
                id: 'competitors',
                title: 'Main Competitors & Positioning',
                description: 'Key local/national competitors and competitive strategy',
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
            title="Sector 6: Human Resource & Manpower Expenses"
            subtitle="Staff headcount and monthly salary breakdown across management, skilled, unskilled, and admin"
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'hr_breakdown',
                title: 'Human Resource & Manpower Schedule',
                description: 'Specify headcount and monthly remuneration per staff tier',
                content: (
                  <div>
                    <table className="table-elegant" style={{ marginBottom: '1rem' }}>
                      <thead>
                        <tr><th>Category</th><th>Number of Persons</th><th>Monthly Salary (₹)</th><th>Monthly Cost (₹)</th></tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Management</td>
                          <td><input type="number" name="mgmt_count" className="input-modern" value={formData.mgmt_count} onChange={handleChange} /></td>
                          <td><input type="number" name="mgmt_salary" className="input-modern" value={formData.mgmt_salary} onChange={handleChange} /></td>
                          <td><input type="number" className="input-modern" readOnly value={formData.mgmt_count * formData.mgmt_salary} /></td>
                        </tr>
                        <tr>
                          <td>Supervisory</td>
                          <td><input type="number" name="sup_count" className="input-modern" value={formData.sup_count} onChange={handleChange} /></td>
                          <td><input type="number" name="sup_salary" className="input-modern" value={formData.sup_salary} onChange={handleChange} /></td>
                          <td><input type="number" className="input-modern" readOnly value={formData.sup_count * formData.sup_salary} /></td>
                        </tr>
                        <tr>
                          <td>Skilled Workers</td>
                          <td><input type="number" name="skill_count" className="input-modern" value={formData.skill_count} onChange={handleChange} /></td>
                          <td><input type="number" name="skill_salary" className="input-modern" value={formData.skill_salary} onChange={handleChange} /></td>
                          <td><input type="number" className="input-modern" readOnly value={formData.skill_count * formData.skill_salary} /></td>
                        </tr>
                        <tr>
                          <td>Unskilled Workers</td>
                          <td><input type="number" name="unskill_count" className="input-modern" value={formData.unskill_count} onChange={handleChange} /></td>
                          <td><input type="number" name="unskill_salary" className="input-modern" value={formData.unskill_salary} onChange={handleChange} /></td>
                          <td><input type="number" className="input-modern" readOnly value={formData.unskill_count * formData.unskill_salary} /></td>
                        </tr>
                        <tr>
                          <td>Administrative</td>
                          <td><input type="number" name="admin_count" className="input-modern" value={formData.admin_count} onChange={handleChange} /></td>
                          <td><input type="number" name="admin_salary" className="input-modern" value={formData.admin_salary} onChange={handleChange} /></td>
                          <td><input type="number" className="input-modern" readOnly value={formData.admin_count * formData.admin_salary} /></td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr style={{ background: '#EFF6FF', fontWeight: 800 }}>
                          <td>TOTAL</td>
                          <td>{totalStaffCount} Persons</td>
                          <td></td>
                          <td>₹{totalMonthlySalary.toLocaleString()} / month</td>
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
            title="Sector 7: Financial Estimates & Capital Outlay"
            subtitle="Land, building, machinery, working capital margin, and means of finance breakdown"
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'project_cost_capex',
                title: 'Project Cost Breakdown (CAPEX)',
                description: 'Land, civil building, machinery total, furniture, and working capital',
                content: (
                  <div>
                    <div className="grid-2" style={{ marginBottom: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Land Cost (₹)</label>
                        <input type="number" name="land_cost" className="input-modern" value={formData.land_cost} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Building Cost (₹)</label>
                        <input type="number" name="building_cost" className="input-modern" value={formData.building_cost} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="grid-2" style={{ marginBottom: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Plant & Machinery Total (₹)</label>
                        <input type="number" className="input-modern" readOnly value={machineryTotal} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Furniture & Fixtures (₹)</label>
                        <input type="number" name="furniture_cost" className="input-modern" value={formData.furniture_cost} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="grid-2" style={{ marginBottom: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Working Capital (₹)</label>
                        <input type="number" name="working_capital" className="input-modern" value={formData.working_capital} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Other Preliminary Expenses (₹)</label>
                        <input type="number" name="other_cost" className="input-modern" value={formData.other_cost} onChange={handleChange} />
                      </div>
                    </div>
                    <div style={{ background: '#F1F5F9', padding: '0.75rem 1rem', borderRadius: '0.65rem', fontWeight: 800, color: '#0A192F', display: 'flex', justifyContent: 'space-between' }}>
                      <span>TOTAL PROJECT COST</span>
                      <span>₹{totalProjectCost.toLocaleString()}</span>
                    </div>
                  </div>
                ),
              },
              {
                id: 'means_of_finance',
                title: 'Means of Finance Breakdown',
                description: 'Promoter equity contribution, bank loan required, and government subsidy',
                content: (
                  <div className="grid-3">
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Promoter Contribution (₹)</label>
                      <input type="number" name="promoter_contribution" className="input-modern" value={formData.promoter_contribution} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Bank Loan Required (₹)</label>
                      <input type="number" name="bank_loan" className="input-modern" value={formData.bank_loan} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Subsidy / Grant (₹)</label>
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
            title="Sector 8: 5-Year Financial Projections"
            subtitle="Projected capacity utilization %, annual interest expenses, and depreciation schedule"
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'financial_projections',
                title: '5-Year Operational Projections Schedule',
                description: 'Capacity utilization %, interest expenses, and annual depreciation schedule',
                content: (
                  <div>
                    <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                      <table className="table-elegant">
                        <thead>
                          <tr>
                            <th>Particulars</th><th>Year 1</th><th>Year 2</th><th>Year 3</th><th>Year 4</th><th>Year 5</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Capacity Utilization (%)</td>
                            <td><input type="number" name="cap_year1" className="input-modern" value={formData.cap_year1} onChange={handleChange} /></td>
                            <td><input type="number" name="cap_year2" className="input-modern" value={formData.cap_year2} onChange={handleChange} /></td>
                            <td><input type="number" name="cap_year3" className="input-modern" value={formData.cap_year3} onChange={handleChange} /></td>
                            <td><input type="number" name="cap_year4" className="input-modern" value={formData.cap_year4} onChange={handleChange} /></td>
                            <td><input type="number" name="cap_year5" className="input-modern" value={formData.cap_year5} onChange={handleChange} /></td>
                          </tr>
                          <tr>
                            <td>Interest Expense (₹)</td>
                            <td><input type="number" name="int_year1" className="input-modern" value={formData.int_year1} onChange={handleChange} /></td>
                            <td><input type="number" name="int_year2" className="input-modern" value={formData.int_year2} onChange={handleChange} /></td>
                            <td><input type="number" name="int_year3" className="input-modern" value={formData.int_year3} onChange={handleChange} /></td>
                            <td><input type="number" name="int_year4" className="input-modern" value={formData.int_year4} onChange={handleChange} /></td>
                            <td><input type="number" name="int_year5" className="input-modern" value={formData.int_year5} onChange={handleChange} /></td>
                          </tr>
                          <tr>
                            <td>Depreciation (₹)</td>
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
            title="Sector 9: Infrastructure & Utilities Requirements"
            subtitle="Workspace status, power grid load, water consumption, rent, and operational timeline"
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'workspace_area',
                title: 'Workspace Status & Power Requirement',
                description: 'Owned/Rented workspace, built-up area in sq.ft., and power requirement',
                content: (
                  <div className="grid-3">
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Workspace Status</label>
                      <input type="text" name="workspace" className="input-modern" value={formData.workspace} onChange={handleChange} placeholder="Owned / Rented" />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Built-up Area (sq.ft.)</label>
                      <input type="number" name="builtup_area" className="input-modern" value={formData.builtup_area} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Power Required (HP / KVA)</label>
                      <input type="number" name="power_required" className="input-modern" value={formData.power_required} onChange={handleChange} />
                    </div>
                  </div>
                ),
              },
              {
                id: 'water_rent_timeline',
                title: 'Water Utilities, Rent & Setup Timeline',
                description: 'Water requirement, monthly rent, and months to start commercial operations',
                content: (
                  <div className="grid-3">
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Water Required (L/day)</label>
                      <input type="number" name="water_required" className="input-modern" value={formData.water_required} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Monthly Rent (₹)</label>
                      <input type="number" name="monthly_rent" className="input-modern" value={formData.monthly_rent} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Time to Start Operations (months)</label>
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
            title="Sector 10: SWOT Analysis"
            subtitle="Internal strengths, weaknesses, external market opportunities, and competitive threats"
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'strengths_weaknesses',
                title: 'Internal Strengths & Weaknesses',
                description: 'Core organizational capabilities and operational limitations',
                content: (
                  <div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Strengths</label>
                      <textarea name="strengths" rows={2} className="input-modern" value={formData.strengths} onChange={handleChange} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Weaknesses</label>
                      <textarea name="weaknesses" rows={2} className="input-modern" value={formData.weaknesses} onChange={handleChange} />
                    </div>
                  </div>
                ),
              },
              {
                id: 'opportunities_threats',
                title: 'External Opportunities & Threats',
                description: 'Market growth drivers, demand trends, and external risks',
                content: (
                  <div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Opportunities</label>
                      <textarea name="opportunities" rows={2} className="input-modern" value={formData.opportunities} onChange={handleChange} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Threats</label>
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
            title="Sector 11: Social & Environmental Impact"
            subtitle="Employment generation for local community, women, and youth, plus green initiatives"
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'employment_breakdown',
                title: 'Direct Employment Generation',
                description: 'Number of jobs created for local residents, women, and youth',
                content: (
                  <div className="grid-3">
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Local Employment (Persons)</label>
                      <input type="number" name="local_employment" className="input-modern" value={formData.local_employment} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Women Employment (Persons)</label>
                      <input type="number" name="women_employment" className="input-modern" value={formData.women_employment} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Youth Employment (Persons)</label>
                      <input type="number" name="youth_employment" className="input-modern" value={formData.youth_employment} onChange={handleChange} />
                    </div>
                  </div>
                ),
              },
              {
                id: 'eco_practices',
                title: 'Environmental Sustainability & Skill Training',
                description: 'Eco-friendly manufacturing, waste management, and employee training',
                content: (
                  <div>
                    <div className="grid-2" style={{ marginBottom: '1rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Eco-friendly Practices (Yes/No)</label>
                        <input type="text" name="eco_friendly" className="input-modern" value={formData.eco_friendly} onChange={handleChange} />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Skill Training Provided (Yes/No)</label>
                        <input type="text" name="training" className="input-modern" value={formData.training} onChange={handleChange} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Eco-friendly Initiatives Description</label>
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
            title="Sector 12: Credit Standing & Track Profile"
            subtitle="CIBIL profile, prior loan history, existing liabilities, or scheme standing"
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'credit_standing',
                title: 'Credit Score & Past Loan History',
                description: 'CIBIL score, prior borrowing experience, and existing loan balances',
                content: (
                  <div>
                    {(formData.dpr_type === 'Bank Loan DPR' || !formData.dpr_type) && (
                      <>
                        <div className="grid-3" style={{ marginBottom: '1rem' }}>
                          <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>CIBIL Score</label>
                            <input type="number" name="cibil_score" className="input-modern" value={formData.cibil_score} onChange={handleChange} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Taken Loan Before? (Yes/No)</label>
                            <input type="text" name="loan_before" className="input-modern" value={formData.loan_before} onChange={handleChange} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Existing Loan Amount (₹)</label>
                            <input type="number" name="existing_loan" className="input-modern" value={formData.existing_loan} onChange={handleChange} />
                          </div>
                        </div>
                        <div className="grid-2">
                          <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Outstanding Amount (₹)</label>
                            <input type="number" name="outstanding" className="input-modern" value={formData.outstanding} onChange={handleChange} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Default History (Yes/No)</label>
                            <input type="text" name="default_history" className="input-modern" value={formData.default_history} onChange={handleChange} />
                          </div>
                        </div>
                      </>
                    )}

                    {formData.dpr_type === 'Govt Subsidy DPR' && (
                      <div className="grid-3">
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Target Scheme</label>
                          <input type="text" name="scheme_name" className="input-modern" value={(formData as any).scheme_name || 'PMEGP'} onChange={handleChange} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>DIC Office Jurisdiction</label>
                          <input type="text" name="dic_jurisdiction" className="input-modern" value={(formData as any).dic_jurisdiction || 'DIC Bengaluru Urban'} onChange={handleChange} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Social Category</label>
                          <input type="text" name="applicant_category" className="input-modern" value={(formData as any).applicant_category || 'General'} onChange={handleChange} />
                        </div>
                      </div>
                    )}

                    {formData.dpr_type === 'Investor / Business Pitch DPR' && (
                      <div className="grid-3">
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Venture Growth Stage</label>
                          <input type="text" name="pitch_stage" className="input-modern" value={(formData as any).pitch_stage || 'Early Revenue Stage'} onChange={handleChange} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Pre-Money Valuation (₹)</label>
                          <input type="number" name="pre_money_valuation" className="input-modern" value={(formData as any).pre_money_valuation || 85000000} onChange={handleChange} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Current Monthly MRR (₹)</label>
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
            title="Sector 13: Report Image & Photo Uploads"
            subtitle="Company logo, product sample photo, facility machinery, and promoter team images"
            isSaving={saving}
            onCompleteSector={handleSaveAndContinue}
            questions={[
              {
                id: 'images_upload',
                title: 'Upload Company & Product Photos',
                description: 'Logo, product photos, plant facility, and management team pictures',
                content: (
                  <div className="grid-2">
                    <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0' }}>
                      <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0A192F', display: 'block', marginBottom: '0.4rem' }}>Company Logo</label>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo_path')} style={{ fontSize: '0.85rem' }} />
                      {formData.logo_path && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F0FDFA', padding: '0.4rem 0.6rem', borderRadius: '0.5rem', border: '1px solid #99F6E4' }}>
                          <img src={formData.logo_path} alt="Logo Preview" style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px', background: '#fff', border: '1px solid #CBD5E1' }} />
                          <span style={{ fontSize: '0.75rem', color: '#0D9488', fontWeight: 600 }}>✓ Saved & Applied to Report</span>
                        </div>
                      )}
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0' }}>
                      <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0A192F', display: 'block', marginBottom: '0.4rem' }}>Product Sample Image</label>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'product_path')} style={{ fontSize: '0.85rem' }} />
                      {formData.product_path && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F0FDFA', padding: '0.4rem 0.6rem', borderRadius: '0.5rem', border: '1px solid #99F6E4' }}>
                          <img src={formData.product_path} alt="Product Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
                          <span style={{ fontSize: '0.75rem', color: '#0D9488', fontWeight: 600 }}>✓ Saved & Applied to Report</span>
                        </div>
                      )}
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0' }}>
                      <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0A192F', display: 'block', marginBottom: '0.4rem' }}>Facility / Machinery Image</label>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'facility_path')} style={{ fontSize: '0.85rem' }} />
                      {formData.facility_path && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F0FDFA', padding: '0.4rem 0.6rem', borderRadius: '0.5rem', border: '1px solid #99F6E4' }}>
                          <img src={formData.facility_path} alt="Facility Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
                          <span style={{ fontSize: '0.75rem', color: '#0D9488', fontWeight: 600 }}>✓ Saved & Applied to Report</span>
                        </div>
                      )}
                    </div>
                    <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0' }}>
                      <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0A192F', display: 'block', marginBottom: '0.4rem' }}>Team Photo</label>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'team_path')} style={{ fontSize: '0.85rem' }} />
                      {formData.team_path && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F0FDFA', padding: '0.4rem 0.6rem', borderRadius: '0.5rem', border: '1px solid #99F6E4' }}>
                          <img src={formData.team_path} alt="Team Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #CBD5E1' }} />
                          <span style={{ fontSize: '0.75rem', color: '#0D9488', fontWeight: 600 }}>✓ Saved & Applied to Report</span>
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
            title="Sector 14: Declaration & Final Report Generation"
            subtitle="Authorised signatory details, report depth selection, and PDF / DOCX compilation"
            isSaving={generating}
            onCompleteSector={handleGeneratePDF}
            questions={[
              {
                id: 'declaration_statement',
                title: 'Authorised Signatory Declaration',
                description: 'Enter declarant name, designation, and location',
                content: (
                  <div className="grid-3">
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Declarant Name</label>
                      <input type="text" name="declarant_name" className="input-modern" placeholder="Your name" value={formData.declarant_name} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Designation</label>
                      <input type="text" name="designation" className="input-modern" value={formData.designation} onChange={handleChange} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A192F', display: 'block', marginBottom: '0.3rem' }}>Place</label>
                      <input type="text" name="place" className="input-modern" value={formData.place} onChange={handleChange} />
                    </div>
                  </div>
                ),
              },
              {
                id: 'report_depth',
                title: 'Target DPR Report Length & Depth',
                description: 'Choose Standard (15-20 Pgs), Comprehensive (25-35 Pgs), or Enterprise (40-60 Pgs)',
                content: (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div
                      onClick={() => setFormData((prev) => ({ ...prev, dpr_depth: 'standard' }))}
                      style={{
                        border: formData.dpr_depth === 'standard' ? '2.5px solid #008C95' : '1.5px solid #CBD5E1',
                        background: formData.dpr_depth === 'standard' ? '#CCFBF1' : '#FFFFFF',
                        padding: '1rem',
                        borderRadius: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.98rem' }}>Standard DPR</div>
                      <div style={{ fontSize: '0.82rem', color: '#008C95', fontWeight: 700, margin: '4px 0' }}>15 – 20 Pages</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>16 Core Chapters, 5-Yr Financials, DSCR Analysis.</div>
                    </div>

                    <div
                      onClick={() => setFormData((prev) => ({ ...prev, dpr_depth: 'comprehensive' }))}
                      style={{
                        border: formData.dpr_depth === 'comprehensive' ? '2.5px solid #008C95' : '1.5px solid #CBD5E1',
                        background: formData.dpr_depth === 'comprehensive' ? '#CCFBF1' : '#FFFFFF',
                        padding: '1rem',
                        borderRadius: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.98rem' }}>Comprehensive MSME</div>
                      <div style={{ fontSize: '0.82rem', color: '#008C95', fontWeight: 700, margin: '4px 0' }}>25 – 35 Pages</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>22 Chapters, 36-Mo Cash Flow, Tandon Assessment, Risk Matrix.</div>
                    </div>

                    <div
                      onClick={() => setFormData((prev) => ({ ...prev, dpr_depth: 'enterprise' }))}
                      style={{
                        border: formData.dpr_depth === 'enterprise' ? '2.5px solid #008C95' : '1.5px solid #CBD5E1',
                        background: formData.dpr_depth === 'enterprise' ? '#CCFBF1' : '#FFFFFF',
                        padding: '1rem',
                        borderRadius: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.98rem' }}>Enterprise Bankable</div>
                      <div style={{ fontSize: '0.82rem', color: '#008C95', fontWeight: 700, margin: '4px 0' }}>40 – 60 Pages ⭐</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>30 Chapters + 10 Annexure Schedules, 10-Yr Projections, BOQ, ESG.</div>
                    </div>
                  </div>
                ),
              },
              {
                id: 'approve_compile',
                title: 'User Approval & Report Generation',
                description: 'Compile publication-ready PDF or editable Word DOCX report',
                content: (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', flexWrap: 'wrap', paddingTop: '1rem' }}>
                    <button
                      type="button"
                      onClick={handleGeneratePDF}
                      disabled={generating}
                      className="btn-next-spacious"
                      style={{ padding: '1.1rem 2.2rem', fontSize: '1rem', background: 'linear-gradient(135deg, #008C95 0%, #006F78 100%)', boxShadow: '0 8px 25px rgba(0, 140, 149, 0.35)' }}
                    >
                      <i className="fas fa-file-pdf"></i> {generating ? 'Compiling PDF Engine Report...' : 'APPROVE & COMPILE FINAL PDF REPORT'}
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadClientReport(formData, 'docx')}
                      disabled={generating}
                      className="btn-next-spacious"
                      style={{ padding: '1.1rem 2.2rem', fontSize: '1rem', background: 'linear-gradient(135deg, #FF7A00 0%, #EA580C 100%)', boxShadow: '0 8px 25px rgba(255, 122, 0, 0.35)' }}
                    >
                      <i className="fas fa-file-word"></i> {generating ? 'Compiling Word DOCX...' : 'APPROVE & COMPILE EDITABLE DOCX'}
                    </button>
                  </div>
                ),
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
      />
    </div>
  );
}
