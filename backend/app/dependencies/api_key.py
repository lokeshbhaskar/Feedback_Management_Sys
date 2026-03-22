import hashlib

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session  # type: ignore

from app.database.postgresql import get_db
from app.models.api_key import APIKey


def _extract_api_key(authorization: str | None, x_api_key: str | None) -> str | None:
    if x_api_key:
        return x_api_key.strip()

    if not authorization:
        return None

    token = authorization.strip()
    lower = token.lower()
    if lower.startswith("bearer "):
        return token[7:].strip()

    return token


def get_current_api_key(
    db: Session = Depends(get_db),
    authorization: str | None = Header(default=None),
    x_api_key: str | None = Header(default=None),
):
    plaintext_key = _extract_api_key(authorization, x_api_key)
    if not plaintext_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing API key",
        )

    hashed_key = hashlib.sha256(plaintext_key.encode("utf-8")).hexdigest()
    row = db.query(APIKey).filter(APIKey.key == hashed_key, APIKey.is_active.is_(True)).first()
    if not row:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or inactive API key",
        )

    return row
