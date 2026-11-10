from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.modules.addresses.schemas.address import (
    AddressCreate,
    AddressResponse,
    AddressUpdate,
)
from app.modules.addresses.service.address import AddressService
from app.modules.auth.dependencies import get_current_user
from app.modules.users.models.users import User

router = APIRouter(prefix="/api/v1/addresses", tags=["Addresses"])


@router.get("/", response_model=list[AddressResponse])
async def list_addresses(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    address_service = AddressService(db)
    addresses = await address_service.list_addresses_by_user_id(
        user_id=current_user.user_id
    )
    return addresses


@router.post("/", response_model=AddressResponse, status_code=201)
async def create_address(
    request: AddressCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    address_service = AddressService(db)
    address = await address_service.create_address(
        user_id=current_user.user_id, address_create=request
    )
    return address


@router.put("/{address_id}", response_model=AddressResponse)
async def update_address(
    address_id: UUID,
    request: AddressUpdate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    address_service = AddressService(db)
    address = await address_service.update_address(
        user_id=current_user.user_id,
        address_id=address_id,
        address_update=request,
    )
    return address


@router.delete("/{address_id}", status_code=204)
async def delete_address(
    address_id: UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    address_service = AddressService(db)
    await address_service.delete_address(
        user_id=current_user.user_id, address_id=address_id
    )
