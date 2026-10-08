from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.catalogue.repository import PublicProductRepository
from app.modules.catalogue.schemas.public_product import (
    ProductSort,
    PublicProductCardResponse,
)


class PublicProductService:
    def __init__(self, db: AsyncSession):
        self.repository = PublicProductRepository(db)

    async def list_public_products(
        self,
        page: int = 1,
        page_size: int = 10,
        search: str | None = None,
        category_id: UUID | None = None,
        sort: ProductSort = "name_asc",
    ) -> tuple[list[PublicProductCardResponse], int]:

        items, total = await self.repository.list_public_products(
            page=page,
            page_size=page_size,
            search=search,
            category_id=category_id,
            sort=sort,
        )

        items = [PublicProductCardResponse.model_validate(item) for item in items]

        return items, total
