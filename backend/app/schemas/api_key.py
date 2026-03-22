from datetime import datetime

from pydantic import BaseModel


class APIKeyItem(BaseModel):
    id: int
    masked_key: str
    is_active: bool
    created_at: datetime


class APIKeyCreateResponse(APIKeyItem):
    plaintext_key: str

