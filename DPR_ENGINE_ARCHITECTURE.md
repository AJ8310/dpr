# DPR CONTENT & DOCUMENT GENERATION ENGINE ARCHITECTURE
**Vision Karnataka Foundation DPR Studio 2026**

---

## 1. Executive Summary & Core Objective

The **DPR Content & Document Generation Engine** is a production-ready, modular document generation platform integrated into the existing DPR Studio application. It transforms structured business inputs, financial parameters, uploaded documents, and images into bank-grade, government-compliant, and investor-ready Detailed Project Reports ranging from **10 pages to 100+ pages**.

### Key Architectural Guarantee:
- **Zero Hard LLM/AI Dependency**: The core generation engine (content blocks, financial models, ratio analysis, charts, diagrams, tables, page layout, PDF, and DOCX rendering) operates deterministically **without requiring an external AI API key**.
- **Optional AI Enhancements**: External AI APIs (e.g. LLM text polishing, automated document extraction) are treated as optional post-processors only. The system remains 100% functional offline or without an API key.

---

## 2. Complete Existing Repository Audit

### 2.1 Current Architecture Components

1. **Backend Infrastructure (`dpr-backend/`)**:
   - **Framework**: FastAPI (`main.py`) running on Uvicorn (Port 5000).
   - **Database**: PostgreSQL (Supabase pooler) & SQLite fallback (`database.py`, `models/database_models.py`).
   - **API Routers**: `dpr_router.py`, `document_router.py`, `assistant_router.py`, `auth_router.py`, `payment_router.py`.
   - **Services**:
     - `calculation_service.py`: Computes CAPEX, Means of Finance, 5-year P&L, DSCR, BEP %, and Nayak CC limit.
     - `pdf_service.py`: Jinja2 template rendering (`templates/dpr_template.html`) + Playwright Chromium PDF compilation.
     - `balance_sheet_parser.py` & `document_router.py`: Document auto-fill parser for PDF, Excel, DOCX, and images.
   - **Data Models**: Pydantic schemas in `models/dpr_models.py` (`DPRDataPayload`).

2. **Frontend Infrastructure (`dpr-frontend/`)**:
   - **Framework**: Next.js 14 App Router (`page.tsx`) with React, TypeScript, Tailwind CSS, and Axios (`api.ts`).
   - **Components**:
     - `FormWizard.tsx`: 14-step form wizard with auto-fill upload and track-specific question cards.
     - `FixedSidebar.tsx`: Fixed left navigation sidebar with 14 steps.
     - `ProgressHeader.tsx`: Progress tracker and active DPR track indicator.
     - `ServiceSelectionView.tsx`: DPR track selection cards (Bank DPR, Govt DPR, Investor DPR).
     - `FloatingChatbotWidget.tsx`: Section-aware DPR AI Advisor.

---

### 2.2 Identification Table (Audit Findings)

| Component | Status | Identification Findings & Action Plan |
|---|---|---|
| **DPR Form Input** | Retain & Extend | Retain 14-step `FormWizard.tsx`. Add **DPR Depth Selector** (`summary`, `standard`, `detailed`, `comprehensive`). |
| **Database Models** | Retain | Retain `DPRSubmissionDB` & `UserDB`. Extend JSON payload schema for job tracking and versioning. |
| **Backend APIs** | Retain & Extend | Keep `/api/dpr/generate-pdf`. Add modular `/api/dpr/engine/*` endpoints for validation, preview, async jobs, and DOCX export. |
| **Calculation Engine** | Refactor & Extend | Move math from `calculation_service.py` to deterministic `financial_engine.py`. Add complete 5/10-year Balance Sheet, Cash Flow, Loan Amortization Schedule, and Financial Ratio analysis. |
| **PDF Generation** | Refactor & Extend | Replace monolithic single Jinja file (`dpr_template.html`) with modular section renderer and dynamic page composition engine. |
| **Docx Output** | NEW | Build `docx_service.py` using `python-docx` to generate fully styled, editable Word documents. |
| **Chart Generator** | NEW | Build `chart_engine.py` using Matplotlib to render SVG/PNG charts (Revenue, EBITDA, Cost pie, Means of Finance, Cash flow, BEP). |
| **Diagram Generator** | NEW | Build `diagram_engine.py` to generate process flowcharts, funding flow, supply chain, and org charts. |
| **Content Library** | NEW | Build `content-library/` with industry-specific rule-based narrative blocks for 10+ industries. |
| **Validation Engine** | NEW | Build `validation_engine.py` to perform financial balance reconciliation (Assets = Liabilities + Equity) and missing data alerts. |
| **Async Job Queue** | NEW | Build `job_queue.py` to process 50–100+ page document generation asynchronously with progress status. |

