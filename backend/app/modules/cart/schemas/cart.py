from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


class AddCartItemRequest(BaseModel):
    variant_id: UUID
    quantity: int = Field(gt=0, strict=True)


class UpdateCartItemRequest(BaseModel):
    quantity: int = Field(gt=0, strict=True)


class CartItemResponse(BaseModel):
    cart_item_id: UUID
    variant_id: UUID
    product_name: str
    sku: str
    image_url: str | None = None

    quantity: int = Field(gt=0)
    current_unit_price: Decimal = Field(ge=0)
    line_total: Decimal = Field(ge=0)

    created_at: datetime
    updated_at: datetime


class CartResponse(BaseModel):
    cart_id: UUID | None = None
    items: list[CartItemResponse] = Field(default_factory=list)
    total_quantity: int = Field(ge=0, default=0)
    cart_subtotal: Decimal = Field(ge=0, default=Decimal("0.00"))
