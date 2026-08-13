from fastapi import status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException
from app.modules.auth.password import hash_password, verify_password
from app.modules.auth.repository import UserRepository
from app.modules.auth.schemas.login import LoginRequest
from app.modules.auth.schemas.registration import UserCreate
from app.modules.users.models.users import User


class AuthService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repository = UserRepository(db)

    async def register_user(self, user_data: UserCreate) -> User:

        normalized_email = str(user_data.email).strip().lower()

        existing_email = await self.repository.get_user_by_email(normalized_email)

        if existing_email is not None:
            raise AppException(
                status_code=status.HTTP_409_CONFLICT,
                code="EMAIL_ALREADY_EXISTS",
                message="An account with this email already exists",
            )

        if user_data.phone_number is not None:
            normalized_phone = user_data.phone_number.strip() or None

        else:
            normalized_phone = None

        if normalized_phone is not None:
            existing_phone = await self.repository.get_user_by_phone(normalized_phone)

            if existing_phone is not None:
                raise AppException(
                    status_code=status.HTTP_409_CONFLICT,
                    code="PHONE_NUMBER_ALREADY_EXISTS",
                    message="An account with this phone number already exists",
                )

        user = User(
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            email=normalized_email,
            phone_number=normalized_phone,
            password_hash=hash_password(user_data.password),
            role="customer",
        )

        try:
            created_user = await self.repository.create_user(user)
            await self.db.commit()
            await self.db.refresh(created_user)

        except IntegrityError as error:
            await self.db.rollback()

            raise AppException(
                status_code=status.HTTP_409_CONFLICT,
                code="USER_ALREADY_EXISTS",
                message="An account with this detail already exists",
            ) from error

        except SQLAlchemyError:
            await self.db.rollback()
            raise

        return created_user

    async def authenticate_user(self, login_data: LoginRequest) -> User:

        normalized_email = str(login_data.email).strip().lower()

        user = await self.repository.get_user_by_email(normalized_email)

        if user is None:
            raise AppException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                code="INVALID_CREDENTIALS",
                message="Invalid password or email",
            )

        if not verify_password(login_data.password, user.password_hash):
            raise AppException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                code="INVALID_CREDENTIALS",
                message="Invalid password or email",
            )

        if not user.is_active:
            raise AppException(
                status_code=status.HTTP_403_FORBIDDEN,
                code="ACCOUNT_INACTIVE",
                message="This account is inactive",
            )

        return user
