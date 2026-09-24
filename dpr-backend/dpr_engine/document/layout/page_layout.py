from typing import Dict, Any

class DocumentTheme:
    """
    Centralized Document Design System defining page size (A4), margins (1 in / 25.4mm),
    typography hierarchy, brand palette, table borders, and header/footer rules.
    """

    PAGE_SIZE = "A4"
    MARGIN_TOP = "2.5cm"
    MARGIN_BOTTOM = "2.5cm"
    MARGIN_LEFT = "2.0cm"
    MARGIN_RIGHT = "2.0cm"

    PRIMARY_COLOR = "#0f172a"      # Slate 900
    ACCENT_COLOR = "#2563eb"       # Royal Blue 600
    TEXT_COLOR = "#334155"         # Slate 700
    BG_LIGHT = "#f8fafc"           # Slate 50
    BORDER_COLOR = "#e2e8f0"       # Slate 200

    PRIMARY_FONT = "Inter, 'Helvetica Neue', Arial, sans-serif"
    HEADING_FONT = "Inter, 'Helvetica Neue', Arial, sans-serif"

    @classmethod
    def get_css(cls) -> str:
        return f"""
        @page {{
            size: {cls.PAGE_SIZE} portrait;
            margin-top: {cls.MARGIN_TOP};
            margin-bottom: {cls.MARGIN_BOTTOM};
            margin-left: {cls.MARGIN_LEFT};
            margin-right: {cls.MARGIN_RIGHT};
            @bottom-right {{
                content: "Page " counter(page) " of " counter(pages);
                font-family: {cls.PRIMARY_FONT};
                font-size: 8pt;
                color: #94a3b8;
            }}
            @bottom-left {{
                content: "CONFIDENTIAL — VISION KARNATAKA FOUNDATION";
                font-family: {cls.PRIMARY_FONT};
                font-size: 8pt;
                color: #94a3b8;
            }}
        }}
        body {{
            font-family: {cls.PRIMARY_FONT};
            color: {cls.TEXT_COLOR};
            font-size: 10pt;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }}
        h1, h2, h3, h4 {{
            font-family: {cls.HEADING_FONT};
            color: {cls.PRIMARY_COLOR};
            font-weight: 700;
            page-break-after: avoid;
        }}
        h1 {{ font-size: 20pt; margin-top: 1.5em; margin-bottom: 0.5em; border-bottom: 2px solid {cls.ACCENT_COLOR}; padding-bottom: 4px; }}
        h2 {{ font-size: 15pt; margin-top: 1.2em; margin-bottom: 0.4em; color: {cls.ACCENT_COLOR}; }}
        h3 {{ font-size: 12pt; margin-top: 1.0em; margin-bottom: 0.3em; }}
        p {{ margin-top: 0; margin-bottom: 0.8em; text-align: justify; }}
        .cover-page {{
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            page-break-after: always;
            box-sizing: border-box;
            padding: 40px 0;
        }}
        .cover-title {{ font-size: 26pt; font-weight: 800; color: {cls.PRIMARY_COLOR}; margin-bottom: 8px; }}
        .cover-subtitle {{ font-size: 14pt; color: {cls.ACCENT_COLOR}; font-weight: 600; margin-bottom: 30px; }}
        .doc-control {{ page-break-after: always; margin-top: 20px; }}
        .dpr-table {{
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 9pt;
            page-break-inside: avoid;
        }}
        .dpr-table th {{
            background-color: {cls.PRIMARY_COLOR};
            color: #ffffff;
            font-weight: 600;
            padding: 8px 12px;
            text-align: left;
        }}
        .dpr-table td {{
            padding: 7px 12px;
            border-bottom: 1px solid {cls.BORDER_COLOR};
        }}
        .dpr-table tr:nth-child(even) {{ background-color: {cls.BG_LIGHT}; }}
        .callout-box {{
            background-color: #eff6ff;
            border-left: 4px solid {cls.ACCENT_COLOR};
            padding: 12px 16px;
            margin: 15px 0;
            border-radius: 0 4px 4px 0;
            font-size: 9.5pt;
        }}
        .chart-box {{ text-align: center; margin: 20px 0; page-break-inside: avoid; }}
        .chart-svg {{ max-width: 100%; height: auto; }}
        .page-break {{ page-break-before: always; }}
        """
