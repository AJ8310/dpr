from pydantic import BaseModel
from typing import Optional, Dict, Any

class ChatMessageRequest(BaseModel):
    message: str
    current_section: Optional[str] = None
    form_data: Optional[Dict[str, Any]] = None

class ChatMessageResponse(BaseModel):
    success: bool = True
    reply: str
