from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ProductImageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product_image_id: UUID
    variant_id: UUID
    image_url: str
    cloudinary_public_id: str
    alt_text: str
    sort_order: int
    is_active: bool
    is_primary: bool
    created_at: str
    updated_at: str


class ProductImageListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    items: list[ProductImageResponse]
