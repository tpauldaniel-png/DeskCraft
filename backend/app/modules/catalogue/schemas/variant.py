

from datetime import datetime
from decimal import Decimal
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, StringConstraints, model_validator, Field

TrimmedName = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=1,
        max_length=200,
    ),
]


TrimmedSku = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=1,
        max_length=100,
    ),
]

Price = Annotated[
    Decimal,
    Field(ge=0, max_digits=10, decimal_places=2),
]

class VariantCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: TrimmedName
    price: Price
    sku: TrimmedSku | None = None
    product_id: UUID


class VariantResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    variant_id: UUID
    name: TrimmedName
    price: Price
    sku: TrimmedSku | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime
    product_id: UUID    

class VariantUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: TrimmedName | None = None
    price: Price | None = None
    sku: TrimmedSku | None = None
    is_active: bool | None = None
    product_id: UUID | None = None

    @model_validator(mode="after")
    def require_atleast_one_field(self):
        if not self.model_fields_set:
            raise ValueError("Atleast one field must be provided")

        non_nullable_fields = ["name", "price", "sku", "is_active", "product_id"]
        for field in non_nullable_fields:
            if field in self.model_fields_set and getattr(self, field) is None:
                raise ValueError(f"{field} cannot be null")

        return self

class VariantListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    items: list[VariantResponse]
    total: int
    page: int
    page_size: int
