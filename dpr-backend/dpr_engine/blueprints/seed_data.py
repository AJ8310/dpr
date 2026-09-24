from typing import Dict, List, Any

# DPR TYPES
DPR_TYPES = [
    {
        "id": "Bank Loan DPR",
        "title": "Bank Loan DPR",
        "subtitle": "CGTMSE, MUDRA, Commercial Term Loans & Cash Credit",
        "icon": "fa-building-columns",
        "badge": "Most Popular"
    },
    {
        "id": "Govt Subsidy DPR",
        "title": "Govt Subsidy DPR",
        "subtitle": "PMEGP, KVIC, Stand-Up India, MSME Subsidies",
        "icon": "fa-landmark",
        "badge": "Subsidy Optimized"
    },
    {
        "id": "Investor / Business Pitch DPR",
        "title": "Investor / Business Pitch DPR",
        "subtitle": "Venture Capital, Angel Funding & Strategic Pitch Decks",
        "icon": "fa-chart-line",
        "badge": "Valuation Ready"
    }
]

# SECTORS
SECTORS = [
    {"id": "manufacturing", "name": "Manufacturing", "description": "Automated, precision, and light industrial manufacturing.", "icon": "fa-industry"},
    {"id": "food_processing", "name": "Food Processing", "description": "Agro-processing, spices, dairy, cold chains, and packaged foods.", "icon": "fa-utensils"},
    {"id": "agriculture", "name": "Agriculture & Farming", "description": "Organic cultivation, polyhouses, horticulture, and bio-fertilizers.", "icon": "fa-seedling"},
    {"id": "textile", "name": "Textile & Garments", "description": "Weaving, apparel stitching, silk processing, and technical textiles.", "icon": "fa-tshirt"},
    {"id": "healthcare", "name": "Healthcare & Pharma", "description": "Diagnostic labs, medical equipment, formulations, and clinics.", "icon": "fa-heartbeat"},
    {"id": "it_services", "name": "IT & ITES", "description": "Software development, SaaS, BPO, data centers, and digital services.", "icon": "fa-laptop-code"},
    {"id": "renewable_energy", "name": "Renewable Energy & EV", "description": "Solar rooftop, EV charging stations, battery assembly, and biomass.", "icon": "fa-solar-panel"},
    {"id": "tourism", "name": "Tourism & Hospitality", "description": "Eco-resorts, homestays, restaurants, and heritage travel logistics.", "icon": "fa-hotel"},
    {"id": "services", "name": "Services & Enterprise", "description": "Equipment rental, professional consulting, and technical services.", "icon": "fa-concierge-bell"},
    {"id": "infrastructure", "name": "Infrastructure & Logistics", "description": "Warehousing, transport fleet, logistics hubs, and industrial parks.", "icon": "fa-truck-loading"}
]

# BUSINESS ACTIVITIES
BUSINESS_ACTIVITIES = [
    {"id": "spice_processing", "sector_id": "food_processing", "name": "Spice Processing & Packaging", "hsn_code": "09109990", "description": "Automated grinding, blending, and pouch packaging of spices."},
    {"id": "dairy_processing", "sector_id": "food_processing", "name": "Dairy Pasteurization & Value Addition", "hsn_code": "04012000", "description": "Milk processing, ghee, paneer, and curd manufacturing."},
    {"id": "cnc_machining", "sector_id": "manufacturing", "name": "Precision CNC & Sheet Metal Components", "hsn_code": "84799090", "description": "Sub-micron precision metal fabrication and enclosure milling."},
    {"id": "plastic_molding", "sector_id": "manufacturing", "name": "Injection Molded Industrial Plastics", "hsn_code": "39269099", "description": "High-density polymer components for automotive and appliances."},
    {"id": "garment_manufacturing", "sector_id": "textile", "name": "Readymade Apparel & Workwear Unit", "hsn_code": "62034200", "description": "Industrial uniforms, cotton shirts, and protective workwear."},
    {"id": "solar_installation", "sector_id": "renewable_energy", "name": "Commercial Solar Power & Microgrid", "hsn_code": "85414011", "description": "Rooftop solar PV generation and battery storage systems."},
    {"id": "software_services", "sector_id": "it_services", "name": "Cloud Software & Enterprise Solutions", "hsn_code": "998314", "description": "Custom SaaS application development and cloud migration."},
    {"id": "cold_storage_hub", "sector_id": "infrastructure", "name": "Multi-Commodity Cold Storage Warehouse", "hsn_code": "998612", "description": "Temperature-controlled multi-chamber agricultural storage."}
]

