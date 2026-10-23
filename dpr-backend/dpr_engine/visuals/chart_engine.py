import os
import matplotlib
matplotlib.use('Agg')  # Non-interactive background rendering
import matplotlib.pyplot as plt
from typing import Dict, Any
from dpr_engine.data_model import DPRDocumentModel

CHART_I18N = {
    "en": {
        "yr_prefix": "Yr",
        "rev_label": "Revenue (₹ Lakhs)",
        "ebitda_label": "EBITDA (₹ Lakhs)",
        "pat_label": "PAT - Net Profit (₹ Lakhs)",
        "y_axis_amount": "Financial Amount (₹ in Lakhs)",
        "rev_chart_title": "5-Year Projected Revenue, EBITDA & Profit Trajectory",
        "unit_lakh": "L",
        "capex_title": "Capital Expenditure (CAPEX) Composition Breakdown",
        "capex_legend_title": "CAPEX Expenditure Heads",
        "capex_slices": {
            "Land & Site": "Land & Site",
            "Building Shed": "Building Shed",
            "Plant & Machinery": "Plant & Machinery",
            "Electrification": "Electrification",
            "Furniture & Office": "Furniture & Office",
            "Working Capital": "Working Capital",
            "Pre-operative": "Pre-operative",
            "Plant Setup": "Plant Setup"
        },
        "finance_title": "Means of Finance Capital Structure Breakdown",
        "finance_legend_title": "Funding Structure",
        "finance_slices": {
            "Promoter Equity": "Promoter Equity",
            "Bank Term Loan": "Bank Term Loan",
            "Subsidy Claim": "Subsidy Claim"
        },
        "dscr_title": "5-Year Debt Service Coverage Ratio (DSCR) Trajectory",
        "dscr_y_label": "DSCR Ratio",
        "dscr_projected": "Projected DSCR Ratio",
        "dscr_cushion": "DSCR Cushion above Benchmark",
        "dscr_benchmark": "Bank Lending Benchmark (1.50)"
    },
    "kn": {
        "yr_prefix": "ವರ್ಷ",
        "rev_label": "ಒಟ್ಟು ಆದಾಯ (₹ ಲಕ್ಷ)",
        "ebitda_label": "ಇಬಿಐಟಿಡಿಎ (₹ ಲಕ್ಷ)",
        "pat_label": "ನಿವ್ವಳ ಲಾಭ - PAT (₹ ಲಕ್ಷ)",
        "y_axis_amount": "ಹಣಕಾಸು ಮೊತ್ತ (₹ ಲಕ್ಷಗಳಲ್ಲಿ)",
        "rev_chart_title": "5-ವರ್ಷಗಳ ಅಂದಾಜು ಆದಾಯ, ಇಬಿಐಟಿಡಿಎ ಮತ್ತು ನಿವ್ವಳ ಲಾಭ",
        "unit_lakh": "ಲಕ್ಷ",
        "capex_title": "ಬಂಡವಾಳ ವೆಚ್ಚ (CAPEX) ವಿಭಜನೆ ವಿವರ",
        "capex_legend_title": "ಬಂಡವಾಳ ವೆಚ್ಚದ ವಿಭಾಗಗಳು",
        "capex_slices": {
            "Land & Site": "ಭೂಮಿ ಮತ್ತು ನಿವೇಶನ",
            "Building Shed": "ಕಟ್ಟಡ ಮತ್ತು ಶೆಡ್",
            "Plant & Machinery": "ಯಂತ್ರೋಪಕರಣಗಳು",
            "Electrification": "ವಿದ್ಯುದ್ದೀಕರಣ ಮತ್ತು ಸೌಲಭ್ಯ",
            "Furniture & Office": "ಪೀಠೋಪಕರಣ ಮತ್ತು ಕಚೇರಿ",
            "Working Capital": "ಕಾರ್ಯಕಾರಿ ಬಂಡವಾಳ",
            "Pre-operative": "ಪೂರ್ವ ಕಾರ್ಯಾಚರಣೆ ವೆಚ್ಚ",
            "Plant Setup": "ಸ್ಥಾವರ ಸ್ಥಾಪನೆ"
        },
        "finance_title": "ಹಣಕಾಸು ಮೂಲಗಳು ಮತ್ತು ಬಂಡವಾಳ ರಚನೆ",
        "finance_legend_title": "ಹಣಕಾಸು ಮೂಲಗಳ ವಿವರ",
        "finance_slices": {
            "Promoter Equity": "ಪ್ರವರ್ತಕರ ಬಂಡವಾಳ",
            "Bank Term Loan": "ಬ್ಯಾಂಕ್ ಅವಧಿ ಸಾಲ",
            "Subsidy Claim": "ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ / ಅನುದಾನ"
        },
        "dscr_title": "5-ವರ್ಷಗಳ ಸಾಲ ಸೇವಾ ವ್ಯಾಪ್ತಿ ಅನುಪಾತ (DSCR) ಪ್ರವೃತ್ತಿ",
        "dscr_y_label": "DSCR ಅನುಪಾತ",
        "dscr_projected": "ಅಂದಾಜು DSCR ಅನುಪಾತ",
        "dscr_cushion": "ಮಾನದಂಡಕ್ಕಿಂತ ಹೆಚ್ಚಿನ ರಕ್ಷಣೆ",
        "dscr_benchmark": "ಬ್ಯಾಂಕ್ ಸಾಲ ನೀಡಿಕೆ ಮಾನದಂಡ (1.50)"
    },
    "hi": {
        "yr_prefix": "वर्ष",
        "rev_label": "कुल राजस्व (₹ लाख)",
        "ebitda_label": "एबिटा (₹ लाख)",
        "pat_label": "शुद्ध लाभ - PAT (₹ लाख)",
        "y_axis_amount": "वित्तीय राशि (₹ लाख में)",
        "rev_chart_title": "5-वर्षीय अनुमानित राजस्व, एबिटा एवं शुद्ध लाभ",
        "unit_lakh": "लाख",
        "capex_title": "पूंजीगत व्यय (CAPEX) संरचना विवरण",
        "capex_legend_title": "पूंजीगत व्यय के मुख्य घटक",
        "capex_slices": {
            "Land & Site": "भूमि एवं स्थल विकास",
            "Building Shed": "भवन एवं शेड निर्माण",
            "Plant & Machinery": "संयंत्र एवं मशीनरी",
            "Electrification": "विद्युतीकरण एवं उपयोगिताएं",
            "Furniture & Office": "फर्नीचर एवं कार्यालय उपकरण",
            "Working Capital": "कार्यशील पूंजी मार्जिन",
            "Pre-operative": "पूर्व-परिचालन व्यय",
            "Plant Setup": "संयंत्र स्थापना"
        },
        "finance_title": "वित्त पोषण संरचना एवं पूंजी साधन",
        "finance_legend_title": "वित्त पोषण के साधन",
        "finance_slices": {
            "Promoter Equity": "प्रवर्तक इक्विटी / अंशदान",
            "Bank Term Loan": "बैंक मियादी ऋण",
            "Subsidy Claim": "सरकारी सब्सिडी / अनुदान"
        },
        "dscr_title": "5-वर्षीय ऋण सेवा कवरेज अनुपात (DSCR) रुझान",
        "dscr_y_label": "डीएससीआर अनुपात (DSCR)",
        "dscr_projected": "अनुमानित DSCR अनुपात",
        "dscr_cushion": "मानक से अतिरिक्त कुशन",
        "dscr_benchmark": "बैंक ऋण मानक (1.50)"
    }
}

