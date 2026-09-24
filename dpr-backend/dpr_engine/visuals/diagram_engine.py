from typing import Dict, Any, List
from dpr_engine.data_model import DPRDocumentModel, IndustryCategoryEnum

class DeterministicDiagramEngine:

    @classmethod
    def generate_html_diagrams(cls, doc: DPRDocumentModel) -> Dict[str, str]:
        ind = str(doc.industry).lower()

        # Dynamic Industry Process Steps
        if "food" in ind or doc.industry == IndustryCategoryEnum.FOOD_PROCESSING:
            steps = [
                "1. Raw Material Sourcing & Washing",
                "2. Sorting, Drying & Grinding",
                "3. Sifting & FSSAI Quality Assay",
                "4. Automatic Packaging & Dispatch"
            ]
        elif "solar" in ind or doc.industry == IndustryCategoryEnum.SOLAR_ENERGY:
            steps = [
                "1. Solar Radiation Capture (PV Modules)",
                "2. DC-to-AC Inversion & Tracking",
                "3. Step-up Substation Transformer",
                "4. Grid Interconnection & Off-take"
            ]
        elif "ev" in ind or "batt" in ind or doc.industry == IndustryCategoryEnum.EV_BATTERY:
            steps = [
                "1. Cell Grade Testing & Sorting",
                "2. Automated Laser Welding & BMS",
                "3. Thermal Runaway Containment Test",
                "4. Pack Aging & Final Dispatch"
            ]
        elif "phar" in ind or doc.industry == IndustryCategoryEnum.PHARMA:
            steps = [
                "1. Raw API Dispensing & Sterilization",
                "2. SS316L Reaction & Lyophilization",
                "3. cGMP Assay & Blister Packaging",
                "4. Sterile Warehousing & Shipping"
            ]
        elif "text" in ind or doc.industry == IndustryCategoryEnum.TEXTILE:
            steps = [
                "1. Yarn/Fabric Sourcing & Inspection",
                "2. Automated CAD Pattern Cutting",
                "3. Precision Stitching & Finishing",
                "4. Quality Check, Packing & Delivery"
            ]
        else:
            steps = [
                "1. Raw Material Receiving & Inspection",
                "2. Precision CNC Turning & VMC Milling",
                "3. 3D CMM Metrology Quality Control",
                "4. Protective Packaging & Dispatch"
            ]

        # Standard Corporate Palette (#0F172A, #1E3A8A, #2563EB, #475569)
        c_step1 = "#0F172A"
        c_step2 = "#1E3A8A"
        c_step3 = "#2563EB"
        c_step4 = "#475569"

        colors = [c_step1, c_step2, c_step3, c_step4]

        flow_items = []
        for idx, (st, col) in enumerate(zip(steps, colors)):
            flow_items.append(
                f'<div style="background: {col}; color: white; padding: 9px 14px; border-radius: 6px; font-weight: bold; font-size: 8.5pt; text-align: center;">{st}</div>'
            )
            if idx < len(steps) - 1:
                flow_items.append('<span style="font-weight: bold; color: #1E3A8A; font-size: 11pt;">➔</span>')

        process_flow_html = (
            '<div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin: 15px 0; flex-wrap: wrap;">'
            + "".join(flow_items) +
            '</div>'
        )

        # 2. Funding Distribution Tree (Standard Corporate Styling)
        funding_tree_html = (
            '<div style="border: 1px solid #CBD5E1; background: #F8FAFC; padding: 12px; border-radius: 8px; margin: 15px 0; text-align: center;">'
            f'<div style="font-weight: bold; color: #0F172A; font-size: 10.5pt; margin-bottom: 8px;">TOTAL CAPITAL PROJECT COST: ₹{doc.total_cost:,.2f}</div>'
            '<div style="display: flex; justify-content: space-around; gap: 10px; font-size: 8.5pt;">'
            f'<div style="background: white; border: 1px solid #0F172A; color: #0F172A; padding: 6px 12px; border-radius: 6px;">Promoter Equity: <strong>₹{doc.promoter_contribution:,.2f}</strong></div>'
            f'<div style="background: white; border: 1px solid #1E3A8A; color: #1E3A8A; padding: 6px 12px; border-radius: 6px;">Bank Term Loan: <strong>₹{doc.bank_loan:,.2f}</strong></div>'
            f'<div style="background: white; border: 1px solid #2563EB; color: #2563EB; padding: 6px 12px; border-radius: 6px;">Subsidy Claim: <strong>₹{doc.subsidy:,.2f}</strong></div>'
            '</div>'
            '</div>'
        )

        diagrams = {
            "process_flow": process_flow_html,
            "funding_tree": funding_tree_html
        }
        doc.diagram_paths = diagrams
        return diagrams
