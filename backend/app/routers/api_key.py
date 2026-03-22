from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session  # type: ignore

from app.controllers.api_key_controller import (
    create_api_key_controller,
    list_api_keys_controller,
    revoke_api_key_controller,
)
from app.database.postgresql import get_db
from app.dependencies.auth import get_current_user
from app.schemas.api_key import APIKeyCreateResponse, APIKeyItem

router = APIRouter(prefix="/api-keys", tags=["API Keys"])


@router.get("", response_model=list[APIKeyItem])
def list_api_keys(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return list_api_keys_controller(db, current_user.company_id)


@router.post("", response_model=APIKeyCreateResponse, status_code=status.HTTP_201_CREATED)
def create_api_key(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return create_api_key_controller(db, current_user.company_id)


@router.patch("/{key_id}/revoke", response_model=APIKeyItem)
def revoke_api_key(
    key_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return revoke_api_key_controller(db, current_user.company_id, key_id)

