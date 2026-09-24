from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import datetime

class DPRTypeEnum(str, Enum):
    BANK_LOAN = "Bank Loan DPR"
    GOVT_SCHEME = "Govt Subsidy DPR"
    INVESTOR_PITCH = "Investor / Business Pitch DPR"
    CORPORATE_DPR = "Corporate Enterprise DPR"

class DPRDepthEnum(str, Enum):
    SUMMARY = "summary"             # 10-15 pages
    STANDARD = "standard"           # 20-30 pages
    DETAILED = "detailed"           # 40-60 pages

class IndustryCategoryEnum(str, Enum):
    MANUFACTURING = "manufacturing"
    FOOD_PROCESSING = "food_processing"
    TEXTILE = "textile"
    AGRICULTURE = "agriculture"
    RETAIL = "retail"
    LOGISTICS = "logistics"
    HEALTHCARE = "healthcare"
    IT_SERVICES = "it_services"
    CONSTRUCTION = "construction"
    HOSPITALITY = "hospitality"
    SOLAR_ENERGY = "solar_energy"
    EV_BATTERY = "ev_battery"
    PHARMA = "pharma"
    DATA_CENTER = "data_center"

class TraceabilitySourceEnum(str, Enum):
    USER_INPUT = "USER_INPUT"
    UPLOADED_DOCUMENT = "UPLOADED_DOCUMENT"
    CALCULATED = "CALCULATED"
    INTERNAL_TEMPLATE = "INTERNAL_TEMPLATE"
    VERIFIED_EXTERNAL_DATA = "VERIFIED_EXTERNAL_DATA"
    OPTIONAL_AI = "OPTIONAL_AI"

class DataTraceabilityItem(BaseModel):
    field_name: str
    source: TraceabilitySourceEnum = TraceabilitySourceEnum.USER_INPUT
    verified: bool = True
    note: Optional[str] = None

class MemberItemModel(BaseModel):
    name: str = ""
    designation: str = ""
    gender: str = "Male"
    age: str = ""
    qualification: str = ""
    experience: str = ""
    cibil_score: int = 750

class MachineryItemModel(BaseModel):
    name: str = ""
    quantity: float = 1.0
    price: float = 0.0
    total: float = 0.0
    supplier: str = ""

class RawMaterialItemModel(BaseModel):
    name: str = ""
    monthly_qty: float = 0.0
    unit: str = "kg"
    unit_price: float = 0.0
    total_monthly: float = 0.0
    source_location: str = ""

class FinancialProjectionYear(BaseModel):
    year: int
    capacity_utilization: float = 0.0
    revenue: float = 0.0
    raw_material_cost: float = 0.0
    wages_cost: float = 0.0
    power_water_cost: float = 0.0
    repairs_maintenance: float = 0.0
    other_opex: float = 0.0
    total_opex: float = 0.0
    ebitda: float = 0.0
    interest: float = 0.0
    depreciation: float = 0.0
    pbt: float = 0.0
    tax: float = 0.0
    pat: float = 0.0
    cash_accruals: float = 0.0
    dscr: float = 0.0

class BalanceSheetYear(BaseModel):
    year: int
    fixed_assets: float = 0.0
    accumulated_depreciation: float = 0.0
    net_fixed_assets: float = 0.0
    current_assets_inventory: float = 0.0
    current_assets_receivables: float = 0.0
    cash_and_bank: float = 0.0
    total_assets: float = 0.0
    promoter_capital: float = 0.0
    reserves_and_surplus: float = 0.0
    long_term_debt: float = 0.0
    current_liabilities: float = 0.0
    total_liabilities_equity: float = 0.0
    is_balanced: bool = True

class AmortizationScheduleItem(BaseModel):
    year: int
    opening_balance: float = 0.0
    interest_payment: float = 0.0
    principal_repayment: float = 0.0
    closing_balance: float = 0.0

from pydantic import BaseModel, Field, field_validator

