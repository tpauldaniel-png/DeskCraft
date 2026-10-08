from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.modules.catalogue.schemas.category import PublicCategoryResponse
from app.modules.catalogue.service.category import CatalogueService

router = APIRouter(prefix="/api/v1/catalogue/categories", tags=["Public Categories"])


@router.get("", response_model=list[PublicCategoryResponse])
async def list_public_categories(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[PublicCategoryResponse]:

    service = CatalogueService(db)
    categories = await service.list_public_categories()

    return [PublicCategoryResponse.model_validate(category) for category in categories]
