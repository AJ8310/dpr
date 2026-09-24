from typing import Dict, Any, Optional

class ImageRenderer:
    """
    Resolves image assets & renders fallback visual frames.
    """

    @staticmethod
    def render_image_html(image_ref: Dict[str, Any]) -> str:
        caption = image_ref.get("caption", "Project Facility Layout")
        return f"""
        <div style="text-align: center; margin: 20px 0;">
            <div style="background-color: #f1f5f9; border: 1px dashed #cbd5e1; padding: 30px; border-radius: 8px; color: #64748b; font-size: 10pt;">
                📷 [Facility & Machinery Asset View: {caption}]
            </div>
            <p style="font-size: 8.5pt; color: #64748b; margin-top: 6px;">Figure: {caption}</p>
        </div>
        """
