import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from typing import Dict, Any, Optional
from dpr_engine.data_model import DPRDocumentModel
from dpr_engine.utils.currency import format_inr

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
        if os.path.exists(output_path) and os.path.getsize(output_path) > 1000:
            return output_path
        try:
            plt.rcParams['font.sans-serif'] = [
                'Nirmala UI',
                'Noto Sans Kannada',
                'Noto Sans Devanagari',
                'Tunga',
                'Mangal',
                'Arial Unicode MS',
                'DejaVu Sans',
                'sans-serif'
            ]
            plt.rcParams['axes.unicode_minus'] = False

            fig, ax = plt.subplots(figsize=(6.5, 3.8), dpi=110)
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
            ax.text(0.5, 0.08, footer, color='#64748B', weight='bold', fontsize=7.5, ha='center', va='center', transform=ax.transAxes)

            plt.tight_layout()
            plt.savefig(output_path, bbox_inches='tight', dpi=110)
            plt.close(fig)
            return output_path
        except Exception as e:
            print(f"Error creating visual card {title}: {e}")
            return ""

    @classmethod
    def generate_industry_visuals(cls, doc: DPRDocumentModel, upload_dir: str) -> Dict[str, str]:
        visuals_dir = os.path.join(upload_dir, "visual_cards")
        os.makedirs(visuals_dir, exist_ok=True)

        raw_lang = str(getattr(doc, 'language', 'en') or 'en').lower()
        lang_code = 'kn' if 'kn' in raw_lang else ('hi' if 'hi' in raw_lang else 'en')

        job_prefix = f"{doc.job_id or 'demo'}_{lang_code}"
        b_name = doc.business_name or "Industrial Enterprise"
        prod_name = doc.primary_product or "Primary Commercial Product"
        ind = str(doc.industry).lower()

        m_name = doc.machinery[0].name if doc.machinery else "Automated Production Line Equipment"
        hsn = doc.hsn_code or '84799090'
        cap_val = doc.daily_capacity or 200
        cap_u = doc.capacity_unit or ('ಘಟಕಗಳು' if lang_code == 'kn' else ('इकाई' if lang_code == 'hi' else 'units'))
        price_val = format_inr(doc.selling_price or 850)
        usp_val = doc.usp or ('ಉನ್ನತ ಗುಣಮಟ್ಟದ ನಿಖರ ಉತ್ಪಾದನಾ ಮಾನದಂಡಗಳು.' if lang_code == 'kn' else ('उच्च गुणवत्ता परिशुद्धता विनिर्देश मानक।' if lang_code == 'hi' else 'High quality precision specification standards.'))

        power_val = doc.power_required or 25
        area_val = doc.builtup_area or 2500
        ws_val = doc.workspace or ('ಕೈಗಾರಿಕಾ ಶೆಡ್' if lang_code == 'kn' else ('औद्योगिक शेड' if lang_code == 'hi' else 'Industrial Shed'))
        sup_val = doc.supplier_name or ('ಪ್ರಮಾಣೀಕೃತ OEM ಯಂತ್ರ ತಯಾರಕರು' if lang_code == 'kn' else ('प्रमाणित ओईएम मशीन निर्माता' if lang_code == 'hi' else 'Certified OEM Machine Manufacturer'))
        days_val = doc.working_days or 300

        loc_val = f"{doc.district}, {doc.state}" if doc.district else ("ಕರ್ನಾಟಕ, ಭಾರತ" if lang_code == 'kn' else ("कर्नाटक, भारत" if lang_code == 'hi' else "Karnataka, India"))
        reg_std = "FSSAI Grade 1 / Organic Seal" if "food" in ind else ("WHO-GMP / US-FDA" if "phar" in ind else ("PLI ACC Norms" if "ev" in ind else "ISO 9001:2015 & 3D CMM Metrology"))
        staff_val = doc.local_employment or 15
        women_val = doc.women_employment or 5
        lead_val = doc.contact_name or doc.declarant_name or ('ಅಧಿಕೃತ ನಿರ್ವಹಣಾ ಮುಖ್ಯಸ್ಥರು' if lang_code == 'kn' else ('अधिकृत प्रबंधन प्रमुख' if lang_code == 'hi' else 'Authorized Management Lead'))

        if lang_code == 'kn':
            # 1. Product Visual Specification Card
            p_title = "ತಾಂತ್ರಿಕ ಉತ್ಪನ್ನದ ವಿಶೇಷಣಗಳು"
            p_sub = f"{b_name} - {prod_name} ವಿವರಣೆ"
            p_details = [
                f"ಉತ್ಪನ್ನದ ಹೆಸರು: {prod_name}",
                f"HSN / ITC ವರ್ಗೀಕರಣ ಕೋಡ್: {hsn}",
                f"ದೈನಂದಿನ ವಿನ್ಯಾಸ ಸಾಮರ್ಥ್ಯ: {cap_val} {cap_u}/ದಿನ",
                f"ಗುರಿ ವಾಣಿಜ್ಯ ಮಾರಾಟ ಬೆಲೆ: ₹{price_val} / ಪ್ರತಿ ಘಟಕ",
                f"ಸ್ಪರ್ಧಾತ್ಮಕ ಪ್ರಯೋಜನ (USP): {usp_val}"
            ]
            p_footer = f"ಪರಿಶೀಲಿಸಿದ ವಿವರಣೆ: {b_name}"

            # 2. Facility & Machinery Layout Card
            f_title = "ಸ್ಥಾವರ ಮತ್ತು ಯಂತ್ರೋಪಕರಣಗಳ ವಿನ್ಯಾಸ ವಿವರಣೆ"
            f_sub = f"{b_name} ಉತ್ಪಾದನಾ ಮೂಲಸೌಕರ್ಯ"
            f_details = [
                f"ಪ್ರಮುಖ ಯಂತ್ರೋಪಕರಣ: {m_name}",
                f"ಮಂಜೂರಾದ ವಿದ್ಯುತ್ ಲೋಡ್: {power_val} HP / kW ಸಂಪರ್ಕ",
                f"ಘಟಕದ ನಿರ್ಮಿತ ವಿಸ್ತೀರ್ಣ: {area_val} ಚದರ ಅಡಿ ({ws_val})",
                f"ಯಂತ್ರ ಪೂರೈಕೆದಾರ ಪಾಲುದಾರ: {sup_val}",
                f"ವಾರ್ಷಿಕ ಕಾರ್ಯಾಚರಣೆ ದಿನಗಳು: {days_val} ದಿನಗಳು / ವರ್ಷ"
            ]
            f_footer = f"ಸ್ಥಳ: {loc_val}"

            # 3. Quality Assurance & Standards Card
            q_title = "ಗುಣಮಟ್ಟ ಭರವಸೆ ಮತ್ತು ಶಾಸನಬದ್ಧ ಮಾನದಂಡಗಳು"
            q_sub = f"{b_name} ಅನುಸರಣೆ ಮತ್ತು ಮಾನವ ಸಂಪನ್ಮೂಲ ವಿವರ"
            q_details = [
                f"ನಿಯಂತ್ರಕ ಅನುಸರಣೆ ಮಾನದಂಡ: {reg_std}",
                f"ನೇರ ಉದ್ಯೋಗ ಮತ್ತು ಸಿಬ್ಬಂದಿ: {staff_val} ನುರಿತ ಸಿಬ್ಬಂದಿ",
                f"ಮಹಿಳಾ ಮತ್ತು ಯುವ ಉದ್ಯೋಗಾವಕಾಶ: {women_val} ಮಹಿಳಾ ಉದ್ಯೋಗಿಗಳು",
                f"ಪರಿಸರ ಲೆಕ್ಕಪರಿಶೋಧನೆ: ಶೂನ್ಯ ದ್ರವ ವಿಸರ್ಜನೆ (ZLD) ಮತ್ತು ತ್ಯಾಜ್ಯ ಮರುಬಳಕೆ",
                f"ಅಧಿಕೃತ ನಿರ್ವಹಣಾ ಸಂಪರ್ಕ: {lead_val}"
            ]
            q_footer = "ISO ಮತ್ತು ಶಾಸನಬದ್ಧ ನಿಯಂತ್ರಕ ಮಾನದಂಡ ಪ್ರಮಾಣೀಕೃತ"

        elif lang_code == 'hi':
            # 1. Product Visual Specification Card
            p_title = "तकनीकी उत्पाद विनिर्देश"
            p_sub = f"{b_name} - {prod_name} विनिर्देश"
            p_details = [
                f"उत्पाद का नाम: {prod_name}",
                f"एचएसएन / आईटीसी कोड: {hsn}",
                f"डिजाइन स्थापित क्षमता: {cap_val} {cap_u}/दिन",
                f"लक्षित व्यावसायिक बिक्री मूल्य: ₹{price_val} / इकाई",
                f"प्रतिस्पर्धी यूएसपी (USP): {usp_val}"
            ]
            p_footer = f"सत्यापित विनिर्देश: {b_name}"

            # 2. Facility & Machinery Layout Card
            f_title = "संयंत्र एवं मशीनरी लेआउट विनिर्देश"
            f_sub = f"{b_name} विनिर्माण बुनियादी ढांचा"
            f_details = [
                f"प्राथमिक मशीनरी उपकरण: {m_name}",
                f"स्वीकृत विद्युत भार: {power_val} HP / kW कनेक्शन",
                f"संयंत्र निर्मित कार्यक्षेत्र: {area_val} वर्ग फुट ({ws_val})",
                f"मशीनरी आपूर्तिकर्ता भागीदार: {sup_val}",
                f"वार्षिक कार्य दिवस: {days_val} दिन / वर्ष"
            ]
            f_footer = f"स्थान: {loc_val}"

            # 3. Quality Assurance & Standards Card
            q_title = "गुणवत्ता आश्वासन एवं नियामक मानक"
            q_sub = f"{b_name} अनुपालन एवं मानव संसाधन विवरण"
            q_details = [
                f"नियामक अनुपालन मानक: {reg_std}",
                f"प्रत्यक्ष रोजगार एवं स्टाफ: {staff_val} कुशल कार्मिक",
                f"महिला एवं युवा सशक्तिकरण: {women_val} महिला कर्मचारी",
                f"पर्यावरण ऑडिट: शून्य तरल निर्वहन (ZLD) एवं अपशिष्ट पुनर्चक्रण",
                f"अधिकृत प्रबंधन संपर्क: {lead_val}"
            ]
            q_footer = "आईएसओ एवं नियामक मानक प्रमाणित"

        else:
            # 1. Product Visual Specification Card
            p_title = "TECHNICAL PRODUCT SPECIFICATION"
            p_sub = f"Enterprise Product Specs for {prod_name}"
            p_details = [
                f"Product Name: {prod_name}",
                f"HSN / ITC Classification Code: {hsn}",
                f"Design Installed Capacity: {cap_val} {cap_u}/day",
                f"Target Commercial Selling Price: ₹{price_val} / unit",
                f"Competitive USP: {usp_val}"
            ]
            p_footer = f"Verified Spec: {b_name}"

            # 2. Facility & Machinery Layout Card
            f_title = "PLANT & MACHINERY LAYOUT SPECIFICATION"
            f_sub = f"Manufacturing Infrastructure for {b_name}"
            f_details = [
                f"Primary Machine Equipment: {m_name}",
                f"Sanctioned Power Load: {power_val} HP / kW Utility Connection",
                f"Plant Built-up Workspace Area: {area_val} sq.ft. ({ws_val})",
                f"Machinery Supplier Partner: {sup_val}",
                f"Operational Working Schedule: {days_val} Days / Year"
            ]
            f_footer = f"Location: {loc_val}"

            # 3. Quality Assurance & Standards Card
            q_title = "QUALITY ASSURANCE & STANDARDS"
            q_sub = f"Compliance & Human Capital Profile for {b_name}"
            q_details = [
                f"Regulatory Compliance Standard: {reg_std}",
                f"Total Direct Labor & Staffing: {staff_val} Skilled Personnel",
                f"Women & Youth Upskilling Impact: {women_val} Female Employees",
                f"Environmental Audit: Zero Liquid Discharge (ZLD) & Waste Recycling",
                f"Promoter / Lead Contact: {lead_val}"
            ]
            q_footer = "ISO & Regulatory Standard Certified"

        p_card_path = os.path.join(visuals_dir, f"prod_card_{job_prefix}.png")
        cls._create_visual_card(p_title, p_sub, p_details, p_footer, p_card_path, header_bg='#0F172A')

        f_card_path = os.path.join(visuals_dir, f"facility_card_{job_prefix}.png")
        cls._create_visual_card(f_title, f_sub, f_details, f_footer, f_card_path, header_bg='#1E3A8A')

        q_card_path = os.path.join(visuals_dir, f"quality_card_{job_prefix}.png")
        cls._create_visual_card(q_title, q_sub, q_details, q_footer, q_card_path, header_bg='#2563EB')

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
