import hashlib
import secrets

from fastapi import HTTPException, status
from sqlalchemy.orm import Session  # type: ignore

from app.models.api_key import APIKey


def _build_masked_key(plaintext_key: str) -> str:
    return f"{plaintext_key[:8]}{'*' * 28}{plaintext_key[-4:]}"


def _generate_plaintext_key() -> str:
    token = secrets.token_urlsafe(32)
    return f"sk_live_{token}"


def _hash_key(plaintext_key: str) -> str:
    return hashlib.sha256(plaintext_key.encode("utf-8")).hexdigest()


def _serialize_key(row: APIKey, masked_key: str):
    return {
        "id": row.id,
        "masked_key": masked_key,
        "is_active": row.is_active,
        "created_at": row.created_at,
    }


def _fallback_masked_key(row_id: int) -> str:
    return f"sk_live_{'*' * 28}{str(row_id).zfill(4)}"


def list_api_keys(db: Session, company_id: int):
    rows = (
        db.query(APIKey)
        .filter(APIKey.company_id == company_id)
        .order_by(APIKey.created_at.desc())
        .all()
    )
    return [_serialize_key(row, _fallback_masked_key(row.id)) for row in rows]


def create_api_key(db: Session, company_id: int):
    if not company_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company not found for this user")

    plaintext_key = None
    key_hash = None

    for _ in range(5):
        candidate = _generate_plaintext_key()
        candidate_hash = _hash_key(candidate)
        existing = db.query(APIKey).filter(APIKey.key == candidate_hash).first()
        if existing is None:
            plaintext_key = candidate
            key_hash = candidate_hash
            break

    if plaintext_key is None or key_hash is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate unique API key",
        )

    row = APIKey(
        key=key_hash,
        is_active=True,
        company_id=company_id,
    )
    db.add(row)
    db.commit()
    db.refresh(row)

    return {
        "id": row.id,
        "masked_key": _build_masked_key(plaintext_key),
        "plaintext_key": plaintext_key,
        "is_active": row.is_active,
        "created_at": row.created_at,
    }


def revoke_api_key(db: Session, company_id: int, key_id: int):
    row = (
        db.query(APIKey)
        .filter(APIKey.id == key_id, APIKey.company_id == company_id)
        .first()
    )
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="API key not found")

    row.is_active = False
    db.commit()
    db.refresh(row)

    return _serialize_key(row, _fallback_masked_key(row.id))
