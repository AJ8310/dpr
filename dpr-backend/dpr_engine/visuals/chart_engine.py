import os
import matplotlib
matplotlib.use('Agg')  # Non-interactive background rendering
import matplotlib.pyplot as plt
from typing import Dict, Any
from dpr_engine.data_model import DPRDocumentModel

class DeterministicChartEngine:

    @classmethod
    def generate_all_charts(cls, doc: DPRDocumentModel, upload_dir: str) -> Dict[str, str]:
        charts_dir = os.path.join(upload_dir, "charts")
        os.makedirs(charts_dir, exist_ok=True)
        chart_paths: Dict[str, str] = {}

        plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
        plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
        plt.rcParams['figure.autolayout'] = True

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
                years = [f"Yr {p.year}" for p in doc.projections]
                revenues = [p.revenue / 100000.0 for p in doc.projections]  # in ₹ Lakhs
                ebitdas = [p.ebitda / 100000.0 for p in doc.projections]
                pats = [p.pat / 100000.0 for p in doc.projections]

                x = list(range(len(years)))
                width = 0.26

                b1 = ax.bar([i - width for i in x], revenues, width=width, label='Revenue (₹ Lakhs)', color=c_revenue)
                b2 = ax.bar(x, ebitdas, width=width, label='EBITDA (₹ Lakhs)', color=c_ebitda)
                b3 = ax.bar([i + width for i in x], pats, width=width, label='PAT - Net Profit (₹ Lakhs)', color=c_pat)

                # Add value annotations on top of bars
                for b in b1:
                    h = b.get_height()
                    if h > 0:
                        ax.annotate(f"₹{h:,.1f}L", (b.get_x() + b.get_width() / 2., h),
                                    xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=7.5, fontweight='bold', color='#047857')
                for b in b2:
                    h = b.get_height()
                    if h > 0:
                        ax.annotate(f"₹{h:,.1f}L", (b.get_x() + b.get_width() / 2., h),
                                    xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=7.5, fontweight='bold', color='#1E3A8A')
                for b in b3:
                    h = b.get_height()
                    if h > 0:
                        ax.annotate(f"₹{h:,.1f}L", (b.get_x() + b.get_width() / 2., h),
                                    xytext=(0, 3), textcoords="offset points", ha='center', va='bottom', fontsize=7.5, fontweight='bold', color='#B45309')

                ax.set_ylabel('Financial Amount (₹ in Lakhs)', fontsize=10, fontweight='bold', color=c_navy)
                ax.set_title('5-Year Projected Revenue, EBITDA & Profit Trajectory', fontsize=12.5, fontweight='bold', color=c_navy, pad=14)
                ax.set_xticks(x)
                ax.set_xticklabels(years, fontsize=9.5, fontweight='bold')
                ax.legend(fontsize=9, loc='upper left', frameon=True)
                ax.set_ylim(bottom=0, top=max(revenues) * 1.22 if revenues else 100)

                c_path = os.path.join(charts_dir, f"rev_ebitda_{doc.job_id or 'demo'}.png")
                plt.savefig(c_path, bbox_inches='tight', dpi=300)
                plt.close(fig)
                chart_paths["revenue_ebitda"] = c_path
            except Exception as e:
                print(f"Chart gen error revenue_ebitda: {e}")

        # 2. Project Cost Breakdown (CAPEX Composition) Donut Chart with Multi-Color Slices
        try:
            fig, ax = plt.subplots(figsize=(9.2, 4.3), dpi=300)
            labels = ['Land & Site', 'Building Shed', 'Plant & Machinery', 'Electrification', 'Furniture & Office', 'Working Capital', 'Pre-operative']
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
                filtered = [("Plant Setup", 1.0)]
            
            f_labels, f_values = zip(*filtered)
            total_capex = sum(f_values)
            pie_colors = multi_pie_colors[:len(f_labels)]

            legend_entries = [
                f"{lbl} — ₹{val/100000.0:,.1f}L ({(val/total_capex)*100.0:.1f}%)"
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

            ax.legend(wedges, legend_entries, title="CAPEX Expenditure Heads", loc="center left", bbox_to_anchor=(1.0, 0.5), fontsize=8.5, frameon=True)
            ax.set_title('Capital Expenditure (CAPEX) Composition Breakdown', fontsize=12, fontweight='bold', color=c_navy, pad=14)

            c_path = os.path.join(charts_dir, f"capex_pie_{doc.job_id or 'demo'}.png")
            plt.savefig(c_path, bbox_inches='tight', dpi=300)
            plt.close(fig)
            chart_paths["capex_pie"] = c_path
        except Exception as e:
            print(f"Chart gen error capex_pie: {e}")

        # 3. Means of Finance Composition Donut Chart with Multi-Color Slices
        try:
            fig, ax = plt.subplots(figsize=(9.2, 4.3), dpi=300)
            labels = ['Promoter Equity', 'Bank Term Loan', 'Subsidy Claim']
            values = [doc.promoter_contribution or 1.0, doc.bank_loan or 1.0, doc.subsidy or 0.0]
            
            filtered = [(l, v) for l, v in zip(labels, values) if v > 0]
            f_labels, f_values = zip(*filtered)
            total_fin = sum(f_values)
            fin_colors = ['#1E3A8A', '#2563EB', '#059669'][:len(f_labels)]

            legend_entries = [
                f"{lbl} — ₹{val/100000.0:,.1f}L ({(val/total_fin)*100.0:.1f}%)"
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

            ax.legend(wedges, legend_entries, title="Funding Structure", loc="center left", bbox_to_anchor=(1.0, 0.5), fontsize=9, frameon=True)
            ax.set_title('Means of Finance Capital Structure Breakdown', fontsize=12, fontweight='bold', color=c_navy, pad=14)

            c_path = os.path.join(charts_dir, f"finance_pie_{doc.job_id or 'demo'}.png")
            plt.savefig(c_path, bbox_inches='tight', dpi=300)
            plt.close(fig)
            chart_paths["finance_pie"] = c_path
        except Exception as e:
            print(f"Chart gen error finance_pie: {e}")

        # 4. Debt Service Coverage Ratio (DSCR) Line & Area Chart (Multi-Color Gradient)
        if doc.projections and len(doc.projections) >= 5:
            try:
                fig, ax = plt.subplots(figsize=(9.5, 4.2), dpi=300)
                years = [f"Yr {p.year}" for p in doc.projections]
                dscrs = [p.dscr for p in doc.projections]

                ax.plot(years, dscrs, marker='o', markersize=8, markerfacecolor=c_pat, markeredgecolor=c_navy, linewidth=3.2, color=c_blue, label='Projected DSCR Ratio')
                ax.fill_between(years, dscrs, 1.50, color='#3B82F6', alpha=0.15, label='DSCR Cushion above Benchmark')
                ax.axhline(y=1.50, color=c_red, linestyle='--', linewidth=2.0, label='Bank Lending Benchmark (1.50)')

                for i, d in enumerate(dscrs):
                    ax.annotate(f"{d:.2f}", (years[i], d), xytext=(0, 10), textcoords="offset points", ha='center', fontsize=9.5, fontweight='bold', color=c_navy)

                ax.set_ylabel('DSCR Ratio', fontsize=10, fontweight='bold', color=c_navy)
                ax.set_title('5-Year Debt Service Coverage Ratio (DSCR) Trajectory', fontsize=12.5, fontweight='bold', color=c_navy, pad=14)
                ax.set_ylim(bottom=1.0, top=max(dscrs) * 1.25 if dscrs else 3.5)
                ax.legend(fontsize=9, loc='upper left', frameon=True)

                c_path = os.path.join(charts_dir, f"dscr_curve_{doc.job_id or 'demo'}.png")
                plt.savefig(c_path, bbox_inches='tight', dpi=300)
                plt.close(fig)
                chart_paths["dscr_curve"] = c_path
            except Exception as e:
                print(f"Chart gen error dscr_curve: {e}")

        doc.chart_paths = chart_paths
        return chart_paths
