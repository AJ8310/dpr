import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from typing import Dict, Any, Optional
from dpr_engine.data_model import DPRDocumentModel, IndustryCategoryEnum

class ImageManagementEngine:

    @classmethod
    def _create_visual_card(
        cls,
        title: str,
        subtitle: str,
        details: list,
        footer: str,
        output_path: str,
        header_bg: str = '#0F172A'
    ) -> str:
        try:
            fig, ax = plt.subplots(figsize=(6.5, 3.8), dpi=300)
            ax.axis('off')
            ax.set_facecolor('#F8FAFC')
            fig.patch.set_facecolor('#F8FAFC')

            # Top Banner
            ax.add_patch(plt.Rectangle((0, 0.80), 1, 0.20, color=header_bg, transform=ax.transAxes))
            ax.text(0.5, 0.90, title.upper(), color='white', weight='bold', fontsize=10, ha='center', va='center', transform=ax.transAxes)

            # Subtitle
            ax.text(0.5, 0.74, subtitle, color='#1E3A8A', weight='bold', fontsize=8.5, ha='center', va='center', transform=ax.transAxes)

            # Main Details Card
            detail_text = "\n".join([f"•  {d}" for d in details])
            bbox_props = dict(boxstyle='round,pad=0.6', facecolor='white', edgecolor='#CBD5E1', lw=1.5)
            ax.text(0.5, 0.44, detail_text, color='#0F172A', weight='bold', fontsize=8, ha='center', va='center', bbox=bbox_props, transform=ax.transAxes)

            # Footer Seal
            ax.text(0.5, 0.08, f"Verified Spec: {footer}", color='#64748B', weight='bold', fontsize=7.5, ha='center', va='center', transform=ax.transAxes)

            plt.tight_layout()
            plt.savefig(output_path, bbox_inches='tight', dpi=300)
            plt.close(fig)
            return output_path
        except Exception as e:
            print(f"Error creating visual card {title}: {e}")
            return ""

    @classmethod
    def generate_industry_visuals(cls, doc: DPRDocumentModel, upload_dir: str) -> Dict[str, str]:
        visuals_dir = os.path.join(upload_dir, "visual_cards")
        os.makedirs(visuals_dir, exist_ok=True)

        job_prefix = doc.job_id or "demo"
        b_name = doc.business_name or "Industrial Enterprise"
        prod_name = doc.primary_product or "Primary Commercial Product"
        ind = str(doc.industry).lower()

        # 1. Product Visual Specification Card
        p_title = f"TECHNICAL PRODUCT SPECIFICATION"
        p_sub = f"Enterprise Product Specs for {prod_name}"
        p_details = [
            f"Product Name: {prod_name}",
            f"HSN / ITC Classification Code: {doc.hsn_code or '84799090'}",
            f"Design Installed Capacity: {doc.daily_capacity or 200} {doc.capacity_unit or 'units'}/day",
            f"Target Commercial Selling Price: ₹{doc.selling_price or 850:,.2f} / unit",
            f"Competitive USP: {doc.usp or 'High quality precision specification standards.'}"
        ]
        p_card_path = os.path.join(visuals_dir, f"prod_card_{job_prefix}.png")
        cls._create_visual_card(p_title, p_sub, p_details, b_name, p_card_path, header_bg='#0F172A')

        # 2. Facility & Machinery Layout Card
        f_title = f"PLANT & MACHINERY LAYOUT SPECIFICATION"
        f_sub = f"Manufacturing Infrastructure for {b_name}"
        m_name = doc.machinery[0].name if doc.machinery else "Automated Production Line Equipment"
        f_details = [
            f"Primary Machine Equipment: {m_name}",
            f"Sanctioned Power Load: {doc.power_required or 25} HP / kW Utility Connection",
            f"Plant Built-up Workspace Area: {doc.builtup_area or 2500} sq.ft. ({doc.workspace or 'Industrial Shed'})",
            f"Machinery Supplier Partner: {doc.supplier_name or 'Certified OEM Machine Manufacturer'}",
            f"Operational Working Schedule: {doc.working_days or 300} Days / Year"
        ]
        f_card_path = os.path.join(visuals_dir, f"facility_card_{job_prefix}.png")
        cls._create_visual_card(f_title, f_sub, f_details, f"{doc.district}, {doc.state}", f_card_path, header_bg='#1E3A8A')

        # 3. Quality Assurance & Standards Card
        q_title = f"QUALITY ASSURANCE & STANDARDS"
        q_sub = f"Compliance & Human Capital Profile for {b_name}"
        
        reg_std = "FSSAI Grade 1 / Organic Seal" if "food" in ind else ("WHO-GMP / US-FDA" if "phar" in ind else ("PLI ACC Norms" if "ev" in ind else "ISO 9001:2015 & 3D CMM Metrology"))
        q_details = [
            f"Regulatory Compliance Standard: {reg_std}",
            f"Total Direct Labor & Staffing: {doc.local_employment or 15} Skilled Personnel",
            f"Women & Youth Upskilling Impact: {doc.women_employment or 5} Female Employees",
            f"Environmental Audit: Zero Liquid Discharge (ZLD) & Waste Recycling",
            f"Promoter / Lead Contact: {doc.contact_name or doc.declarant_name or 'Authorized Management Lead'}"
        ]
        q_card_path = os.path.join(visuals_dir, f"quality_card_{job_prefix}.png")
        cls._create_visual_card(q_title, q_sub, q_details, "ISO & Regulatory Standard Certified", q_card_path, header_bg='#2563EB')

        return {
            "product_card": p_card_path,
            "facility_card": f_card_path,
            "quality_card": q_card_path
        }

    @classmethod
    def resolve_image_paths(cls, doc: DPRDocumentModel, upload_dir: str) -> Dict[str, Optional[str]]:
        images = {
            "logo": doc.logo_path,
            "product": doc.product_path,
            "facility": doc.facility_path,
            "team": doc.team_path
        }

        # Fallback resolve to uploads directory if relative path provided
        for key, path in images.items():
            if path and not os.path.isabs(path):
                clean_name = os.path.basename(path)
                abs_p = os.path.join(upload_dir, clean_name)
                if os.path.exists(abs_p):
                    images[key] = abs_p

        # Generate 300 DPI business-tailored visual cards if no user upload provided
        visual_cards = cls.generate_industry_visuals(doc, upload_dir)
        if not images.get("product"):
            images["product"] = visual_cards.get("product_card")
        if not images.get("facility"):
            images["facility"] = visual_cards.get("facility_card")
        if not images.get("team"):
            images["team"] = visual_cards.get("quality_card")

        return images
