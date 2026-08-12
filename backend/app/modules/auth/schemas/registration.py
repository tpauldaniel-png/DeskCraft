from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    StringConstraints,
)

TrimmedName = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=1,
        max_length=100,
    ),
]


class UserCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    first_name: TrimmedName
    last_name: TrimmedName
    email: EmailStr
    phone_number: str | None = Field(default=None, max_length=20)
    password: str = Field(min_length=8, max_length=128)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: UUID
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: str | None
    role: str
    is_active: bool
    created_at: datetime
