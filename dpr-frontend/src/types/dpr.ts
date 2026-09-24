export interface MemberItem {
  id: string;
  name: string;
  designation: string;
  gender: string;
  age: string;
  qualification: string;
  experience: string;
}

export interface MachineryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface DPRFormData {
  dpr_type: string;
  dpr_depth?: 'summary' | 'standard' | 'detailed' | 'comprehensive' | 'enterprise';
  industry?: string;
  sector_id?: string;
  activity_id?: string;
  project_type_id?: string;
  custom_sector?: string;
  custom_activity?: string;
  custom_project_type?: string;
  project_scale?: string;
  geography_id?: string;
  
  // Section 01
  business_name: string;
  group_name: string;
  business_desc: string;
  entity_type: string;
  cin: string;
  gst_no: string;
  pan_no: string;
  udyam_no: string;
  fssai_no: string;
  village: string;
  block: string;
  district: string;
  state: string;
  contact_name: string;
  contact_number: string;
  email: string;
  bank_name: string;
  bank_branch: string;
  account_number: string;
  ifsc: string;

  // Track-Specific Fields
  primary_lending_bank?: string;
  collateral_offered?: string;
  moratorium_period_months?: number;
  repayment_tenure_years?: number;
  interest_rate_percent?: number;
  bank_loan_scheme_name?: string;

  govt_scheme_name?: string;
  nodal_agency?: string;
  location_subsidy_category?: string;
  social_category?: string;
  edp_training_status?: string;
  subsidy_margin_money_claim?: number;

  investment_ask?: number;
  equity_offered_percent?: number;
  pre_money_valuation?: number;
  post_money_valuation?: number;
  use_of_funds?: string;
  ebitda_multiple_target?: number;
  exit_strategy?: string;
  tam_sam_som?: string;
  
  // Section 02
  members: MemberItem[];
  
  // Section 03
  primary_product: string;
  hsn_code: string;
  daily_capacity: number;
  capacity_unit: string;
  selling_price: number;
  raw_materials: string;
  input_cost: number;
  working_days: number;
  market_growth: number;
  usp: string;
  
  // Section 04
  machinery: MachineryItem[];
  supplier_name: string;
  supplier_location: string;
  
  // Section 05
  target_customers: string;
  sales_location: string;
  competitors: string;
  
  // Section 06
  mgmt_count: number;
  mgmt_salary: number;
  sup_count: number;
  sup_salary: number;
  skill_count: number;
  skill_salary: number;
  unskill_count: number;
  unskill_salary: number;
  admin_count: number;
  admin_salary: number;
  
  // Section 07
  land_area: string;
  land_cost: number;
  building_area: string;
  building_cost: number;
  furniture_cost: number;
  working_capital: number;
  other_cost: number;
  promoter_contribution: number;
  bank_loan: number;
  subsidy: number;
  
  // Balance Sheet
  cash_in_hand: number;
  bank_balance: number;
  inventory_value: number;
  receivables: number;
  fixed_land: number;
  fixed_building: number;
  fixed_machinery: number;
  fixed_furniture: number;
  short_term_loan: number;
  creditors: number;
  long_term_loan: number;
  owner_capital: number;
  retained_earnings: number;
  
  // Section 08 (Projections)
  cap_year1: number;
  cap_year2: number;
  cap_year3: number;
  cap_year4: number;
  cap_year5: number;
  int_year1: number;
  int_year2: number;
  int_year3: number;
  int_year4: number;
  int_year5: number;
  dep_year1: number;
  dep_year2: number;
  dep_year3: number;
  dep_year4: number;
  dep_year5: number;
  
  // Section 09
  workspace: string;
  builtup_area: number;
  power_required: number;
  water_required: number;
  monthly_rent: number;
  start_time: number;
  
  // Section 10
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
  
  // Section 11
  local_employment: number;
  women_employment: number;
  youth_employment: number;
  eco_friendly: string;
  training: string;
  eco_description: string;
  
  // Section 12
  cibil_score: number;
  loan_before: string;
  existing_loan: number;
  outstanding: number;
  default_history: string;
  
  // Section 13
  logo_path?: string;
  product_path?: string;
  facility_path?: string;
  team_path?: string;
  
  // Section 14
  declarant_name: string;
  designation: string;
  place: string;
  declaration_date: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service_type?: string;
  token?: string;
}