# PROJECT TYPES
PROJECT_TYPES = [
    {"id": "new_project", "name": "New Greenfield Project", "description": "Setting up a brand new industrial or enterprise facility."},
    {"id": "expansion", "name": "Expansion & Capacity Upgrade", "description": "Expanding existing plant capacity or adding additional production lines."},
    {"id": "modernization", "name": "Modernization & Technology Upgrade", "description": "Upgrading legacy machinery to automated, energy-efficient equipment."},
    {"id": "diversification", "name": "Product Diversification", "description": "Introducing new product verticals into an existing business operation."},
    {"id": "existing_business", "name": "Existing Business Refinance", "description": "Working capital augmentation or term loan balance transfer."},
    {"id": "startup", "name": "Tech Startup / Innovation Venture", "description": "Early-stage scalable business seeking seed or growth capital."}
]

# GEOGRAPHIES
GEOGRAPHIES = [
    {
        "id": "IN-KA",
        "country": "India",
        "state": "Karnataka",
        "districts": [
            "Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Hubballi-Dharwad",
            "Belagavi", "Mangaluru (Dakshina Kannada)", "Tumakuru", "Kalaburagi",
            "Davangere", "Ballari", "Shivamogga", "Hassan", "Udupi", "Mandya"
        ]
    }
]