class DPRDocumentModel(BaseModel):
    # Metadata
    job_id: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    version: int = 1
    dpr_type: DPRTypeEnum = DPRTypeEnum.BANK_LOAN
    dpr_depth: DPRDepthEnum = DPRDepthEnum.STANDARD
    industry: IndustryCategoryEnum = IndustryCategoryEnum.MANUFACTURING

    @field_validator('dpr_type', mode='before')
    @classmethod
    def normalize_dpr_type(cls, v):
        if not v:
            return DPRTypeEnum.BANK_LOAN
        s = str(v).strip().lower()
        if 'gov' in s or 'subsidy' in s:
            return DPRTypeEnum.GOVT_SCHEME
        elif 'invest' in s or 'pitch' in s:
            return DPRTypeEnum.INVESTOR_PITCH
        elif 'corp' in s:
            return DPRTypeEnum.CORPORATE_DPR
        else:
            return DPRTypeEnum.BANK_LOAN

    @field_validator('dpr_depth', mode='before')
    @classmethod
    def normalize_dpr_depth(cls, v):
        if not v:
            return DPRDepthEnum.STANDARD
        s = str(v).strip().lower()
        if 'sum' in s:
            return DPRDepthEnum.SUMMARY
        elif 'det' in s or 'comp' in s:
            return DPRDepthEnum.DETAILED
        else:
            return DPRDepthEnum.STANDARD

    @field_validator('industry', mode='before')
    @classmethod
    def normalize_industry(cls, v):
        if not v:
            return IndustryCategoryEnum.MANUFACTURING
        s = str(v).strip().lower()
        if 'food' in s:
            return IndustryCategoryEnum.FOOD_PROCESSING
        elif 'solar' in s:
            return IndustryCategoryEnum.SOLAR_ENERGY
        elif 'ev' in s or 'batt' in s:
            return IndustryCategoryEnum.EV_BATTERY
        elif 'phar' in s:
            return IndustryCategoryEnum.PHARMA
        elif 'data' in s or 'cloud' in s:
            return IndustryCategoryEnum.DATA_CENTER
        elif 'text' in s:
            return IndustryCategoryEnum.TEXTILE
        elif 'agri' in s:
            return IndustryCategoryEnum.AGRICULTURE
        elif 'logi' in s:
            return IndustryCategoryEnum.LOGISTICS
        elif 'heal' in s:
            return IndustryCategoryEnum.HEALTHCARE
        elif 'it' in s or 'soft' in s:
            return IndustryCategoryEnum.IT_SERVICES
        elif 'const' in s:
            return IndustryCategoryEnum.CONSTRUCTION
        elif 'hosp' in s:
            return IndustryCategoryEnum.HOSPITALITY
        else:
            return IndustryCategoryEnum.MANUFACTURING

    # Dynamic Sector & Activity Identifiers
    sector_id: str = "manufacturing"
    activity_id: str = "cnc_machining"
    project_type_id: str = "new_project"
    custom_sector: Optional[str] = None
    custom_activity: Optional[str] = None
    custom_project_type: Optional[str] = None

    # Section 01: Business Identity
    business_name: str = "Enterprise"
    group_name: str = ""
    business_desc: str = ""
    entity_type: str = "Proprietorship"
    cin: str = ""
    gst_no: str = ""
    pan_no: str = ""
    udyam_no: str = ""
    fssai_no: str = ""
    village: str = ""
    block: str = ""
    district: str = "Bengaluru"
    state: str = "Karnataka"
    contact_name: str = ""
    contact_number: str = ""
    email: str = ""
    bank_name: str = ""
    bank_branch: str = ""
    account_number: str = ""
    ifsc: str = ""

    # Track 1: Bank Loan Specifics
    primary_lending_bank: str = "State Bank of India"
    bank_loan_scheme_name: str = "Commercial Term Loan / Cash Credit"
    collateral_offered: str = "CGTMSE Guarantee (Collateral Free)"
    moratorium_period_months: int = 6
    repayment_tenure_years: int = 5
    interest_rate_percent: float = 10.5

    # Track 2: Govt Scheme Specifics
    govt_scheme_name: str = "PMEGP"
    nodal_agency: str = "KVIC"
    location_subsidy_category: str = "Rural Area (35% Subsidy)"
    social_category: str = "Special Category (Women / SC / ST / OBC)"
    edp_training_status: str = "Completed"
    subsidy_margin_money_claim: float = 350000.0

    # Track 3: Investor Pitch Specifics
    investment_ask: float = 5000000.0
    equity_offered_percent: float = 15.0
    pre_money_valuation: float = 28333333.0
    post_money_valuation: float = 33333333.0
    use_of_funds: str = "40% Machinery, 30% Marketing, 30% Working Capital"
    ebitda_multiple_target: float = 6.5
    exit_strategy: str = "Strategic Acquisition / Secondary Sale in Year 5"
    tam_sam_som: str = "TAM: ₹500 Cr, SAM: ₹100 Cr, SOM: ₹15 Cr"

    # Section 02: Promoter Board
    members: List[MemberItemModel] = []

    # Section 03: Product Details & Capacity
    primary_product: str = ""
    hsn_code: str = ""
    daily_capacity: float = 100.0
    capacity_unit: str = "units"
    selling_price: float = 100.0
    raw_materials_summary: str = ""
    input_cost_per_unit: float = 60.0
    working_days: int = 300
    market_growth: float = 12.0
    usp: str = ""

    # Section 04: Machinery & Suppliers
    machinery: List[MachineryItemModel] = []
    supplier_name: str = ""
    supplier_location: str = ""

    # Raw Materials Detail List
    raw_materials_list: List[RawMaterialItemModel] = []

    # Section 05: Market & Competitors
    target_customers: str = ""
    sales_location: str = ""
    competitors: str = ""

    # Section 06: HR Staffing Plan
    mgmt_count: int = 2
    mgmt_salary: float = 40000.0
    sup_count: int = 2
    sup_salary: float = 25000.0
    skill_count: int = 5
    skill_salary: float = 18000.0
    unskill_count: int = 5
    unskill_salary: float = 14000.0
    admin_count: int = 2
    admin_salary: float = 20000.0
    hr_summary: Dict[str, Any] = {}

    # Section 07: Project Cost (CAPEX) & Financing
    land_area: str = ""
    land_cost: float = 0.0
    building_area: str = ""
    building_cost: float = 0.0
    furniture_cost: float = 0.0
    working_capital: float = 500000.0
    other_cost: float = 0.0
    electrification_cost: float = 0.0
    total_cost: float = 0.0

    promoter_contribution: float = 0.0
    bank_loan: float = 0.0
    subsidy: float = 0.0
    total_funds: float = 0.0

    # Section 08: Computed Projections & Ratio Suite
    projections: List[FinancialProjectionYear] = []
    balance_sheets: List[BalanceSheetYear] = []
    amortization_schedule: List[AmortizationScheduleItem] = []

    max_annual_revenue: float = 0.0
    avg_dscr: float = 1.85
    bep_percent: float = 48.5
    bep_sales: float = 0.0
    nayak_limit: float = 0.0
    debt_equity_ratio: Any = "2.5:1"
    current_ratio: float = 1.6
    interest_coverage_ratio: float = 3.2
    roi_percent: float = 24.5
    payback_years: float = 3.2

    # Section 09: Infrastructure
    workspace: str = ""
    builtup_area: Any = 0.0
    power_required: Any = 0.0
    water_required: Any = 0.0
    monthly_rent: float = 0.0
    start_time: float = 6.0

    # Section 10: SWOT
    strengths: str = ""
    weaknesses: str = ""
    opportunities: str = ""
    threats: str = ""

    # Section 11: Social & Economic Impact
    local_employment: int = 0
    women_employment: int = 0
    youth_employment: int = 0
    eco_friendly: str = "Yes"
    training: str = "Yes"
    eco_description: str = ""

    # Section 12: Credit History
    cibil_score: int = 785
    loan_before: str = "No"
    existing_loan: float = 0.0
    outstanding: float = 0.0
    default_history: str = "No"

    # Uploaded Media Paths
    logo_path: Optional[str] = None
    product_path: Optional[str] = None
    facility_path: Optional[str] = None
    team_path: Optional[str] = None

    # Section 14: Legal Declaration
    declarant_name: str = ""
    designation: str = ""
    place: str = ""
    declaration_date: str = ""

    # Generated Graphics Paths
    chart_paths: Dict[str, str] = {}
    diagram_paths: Dict[str, str] = {}

    # Corporate Financial & ESG Advanced Metrics
    corporate_npv: Any = 0.0
    corporate_project_irr: Any = 0.0
    corporate_equity_irr: Any = 0.0
    corporate_wacc: Any = 11.5
    corporate_payback_years: Any = 0.0
    sensitivity_matrix: Dict[str, Any] = {}
    tcrm_rating: Dict[str, Any] = {}
    esg_scorecard: Dict[str, Any] = {}
    environmental_clearance: str = "Required / In Progress"
    fire_noc_status: str = "Obtained"
    factory_license_status: str = "Applied"
    pcb_cte_status: str = "Consent to Establish Granted"

    # Quality & Traceability Audit
    validation_warnings: List[str] = []
    traceability: List[DataTraceabilityItem] = []

DPRProjectData = DPRDocumentModel

