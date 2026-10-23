from typing import Dict, Any, List
from dpr_engine.utils.currency import format_inr

SVG_CHART_I18N = {
    "en": {
        "fig1_title": "FIGURE 1: 5-YEAR PROJECTED REVENUE & NET PROFIT (PAT) TREND (₹ LAKHS)",
        "yr_prefix": "Year",
        "unit_lakh": "L",
        "gross_rev": "Gross Revenue",
        "net_profit": "Net Profit (PAT)",
        "fig2_title": "FIGURE 2: CAPITAL STRUCTURE & MEANS OF FINANCE BREAKDOWN",
        "total": "TOTAL",
        "promoter_title": "Promoter Margin Equity Contribution",
        "loan_title": "Bank Debt / Term Loan Sanction",
        "subsidy_title": "Government Scheme Capital Subsidy",
        "fig3_title": "FIGURE 3: 5-YEAR DEBT SERVICE COVERAGE RATIO (DSCR) vs. 1.25x BANK BENCHMARK",
        "safety_line": "1.25x Min Bank Safety Line"
    },
    "kn": {
        "fig1_title": "ಚಿತ್ರ 1: 5-ವರ್ಷಗಳ ಅಂದಾಜು ಒಟ್ಟು ಆದಾಯ ಮತ್ತು ನಿವ್ವಳ ಲಾಭ (PAT) ಪ್ರವೃತ್ತಿ (₹ ಲಕ್ಷಗಳಲ್ಲಿ)",
        "yr_prefix": "ವರ್ಷ",
        "unit_lakh": "ಲ",
        "gross_rev": "ಒಟ್ಟು ಆದಾಯ (Revenue)",
        "net_profit": "ನಿವ್ವಳ ಲಾಭ (PAT)",
        "fig2_title": "ಚಿತ್ರ 2: ಬಂಡವಾಳ ರಚನೆ ಮತ್ತು ಹಣಕಾಸು ಮೂಲಗಳ ವಿಭಜನೆ",
        "total": "ಒಟ್ಟು",
        "promoter_title": "ಪ್ರವರ್ತಕರ ಸ್ವಂತ ಬಂಡವಾಳ / ಮಾರ್ಜಿನ್",
        "loan_title": "ಬ್ಯಾಂಕ್ ಅವಧಿ ಸಾಲ ಮಂಜೂರಾತಿ",
        "subsidy_title": "ಸರ್ಕಾರಿ ಯೋಜನೆಯ ಬಂಡವಾಳ ಸಬ್ಸಿಡಿ",
        "fig3_title": "ಚಿತ್ರ 3: 5-ವರ್ಷಗಳ ಸಾಲ ಮರುಪಾವತಿ ಸಾಮರ್ಥ್ಯ (DSCR) vs 1.25x ಬ್ಯಾಂಕ್ ಕನಿಷ್ಠ ಮಾನದಂಡ",
        "safety_line": "1.25x ಬ್ಯಾಂಕ್ ಕನಿಷ್ಠ ಸುರಕ್ಷತಾ ಮಾನದಂಡ"
    },
    "hi": {
        "fig1_title": "चित्र 1: 5-वर्षीय अनुमानित कुल राजस्व और शुद्ध लाभ (PAT) रुझान (₹ लाख में)",
        "yr_prefix": "वर्ष",
        "unit_lakh": "ला",
        "gross_rev": "सकल राजस्व (Revenue)",
        "net_profit": "शुद्ध लाभ (PAT)",
        "fig2_title": "चित्र 2: पूंजी संरचना एवं वित्त के साधन विवरण",
        "total": "कुल",
        "promoter_title": "प्रवर्तक इक्विटी / स्वयं का अंशदान",
        "loan_title": "बैंक सावधि ऋण / बैंक ऋण स्वीकृति",
        "subsidy_title": "सरकारी योजना पूंजीगत सब्सिडी / अनुदान",
        "fig3_title": "चित्र 3: 5-वर्षीय ऋण सेवा कवरेज अनुपात (DSCR) बनाम 1.25x बैंक मानक",
        "safety_line": "1.25x न्यूनतम बैंक सुरक्षा मानक रेखा"
    }
}

FONT_STACK = "'Nirmala UI', 'Noto Sans Kannada', 'Noto Sans Devanagari', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"

