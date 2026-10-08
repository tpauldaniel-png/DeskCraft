from decimal import Decimal
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class PublicProductCardResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product_id: UUID
    category_id: UUID
    category_name: str
    name: str
    slug: str
    starting_price: Decimal | None
    image_url: str | None


ProductSort = Literal[
    "name_asc",
    "name_desc",
    "price_asc",
    "price_desc",
]


class PublicProductListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    items: list[PublicProductCardResponse]
    total: int
    page: int
    page_size: int
    sort: ProductSort = "name_asc"
