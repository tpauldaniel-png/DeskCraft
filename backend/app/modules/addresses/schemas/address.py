from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, StringConstraints, field_validator

ShortText = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=1,
        max_length=20,
    ),
]

CountryText = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=1,
        max_length=50,
    ),
]

NameText = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=1,
        max_length=100,
    ),
]

AddressLine = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=1,
        max_length=200,
    ),
]


class AddressCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    recipient_name: NameText
    phone_number: ShortText
    address_line1: AddressLine
    address_line2: AddressLine | None = None
    city: NameText
    state: NameText
    postal_code: ShortText
    country: CountryText = "INDIA"
    is_default: bool = False


class AddressResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    address_id: UUID
    user_id: UUID
    recipient_name: str
    phone_number: str
    address_line1: str
    address_line2: str | None
    city: str
    state: str
    postal_code: str
    country: str
    is_default: bool
    created_at: datetime
    updated_at: datetime


class AddressUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    recipient_name: NameText | None
    phone_number: ShortText | None = None
    address_line1: AddressLine | None = None
    address_line2: AddressLine | None = None
    city: NameText | None = None
    state: NameText | None = None
    postal_code: ShortText | None = None
    country: CountryText | None = None
    is_default: bool | None = None

    @field_validator(
        "recipient_name",
        "phone_number",
        "address_line1",
        "address_line2",
        "city",
        "state",
        "postal_code",
        "country",
    )
    @classmethod
    def reject_null(cls, value: str | bool | None) -> str | bool:
        if value is None:
            raise ValueError("Omit this field if you don't want to update it.")
        return value
