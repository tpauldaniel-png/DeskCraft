from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.modules.auth.schemas.registration import UserResponse


class LoginRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class LoginResponse(BaseModel):
    message: str
    data: UserResponse
