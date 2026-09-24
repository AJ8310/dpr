from typing import Dict, Any, List

class TableRenderer:
    """
    Renders structured JSON table domain objects into HTML and Word table formats.
    """

    @staticmethod
    def render_table_html(table_data: Dict[str, Any]) -> str:
        title = table_data.get("title", "Financial Table")
        cols = table_data.get("columns", [])
        rows = table_data.get("rows", [])

        html = [f"<h4 style='margin-top:15px; margin-bottom:5px; color:#1e293b;'>{title}</h4>"]
        html.append("<table class='dpr-table'><thead><tr>")
        for c in cols:
            html.append(f"<th>{c}</th>")
        html.append("</tr></thead><tbody>")

        for r in rows:
            html.append("<tr>")
            for val in r:
                html.append(f"<td>{val}</td>")
            html.append("</tr>")

        html.append("</tbody></table>")
        return "".join(html)
