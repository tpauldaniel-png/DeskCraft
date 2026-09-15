from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    StringConstraints,
    field_validator,
    model_validator,
)

TrimmedName = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=1,
        max_length=100,
    ),
]


class CategoryCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: TrimmedName
    description: str | None = None


class CategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    category_id: UUID
    name: str
    description: str | None
    is_active: bool
    created_at: datetime
    updated_at: datetime


class CategoryUpdate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: TrimmedName | None = None
    description: str | None = None
    is_active: bool | None = None

    @field_validator("name", "is_active")
    @classmethod
    def fields_must_not_be_null(cls, value):
        if value is None:
            raise ValueError("This field cannot be null")
        return value

    @model_validator(mode="after")
    def require_atleast_one_field(self):
        if not self.model_fields_set:
            raise ValueError("Atleast one field must be provided")
        return self


class CategoryListResponse(BaseModel):
    items: list[CategoryResponse]
    total: int
    page: int
    page_size: int
