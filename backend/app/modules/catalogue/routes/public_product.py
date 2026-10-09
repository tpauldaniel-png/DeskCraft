from decimal import Decimal
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.modules.catalogue.schemas.public_product import (
    ProductSort,
    PublicProductListResponse,
)
from app.modules.catalogue.service.public_product import PublicProductService

router = APIRouter(prefix="/api/v1/catalogue/products", tags=["Public Product"])


@router.get("", response_model=PublicProductListResponse)
async def list_public_products(
    db: Annotated[AsyncSession, Depends(get_db)],
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
    search: Annotated[str | None, Query(max_length=200)] = None,
    category_id: Annotated[UUID | None, Query()] = None,
    sort: Annotated[ProductSort, Query()] = "name_asc",
    min_price: Annotated[Decimal | None, Query(ge=0)] = None,
    max_price: Annotated[Decimal | None, Query(ge=0)] = None,
) -> PublicProductListResponse:

    service = PublicProductService(db)
    items, total = await service.list_public_products(
        page=page,
        page_size=page_size,
        search=search,
        category_id=category_id,
        sort=sort,
        min_price=min_price,
        max_price=max_price,
    )

    return PublicProductListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        sort=sort,
        min_price=min_price,
        max_price=max_price,
    )
