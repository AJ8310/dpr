"""
Zero-Data-Leakage Privacy Guardrail & PII Masking Engine
Protects confidential user data (PAN, Aadhaar, Bank Account #, Phone, Email)
by tokenizing sensitive fields before LLM prompts are constructed.
"""

import re
from typing import Dict, Any, Tuple

class DataAnonymizer:
    """
    Masks and tokenizes sensitive PII fields in raw text or dictionary payloads.
    """

    @classmethod
    def sanitize_text(cls, text: str) -> Tuple[str, Dict[str, str]]:
        if not text:
            return "", {}

        token_map = {}
        sanitized = text

        # 1. Mask Aadhaar numbers (12 digits)
        aadhaar_pattern = r'\b\d{4}[-\s]?\d{4}[-\s]?\d{4}\b'
        aadhaars = re.findall(aadhaar_pattern, sanitized)
        for i, a in enumerate(aadhaars):
            token = f"[AADHAAR_TOKEN_{i+1}]"
            token_map[token] = a
            sanitized = sanitized.replace(a, token)

        # 2. Mask PAN numbers (10 alphanumeric: e.g. ABCDE1234F)
        pan_pattern = r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b'
        pans = re.findall(pan_pattern, sanitized)
        for i, p in enumerate(pans):
            token = f"[PAN_TOKEN_{i+1}]"
            token_map[token] = p
            sanitized = sanitized.replace(p, token)

        # 3. Mask Bank Account numbers (9-18 digits)
        acc_pattern = r'\b\d{9,18}\b'
        accs = re.findall(acc_pattern, sanitized)
        for i, acc in enumerate(accs):
            # Avoid masking small integers or years
            if len(acc) >= 9 and not acc.startswith("202"):
                token = f"[ACCOUNT_TOKEN_{i+1}]"
                token_map[token] = acc
                sanitized = sanitized.replace(acc, token)

        # 4. Mask Phone numbers (10 digits)
        phone_pattern = r'\b[6-9]\d{9}\b'
        phones = re.findall(phone_pattern, sanitized)
        for i, ph in enumerate(phones):
            token = f"[PHONE_TOKEN_{i+1}]"
            token_map[token] = ph
            sanitized = sanitized.replace(ph, token)

        # 5. Mask Email addresses
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, sanitized)
        for i, em in enumerate(emails):
            token = f"[EMAIL_TOKEN_{i+1}]"
            token_map[token] = em
            sanitized = sanitized.replace(em, token)

        return sanitized, token_map

    @classmethod
    def restore_text(cls, sanitized_text: str, token_map: Dict[str, str]) -> str:
        """
        De-tokenizes sanitized text locally during PDF rendering or report assembly.
        """
        if not sanitized_text or not token_map:
            return sanitized_text

        restored = sanitized_text
        for token, original in token_map.items():
            restored = restored.replace(token, original)
        return restored

    @classmethod
    def sanitize_canonical_data(cls, canonical_data: Dict[str, Any]) -> Tuple[Dict[str, Any], Dict[str, str]]:
        """
        Sanitizes canonical project data dict before passing context to LLM agents.
        """
        import copy
        sanitized_dict = copy.deepcopy(canonical_data)
        master_token_map = {}

        def _recursive_sanitize(obj):
            if isinstance(obj, dict):
                for k, v in obj.items():
                    if k in ["pan_no", "aadhaar_no", "account_number", "contact_number", "email"]:
                        if isinstance(v, str) and v:
                            token = f"[{k.upper()}_MASKED]"
                            master_token_map[token] = v
                            obj[k] = token
                    elif isinstance(v, (dict, list)):
                        _recursive_sanitize(v)
            elif isinstance(obj, list):
                for elem in obj:
                    if isinstance(elem, (dict, list)):
                        _recursive_sanitize(elem)

        _recursive_sanitize(sanitized_dict)
        return sanitized_dict, master_token_map
