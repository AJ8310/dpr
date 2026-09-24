import unittest
import os, sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dpr_engine.blueprints.blueprint_resolver import DynamicBlueprintResolver
from dpr_engine.questions.question_engine import DynamicQuestionEngine

class TestDynamicQuestionEngine(unittest.TestCase):

    def test_condition_evaluator_operators(self):
        responses = {"owns_land": True, "total_cost": 25000000, "sector": "manufacturing"}
        
        c1 = {"field": "owns_land", "operator": "==", "value": True}
        self.assertTrue(DynamicQuestionEngine.evaluate_condition(c1, responses))

        c2 = {"field": "total_cost", "operator": ">=", "value": 10000000}
        self.assertTrue(DynamicQuestionEngine.evaluate_condition(c2, responses))

        c3 = {"field": "owns_land", "operator": "==", "value": False}
        self.assertFalse(DynamicQuestionEngine.evaluate_condition(c3, responses))

    def test_conditional_question_visibility(self):
        bp = DynamicBlueprintResolver.resolve_blueprint("Bank Loan DPR", "food_processing", "spice_processing")
        
        # Add a conditional question to blueprint
        bp["questions"].append({
            "id": "q_land_area",
            "key": "land_area",
            "label": "Land Area (Sq Ft)",
            "required": True,
            "conditions": {"field": "owns_land", "operator": "==", "value": True}
        })

        # 1. When owns_land is False -> land_area is hidden
        r_false = {"owns_land": False}
        qs_hidden = DynamicQuestionEngine.resolve_questions_for_project(bp, r_false)
        self.assertFalse(any(q["key"] == "land_area" for q in qs_hidden))

        # 2. When owns_land is True -> land_area is visible
        r_true = {"owns_land": True}
        qs_visible = DynamicQuestionEngine.resolve_questions_for_project(bp, r_true)
        self.assertTrue(any(q["key"] == "land_area" for q in qs_visible))

    def test_validation_engine_rules(self):
        questions = [
            {"key": "business_name", "label": "Business Name", "required": True, "is_visible": True},
            {"key": "total_cost", "label": "Total Cost", "data_type": "currency", "is_visible": True},
            {"key": "margin_percent", "label": "Margin Percent", "data_type": "percentage", "is_visible": True},
            {"key": "hidden_q", "label": "Hidden Question", "required": True, "is_visible": False}
        ]

        # Valid payload
        valid_r = {"business_name": "VKF Enterprises", "total_cost": 15000000, "margin_percent": 25}
        is_val, errs = DynamicQuestionEngine.validate_responses(questions, valid_r)
        self.assertTrue(is_val)
        self.assertEqual(len(errs), 0)

        # Invalid payload (missing required + negative cost + percentage > 100)
        invalid_r = {"total_cost": -500, "margin_percent": 150}
        is_val, errs = DynamicQuestionEngine.validate_responses(questions, invalid_r)
        self.assertFalse(is_val)
        self.assertEqual(len(errs), 3)  # Missing business_name, negative cost, percentage > 100

    def test_progress_calculation(self):
        bp = DynamicBlueprintResolver.resolve_blueprint("Bank Loan DPR", "food_processing", "spice_processing")
        
        # Partially filled responses
        r = {
            "business_name": "Karnataka Spice Mill",
            "entity_type": "Private Limited Company",
            "total_cost": 20000000,
            "bank_loan": 14000000
        }

        progress = DynamicQuestionEngine.calculate_progress(bp, r)
        self.assertGreater(progress["overall_completion_percent"], 0)
        self.assertIn("required_questions_remaining", progress)
        self.assertIn("section_completion_percentages", progress)

if __name__ == "__main__":
    unittest.main()