# DEFAULT BLUEPRINTS SEED DEFINITIONS
DEFAULT_BLUEPRINTS = {
    "Bank Loan DPR": {
        "id": "blueprint_bank_loan_v1.0",
        "dpr_type": "Bank Loan DPR",
        "version": "1.0.0",
        "name": "Standard Commercial Bank Loan DPR Blueprint",
        "description": "Formatted for CGTMSE, MUDRA, and Commercial Bank Loan sanction.",
        "sections": [
            {"id": "sec_exec", "name": "Executive Summary", "required": True},
            {"id": "sec_promoter", "name": "Promoter & Entity Background", "required": True},
            {"id": "sec_business", "name": "Business & Technical Feasibility", "required": True},
            {"id": "sec_market", "name": "Market Demand & SWOT Analysis", "required": True},
            {"id": "sec_cost", "name": "Project Cost & Means of Finance", "required": True},
            {"id": "sec_financials", "name": "5-Year Financial Statements & Ratios (DSCR, BEP)", "required": True},
            {"id": "sec_collateral", "name": "Bank Collateral & Scheme Compliance", "required": True}
        ],
        "questions": [
            {"id": "q_bank", "key": "primary_lending_bank", "label": "Primary Lending Bank Name", "type": "text", "required": True, "default_value": "State Bank of India", "help_text": "Target commercial bank for term loan & working capital sanction."},
            {"id": "q_branch", "key": "bank_branch_ifsc", "label": "Bank Branch Name & IFSC Code", "type": "text", "required": True, "default_value": "Bengaluru Main Branch (SBIN0000813)", "help_text": "Bank branch handling the loan appraisal."},
            {"id": "q_loan_scheme", "key": "bank_loan_scheme_name", "label": "Bank Loan Credit Scheme", "type": "select", "options": ["Commercial Term Loan & Cash Credit", "CGTMSE Collateral Free Loan", "MUDRA Tarun Loan", "Industrial Equipment Finance"], "required": True, "default_value": "Commercial Term Loan & Cash Credit"},
            {"id": "q_loan_amt", "key": "bank_loan", "label": "Term Loan Required (₹)", "type": "number", "required": True, "default_value": 20500000},
            {"id": "q_tenure", "key": "repayment_tenure_years", "label": "Repayment Tenure (Years)", "type": "number", "default_value": 5, "help_text": "Standard bank loan amortization period."},
            {"id": "q_moratorium", "key": "moratorium_period_months", "label": "Moratorium Period (Months)", "type": "number", "default_value": 6, "help_text": "Grace period before principal repayment starts."},
            {"id": "q_interest_rate", "key": "interest_rate_percent", "label": "Proposed Interest Rate (% p.a.)", "type": "number", "default_value": 10.5},
            {"id": "q_collateral", "key": "collateral_offered", "label": "Collateral Security / CGTMSE Cover", "type": "text", "required": True, "default_value": "CGTMSE Guarantee Cover & Hypothecation of Plant & Machinery"},
            {"id": "q_cibil", "key": "cibil_score", "label": "Promoter CIBIL Credit Score", "type": "number", "required": True, "default_value": 780},
            {"id": "q_existing_debt", "key": "existing_loan", "label": "Existing Bank Obligations / Liabilities (₹)", "type": "number", "default_value": 0},
            {"id": "q_working_capital_method", "key": "working_capital_method", "label": "Working Capital Assessment Method", "type": "select", "options": ["Nayak Committee (20% Turnover)", "Tandon Committee (75% NWC Gap)"], "default_value": "Tandon Committee (75% NWC Gap)"}
        ]
    },
    "Govt Subsidy DPR": {
        "id": "blueprint_govt_subsidy_v1.0",
        "dpr_type": "Govt Subsidy DPR",
        "version": "1.0.0",
        "name": "State & Central Govt Subsidy DPR Blueprint",
        "description": "Formatted for PMEGP, KVIC, Stand-Up India, PMFME, and DIC Subsidies.",
        "sections": [
            {"id": "sec_exec", "name": "Executive Summary", "required": True},
            {"id": "sec_scheme", "name": "Govt Subsidy Scheme Eligibility & Guidelines", "required": True},
            {"id": "sec_promoter", "name": "Promoter Identity & Social Category", "required": True},
            {"id": "sec_unit", "name": "Unit Location & Employment Potential", "required": True},
            {"id": "sec_cost", "name": "Project Cost & Subsidy Calculation (Margin Money)", "required": True},
            {"id": "sec_financials", "name": "5-Year Financial Viability", "required": True}
        ],
        "questions": [
            {"id": "q_scheme_name", "key": "scheme_name", "label": "Target Subsidy Scheme Name", "type": "select", "options": ["PMEGP (Prime Minister Employment Generation Programme)", "PMFME (PM Formalisation of Micro Food Enterprises)", "MUDRA Scheme", "MSME CLCSS Capital Subsidy", "KVIC Village Industry Grant", "Stand-Up India Scheme"], "required": True, "default_value": "PMEGP (Prime Minister Employment Generation Programme)"},
            {"id": "q_category", "key": "applicant_category", "label": "Promoter Social Category", "type": "select", "options": ["General", "Special Category (Women / SC / ST / OBC / Ex-Servicemen / PH)"], "required": True, "default_value": "General"},
            {"id": "q_location_type", "key": "location_type", "label": "Unit Location Classification", "type": "select", "options": ["Rural Area (Higher 25-35% Subsidy)", "Urban Area (15-25% Subsidy)"], "required": True, "default_value": "Rural Area (Higher 25-35% Subsidy)"},
            {"id": "q_dic_office", "key": "dic_jurisdiction", "label": "District Industry Centre (DIC) Office", "type": "text", "required": True, "default_value": "DIC Bengaluru Urban"},
            {"id": "q_employment", "key": "local_employment", "label": "Total Direct Employment Generated (Persons)", "type": "number", "required": True, "default_value": 15},
            {"id": "q_women_emp", "key": "women_employment", "label": "Women Employment Beneficiaries (Count)", "type": "number", "default_value": 8},
            {"id": "q_youth_emp", "key": "youth_employment", "label": "Rural Youth / SC-ST Job Beneficiaries", "type": "number", "default_value": 10},
            {"id": "q_subsidy_pct", "key": "expected_subsidy_pct", "label": "Expected Capital Subsidy Rate (%)", "type": "number", "default_value": 35},
            {"id": "q_margin_pct", "key": "promoter_margin_pct", "label": "Promoter Equity Margin Contribution (%)", "type": "number", "default_value": 10},
            {"id": "q_edp_status", "key": "edp_training_status", "label": "EDP Training Certificate Status", "type": "select", "options": ["Completed (RUDSETI / CEDOK Certificate Obtained)", "Enrolled / In Progress", "Exempted"], "default_value": "Completed (RUDSETI / CEDOK Certificate Obtained)"},
            {"id": "q_nodal_bank", "key": "nodal_bank_name", "label": "PMEGP/Scheme Sponsoring Nodal Bank", "type": "text", "default_value": "Canara Bank Peenya Branch"}
        ]
    },
    "Investor / Business Pitch DPR": {
        "id": "blueprint_investor_pitch_v1.0",
        "dpr_type": "Investor / Business Pitch DPR",
        "version": "1.0.0",
        "name": "Investor Pitch & Equity Valuation DPR Blueprint",
        "description": "Formatted for Venture Capital, Angel Investors, and Strategic Pitch Decks.",
        "sections": [
            {"id": "sec_exec", "name": "Executive Summary & Pitch Highlights", "required": True},
            {"id": "sec_problem", "name": "Problem Statement & Solution Unique Value Proposition", "required": True},
            {"id": "sec_market", "name": "Total Addressable Market (TAM / SAM / SOM)", "required": True},
            {"id": "sec_unit", "name": "Technology, Operations & Unit Economics", "required": True},
            {"id": "sec_valuation", "name": "DCF Valuation, NPV, IRR & Equity Structure", "required": True},
            {"id": "sec_ask", "name": "Investment Ask & Use of Funds", "required": True}
        ],
        "questions": [
            {"id": "q_stage", "key": "pitch_stage", "label": "Venture Growth Stage", "type": "select", "options": ["Pre-Revenue MVP", "Early Revenue Stage", "Growth & Scale Expansion"], "required": True, "default_value": "Early Revenue Stage"},
            {"id": "q_target_ask", "key": "equity_ask", "label": "Equity Capital Funding Ask (₹)", "type": "number", "required": True, "default_value": 15000000},
            {"id": "q_stake_offered", "key": "equity_stake", "label": "Target Equity Stake Offered (%)", "type": "number", "required": True, "default_value": 15},
            {"id": "q_target_valuation", "key": "pre_money_valuation", "label": "Target Pre-Money Enterprise Valuation (₹)", "type": "number", "required": True, "default_value": 85000000},
            {"id": "q_exit_horizon", "key": "exit_horizon_years", "label": "Target Exit Strategy Horizon (Years)", "type": "number", "default_value": 5},
            {"id": "q_tam", "key": "tam_size_cr", "label": "Total Addressable Market TAM (₹ Crore)", "type": "number", "required": True, "default_value": 450},
            {"id": "q_sam", "key": "sam_size_cr", "label": "Serviceable Addressable Market SAM (₹ Crore)", "type": "number", "default_value": 85},
            {"id": "q_som", "key": "som_size_cr", "label": "Serviceable Obtainable Market SOM (₹ Crore)", "type": "number", "default_value": 25},
            {"id": "q_current_mrr", "key": "current_mrr", "label": "Current Monthly Recurring Revenue MRR (₹)", "type": "number", "default_value": 850000},
            {"id": "q_target_irr", "key": "target_irr_percent", "label": "Target Equity Internal Rate of Return IRR (%)", "type": "number", "default_value": 24.5},
            {"id": "q_use_of_funds", "key": "use_of_funds", "label": "Strategic Use of Investment Proceeds", "type": "textarea", "default_value": "40% R&D & Machinery, 35% Market Expansion & Sales, 25% Key Talent Acquisition"}
        ]
    }
}
