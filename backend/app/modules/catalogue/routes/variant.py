from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.modules.auth.dependencies import require_admin
from app.modules.catalogue.schemas.variant import (
    VariantCreate,
    VariantListResponse,
    VariantResponse,
    VariantUpdate,
)
from app.modules.catalogue.service.variant import VariantService
from app.modules.users.models.users import User

router = APIRouter(prefix="/api/v1/variants", tags=["Variant"])


@router.post("", status_code=status.HTTP_201_CREATED, response_model=VariantResponse)
async def create_variant(
    variant_data: VariantCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_admin)],
) -> VariantResponse:

    service = VariantService(db)
    variant = await service.create_variant(variant_data)

    return VariantResponse.model_validate(variant)


@router.get("", response_model=VariantListResponse)
async def list_variants(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_admin)],
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
    search: Annotated[str | None, Query(max_length=200)] = None,
    product_id: Annotated[UUID | None, Query()] = None,
    is_active: Annotated[bool | None, Query()] = None,
) -> VariantListResponse:

    service = VariantService(db)
    variants, total = await service.list_variants(
        page=page,
        page_size=page_size,
        search=search,
        product_id=product_id,
        is_active=is_active,
    )

    return VariantListResponse(
        items=[VariantResponse.model_validate(variant) for variant in variants],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{variant_id}", response_model=VariantResponse)
async def get_variant(
    variant_id: UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_admin)],
) -> VariantResponse:

    service = VariantService(db)
    variant = await service.get_variant(variant_id)

    return VariantResponse.model_validate(variant)


@router.patch("/{variant_id}", response_model=VariantResponse)
async def update_variant(
    variant_id: UUID,
    variant_data: VariantUpdate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_admin)],
) -> VariantResponse:

    service = VariantService(db)
    variant = await service.update_variant(variant_id, variant_data)

    return VariantResponse.model_validate(variant)
