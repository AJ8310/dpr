from typing import Dict, List, Any, Optional, Tuple
from decimal import Decimal
from sqlalchemy.orm import Session
from models.database_models import DPRQuestionDB, DPRResponseDB, DPRProjectDB
from dpr_engine.blueprints.blueprint_resolver import DynamicBlueprintResolver

class DynamicQuestionEngine:

    @staticmethod
    def evaluate_condition(condition: Dict[str, Any], responses: Dict[str, Any]) -> bool:
        """
        Safely evaluates structured condition rules without arbitrary code execution.
        Rule schema: {"field": "owns_land", "operator": "==", "value": True}
        """
        if not condition or not isinstance(condition, dict):
            return True

        field = condition.get("field")
        op = condition.get("operator", "==")
        target_val = condition.get("value")

        if not field:
            return True

        val = responses.get(field)

        if op == "==":
            return val == target_val
        elif op == "!=":
            return val != target_val
        elif op == ">":
            return Decimal(str(val or 0)) > Decimal(str(target_val or 0))
        elif op == ">=":
            return Decimal(str(val or 0)) >= Decimal(str(target_val or 0))
        elif op == "<":
            return Decimal(str(val or 0)) < Decimal(str(target_val or 0))
        elif op == "<=":
            return Decimal(str(val or 0)) <= Decimal(str(target_val or 0))
        elif op == "in":
            return val in target_val if isinstance(target_val, list) else False
        elif op == "not_in":
            return val not in target_val if isinstance(target_val, list) else True
        elif op == "is_empty":
            return val is None or val == "" or val == [] or val == {}
        elif op == "is_not_empty":
            return val is not None and val != "" and val != [] and val != {}

        return True

    @classmethod
    def resolve_questions_for_project(
        cls,
        blueprint: Dict[str, Any],
        user_responses: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        Resolves visibility, requirements, and state for all blueprint questions based on user responses.
        """
        raw_questions = blueprint.get("questions", [])
        resolved_questions = []

        for q in raw_questions:
            q_copy = dict(q)
            q_key = q_copy.get("key") or q_copy.get("id")
            q_copy["key"] = q_key

            # Evaluate conditional visibility
            condition = q_copy.get("conditions")
            is_visible = cls.evaluate_condition(condition, user_responses) if condition else True

            q_copy["is_visible"] = is_visible
            q_copy["current_value"] = user_responses.get(q_key, q_copy.get("default_value"))

            if is_visible:
                resolved_questions.append(q_copy)

        return resolved_questions

    @classmethod
    def validate_responses(
        cls,
        questions: List[Dict[str, Any]],
        user_responses: Dict[str, Any]
    ) -> Tuple[bool, List[Dict[str, Any]]]:
        """
        Server-side validation of user responses against question schema validation rules.
        """
        errors = []

        for q in questions:
            if not q.get("is_visible", True):
                continue  # Hidden questions are NOT treated as validation errors

            q_key = q.get("key") or q.get("id")
            label = q.get("label", q_key)
            val = user_responses.get(q_key)
            is_required = q.get("required", False)
            field_type = q.get("field_type", "TEXT")
            data_type = q.get("data_type", "string")

            # 1. Required Field Validation
            if is_required and (val is None or val == "" or val == [] or val == {}):
                errors.append({"key": q_key, "message": f"{label} is required."})
                continue

            if val is None or val == "":
                continue

            # 2. Number / Currency / Percentage Bounds Validation
            if data_type in ["decimal", "currency", "percentage", "integer"]:
                try:
                    num_val = Decimal(str(val))
                    if num_val < 0 and "cost" in q_key.lower():
                        errors.append({"key": q_key, "message": f"{label} cannot be negative."})
                    if data_type == "percentage" and (num_val < 0 or num_val > 100):
                        errors.append({"key": q_key, "message": f"{label} must be between 0% and 100%."})
                except Exception:
                    errors.append({"key": q_key, "message": f"{label} must be a valid number."})

        return len(errors) == 0, errors

    @classmethod
    def calculate_progress(
        cls,
        blueprint: Dict[str, Any],
        user_responses: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Calculates overall and section completion percentages for the DPR project.
        """
        resolved_q = cls.resolve_questions_for_project(blueprint, user_responses)

        visible_count = len(resolved_q)
        required_q = [q for q in resolved_q if q.get("required", False)]
        total_required = len(required_q)

        completed_required = 0
        for q in required_q:
            k = q.get("key") or q.get("id")
            val = user_responses.get(k)
            if val is not None and val != "" and val != [] and val != {}:
                completed_required += 1

        overall_pct = int((completed_required / max(total_required, 1)) * 100)

        # Section Completion Percentages
        sections = blueprint.get("sections", [])
        section_progress = {}
        for sec in sections:
            sec_id = sec.get("id")
            sec_name = sec.get("name", sec_id)
            sec_qs = [q for q in resolved_q if q.get("section_id") == sec_id]
            sec_req = [q for q in sec_qs if q.get("required", False)]
            
            sec_total = len(sec_req) or len(sec_qs) or 1
            sec_done = 0
            for q in (sec_req if sec_req else sec_qs):
                k = q.get("key") or q.get("id")
                v = user_responses.get(k)
                if v is not None and v != "" and v != [] and v != {}:
                    sec_done += 1

            section_progress[sec_name] = int((sec_done / sec_total) * 100)

        return {
            "overall_completion_percent": min(100, overall_pct),
            "total_questions_visible": visible_count,
            "required_questions_total": total_required,
            "required_questions_completed": completed_required,
            "required_questions_remaining": max(0, total_required - completed_required),
            "section_completion_percentages": section_progress
        }
