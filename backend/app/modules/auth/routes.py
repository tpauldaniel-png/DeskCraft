from typing import Annotated

from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import get_db
from app.modules.auth.dependencies import get_current_user, require_admin
from app.modules.auth.schemas.login import LoginRequest, LoginResponse
from app.modules.auth.schemas.registration import (
    UserCreate,
    UserResponse,
)
from app.modules.auth.service import AuthService
from app.modules.auth.tokens import create_access_token
from app.modules.users.models.users import User

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


@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def login(
    login_data: LoginRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    response: Response,
) -> LoginResponse:

    service = AuthService(db)
    user = await service.authenticate_user(login_data)

    access_token = create_access_token(user_id=user.user_id, role=user.role)

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=settings.auth_cookie_secure,
        samesite="lax",
        max_age=settings.access_token_expire_minutes * 60,
        path="/",
    )

    return LoginResponse(
        message="Login Successful",
        data=UserResponse.model_validate(user),
    )


@router.get("/me", response_model=UserResponse)
async def get_my_profile(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    return current_user


@router.get("/admin-check", response_model=UserResponse)
async def admin_check(current_user: Annotated[User, Depends(require_admin)]) -> User:

    return current_user
