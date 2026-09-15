from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.modules.auth.dependencies import require_admin
from app.modules.catalogue.schemas.category import (
    CategoryCreate,
    CategoryListResponse,
    CategoryResponse,
    CategoryUpdate,
)
from app.modules.catalogue.service import CatalogueService
from app.modules.users.models.users import User

router = APIRouter(prefix="/api/v1/categories", tags=["Category"])


@router.post("", status_code=status.HTTP_201_CREATED, response_model=CategoryResponse)
async def create_category(
    category_data: CategoryCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_admin)],
) -> CategoryResponse:

    service = CatalogueService(db)
    category = await service.create_category(category_data)

    return CategoryResponse.model_validate(category)


@router.get("", response_model=CategoryListResponse)
async def list_categories(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_admin)],
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
) -> CategoryListResponse:

    service = CatalogueService(db)
    categories, total = await service.list_categories(page=page, page_size=page_size)

    return CategoryListResponse(
        items=[CategoryResponse.model_validate(category) for category in categories],
        total=total,
        page=page,
        page_size=page_size,
    )


async def update_category(
    category_id: UUID,
    category_data: CategoryUpdate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_admin)],
) -> CategoryResponse:

    service = CatalogueService(db)

    category = await service.update_category(
        category_id=category_id, category_data=category_data
    )

    return CategoryResponse.model_validate(category)
