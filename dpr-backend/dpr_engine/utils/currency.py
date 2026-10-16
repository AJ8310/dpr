"""
Indian Financial Formatting Utilities.
Conforms strictly to the Indian numbering system (Lakhs and Crores).
Eliminates Western Millions, Billions, M, and B.
"""

from typing import Union

def format_inr(val: Union[int, float, str, None], decimals: int = 2, trim_trailing_zeros: bool = True) -> str:
    """
    Formats a number into Indian standard comma grouping (e.g. 12,34,567.89).
    Grouping rule: Last 3 digits grouped, then groups of 2 digits.
    """
    if val is None or val == "":
        return "0"
    try:
        val = float(val)
    except (ValueError, TypeError):
        return str(val)

    is_int = (val % 1 == 0) and trim_trailing_zeros
    if is_int:
        s = f"{int(round(val))}"
        integer_part = s
        dec_part = ""
    else:
        s = f"{val:.{decimals}f}"
        parts = s.split('.')
        integer_part = parts[0]
        dec_part = parts[1] if len(parts) > 1 else ""

    negative = integer_part.startswith('-')
    if negative:
        integer_part = integer_part[1:]

    if len(integer_part) > 3:
        last3 = integer_part[-3:]
        rest = integer_part[:-3]
        groups = []
        while len(rest) > 2:
            groups.insert(0, rest[-2:])
            rest = rest[:-2]
        if rest:
            groups.insert(0, rest)
        formatted = ",".join(groups) + "," + last3
    else:
        formatted = integer_part

    if negative:
        formatted = "-" + formatted

    if dec_part and not is_int:
        # If trim_trailing_zeros is True, trim trailing zeros in decimal
        if trim_trailing_zeros and dec_part.rstrip('0') != dec_part:
            dec_part = dec_part.rstrip('0')
        if dec_part:
            formatted += "." + dec_part

    return formatted


def format_indian_words(val: Union[int, float, str, None], lang: str = "en", include_symbol: bool = True) -> str:
    """
    Converts a raw Rupee number into Indian standard denominations (Lakhs or Crores).
    Language-aware: supports English, Kannada, and Hindi.
    Never outputs Western "million" or "billion".

    Examples:
      25,00,000 -> "₹25.00 Lakhs" / "₹25.00 ಲಕ್ಷ" / "₹25.00 लाख"
      1,50,00,000 -> "₹1.50 Crores" / "₹1.50 ಕೋಟಿ" / "₹1.50 करोड़"
      50,000 -> "₹50,000"
    """
    if val is None or val == "":
        return "₹0" if include_symbol else "0"
    try:
        val = float(val)
    except (ValueError, TypeError):
        return str(val)

    sym = "₹" if include_symbol else ""
    lang = (lang or "en").lower().strip()

    abs_val = abs(val)
    sign = "-" if val < 0 else ""

    if abs_val >= 10000000.0:  # 1 Crore or more
        cr_val = abs_val / 10000000.0
        cr_str = f"{cr_val:.2f}"
        if 'kn' in lang:
            return f"{sign}{sym}{cr_str} ಕೋಟಿ"
        elif 'hi' in lang:
            return f"{sign}{sym}{cr_str} करोड़"
        else:
            return f"{sign}{sym}{cr_str} Crores"

    elif abs_val >= 100000.0:  # 1 Lakh or more
        lakh_val = abs_val / 100000.0
        lakh_str = f"{lakh_val:.2f}"
        if 'kn' in lang:
            return f"{sign}{sym}{lakh_str} ಲಕ್ಷ"
        elif 'hi' in lang:
            return f"{sign}{sym}{lakh_str} लाख"
        else:
            return f"{sign}{sym}{lakh_str} Lakhs"

    else:
        return f"{sign}{sym}{format_inr(abs_val)}"
