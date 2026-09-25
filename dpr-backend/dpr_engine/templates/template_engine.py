import os
import base64
from jinja2 import Environment, FileSystemLoader
from typing import Dict, Any
from dpr_engine.data_model import DPRDocumentModel
from dpr_engine.structures.structure_engine import DPRStructureEngine
from dpr_engine.content_library.content_engine import DPRContentEngine
from dpr_engine.visuals.diagram_engine import DeterministicDiagramEngine
from dpr_engine.visuals.image_engine import ImageManagementEngine

from dpr_engine.document.renderers.chart_renderer import ChartRenderer

def format_inr(val):
    if val is None or val == "":
        return "0"
    try:
        val = float(val)
    except (ValueError, TypeError):
        return str(val)
    
    is_int = (val % 1 == 0)
    s = f"{val:.2f}" if not is_int else f"{int(val)}"
    parts = s.split('.')
    integer_part = parts[0]
    
    negative = integer_part.startswith('-')
    if negative:
        integer_part = integer_part[1:]
    
    if len(integer_part) > 3:
        last3 = integer_part[-3:]
        rest = integer_part[:-3]
        groups = []
        while len(rest) > 2:
            groups.insert(0, rest[-2:])
            rest = rest[:-2]
        if rest:
            groups.insert(0, rest)
        formatted = ",".join(groups) + "," + last3
    else:
        formatted = integer_part
        
    if negative:
        formatted = "-" + formatted
        
    if not is_int and len(parts) > 1 and int(parts[1]) > 0:
        formatted += "." + parts[1]
        
    return formatted

