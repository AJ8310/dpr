# DPR Engine Integration Report ⚙️⚡

## 1. Engine Status Verification
- **Dynamic Blueprint Resolver**: Connected via `GET /api/dpr/master/blueprints/resolve`. Returns sector rules (Min Equity %, Max Debt/Equity, Min DSCR).
- **Dynamic Question Engine**: Connected via `GET /api/dpr/projects/{id}/questionnaire`. Resolves taxonomy questions.
- **Deterministic Financial Engine**: Connected via `POST /api/projects/{id}/calculate`. Produces single-source-of-truth P&L, Balance Sheet, DSCR, BEP %.
- **Document Compiler Engine**: Connected via `POST /api/projects/{id}/documents/compile`. Compiles Playwright A4 PDF and DOCX documents with quality score 100.0/100.
