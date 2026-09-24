from typing import List, Dict, Any
from dpr_engine.data_model import DPRDocumentModel, DPRTypeEnum, DPRDepthEnum
from dpr_engine.structures.bank_structure import BankDPRStructure
from dpr_engine.structures.govt_structure import GovtDPRStructure
from dpr_engine.structures.investor_structure import InvestorDPRStructure
from dpr_engine.structures.corporate_structure import CorporateDPRStructure

class DPRStructureEngine:

    @staticmethod
    def resolve_structure(doc: DPRDocumentModel) -> List[Dict[str, Any]]:
        d_type = doc.dpr_type
        d_depth = doc.dpr_depth

        if d_type == DPRTypeEnum.CORPORATE_DPR or "Corporate" in str(d_type):
            res = CorporateDPRStructure.get_structure_for_depth(str(d_depth))
            return res
        elif d_type == DPRTypeEnum.BANK_LOAN or "Bank" in str(d_type):
            sections = BankDPRStructure.get_sections(d_depth)
        elif d_type == DPRTypeEnum.GOVT_SCHEME or "Govt" in str(d_type) or "Subsidy" in str(d_type):
            sections = GovtDPRStructure.get_sections(d_depth)
        else:
            sections = InvestorDPRStructure.get_sections(d_depth)

        # Estimate target page count based on depth configuration
        page_estimates = {
            DPRDepthEnum.SUMMARY: (10, 15),
            DPRDepthEnum.STANDARD: (20, 30),
            DPRDepthEnum.DETAILED: (40, 60)
        }
        min_p, max_p = page_estimates.get(d_depth, (20, 30))

        return {
            "dpr_type": str(d_type),
            "dpr_depth": str(d_depth),
            "target_page_range": f"{min_p}-{max_p} pages",
            "section_count": len(sections),
            "sections": sections
        }