---

## 3. Proposed DPR Generation Engine Architecture

```
                               ┌────────────────────────────────────────┐
                               │            FRONTEND CLIENT             │
                               │  (Next.js FormWizard / Track Selector /│
                               │   Depth Selector / Quality Audit UI)   │
                               └───────────────────┬────────────────────┘
                                                   │ POST /api/dpr/engine/generate
                                                   ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                  DPR ENGINE API & JOB CONTROLLER                                        │
│                                  (routers/dpr_engine_router.py)                                         │
└────────┬─────────────────────────────────────────┬─────────────────────────────────────────────┬────────┘
         │                                         │                                             │
         ▼                                         ▼                                             ▼
┌─────────────────────────┐             ┌─────────────────────────┐                   ┌────────────────────┐
│ DATA VALIDATOR ENGINE   │             │   FINANCIAL ENGINE      │                   │ CONTENT LIBRARY    │
│ (validation_engine.py)  │             │ (financial_engine.py)   │                   │ (content_engine.py)│
│ • Balance Sheet Check   │             │ • 5-Yr / 10-Yr P&L      │                   │ • 10+ Industries   │
│ • Project Cost Check    │             │ • Balance Sheet & Cash  │                   │ • Section Blocks   │
│ • Data Traceability     │             │ • Amortization & Ratios │                   │ • Traceability     │
└─────────────────────────┘             └──────────┬──────────────┘                   └──────────┬─────────┘
                                                   │                                             │
                                                   ▼                                             ▼
┌─────────────────────────┐             ┌─────────────────────────┐                   ┌────────────────────┐
│ CHART & DIAGRAM ENGINE  │             │ STRUCTURE ENGINE        │                   │ IMAGE MANAGEMENT   │
│ (chart_engine.py /      │             │ (structure_engine.py)   │                   │ (image_engine.py)  │
│  diagram_engine.py)     │             │ • Bank DPR (29 Sec)     │                   │ • User Uploads     │
│ • Revenue & EBITDA      │             │ • Govt DPR (14 Sec)     │                   │ • Facility Photos  │
│ • Process Flowcharts    │             │ • Investor DPR (28 Sec) │                   │ • Industry Library │
└────────┬────────────────┘             └──────────┬──────────────┘                   └──────────┬─────────┘
         │                                         │                                             │
         └─────────────────────────────────────────┼─────────────────────────────────────────────┘
                                                   │
                                                   ▼
                                ┌────────────────────────────────────┐
                                │    PAGE COMPOSITION & TEMPLATE     │
                                │         RENDER ENGINE              │
                                │      (template_engine.py)          │
                                │ • Corporate / Bank / Investor CSS  │
                                │ • TOC / List of Figures & Tables   │
                                │ • Annexures A to F                 │
                                └──────────────────┬─────────────────┘
                                                   │
                                ┌──────────────────┴─────────────────┐
                                │                                    │
                                ▼                                    ▼
                     ┌────────────────────┐               ┌────────────────────┐
                     │ PDF RENDERER       │               │ DOCX RENDERER      │
                     │ (Playwright A4)    │               │ (python-docx)      │
                     └─────────┬──────────┘               └─────────┬──────────┘
                               │                                    │
                               └──────────────────┬─────────────────┘
                                                  │
                                                  ▼
                                       ┌──────────────────────┐
                                       │ GENERATED DPR REPORT │
                                       │ (10 to 100+ Pages)   │
                                       └──────────────────────┘
```

