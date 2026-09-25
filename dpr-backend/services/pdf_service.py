import os
import asyncio
from typing import Dict, Any, Optional
from dpr_engine.data_model import DPRDocumentModel
from dpr_engine.templates.template_engine import DPRTemplateCompositionEngine

def _generate_pdf_sync(html_content: str, output_path: str) -> str:
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
        )
        page = browser.new_page()
        page.set_content(html_content, wait_until="load", timeout=15000)
        page.pdf(
            path=output_path,
            format="A4",
            print_background=True,
            margin={"top": "0in", "right": "0in", "bottom": "0in", "left": "0in"}
        )
        browser.close()
    return output_path

class PDFService:

    @classmethod
    def render_html_report(cls, data: Dict[str, Any], template_dir: str) -> str:
        try:
            doc = DPRDocumentModel.model_validate(data)
        except Exception as e:
            safe_msg = str(e).encode('ascii', 'ignore').decode('ascii')
            print(f"Pydantic model validation fallback: {safe_msg}")
            doc = DPRDocumentModel()
            for k, v in data.items():
                if hasattr(doc, k):
                    try:
                        setattr(doc, k, v)
                    except Exception:
                        pass
        return DPRTemplateCompositionEngine.compose_html_document(doc, template_dir)

    @classmethod
    async def generate_pdf(cls, data: Dict[str, Any], template_dir: str, output_path: str) -> str:
        html_content = cls.render_html_report(data, template_dir)
        
        # Save temporary HTML file
        html_path = output_path.replace(".pdf", ".html")
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html_content)

        try:
            from playwright.async_api import async_playwright
            async with async_playwright() as p:
                browser = await p.chromium.launch(
                    headless=True,
                    args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
                )
                page = await browser.new_page(viewport={"width": 1280, "height": 1024})
                await page.set_content(html_content, wait_until="load", timeout=15000)
                await page.pdf(
                    path=output_path,
                    format="A4",
                    print_background=True,
                    margin={"top": "0in", "right": "0in", "bottom": "0in", "left": "0in"}
                )
                await browser.close()
            return output_path
        except Exception as e:
            safe_msg = str(e).encode('ascii', 'ignore').decode('ascii')
            print(f"Async Playwright PDF compilation warning: {safe_msg}")
            try:
                pdf_path = await asyncio.to_thread(_generate_pdf_sync, html_content, output_path)
                return pdf_path
            except Exception as e2:
                print(f"Sync Playwright PDF compilation error: {e2}")
                if os.path.exists(output_path):
                    return output_path
                raise RuntimeError(f"Playwright PDF generation failed: {e2}")
