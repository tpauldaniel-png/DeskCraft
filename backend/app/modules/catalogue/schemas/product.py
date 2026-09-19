from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, StringConstraints, model_validator

TrimmedName = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=1,
        max_length=200,
    ),
]


class ProductCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: TrimmedName
    description: str | None = None
    specifications: dict[str, object] | None = None
    category_id: UUID


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product_id: UUID
    name: str
    description: str | None
    specifications: dict[str, object] | None
    is_active: bool
    created_at: datetime
    updated_at: datetime
    category_id: UUID
    slug: str


class ProductUpdate(BaseModel):
    model_config = ConfigDict(from_attributes=True, extra="forbid")

    name: TrimmedName | None = None
    description: str | None = None
    specifications: dict[str, object] | None = None
    is_active: bool | None = None
    category_id: UUID | None = None

    @model_validator(mode="after")
    def require_atleast_one_field(self):
        if not self.model_fields_set:
            raise ValueError("Atleast one field must be provided")

        non_nullable_fields = ["name", "is_active", "category_id"]
        for field in non_nullable_fields:
            if field in self.model_fields_set and getattr(self, field) is None:
                raise ValueError(f"{field} cannot be null")

        return self


class ProductListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    items: list[ProductResponse]
    total: int
    page: int
    page_size: int