class DeterministicChartEngine:

    @classmethod
    def generate_all_charts(cls, doc: DPRDocumentModel, upload_dir: str) -> Dict[str, str]:
        charts_dir = os.path.join(upload_dir, "charts")
        os.makedirs(charts_dir, exist_ok=True)
        chart_paths: Dict[str, str] = {}

        # Configure fonts with Indic fallbacks (Nirmala UI for Kannada & Devanagari)
        plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
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
        plt.rcParams['figure.autolayout'] = True

        raw_lang = str(getattr(doc, 'language', 'en') or 'en').lower()
        lang_code = 'kn' if 'kn' in raw_lang else ('hi' if 'hi' in raw_lang else 'en')
        t = CHART_I18N.get(lang_code, CHART_I18N["en"])

        # Vibrant Multi-Color Financial Palette
        c_revenue = '#059669'   # Emerald Green (Top-line Revenue Growth)
        c_ebitda = '#1E40AF'    # Deep Sapphire Blue (Operational Earnings)
        c_pat = '#D97706'       # Golden Amber / Warm Bronze (Bottom-line Net Profit)
        c_navy = '#0F172A'      # Deep Corporate Charcoal
        c_blue = '#2563EB'      # Bright Royal Blue
        c_red = '#DC2626'       # Crimson Red (Benchmark Threshold)

        # Multi-Color Donut Slice Palette
        multi_pie_colors = [
            '#1E3A8A',  # Deep Corporate Blue
            '#2563EB',  # Sapphire Blue
            '#059669',  # Emerald Green
            '#D97706',  # Amber Gold
            '#7C3AED',  # Violet Purple
            '#0891B2',  # Cyan Blue
            '#E11D48',  # Rose Red
        ]

        # 1. 5-Year Revenue, EBITDA & PAT Growth Bar Chart (Vibrant Multi-Color 300 DPI)
        if doc.projections and len(doc.projections) >= 5:
            try:
                fig, ax = plt.subplots(figsize=(9.5, 4.6), dpi=300)
                years = [f"{t['yr_prefix']} {p.year}" for p in doc.projections]
                revenues = [p.revenue / 100000.0 for p in doc.projections]  # in ₹ Lakhs
                ebitdas = [p.ebitda / 100000.0 for p in doc.projections]
                pats = [p.pat / 100000.0 for p in doc.projections]

                x = list(range(len(years)))
                width = 0.26

                b1 = ax.bar([i - width for i in x], revenues, width=width, label=t['rev_label'], color=c_revenue)
                b2 = ax.bar(x, ebitdas, width=width, label=t['ebitda_label'], color=c_ebitda)
                b3 = ax.bar([i + width for i in x], pats, width=width, label=t['pat_label'], color=c_pat)

                unit_suffix = t['unit_lakh']
                # Add value annotations on top of bars
                for b in b1:
                    h = b.get_height()
                    if h > 0:
                        ax.annotate(f"₹{h:,.1f}{unit_suffix}", (b.get_x() + b.get_width() / 2., h),
                                    xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=7.5, fontweight='bold', color='#047857')
                for b in b2:
                    h = b.get_height()
                    if h > 0:
                        ax.annotate(f"₹{h:,.1f}{unit_suffix}", (b.get_x() + b.get_width() / 2., h),
                                    xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=7.5, fontweight='bold', color='#1E3A8A')
                for b in b3:
                    h = b.get_height()
                    if h > 0:
                        ax.annotate(f"₹{h:,.1f}{unit_suffix}", (b.get_x() + b.get_width() / 2., h),
                                    xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=7.5, fontweight='bold', color='#B45309')

                ax.set_ylabel(t['y_axis_amount'], fontsize=10, fontweight='bold', color=c_navy)
                ax.set_title(t['rev_chart_title'], fontsize=12.5, fontweight='bold', color=c_navy, pad=14)
                ax.set_xticks(x)
                ax.set_xticklabels(years, fontsize=9.5, fontweight='bold')
                ax.legend(fontsize=9, loc='upper left', frameon=True)
                ax.set_ylim(bottom=0, top=max(revenues) * 1.22 if revenues else 100)

                c_path = os.path.join(charts_dir, f"rev_ebitda_{doc.job_id or 'demo'}_{lang_code}.png")
                plt.savefig(c_path, bbox_inches='tight', dpi=300)
                plt.close(fig)
                chart_paths["revenue_ebitda"] = c_path
            except Exception as e:
                print(f"Chart gen error revenue_ebitda: {e}")

        # 2. Project Cost Breakdown (CAPEX Composition) Donut Chart with Multi-Color Slices
        try:
            fig, ax = plt.subplots(figsize=(9.2, 4.3), dpi=300)
            raw_labels = ['Land & Site', 'Building Shed', 'Plant & Machinery', 'Electrification', 'Furniture & Office', 'Working Capital', 'Pre-operative']
            labels = [t['capex_slices'].get(k, k) for k in raw_labels]
            machinery_val = sum(m.total for m in doc.machinery) if doc.machinery else 1.0
            raw_values = [
                doc.land_cost or 0.0,
                doc.building_cost or 0.0,
                machinery_val or 0.0,
                doc.electrification_cost or 0.0,
                doc.furniture_cost or 0.0,
                doc.working_capital or 0.0,
                doc.other_cost or 0.0
            ]
            
            filtered = [(l, v) for l, v in zip(labels, raw_values) if v > 0]
            if not filtered:
                filtered = [(t['capex_slices'].get("Plant Setup", "Plant Setup"), 1.0)]
            
            f_labels, f_values = zip(*filtered)
            total_capex = sum(f_values)
            pie_colors = multi_pie_colors[:len(f_labels)]
            unit_suffix = t['unit_lakh']

            legend_entries = [
                f"{lbl} — ₹{val/100000.0:,.1f}{unit_suffix} ({(val/total_capex)*100.0:.1f}%)"
                for lbl, val in zip(f_labels, f_values)
            ]

            wedges, texts, autotexts = ax.pie(
                f_values,
                autopct=lambda pct: f'{pct:.1f}%' if pct >= 5.0 else '',
                pctdistance=0.75,
                startangle=140,
                colors=pie_colors,
                wedgeprops=dict(width=0.45, edgecolor='white', linewidth=2.0)
            )
            for at in autotexts:
                at.set_color('white')
                at.set_weight('bold')
                at.set_fontsize(8.5)

            ax.legend(wedges, legend_entries, title=t['capex_legend_title'], loc="center left", bbox_to_anchor=(1.0, 0.5), fontsize=8.5, frameon=True)
            ax.set_title(t['capex_title'], fontsize=12, fontweight='bold', color=c_navy, pad=14)

            c_path = os.path.join(charts_dir, f"capex_pie_{doc.job_id or 'demo'}_{lang_code}.png")
            plt.savefig(c_path, bbox_inches='tight', dpi=300)
            plt.close(fig)
            chart_paths["capex_pie"] = c_path
        except Exception as e:
            print(f"Chart gen error capex_pie: {e}")

        # 3. Means of Finance Composition Donut Chart with Multi-Color Slices
        try:
            fig, ax = plt.subplots(figsize=(9.2, 4.3), dpi=300)
            raw_labels = ['Promoter Equity', 'Bank Term Loan', 'Subsidy Claim']
            labels = [t['finance_slices'].get(k, k) for k in raw_labels]
            values = [doc.promoter_contribution or 1.0, doc.bank_loan or 1.0, doc.subsidy or 0.0]
            
            filtered = [(l, v) for l, v in zip(labels, values) if v > 0]
            f_labels, f_values = zip(*filtered)
            total_fin = sum(f_values)
            fin_colors = ['#1E3A8A', '#2563EB', '#059669'][:len(f_labels)]
            unit_suffix = t['unit_lakh']

            legend_entries = [
                f"{lbl} — ₹{val/100000.0:,.1f}{unit_suffix} ({(val/total_fin)*100.0:.1f}%)"
                for lbl, val in zip(f_labels, f_values)
            ]

            wedges, texts, autotexts = ax.pie(
                f_values,
                autopct=lambda pct: f'{pct:.1f}%' if pct >= 5.0 else '',
                pctdistance=0.72,
                startangle=140,
                colors=fin_colors,
                wedgeprops=dict(width=0.45, edgecolor='white', linewidth=2.0)
            )
            for at in autotexts:
                at.set_color('white')
                at.set_weight('bold')
                at.set_fontsize(9)

            ax.legend(wedges, legend_entries, title=t['finance_legend_title'], loc="center left", bbox_to_anchor=(1.0, 0.5), fontsize=9, frameon=True)
            ax.set_title(t['finance_title'], fontsize=12, fontweight='bold', color=c_navy, pad=14)

            c_path = os.path.join(charts_dir, f"finance_pie_{doc.job_id or 'demo'}_{lang_code}.png")
            plt.savefig(c_path, bbox_inches='tight', dpi=300)
            plt.close(fig)
            chart_paths["finance_pie"] = c_path
        except Exception as e:
            print(f"Chart gen error finance_pie: {e}")

        # 4. Debt Service Coverage Ratio (DSCR) Line & Area Chart (Multi-Color Gradient)
        if doc.projections and len(doc.projections) >= 5:
            try:
                fig, ax = plt.subplots(figsize=(9.5, 4.2), dpi=300)
                years = [f"{t['yr_prefix']} {p.year}" for p in doc.projections]
                dscrs = [p.dscr for p in doc.projections]

                ax.plot(years, dscrs, marker='o', markersize=8, markerfacecolor=c_pat, markeredgecolor=c_navy, linewidth=3.2, color=c_blue, label=t['dscr_projected'])
                ax.fill_between(years, dscrs, 1.50, color='#3B82F6', alpha=0.15, label=t['dscr_cushion'])
                ax.axhline(y=1.50, color=c_red, linestyle='--', linewidth=2.0, label=t['dscr_benchmark'])

                for i, d in enumerate(dscrs):
                    ax.annotate(f"{d:.2f}", (years[i], d), xytext=(0, 10), textcoords="offset points", ha='center', fontsize=9.5, fontweight='bold', color=c_navy)

                ax.set_ylabel(t['dscr_y_label'], fontsize=10, fontweight='bold', color=c_navy)
                ax.set_title(t['dscr_title'], fontsize=12.5, fontweight='bold', color=c_navy, pad=14)
                ax.set_ylim(bottom=1.0, top=max(dscrs) * 1.25 if dscrs else 3.5)
                ax.legend(fontsize=9, loc='upper left', frameon=True)

                c_path = os.path.join(charts_dir, f"dscr_curve_{doc.job_id or 'demo'}_{lang_code}.png")
                plt.savefig(c_path, bbox_inches='tight', dpi=300)
                plt.close(fig)
                chart_paths["dscr_curve"] = c_path
            except Exception as e:
                print(f"Chart gen error dscr_curve: {e}")

        doc.chart_paths = chart_paths
        return chart_paths
