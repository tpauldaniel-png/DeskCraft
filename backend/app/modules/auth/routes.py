from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.modules.auth.schemas.registration import (
    UserCreate,
    UserResponse,
)
from app.modules.auth.service import AuthService

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_account(
    user_data: UserCreate, db: Annotated[AsyncSession, Depends(get_db)]
) -> UserResponse:

    service = AuthService(db)
    user = await service.register_user(user_data)

    return UserResponse.model_validate(user)