class DPRTemplateCompositionEngine:

    @staticmethod
    def _file_to_base64_uri(file_path: str, mime_type: str) -> str:
        if os.path.exists(file_path):
            try:
                with open(file_path, "rb") as image_file:
                    encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
                    return f"data:{mime_type};base64,{encoded_string}"
            except Exception:
                pass
        return ""

    @classmethod
    def compose_html_document(cls, doc: DPRDocumentModel, templates_dir: str) -> str:
        # Resolve structure, narratives, and diagrams
        structure_info = DPRStructureEngine.resolve_structure(doc)
        narratives = DPRContentEngine.generate_narratives(doc)
        diagrams = DeterministicDiagramEngine.generate_html_diagrams(doc)

        upload_dir = os.path.join(os.path.dirname(templates_dir), "uploads")
        resolved_images = ImageManagementEngine.resolve_image_paths(doc, upload_dir)

        def resolve_to_b64(path_val):
            if not path_val:
                return None
            p_str = str(path_val).strip()
            if not p_str:
                return None
            if p_str.startswith("data:image"):
                return p_str

            clean_name = os.path.basename(p_str.split("?")[0])
            abs_u = os.path.join(upload_dir, clean_name)
            if os.path.exists(abs_u) and os.path.isfile(abs_u):
                ext = os.path.splitext(abs_u)[1].lower().replace(".", "")
                mime = "jpeg" if ext in ["jpg", "jpeg"] else "png"
                return cls._file_to_base64_uri(abs_u, f"image/{mime}")

            if os.path.exists(p_str) and os.path.isfile(p_str):
                ext = os.path.splitext(p_str)[1].lower().replace(".", "")
                mime = "jpeg" if ext in ["jpg", "jpeg"] else "png"
                return cls._file_to_base64_uri(p_str, f"image/{mime}")

            if p_str.startswith("http://") or p_str.startswith("https://"):
                try:
                    import urllib.request
                    req = urllib.request.Request(p_str, headers={'User-Agent': 'Mozilla/5.0'})
                    with urllib.request.urlopen(req, timeout=5) as resp:
                        ctype = resp.headers.get('Content-Type', 'image/png')
                        b64 = base64.b64encode(resp.read()).decode("utf-8")
                        return f"data:{ctype};base64,{b64}"
                except Exception as e:
                    print(f"Error downloading remote logo {p_str}: {e}")
                    return p_str

            return None

        # Resolve logo: prioritize user uploaded logo over default logo
        user_logo_b64 = resolve_to_b64(resolved_images.get("logo") or doc.logo_path)

        assets_dir = os.path.join(templates_dir, "assets")
        banner_b64 = cls._file_to_base64_uri(os.path.join(assets_dir, "vkf_header_banner.png"), "image/png")
        default_logo_b64 = cls._file_to_base64_uri(os.path.join(assets_dir, "vkf_official_logo.png"), "image/png")
        logo_b64 = user_logo_b64 or default_logo_b64

        prod1_b64 = cls._file_to_base64_uri(os.path.join(assets_dir, "product_sample_1.jpg"), "image/jpeg")
        prod2_b64 = cls._file_to_base64_uri(os.path.join(assets_dir, "product_sample_2.jpg"), "image/jpeg")
        prod3_b64 = cls._file_to_base64_uri(os.path.join(assets_dir, "product_sample_3.jpg"), "image/jpeg")

        # Convert generated chart files to Base64 URIs
        charts_b64: Dict[str, str] = {}
        if doc.chart_paths:
            for c_name, c_path in doc.chart_paths.items():
                if c_path and os.path.exists(c_path):
                    charts_b64[c_name] = cls._file_to_base64_uri(c_path, "image/png")

        user_product_b64 = resolve_to_b64(resolved_images.get("product") or doc.product_path)
        user_facility_b64 = resolve_to_b64(resolved_images.get("facility") or doc.facility_path)
        user_team_b64 = resolve_to_b64(resolved_images.get("team") or doc.team_path)

        product_card_b64 = user_product_b64 or resolve_to_b64(resolved_images.get("product"))
        facility_card_b64 = user_facility_b64 or resolve_to_b64(resolved_images.get("facility"))
        quality_card_b64 = user_team_b64 or resolve_to_b64(resolved_images.get("team"))

        env = Environment(loader=FileSystemLoader(templates_dir))
        env.filters['inr'] = format_inr
        env.filters['indian_num'] = format_inr
        template = env.get_template("dpr_template.html")

        # Context payload for Jinja rendering
        context = doc.model_dump()
        context["dpr_type"] = doc.dpr_type.value if hasattr(doc.dpr_type, "value") else str(doc.dpr_type)
        context["structure"] = structure_info
        context["narratives"] = narratives
        context["diagrams"] = diagrams
        context["charts_b64"] = charts_b64
        context["vkf_header_banner_b64"] = banner_b64
        context["vkf_official_logo_b64"] = logo_b64
        context["user_logo_b64"] = logo_b64
        context["org_logo_b64"] = logo_b64
        context["user_product_b64"] = user_product_b64
        context["user_facility_b64"] = user_facility_b64
        context["user_team_b64"] = user_team_b64
        context["product_card_b64"] = product_card_b64
        context["facility_card_b64"] = facility_card_b64
        context["quality_card_b64"] = quality_card_b64
        context["product_sample_1_b64"] = prod1_b64
        context["product_sample_2_b64"] = prod2_b64
        context["product_sample_3_b64"] = prod3_b64
        context["product_card_b64"] = product_card_b64
        context["facility_card_b64"] = facility_card_b64
        context["quality_card_b64"] = quality_card_b64
        context["machinery_total"] = sum(m.total for m in doc.machinery) if doc.machinery else (doc.total_cost * 0.40)

        # Generate High-Impact Vector SVG Charts
        projections_list = [p.model_dump() if hasattr(p, 'model_dump') else p for p in doc.projections] if doc.projections else []
        context["chart_financial_trend_svg"] = ChartRenderer.render_financial_trend_chart(projections_list)
        context["chart_means_of_finance_svg"] = ChartRenderer.render_means_of_finance_chart(doc.total_cost, doc.bank_loan, doc.promoter_contribution, getattr(doc, 'subsidy', 0))
        context["chart_dscr_trend_svg"] = ChartRenderer.render_dscr_trend_chart(projections_list)

        if not context.get("hr_summary"):
            m_cost = (doc.mgmt_count * doc.mgmt_salary) + (doc.sup_count * doc.sup_salary) + (doc.skill_count * doc.skill_salary) + (doc.unskill_count * doc.unskill_salary) + (doc.admin_count * doc.admin_salary)
            context["hr_summary"] = {
                "total_staff": doc.mgmt_count + doc.sup_count + doc.skill_count + doc.unskill_count + doc.admin_count,
                "monthly_salary_cost": m_cost,
                "annual_salary_cost": m_cost * 12.0,
                "mgmt_cost": doc.mgmt_count * doc.mgmt_salary,
                "sup_cost": doc.sup_count * doc.sup_salary,
                "skill_cost": doc.skill_count * doc.skill_salary,
                "unskill_cost": doc.unskill_count * doc.unskill_salary,
                "admin_cost": doc.admin_count * doc.admin_salary
            }

        return template.render(data=context, **context)
