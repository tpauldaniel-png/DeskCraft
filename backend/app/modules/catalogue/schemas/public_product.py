from decimal import Decimal
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from app.modules.catalogue.schemas.product import ProductSpecification


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
    min_price: Decimal | None
    max_price: Decimal | None


class PublicProductVariantImage(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    product_image_id: UUID
    image_url: str
    alt_text: str | None = None
    is_primary: bool
    sort_order: int


class PublicProductVariant(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    variant_id: UUID
    name: str
    price: Decimal
    images: list[PublicProductVariantImage] = Field(default_factory=list)


class PublicProductDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product_id: UUID
    category_id: UUID
    category_name: str
    name: str
    slug: str
    description: str | None
    specifications: ProductSpecification | None
    variants: list[PublicProductVariant] = Field(default_factory=list)
