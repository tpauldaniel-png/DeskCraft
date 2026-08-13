from typing import Annotated
from uuid import UUID

from fastapi import Cookie, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException
from app.db.session import get_db
from app.modules.auth.repository import UserRepository
from app.modules.auth.tokens import decode_access_token
from app.modules.users.models.users import User


def invalid_access_token_exception() -> AppException:
    return AppException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        code="INVALID_ACCESS_TOKEN",
        message="Invalid or expired access token",
    )


async def get_current_user(
    db: Annotated[AsyncSession, Depends(get_db)],
    access_token: Annotated[str | None, Cookie(alias="access_token")] = None,
) -> User:

    if access_token is None:
        raise AppException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="AUTHENTICATION_REQUIRED",
            message="Authentication is required",
        )

    payload = decode_access_token(access_token)

    if payload is None:
        raise invalid_access_token_exception()

    try:
        user_id = UUID(payload.get("sub"))

    except KeyError, TypeError, ValueError:
        raise invalid_access_token_exception()

    repository = UserRepository(db)

    user = await repository.get_user_by_id(user_id)

    if user is None:
        raise invalid_access_token_exception()

    if not user.is_active:
        raise AppException(
            status_code=status.HTTP_403_FORBIDDEN,
            code="INACTIVE_USER",
            message="This user account is inactive",
        )

    return user


async def require_admin(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    if current_user.role != "admin":
        raise AppException(
            status_code=status.HTTP_403_FORBIDDEN,
            code="REQUIRE_ADMIN_ACCESS",
            message="require admin access",
        )

    return current_user
