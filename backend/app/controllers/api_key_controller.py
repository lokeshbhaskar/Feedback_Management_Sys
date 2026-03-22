from sqlalchemy.orm import Session  # type: ignore

from app.services.api_key_service import create_api_key, list_api_keys, revoke_api_key


def list_api_keys_controller(db: Session, company_id: int):
    return list_api_keys(db, company_id)


def create_api_key_controller(db: Session, company_id: int):
    return create_api_key(db, company_id)


def revoke_api_key_controller(db: Session, company_id: int, key_id: int):
    return revoke_api_key(db, company_id, key_id)