---

## 4. Module Structure & Specifications

### Module 1: Configurable DPR Structure Engine (`dpr_engine/structures/`)
Supports 3 distinct DPR types across 4 selectable depth levels:

1. **BANK LOAN DPR (29 Standard Sections)**:
   Cover Page, Executive Summary, Promoter Profile, Business Overview, Project Background, Product Description, Market Analysis, Technical Feasibility, Process Flow, Machinery & Equipment, Raw Materials, Infrastructure, Manpower, Project Cost, Means of Finance, Working Capital, Marketing Strategy, Financial Projections, Projected P&L, Projected Balance Sheet, Cash Flow Statement, Break-Even Analysis, DSCR Analysis, Loan Repayment Schedule, Risk Analysis, SWOT Analysis, Implementation Schedule, Conclusion, Annexures.

2. **GOVERNMENT SCHEME DPR (Scheme-Specific Sections)**:
   Cover Page, Scheme Sanction Summary, Applicant & Social Category Profile, Scheme Objectives & Eligibility, Project Description, Technical Specifications, Cost of Project, Means of Finance & Subsidy Claim, Employment Generation (Local/Women/Youth), Social & Economic Impact, Financial Viability & DSCR, Scheme Compliance, Annexures.

3. **INVESTOR PITCH DPR (28 Pitch & Valuation Sections)**:
   Cover Page, Executive Summary, Problem Statement, Solution Overview, Product Specifications, Business Model, Market Opportunity & TAM/SAM/SOM, Industry Trends, Customer Segments, Traction & Milestones, Competitive Landscape, Competitive Advantage, Go-To-Market Strategy, Founding Team, Technology & IP, Financial Performance, Financial Projections, Funding Ask, Use of Funds Allocation, Unit Economics, Valuation & Cap Table, Investment Opportunity, Risk Assessment, Exit Strategy, Conclusion, Annexures.

#### Depth Configuration Rules:
- `summary`: 10–15 pages (Core summary tables, key narratives, primary charts).
- `standard`: 20–30 pages (Full section coverage, detailed financial tables, process diagrams).
- `detailed`: 40–60 pages (Extended market analysis, sub-itemized machinery schedules, comprehensive ratios).
- `comprehensive`: 70–100+ pages (Exhaustive technical specs, multi-year monthly cash flows, complete Annexures A-F).

---

### Module 2: Rule-Based Content Engine & Library (`dpr_engine/content_library/`)
- Contains structured, deterministic narrative blocks across **10 key industry verticals**:
  1. Food Processing & Agro Industries
  2. Precision Manufacturing & Engineering
  3. Textile & Garments Manufacturing
  4. Agriculture & Dairy Farming
  5. Retail & E-Commerce
  6. Logistics & Warehousing
  7. Healthcare & Pharmaceuticals
  8. IT Services & Software/Robotics
  9. Construction & Infrastructure
  10. Hospitality & Tourism
- Dynamically populates business narratives based on input variables without requiring LLM API calls.
- Marks unverified external market claims clearly: `[Requires Local Market Verification]`.

---

