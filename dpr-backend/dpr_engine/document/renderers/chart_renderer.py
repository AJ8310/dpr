from typing import Dict, Any, List

class ChartRenderer:
    """
    Renders structured chart references into vector SVG graphics for embedded HTML & PDF documents.
    """

    @staticmethod
    def render_financial_trend_chart(projections: List[Dict[str, Any]]) -> str:
        """Renders 5-Year Projected Revenue & Net Profit Bar Chart"""
        if not projections:
            projections = [
                {"year": 1, "revenue": 15000000, "pat": 1800000},
                {"year": 2, "revenue": 21000000, "pat": 2800000},
                {"year": 3, "revenue": 28000000, "pat": 4200000},
                {"year": 4, "revenue": 35000000, "pat": 5800000},
                {"year": 5, "revenue": 42000000, "pat": 7500000},
            ]

        years = [f"Year {p.get('year', i+1)}" for i, p in enumerate(projections[:5])]
        revenues = [float(p.get('revenue', 0)) / 100000.0 for p in projections[:5]]  # in ₹ Lakhs
        pats = [float(p.get('pat', 0)) / 100000.0 for p in projections[:5]]  # in ₹ Lakhs

        max_val = max(max(revenues, default=100.0), 10.0)
        
        svg = [
            '<div style="margin: 16px 0; padding: 14px; background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 10px;">',
            '<h4 style="font-size: 10pt; font-weight: 800; color: #0F172A; margin-bottom: 12px; text-align: center;">FIGURE 1: 5-YEAR PROJECTED REVENUE & NET PROFIT (PAT) TREND (₹ LAKHS)</h4>',
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
            svg.append(f'<text x="48" y="{y_pos + 4}" text-anchor="end" font-size="8.5" fill="#64748B" font-family="Inter, sans-serif">₹{val_step:.1f}L</text>')

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
            svg.append(f'<text x="{x_rev + 14}" y="{y_rev - 5}" text-anchor="middle" font-size="8.5" font-weight="700" fill="#0F766E">₹{rev:.1f}L</text>')

            # PAT Bar
            svg.append(f'<rect x="{x_pat}" y="{y_pat}" width="28" height="{pat_h}" fill="#10B981" rx="3"/>')
            svg.append(f'<text x="{x_pat + 14}" y="{y_pat - 5}" text-anchor="middle" font-size="8.5" font-weight="700" fill="#047857">₹{pat:.1f}L</text>')

            # X-label
            svg.append(f'<text x="{x_rev + 30}" y="188" text-anchor="middle" font-size="9" font-weight="700" fill="#1E293B">{years[i]}</text>')

        # Legend
        svg.append('<rect x="230" y="10" width="12" height="12" fill="#008C95" rx="2"/>')
        svg.append('<text x="248" y="20" font-size="9" font-weight="700" fill="#334155">Gross Revenue</text>')
        svg.append('<rect x="360" y="10" width="12" height="12" fill="#10B981" rx="2"/>')
        svg.append('<text x="378" y="20" font-size="9" font-weight="700" fill="#334155">Net Profit (PAT)</text>')

        svg.append('</svg></div>')
        return "".join(svg)

    @staticmethod
    def render_means_of_finance_chart(total_cost: float, bank_loan: float, promoter_contribution: float, subsidy: float = 0) -> str:
        """Renders Means of Finance Donut/Pie Chart"""
        total = max(total_cost, bank_loan + promoter_contribution + subsidy, 1.0)
        
        promoter_pct = round((promoter_contribution / total) * 100, 1)
        loan_pct = round((bank_loan / total) * 100, 1)
        subsidy_pct = round((subsidy / total) * 100, 1) if subsidy > 0 else round(max(0, 100 - promoter_pct - loan_pct), 1)

        svg = [
            '<div style="margin: 16px 0; padding: 14px; background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 10px;">',
            '<h4 style="font-size: 10pt; font-weight: 800; color: #0F172A; margin-bottom: 12px; text-align: center;">FIGURE 2: CAPITAL STRUCTURE & MEANS OF FINANCE BREAKDOWN</h4>',
            '<svg width="100%" height="185" viewBox="0 0 680 185" xmlns="http://www.w3.org/2000/svg">',
            '<rect width="680" height="185" fill="#FFFFFF" rx="8" stroke="#E2E8F0" stroke-width="1"/>',
            
            # Donut Graphic Representation
            '<circle cx="150" cy="92" r="62" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="2"/>',
            '<circle cx="150" cy="92" r="62" fill="transparent" stroke="#008C95" stroke-width="24" stroke-dasharray="245 160" stroke-dashoffset="0"/>',
            '<circle cx="150" cy="92" r="62" fill="transparent" stroke="#FF7A00" stroke-width="24" stroke-dasharray="140 265" stroke-dashoffset="-245"/>',
            '<circle cx="150" cy="92" r="36" fill="#FFFFFF"/>',
            '<text x="150" y="88" text-anchor="middle" font-size="9.5" font-weight="800" fill="#0F172A">TOTAL</text>',
            f'<text x="150" y="102" text-anchor="middle" font-size="9" font-weight="700" fill="#008C95">₹{(total/100000):.1f}L</text>',

            # Right Summary Legend Cards
            '<g transform="translate(290, 20)">',
            '<rect x="0" y="0" width="350" height="42" fill="#F0FDFA" rx="6" stroke="#CCFBF1"/>',
            '<rect x="12" y="13" width="16" height="16" fill="#008C95" rx="3"/>',
            '<text x="38" y="25" font-size="9.5" font-weight="800" fill="#0F172A">Promoter Margin Equity Contribution</text>',
            f'<text x="38" y="36" font-size="8.5" fill="#64748B">₹{promoter_contribution:,.0f} ({promoter_pct}%)</text>',

            '<rect x="0" y="50" width="350" height="42" fill="#FFF7ED" rx="6" stroke="#FFEDD5"/>',
            '<rect x="12" y="63" width="16" height="16" fill="#FF7A00" rx="3"/>',
            '<text x="38" y="75" font-size="9.5" font-weight="800" fill="#0F172A">Bank Debt / Term Loan Sanction</text>',
            f'<text x="38" y="86" font-size="8.5" fill="#64748B">₹{bank_loan:,.0f} ({loan_pct}%)</text>',

            '<rect x="0" y="100" width="350" height="42" fill="#EFF6FF" rx="6" stroke="#DBEAFE"/>',
            '<rect x="12" y="113" width="16" height="16" fill="#2563EB" rx="3"/>',
            '<text x="38" y="125" font-size="9.5" font-weight="800" fill="#0F172A">Government Scheme Capital Subsidy</text>',
            f'<text x="38" y="136" font-size="8.5" fill="#64748B">₹{subsidy:,.0f} ({subsidy_pct}%)</text>',
            '</g>',

            '</svg></div>'
        ]
        return "".join(svg)

    @staticmethod
    def render_dscr_trend_chart(projections: List[Dict[str, Any]]) -> str:
        """Renders 5-Year DSCR Trend Line Graph with 1.25x Bank Threshold"""
        if not projections:
            projections = [
                {"year": 1, "dscr": 1.45},
                {"year": 2, "dscr": 1.62},
                {"year": 3, "dscr": 1.85},
                {"year": 4, "dscr": 2.10},
                {"year": 5, "dscr": 2.35},
            ]

        years = [f"Year {p.get('year', i+1)}" for i, p in enumerate(projections[:5])]
        dscrs = [float(p.get('dscr', 1.5)) for p in projections[:5]]
        
        svg = [
            '<div style="margin: 16px 0; padding: 14px; background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 10px;">',
            '<h4 style="font-size: 10pt; font-weight: 800; color: #0F172A; margin-bottom: 12px; text-align: center;">FIGURE 3: 5-YEAR DEBT SERVICE COVERAGE RATIO (DSCR) vs. 1.25x BANK BENCHMARK</h4>',
            '<svg width="100%" height="195" viewBox="0 0 680 195" xmlns="http://www.w3.org/2000/svg">',
            '<rect width="680" height="195" fill="#FFFFFF" rx="8" stroke="#E2E8F0" stroke-width="1"/>',

            # 1.25x Benchmark Safety Line
            '<line x1="60" y1="120" x2="630" y2="120" stroke="#EF4444" stroke-width="2" stroke-dasharray="6 4"/>',
            '<text x="632" y="123" font-size="8.5" font-weight="800" fill="#EF4444">1.25x Min Bank Safety Line</text>',

            # Grid lines
            '<line x1="60" y1="155" x2="630" y2="155" stroke="#E2E8F0" stroke-width="1"/>',
            '<line x1="60" y1="85" x2="630" y2="85" stroke="#E2E8F0" stroke-width="1"/>',
            '<line x1="60" y1="45" x2="630" y2="45" stroke="#E2E8F0" stroke-width="1"/>',
            '<line x1="60" y1="30" x2="60" y2="155" stroke="#475569" stroke-width="1.5"/>',
            '<line x1="60" y1="155" x2="630" y2="155" stroke="#475569" stroke-width="1.5"/>',
        ]

        # Y-axis labels
        svg.append('<text x="52" y="158" text-anchor="end" font-size="8.5" fill="#64748B">1.0x</text>')
        svg.append('<text x="52" y="123" text-anchor="end" font-size="8.5" fill="#EF4444" font-weight="700">1.25x</text>')
        svg.append('<text x="52" y="88" text-anchor="end" font-size="8.5" fill="#64748B">1.75x</text>')
        svg.append('<text x="52" y="48" text-anchor="end" font-size="8.5" fill="#64748B">2.25x</text>')

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
            svg.append(f'<text x="{pt[0]}" y="{pt[1]-10}" text-anchor="middle" font-size="9" font-weight="800" fill="#0F766E">{pt[2]:.2f}x</text>')
            svg.append(f'<text x="{pt[0]}" y="174" text-anchor="middle" font-size="9" font-weight="700" fill="#334155">{pt[3]}</text>')

        svg.append('</svg></div>')
        return "".join(svg)

    @staticmethod
    def render_chart_svg(chart_ref: Dict[str, Any], financial_summary: Dict[str, Any]) -> str:
        """Fallback compatibility method"""
        return ChartRenderer.render_financial_trend_chart([])

