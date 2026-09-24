# DPR Studio - Detailed Project Report Generator

## Overview

**DPR Studio** is a full-stack SaaS platform that generates professional, bank-ready Detailed Project Reports (DPRs) using AI. Users fill a 14-section form, upload images, and the system generates a comprehensive PDF report with financial calculations, SWOT analysis, market insights, and more.

---

## Features

### 14 Comprehensive Sections

| Section | Description |
|---------|-------------|
| 01. Basic Information | Business identity, registrations, contact details |
| 02. Members | Team structure & member profiles |
| 03. Product | Product specifications & USP |
| 04. Machinery | Equipment list with costs |
| 05. Market | Market analysis & target segments |
| 06. HR Plan | Staffing & salary structure |
| 07. Financials | Project cost, balance sheet, ratios |
| 08. Projections | 5-year financial projections |
| 09. Infrastructure | Land, building, utilities |
| 10. SWOT | Strengths, Weaknesses, Opportunities, Threats |
| 11. Social Impact | Employment, women & youth empowerment |
| 12. Credit Profile | CIBIL score, loan history |
| 13. Image Upload | Logo, product, facility, team photos |
| 14. Declaration | Legal declaration & report generation |

### AI-Powered Content

- **Gemini AI Integration**: Writes professional narrative for each section
- **Smart Fallback**: Pre-written templates when API is unavailable
- **Multiple Model Support**: Gemini 2.5 Flash, 2.5 Flash Lite, 1.5 Pro

### Financial Engine

- **Auto-calculations**: Project cost, means of finance, ratios
- **5-Year Projections**: Revenue, expenses, PAT, margins
- **Balance Sheet**: Assets, liabilities, equity verification
- **Break-even Analysis**: Fixed costs, variable costs, BEP

### Image Management

- **4 Image Types**: Logo, Product, Facility, Team
- **Upload to Supabase Storage**: Cloud-based, persistent
- **Auto-embed in PDF**: Professional placement with captions

### PDF Generation

- **Professional Layout**: Double border, header, footer
- **Page Numbers**: Auto-generated
- **Images Included**: Logo on cover, images in relevant sections
- **Bank-Ready Format**: Clean, professional, printable

### Data Storage

- **Supabase Database**: Save all report data
- **Row Level Security**: Users only see their own data
- **Cloud Images**: Supabase Storage for all uploaded images

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML5, CSS3, JavaScript |
| **Backend** | Node.js, Express.js |
| **AI** | Google Gemini API |
| **Database** | Supabase (PostgreSQL) |
| **Storage** | Supabase Storage |
| **PDF** | Playwright |
| **Deployment** | Vercel (Frontend), Render (Backend) |
| **Version Control** | Git, GitHub |

---

## Live URLs

| Service | URL |
|---------|-----|
| **Frontend** | [https://dpr-frontend-khaki.vercel.app](https://dpr-frontend-khaki.vercel.app) |
| **Backend** | [https://dpr-backend-alld.onrender.com](https://dpr-backend-alld.onrender.com) |
| **API Health** | [https://dpr-backend-alld.onrender.com/api/dpr/health](https://dpr-backend-alld.onrender.com/api/dpr/health) |

---

## Project Structure

```
DPR-5.0/
│
├── index.html                      # Frontend (14-section form)
├── VKF.png                         # Organization logo
├── vercel.json                     # Vercel deployment config
├── render.yaml                     # Render deployment config
│
└── dpr-backend/                    # Backend (Node.js)
    │
    ├── server.js                   # Main application
    ├── package.json                # Dependencies
    ├── .env                        # Environment variables
    │
    ├── uploads/                    # Temporary image storage
    │
    └── templates/
        └── dpr-template.html       # PDF template
```

---

## Installation

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Supabase account
- Google Gemini API key

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/spandanaworks/DPR-5.0.git
cd DPR-5.0/dpr-backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOL
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
EOL

# Start the backend
node server.js
```

### Frontend Setup

```bash
# Open index.html with Live Server (VS Code extension)
# Or use Python server
cd DPR-5.0
python -m http.server 5500
```

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | Yes |
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anon public key | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |

---

## Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Import repository to Vercel
3. Configure root directory: `.`
4. Deploy

### Backend (Render)

1. Push code to GitHub
2. Import repository to Render
3. Set `Root Directory` to `dpr-backend`
4. Add environment variables
5. Set Build Command: `npm install`
6. Set Start Command: `node server.js`
7. Deploy

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/dpr/health` | GET | Health check |
| `/api/dpr/generate-full-report` | POST | Generate DPR PDF |
| `/api/dpr/save-report` | POST | Save report to Supabase |
| `/api/dpr/load-report/:id` | GET | Load saved report |
| `/api/dpr/user-reports` | GET | Get user's reports |
| `/api/dpr/upload-image` | POST | Upload image |

---

## Generate DPR

1. Fill all 14 sections
2. Upload images
3. Click "Generate Report"
4. PDF downloads automatically

---

## License

This project is proprietary and confidential.

---

## Acknowledgments

- **VISION KARNATAKA FOUNDATION** - Project support
- **Google Gemini AI** - AI content generation
- **Supabase** - Database and storage
- **Render** - Backend hosting
- **Vercel** - Frontend hosting


