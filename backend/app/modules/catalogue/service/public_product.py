from decimal import Decimal
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException
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
        min_price: Decimal | None = None,
        max_price: Decimal | None = None,
    ) -> tuple[list[PublicProductCardResponse], int]:

        try:
            if (
                min_price is not None
                and max_price is not None
                and min_price > max_price
            ):
                raise AppException(
                    status_code=400,
                    code="INVALID_PRICE_RANGE",
                    message="min_price cannot be greater than max_price",
                )

            items, total = await self.repository.list_public_products(
                page=page,
                page_size=page_size,
                search=search,
                category_id=category_id,
                sort=sort,
                min_price=min_price,
                max_price=max_price,
            )

            items = [PublicProductCardResponse.model_validate(item) for item in items]

            return items, total

        except AppException:
            raise

        except Exception as e:
            raise AppException(
                status_code=500,
                code="INTERNAL_SERVER_ERROR",
                message="An unexpected error occurred while listing public products",
            ) from e
