from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.modules.auth.dependencies import require_admin
from app.modules.catalogue.schemas.product import (
    ProductCreate,
    ProductListResponse,
    ProductResponse,
    ProductUpdate,
)
from app.modules.catalogue.service.product import ProductService
from app.modules.users.models.users import User

router = APIRouter(prefix="/api/v1/products", tags=["Product"])


@router.post("", status_code=status.HTTP_201_CREATED, response_model=ProductResponse)
async def create_product(
    product_data: ProductCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_admin)],
) -> ProductResponse:

    service = ProductService(db)
    product = await service.create_product(product_data)

    return ProductResponse.model_validate(product)


@router.get("", response_model=ProductListResponse)
async def list_products(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_admin)],
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
    search: Annotated[str | None, Query(max_length=200)] = None,
    category_id: Annotated[UUID | None, Query()] = None,
    is_active: Annotated[bool | None, Query()] = None,
) -> ProductListResponse:

    service = ProductService(db)
    products, total = await service.list_products(
        page=page,
        page_size=page_size,
        search=search,
        category_id=category_id,
        is_active=is_active,
    )

    return ProductListResponse(
        items=[ProductResponse.model_validate(product) for product in products],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(
    product_id: UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_admin)],
) -> ProductResponse:

    service = ProductService(db)
    product = await service.get_product_by_id(product_id)

    return ProductResponse.model_validate(product)


@router.patch("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: UUID,
    product_data: ProductUpdate,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_admin)],
) -> ProductResponse:

    service = ProductService(db)

    product = await service.update_product(
        product_id=product_id, product_data=product_data
    )

    return ProductResponse.model_validate(product)
