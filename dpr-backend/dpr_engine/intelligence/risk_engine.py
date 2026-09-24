from typing import Dict, Any, List
from sqlalchemy.orm import Session
from models.database_models import DPRRiskItemDB

class RiskIntelligenceEngine:
    """
    Structured Risk Assessment Engine categorizing financial, market, operational, and regulatory risks.
    """

    @classmethod
    def evaluate_project_risks(
        cls,
        project_id: str,
        canonical_data: Dict[str, Any],
        fin_results: Dict[str, Any],
        db: Session
    ) -> List[Dict[str, Any]]:
        risks = []
        cost = canonical_data.get("project_cost", {}).get("total", 0.0)
        debt = canonical_data.get("funding", {}).get("term_loan", 0.0)
        avg_dscr = fin_results.get("avg_dscr", 1.85)

        # 1. Financial Debt Service Risk
        if debt > 0 and avg_dscr < 1.35:
            risks.append({
                "category": "FINANCIAL",
                "description": "Tight Debt Service Coverage Ratio (DSCR) during early projection years.",
                "severity": "HIGH" if avg_dscr < 1.25 else "MEDIUM",
                "likelihood": "MEDIUM",
                "impact": "Potential cash flow strain during debt servicing periods.",
                "mitigation": "Negotiate a 6-month principal moratorium during initial production ramp-up."
            })
        else:
            risks.append({
                "category": "FINANCIAL",
                "description": "Moderate interest rate fluctuation sensitivity.",
                "severity": "LOW",
                "likelihood": "LOW",
                "impact": "Minor variation in annual interest expenditure.",
                "mitigation": "Opt for fixed-rate term loan tranche or rate hedging where applicable."
            })

        # 2. Raw Material & Supply Chain Risk
        risks.append({
            "category": "SUPPLY_CHAIN",
            "description": "Seasonal price volatility of agricultural raw materials and inputs.",
            "severity": "MEDIUM",
            "likelihood": "MEDIUM",
            "impact": "Fluttuations in gross operating margin percentage.",
            "mitigation": "Establish long-term supply contracts with local farmer FPOs and raw material distributors."
        })

        # 3. Regulatory & Food Safety Compliance Risk
        sector = canonical_data.get("classification", {}).get("sector_id")
        if sector == "food_processing":
            risks.append({
                "category": "REGULATORY",
                "description": "Mandatory FSSAI and PCB environmental clearance compliance requirement.",
                "severity": "HIGH",
                "likelihood": "LOW",
                "impact": "Delay in commercial production commencement.",
                "mitigation": "Apply for FSSAI manufacturing license and Consent to Establish (CTE) early."
            })

        # Store risks in database
        db.query(DPRRiskItemDB).filter(DPRRiskItemDB.project_id == project_id).delete()
        for r in risks:
            db_risk = DPRRiskItemDB(
                project_id=project_id,
                category=r["category"],
                description=r["description"],
                severity=r["severity"],
                likelihood=r["likelihood"],
                impact=r["impact"],
                mitigation=r["mitigation"],
                source="RISK_INTELLIGENCE_ENGINE"
            )
            db.add(db_risk)
        db.commit()

        return risks