class ChartRenderer:
    """
    Renders structured chart references into vector SVG graphics for embedded HTML & PDF documents.
    Supports English, Kannada, and Hindi localization.
    """

    @classmethod
    def _get_i18n(cls, lang: str) -> Dict[str, str]:
        l_str = str(lang or 'en').lower()
        if 'kn' in l_str:
            return SVG_CHART_I18N["kn"]
        elif 'hi' in l_str:
            return SVG_CHART_I18N["hi"]
        return SVG_CHART_I18N["en"]

    @classmethod
    def render_financial_trend_chart(cls, projections: List[Dict[str, Any]], lang: str = 'en') -> str:
        """Renders 5-Year Projected Revenue & Net Profit Bar Chart"""
        t = cls._get_i18n(lang)

        if not projections:
            projections = [
                {"year": 1, "revenue": 15000000, "pat": 1800000},
                {"year": 2, "revenue": 21000000, "pat": 2800000},
                {"year": 3, "revenue": 28000000, "pat": 4200000},
                {"year": 4, "revenue": 35000000, "pat": 5800000},
                {"year": 5, "revenue": 42000000, "pat": 7500000},
            ]

        years = [f"{t['yr_prefix']} {p.get('year', i+1)}" for i, p in enumerate(projections[:5])]
        revenues = [float(p.get('revenue', 0)) / 100000.0 for p in projections[:5]]  # in ₹ Lakhs
        pats = [float(p.get('pat', 0)) / 100000.0 for p in projections[:5]]  # in ₹ Lakhs

        max_val = max(max(revenues, default=100.0), 10.0)
        unit = t['unit_lakh']
        
        svg = [
            '<div style="margin: 16px 0; padding: 14px; background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 10px;">',
            f'<h4 style="font-size: 10pt; font-weight: 800; color: #0F172A; margin-bottom: 12px; text-align: center; font-family: {FONT_STACK};">{t["fig1_title"]}</h4>',
            '<svg width="100%" height="210" viewBox="0 0 680 210" xmlns="http://www.w3.org/2000/svg">',
            '<rect width="680" height="210" fill="#FFFFFF" rx="8" stroke="#E2E8F0" stroke-width="1"/>'
        ]

        # Gridlines
        for i, grid_y in enumerate([40, 75, 110, 145]):
            svg.append(f'<line x1="55" y1="{grid_y}" x2="640" y2="{grid_y}" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="4 4"/>')

        # Axis Lines
        svg.append('<line x1="55" y1="170" x2="640" y2="170" stroke="#475569" stroke-width="1.5"/>')
        svg.append('<line x1="55" y1="30" x2="55" y2="170" stroke="#475569" stroke-width="1.5"/>')

        # Y-axis labels
        for i in range(5):
            val_step = (max_val / 4.0) * (4 - i)
            y_pos = 40 + i * 31.25
            svg.append(f'<text x="48" y="{y_pos + 4}" text-anchor="end" font-size="8.5" fill="#64748B" font-family="{FONT_STACK}">₹{val_step:.1f}{unit}</text>')

        # Bars
        bar_group_width = 112
        start_x = 80

        for i in range(min(5, len(projections))):
            rev = revenues[i]
            pat = pats[i]
            
            rev_h = max(int((rev / max_val) * 125), 8) if max_val > 0 else 10
            pat_h = max(int((pat / max_val) * 125), 5) if max_val > 0 else 5

            x_rev = start_x + i * bar_group_width
            x_pat = x_rev + 32

            y_rev = 170 - rev_h
            y_pat = 170 - pat_h

            # Revenue Bar
            svg.append(f'<rect x="{x_rev}" y="{y_rev}" width="28" height="{rev_h}" fill="#008C95" rx="3"/>')
            svg.append(f'<text x="{x_rev + 14}" y="{y_rev - 5}" text-anchor="middle" font-size="8.5" font-weight="700" fill="#0F766E" font-family="{FONT_STACK}">₹{rev:.1f}{unit}</text>')

            # PAT Bar
            svg.append(f'<rect x="{x_pat}" y="{y_pat}" width="28" height="{pat_h}" fill="#10B981" rx="3"/>')
            svg.append(f'<text x="{x_pat + 14}" y="{y_pat - 5}" text-anchor="middle" font-size="8.5" font-weight="700" fill="#047857" font-family="{FONT_STACK}">₹{pat:.1f}{unit}</text>')

            # X-label
            svg.append(f'<text x="{x_rev + 30}" y="188" text-anchor="middle" font-size="9" font-weight="700" fill="#1E293B" font-family="{FONT_STACK}">{years[i]}</text>')

        # Legend
        svg.append('<rect x="200" y="10" width="12" height="12" fill="#008C95" rx="2"/>')
        svg.append(f'<text x="218" y="20" font-size="9" font-weight="700" fill="#334155" font-family="{FONT_STACK}">{t["gross_rev"]}</text>')
        svg.append('<rect x="360" y="10" width="12" height="12" fill="#10B981" rx="2"/>')
        svg.append(f'<text x="378" y="20" font-size="9" font-weight="700" fill="#334155" font-family="{FONT_STACK}">{t["net_profit"]}</text>')

        svg.append('</svg></div>')
        return "".join(svg)

    @classmethod
    def render_means_of_finance_chart(cls, total_cost: float, bank_loan: float, promoter_contribution: float, subsidy: float = 0, lang: str = 'en') -> str:
        """Renders Means of Finance Donut/Pie Chart"""
        t = cls._get_i18n(lang)
        total = max(total_cost, bank_loan + promoter_contribution + subsidy, 1.0)
        
        promoter_pct = round((promoter_contribution / total) * 100, 1)
        loan_pct = round((bank_loan / total) * 100, 1)
        subsidy_pct = round((subsidy / total) * 100, 1) if subsidy > 0 else round(max(0, 100 - promoter_pct - loan_pct), 1)
        unit = t['unit_lakh']

        svg = [
            '<div style="margin: 16px 0; padding: 14px; background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 10px;">',
            f'<h4 style="font-size: 10pt; font-weight: 800; color: #0F172A; margin-bottom: 12px; text-align: center; font-family: {FONT_STACK};">{t["fig2_title"]}</h4>',
            '<svg width="100%" height="185" viewBox="0 0 680 185" xmlns="http://www.w3.org/2000/svg">',
            '<rect width="680" height="185" fill="#FFFFFF" rx="8" stroke="#E2E8F0" stroke-width="1"/>',
            
            # Donut Graphic Representation
            '<circle cx="150" cy="92" r="62" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="2"/>',
            '<circle cx="150" cy="92" r="62" fill="transparent" stroke="#008C95" stroke-width="24" stroke-dasharray="245 160" stroke-dashoffset="0"/>',
            '<circle cx="150" cy="92" r="62" fill="transparent" stroke="#FF7A00" stroke-width="24" stroke-dasharray="140 265" stroke-dashoffset="-245"/>',
            '<circle cx="150" cy="92" r="36" fill="#FFFFFF"/>',
            f'<text x="150" y="88" text-anchor="middle" font-size="9.5" font-weight="800" fill="#0F172A" font-family="{FONT_STACK}">{t["total"]}</text>',
            f'<text x="150" y="102" text-anchor="middle" font-size="9" font-weight="700" fill="#008C95" font-family="{FONT_STACK}">₹{(total/100000):.1f}{unit}</text>',

            # Right Summary Legend Cards
            '<g transform="translate(270, 20)">',
            '<rect x="0" y="0" width="380" height="42" fill="#F0FDFA" rx="6" stroke="#CCFBF1"/>',
            '<rect x="12" y="13" width="16" height="16" fill="#008C95" rx="3"/>',
            f'<text x="38" y="25" font-size="9.5" font-weight="800" fill="#0F172A" font-family="{FONT_STACK}">{t["promoter_title"]}</text>',
            f'<text x="38" y="36" font-size="8.5" fill="#64748B" font-family="{FONT_STACK}">₹{format_inr(promoter_contribution)} ({promoter_pct}%)</text>',

            '<rect x="0" y="50" width="380" height="42" fill="#FFF7ED" rx="6" stroke="#FFEDD5"/>',
            '<rect x="12" y="63" width="16" height="16" fill="#FF7A00" rx="3"/>',
            f'<text x="38" y="75" font-size="9.5" font-weight="800" fill="#0F172A" font-family="{FONT_STACK}">{t["loan_title"]}</text>',
            f'<text x="38" y="86" font-size="8.5" fill="#64748B" font-family="{FONT_STACK}">₹{format_inr(bank_loan)} ({loan_pct}%)</text>',

            '<rect x="0" y="100" width="380" height="42" fill="#EFF6FF" rx="6" stroke="#DBEAFE"/>',
            '<rect x="12" y="113" width="16" height="16" fill="#2563EB" rx="3"/>',
            f'<text x="38" y="125" font-size="9.5" font-weight="800" fill="#0F172A" font-family="{FONT_STACK}">{t["subsidy_title"]}</text>',
            f'<text x="38" y="136" font-size="8.5" fill="#64748B" font-family="{FONT_STACK}">₹{format_inr(subsidy)} ({subsidy_pct}%)</text>',
            '</g>',

            '</svg></div>'
        ]
        return "".join(svg)

    @classmethod
    def render_dscr_trend_chart(cls, projections: List[Dict[str, Any]], lang: str = 'en') -> str:
        """Renders 5-Year DSCR Trend Line Graph with 1.25x Bank Threshold"""
        t = cls._get_i18n(lang)

        if not projections:
            projections = [
                {"year": 1, "dscr": 1.45},
                {"year": 2, "dscr": 1.62},
                {"year": 3, "dscr": 1.85},
                {"year": 4, "dscr": 2.10},
                {"year": 5, "dscr": 2.35},
            ]

        years = [f"{t['yr_prefix']} {p.get('year', i+1)}" for i, p in enumerate(projections[:5])]
        dscrs = [float(p.get('dscr', 1.5)) for p in projections[:5]]
        
        svg = [
            '<div style="margin: 16px 0; padding: 14px; background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 10px;">',
            f'<h4 style="font-size: 10pt; font-weight: 800; color: #0F172A; margin-bottom: 12px; text-align: center; font-family: {FONT_STACK};">{t["fig3_title"]}</h4>',
            '<svg width="100%" height="195" viewBox="0 0 680 195" xmlns="http://www.w3.org/2000/svg">',
            '<rect width="680" height="195" fill="#FFFFFF" rx="8" stroke="#E2E8F0" stroke-width="1"/>',

            # 1.25x Benchmark Safety Line
            '<line x1="60" y1="120" x2="630" y2="120" stroke="#EF4444" stroke-width="2" stroke-dasharray="6 4"/>',
            f'<text x="632" y="123" font-size="8.5" font-weight="800" fill="#EF4444" font-family="{FONT_STACK}">{t["safety_line"]}</text>',

            # Grid lines
            '<line x1="60" y1="155" x2="630" y2="155" stroke="#E2E8F0" stroke-width="1"/>',
            '<line x1="60" y1="85" x2="630" y2="85" stroke="#E2E8F0" stroke-width="1"/>',
            '<line x1="60" y1="45" x2="630" y2="45" stroke="#E2E8F0" stroke-width="1"/>',
            '<line x1="60" y1="30" x2="60" y2="155" stroke="#475569" stroke-width="1.5"/>',
            '<line x1="60" y1="155" x2="630" y2="155" stroke="#475569" stroke-width="1.5"/>',
        ]

        # Y-axis labels
        svg.append(f'<text x="52" y="158" text-anchor="end" font-size="8.5" fill="#64748B" font-family="{FONT_STACK}">1.0x</text>')
        svg.append(f'<text x="52" y="123" text-anchor="end" font-size="8.5" fill="#EF4444" font-weight="700" font-family="{FONT_STACK}">1.25x</text>')
        svg.append(f'<text x="52" y="88" text-anchor="end" font-size="8.5" fill="#64748B" font-family="{FONT_STACK}">1.75x</text>')
        svg.append(f'<text x="52" y="48" text-anchor="end" font-size="8.5" fill="#64748B" font-family="{FONT_STACK}">2.25x</text>')

        # Points calculation
        points = []
        for i, d in enumerate(dscrs):
            x = 115 + i * 115
            y = int(155 - ((d - 1.0) / 1.3) * 85)
            y = max(35, min(150, y))
            points.append((x, y, d, years[i]))

        # Connect points with smooth line
        poly_str = " ".join([f"{pt[0]},{pt[1]}" for pt in points])
        svg.append(f'<polyline points="{poly_str}" fill="none" stroke="#008C95" stroke-width="3.5" stroke-linecap="round"/>')

        # Draw data circles and labels
        for pt in points:
            svg.append(f'<circle cx="{pt[0]}" cy="{pt[1]}" r="6" fill="#008C95" stroke="#FFFFFF" stroke-width="2"/>')
            svg.append(f'<text x="{pt[0]}" y="{pt[1]-10}" text-anchor="middle" font-size="9" font-weight="800" fill="#0F766E" font-family="{FONT_STACK}">{pt[2]:.2f}x</text>')
            svg.append(f'<text x="{pt[0]}" y="174" text-anchor="middle" font-size="9" font-weight="700" fill="#334155" font-family="{FONT_STACK}">{pt[3]}</text>')

        svg.append('</svg></div>')
        return "".join(svg)

    @classmethod
    def render_chart_svg(cls, chart_ref: Dict[str, Any], financial_summary: Dict[str, Any], lang: str = 'en') -> str:
        """Fallback compatibility method"""
        return cls.render_financial_trend_chart([], lang=lang)
