from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class MemberItem(BaseModel):
    name: str = ""
    designation: str = ""
    gender: str = "Male"
    age: str = ""
    qualification: str = ""
    experience: str = ""

class MachineryItem(BaseModel):
    name: str = ""
    quantity: float = 1.0
    price: float = 0.0
    total: float = 0.0

class DPRDataPayload(BaseModel):
    dpr_type: Optional[str] = "Bank Loan DPR"
    
    # Section 01: Basic Information
    business_name: Optional[str] = "Enterprise"
    group_name: Optional[str] = ""
    business_desc: Optional[str] = ""
    entity_type: Optional[str] = "Proprietorship"
    cin: Optional[str] = ""
    gst_no: Optional[str] = ""
    pan_no: Optional[str] = ""
    udyam_no: Optional[str] = ""
    fssai_no: Optional[str] = ""
    village: Optional[str] = ""
    block: Optional[str] = ""
    district: Optional[str] = ""
    state: Optional[str] = "Karnataka"
    contact_name: Optional[str] = ""
    contact_number: Optional[str] = ""
    email: Optional[str] = ""
    bank_name: Optional[str] = ""
    bank_branch: Optional[str] = ""
    account_number: Optional[str] = ""
    ifsc: Optional[str] = ""

    # TRACK 1: BANK-SPECIFIC INPUTS (BANK DPR)
    primary_lending_bank: Optional[str] = "State Bank of India"
    collateral_offered: Optional[str] = "CGTMSE Guarantee / Property Mortgage"
    moratorium_period_months: Optional[int] = 6
    repayment_tenure_years: Optional[int] = 5
    interest_rate_percent: Optional[float] = 10.5
    bank_loan_scheme_name: Optional[str] = "Commercial Term Loan / Cash Credit"

    # TRACK 2: GOVT SCHEME-SPECIFIC INPUTS (GOVT SUBSIDY DPR)
    govt_scheme_name: Optional[str] = "PMEGP (Prime Minister Employment Generation Programme)"
    nodal_agency: Optional[str] = "KVIC / KVIB / DIC"
    location_subsidy_category: Optional[str] = "Rural (35% Subsidy)"
    social_category: Optional[str] = "Special Category (Women / SC / ST / OBC)"
    edp_training_status: Optional[str] = "Completed / EDP Registered"
    subsidy_margin_money_claim: Optional[float] = 350000.0

    # TRACK 3: INVESTOR-SPECIFIC INPUTS (INVESTOR PITCH DPR)
    investment_ask: Optional[float] = 5000000.0
    equity_offered_percent: Optional[float] = 15.0
    pre_money_valuation: Optional[float] = 28333333.0
    post_money_valuation: Optional[float] = 33333333.0
    use_of_funds: Optional[str] = "40% Machinery Automation, 30% Market Expansion, 30% Working Capital"
    ebitda_multiple_target: Optional[float] = 6.5
    exit_strategy: Optional[str] = "Strategic Acquisition / Secondary Sale in Year 5"
    tam_sam_som: Optional[str] = "TAM: ₹500 Cr, SAM: ₹100 Cr, SOM: ₹15 Cr"
    
    # Section 02: Members
    members: Optional[List[MemberItem]] = []
    
    # Section 03: Product Details
    primary_product: Optional[str] = ""
    hsn_code: Optional[str] = ""
    daily_capacity: Optional[float] = 100.0
    capacity_unit: Optional[str] = "units"
    selling_price: Optional[float] = 100.0
    raw_materials: Optional[str] = ""
    input_cost: Optional[float] = 60.0
    working_days: Optional[int] = 300
    market_growth: Optional[float] = 20.0
    usp: Optional[str] = ""
    
    # Section 04: Machinery
    machinery: Optional[List[MachineryItem]] = []
    supplier_name: Optional[str] = ""
    supplier_location: Optional[str] = ""
    
    # Section 05: Market Analysis
    target_customers: Optional[str] = ""
    sales_location: Optional[str] = ""
    competitors: Optional[str] = ""
    
    # Section 06: HR Plan
    mgmt_count: Optional[int] = 2
    mgmt_salary: Optional[float] = 40000.0
    sup_count: Optional[int] = 2
    sup_salary: Optional[float] = 25000.0
    skill_count: Optional[int] = 5
    skill_salary: Optional[float] = 18000.0
    unskill_count: Optional[int] = 5
    unskill_salary: Optional[float] = 14000.0
    admin_count: Optional[int] = 2
    admin_salary: Optional[float] = 20000.0
    
    # Section 07: Financial Estimates
    land_area: Optional[str] = ""
    land_cost: Optional[float] = 0.0
    building_area: Optional[str] = ""
    building_cost: Optional[float] = 0.0
    furniture_cost: Optional[float] = 0.0
    working_capital: Optional[float] = 500000.0
    other_cost: Optional[float] = 0.0
    promoter_contribution: Optional[float] = 0.0
    bank_loan: Optional[float] = 0.0
    subsidy: Optional[float] = 0.0
    
    # Balance Sheet Inputs
    cash_in_hand: Optional[float] = 0.0
    bank_balance: Optional[float] = 0.0
    inventory_value: Optional[float] = 0.0
    receivables: Optional[float] = 0.0
    fixed_land: Optional[float] = 0.0
    fixed_building: Optional[float] = 0.0
    fixed_machinery: Optional[float] = 0.0
    fixed_furniture: Optional[float] = 0.0
    short_term_loan: Optional[float] = 0.0
    creditors: Optional[float] = 0.0
    long_term_loan: Optional[float] = 0.0
    owner_capital: Optional[float] = 0.0
    retained_earnings: Optional[float] = 0.0
    
    # Section 08: Financial Projections
    cap_year1: Optional[float] = 60.0
    cap_year2: Optional[float] = 75.0
    cap_year3: Optional[float] = 85.0
    cap_year4: Optional[float] = 90.0
    cap_year5: Optional[float] = 95.0
    int_year1: Optional[float] = 250000.0
    int_year2: Optional[float] = 225000.0
    int_year3: Optional[float] = 200000.0
    int_year4: Optional[float] = 175000.0
    int_year5: Optional[float] = 150000.0
    dep_year1: Optional[float] = 88000.0
    dep_year2: Optional[float] = 79200.0
    dep_year3: Optional[float] = 71300.0
    dep_year4: Optional[float] = 64200.0
    dep_year5: Optional[float] = 57800.0
    
    # Section 09: Infrastructure
    workspace: Optional[str] = ""
    builtup_area: Optional[float] = 0.0
    power_required: Optional[float] = 0.0
    water_required: Optional[float] = 0.0
    monthly_rent: Optional[float] = 0.0
    start_time: Optional[float] = 0.0
    
    # Section 10: SWOT
    strengths: Optional[str] = ""
    weaknesses: Optional[str] = ""
    opportunities: Optional[str] = ""
    threats: Optional[str] = ""
    
    # Section 11: Social Impact
    local_employment: Optional[int] = 0
    women_employment: Optional[int] = 0
    youth_employment: Optional[int] = 0
    eco_friendly: Optional[str] = "Yes"
    training: Optional[str] = "Yes"
    eco_description: Optional[str] = ""
    
    # Section 12: Credit History
    cibil_score: Optional[int] = 785
    loan_before: Optional[str] = "No"
    existing_loan: Optional[float] = 0.0
    outstanding: Optional[float] = 0.0
    default_history: Optional[str] = "No"
    
    # Section 13: Uploaded Image Paths
    logo_path: Optional[str] = None
    product_path: Optional[str] = None
    facility_path: Optional[str] = None
    team_path: Optional[str] = None
    
    # Section 14: Declaration
    declarant_name: Optional[str] = ""
    designation: Optional[str] = ""
    place: Optional[str] = ""
    declaration_date: Optional[str] = ""