### Module 3: Financial Calculation Engine & Validator (`dpr_engine/calculations/`)
- **Deterministic Math**:
  - Capacity Utilization Ramp-up (Y1: 60% → Y5: 95%).
  - Itemized CAPEX, Electrification, Contingency, and Pre-operative expenses.
  - Means of Finance (Equity %, Loan %, Subsidy %).
  - 5-Year / 10-Year Income Statement (Revenue, OPEX, EBITDA, Interest, Depreciation, PBT, Tax, PAT).
  - 5-Year Projected Balance Sheet (Assets = Liabilities + Equity reconciliation).
  - 5-Year Cash Flow Statement.
  - Amortization Schedule (Monthly & Annual Principal/Interest breakdown).
  - Ratio Suite: DSCR, Average DSCR, BEP %, Break-Even Sales, Debt-Equity Ratio, Current Ratio, Interest Coverage Ratio, ROI %, Payback Period (years), Nayak Committee CC Limit.
- **Financial Validation & Quality Audit**:
  - Validates `Total Cost == Means of Finance`.
  - Validates `Balance Sheet Assets == Liabilities + Equity`.
  - Emits pre-flight validation warnings for missing data or calculation mismatches.

---

### Module 4: Chart & Visual Diagram Engine (`dpr_engine/visuals/`)
- **Chart Generator (`chart_engine.py`)**:
  - Generates high-resolution PNG/SVG charts using Matplotlib:
    1. 5-Year Projected Revenue & EBITDA Growth Bar Chart
    2. Cost of Project Breakdown Pie Chart
    3. Means of Finance Composition Pie Chart
    4. 5-Year Cash Flow Projection Chart
    5. Break-Even Analysis Graph (Fixed Cost vs Revenue)
    6. Loan Principal Repayment Amortization Curve
    7. TAM / SAM / SOM Market Sizing Diagram (Investor Track)
- **Diagram Generator (`diagram_engine.py`)**:
  - Programmatically renders process flowcharts, funding distribution trees, supply chain diagrams, and organization hierarchy charts.

---

### Module 5: Template & Page Composition Engine (`dpr_engine/templates/`)
- Configuration-driven HTML/CSS templates (`bank_dpr.html`, `govt_dpr.html`, `investor_dpr.html`).
- Dynamic page composition:
  - Automatic Table of Contents (TOC) with page number mapping.
  - List of Tables, List of Figures.
  - Dynamic page numbering (`Page X of Y`), running headers, running footers, corporate watermarks.
  - Annexures A through F (Promoter Docs, Quotations, Financials, Land Docs, Site Photos, Statutory Certificates).

---

### Module 6: Multi-Format Document Renderer (`dpr_engine/renderers/`)
- **PDF Renderer**: Jinja2 + Playwright Chromium Headless compilation for searchable, print-ready PDFs.
- **DOCX Renderer**: `python-docx` compilation generating editable Word documents with corporate styles, tables, headers, and embedded charts.

---

## 5. API Endpoints Architecture

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/dpr/engine/validate` | Runs pre-flight Data Quality Audit & Financial Reconciliation Check. |
| `POST` | `/api/dpr/engine/preview` | Generates document outline, estimated page count, TOC, and financial summary. |
| `POST` | `/api/dpr/engine/generate` | Triggers DPR document generation (`PDF` + `DOCX`) with `dpr_depth` parameter. |
| `GET` | `/api/dpr/engine/job-status/{job_id}` | Polls async generation progress (`0%` to `100%`). |
| `GET` | `/api/dpr/engine/download/{job_id}?format=pdf` | Downloads generated PDF report. |
| `GET` | `/api/dpr/engine/download/{job_id}?format=docx` | Downloads editable DOCX Word document. |

---

## 6. Testing & Quality Assurance Plan

1. **Automated Unit Tests**:
   - Financial calculation reconciliation tests (Assets = Liabilities + Equity).
   - Loan repayment amortization accuracy tests.
   - Chart generation & image embedding tests.
2. **Document Depth Verification**:
   - `summary` (10-15 pages)
   - `standard` (20-30 pages)
   - `detailed` (40-60 pages)
   - `comprehensive` (70-100+ pages)
3. **Multi-Industry Test Suite**:
   - Small Manufacturing, Agro Food Processing, IT/Robotics Startup, Govt PMEGP Project.
