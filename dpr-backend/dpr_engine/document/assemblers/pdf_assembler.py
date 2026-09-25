import os
from typing import Dict, Any
from playwright.async_api import async_playwright

class PDFAssembler:
    """
    Renders standalone HTML into production A4 PDF document using Chromium browser.
    """

    @classmethod
    async def assemble_pdf_from_html(cls, html_content: str, output_filepath: str) -> Dict[str, Any]:
        os.makedirs(os.path.dirname(output_filepath), exist_ok=True)

        CHROMIUM_FLAGS = [
            "--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage",
            "--disable-gpu", "--no-zygote", "--single-process", "--disable-extensions"
        ]
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                args=CHROMIUM_FLAGS
            )
            page = await browser.new_page()

            try:
                await page.set_content(html_content, wait_until="load", timeout=15000)
                pdf_bytes = await page.pdf(
                    format="A4",
                    print_background=True,
                    margin={"top": "0.25in", "bottom": "0.25in", "left": "0.25in", "right": "0.25in"}
                )
                with open(output_filepath, "wb") as f:
                    f.write(pdf_bytes)
            finally:
                await browser.close()

        file_size = os.path.getsize(output_filepath)
        return {"output_filepath": output_filepath, "file_size_bytes": file_size}
