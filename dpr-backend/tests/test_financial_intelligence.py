import unittest
import os, sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dpr_engine.financials.canonical_model import DPRProjectData
from dpr_engine.financials.financial_intelligence import (
    BankLoanFinancialModel, GovtSubsidyFinancialModel,
    InvestorFinancialModel, FinancialIntelligenceEngine
)

class TestFinancialIntelligenceEngine(unittest.TestCase):

    def setUp(self):
        self.sample_responses = {
            "business_name": "Karnataka Renewable Microgrid Pvt Ltd",
            "entity_type": "Private Limited Company",
            "primary_product": "Solar PV Microgrids",
            "land_cost": 2000000,
            "building_cost": 5000000,
            "machinery_cost": 10000000,
            "furniture_cost": 1000000,
            "working_capital": 2000000,
            "total_cost": 20000000,
            "promoter_contribution": 5000000,
            "bank_loan": 15000000
        }

        self.canonical = DPRProjectData.from_project_and_responses(
            project_id="proj_test_001",
            business_name="Karnataka Renewable Microgrid Pvt Ltd",
            dpr_type="Bank Loan DPR",
            sector_id="renewable_energy",
            activity_id="solar_installation",
            project_type_id="new_project",
            geography_id="IN-KA",
            project_scale="medium",
            blueprint_id="blueprint_bank_loan_v1.0",
            blueprint_version="1.0.0",
            responses=self.sample_responses
        )

    def test_canonical_data_normalization(self):
        self.assertEqual(self.canonical["project"]["business_name"], "Karnataka Renewable Microgrid Pvt Ltd")
        self.assertEqual(self.canonical["project_cost"]["total"], 20000000.0)
        self.assertEqual(self.canonical["funding"]["term_loan"], 15000000.0)
        self.assertEqual(self.canonical["funding"]["promoter_equity"], 5000000.0)
        self.assertEqual(self.canonical["funding"]["total_funding"], 20000000.0)

    def test_bank_loan_numerical_model(self):
        res = BankLoanFinancialModel.calculate(self.canonical)
        self.assertEqual(res["model_type"], "Bank Loan Financial Model")
        self.assertEqual(res["total_project_cost"], 20000000.0)
        self.assertEqual(res["bank_loan"], 15000000.0)
        self.assertEqual(res["promoter_equity"], 5000000.0)
        self.assertEqual(len(res["yearly_projections"]), 5)
        
        # Verify Year 1 Numerical Projections
        y1 = res["yearly_projections"][0]
        self.assertEqual(y1["year"], "Year 1")
        self.assertEqual(y1["revenue"], 30000000.0)
        self.assertEqual(y1["opex"], 21000000.0)
        self.assertEqual(y1["ebitda"], 9000000.0)
        self.assertEqual(y1["depreciation"], 2000000.0)

        # DSCR & BEP Checks
        self.assertGreater(res["avg_dscr"], 1.0)
        self.assertEqual(res["bep_percent"], 42.5)

    def test_govt_subsidy_numerical_model(self):
        subsidy_canonical = DPRProjectData.from_project_and_responses(
            project_id="proj_subsidy_001",
            business_name="Mysuru Spice Processing Unit",
            dpr_type="Govt Subsidy DPR",
            sector_id="food_processing",
            activity_id="spice_processing",
            project_type_id="new_project",
            geography_id="IN-KA",
            project_scale="micro",
            blueprint_id="blueprint_govt_subsidy_v1.0",
            blueprint_version="1.0.0",
            responses={"total_cost": 4000000, "q_category": "SC/ST"}
        )

        res = GovtSubsidyFinancialModel.calculate(subsidy_canonical)
        self.assertEqual(res["model_type"], "Government & Subsidy Scheme Model")
        self.assertEqual(res["eligible_project_cost"], 4000000.0)
        self.assertEqual(res["applicable_subsidy_rate_percent"], 35.0)  # 35% Special Category Subsidy
        self.assertEqual(res["estimated_subsidy_amount"], 1400000.0)  # 35% of 40L = 14L

    def test_investor_pitch_numerical_model(self):
        investor_canonical = DPRProjectData.from_project_and_responses(
            project_id="proj_investor_001",
            business_name="CloudSaaS Tech Pvt Ltd",
            dpr_type="Investor / Business Pitch DPR",
            sector_id="it_services",
            activity_id="software_services",
            project_type_id="startup",
            geography_id="IN-KA",
            project_scale="small",
            blueprint_id="blueprint_investor_pitch_v1.0",
            blueprint_version="1.0.0",
            responses={"promoter_contribution": 10000000}
        )

        res = InvestorFinancialModel.calculate(investor_canonical)
        self.assertEqual(res["model_type"], "Investor Pitch & Equity Valuation Model")
        self.assertEqual(res["equity_ask"], 10000000.0)
        self.assertEqual(res["pre_money_valuation"], 40000000.0)
        self.assertEqual(res["post_money_valuation"], 50000000.0)
        self.assertEqual(res["equity_dilution_percent"], 20.0)  # 10M / 50M = 20%

    def test_reconciliation_service_checks(self):
        # 1. Perfectly Reconciled
        is_val, logs = FinancialIntelligenceEngine.validate_and_reconcile(
            self.canonical, {"avg_dscr": 1.85}
        )
        self.assertTrue(is_val)
        self.assertTrue(any(l["code"] == "RECONCILIATION_OK" for l in logs))

        # 2. Mismatched Means of Finance Warning
        mismatched_canonical = dict(self.canonical)
        mismatched_canonical["funding"] = {"total_funding": 18000000.0}  # Cost is 20M
        is_val_2, logs_2 = FinancialIntelligenceEngine.validate_and_reconcile(
            mismatched_canonical, {"avg_dscr": 1.85}
        )
        self.assertTrue(any(l["code"] == "RECONCILIATION_MISMATCH" for l in logs_2))

if __name__ == "__main__":
    unittest.main()
