from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.users.models.users import User


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_by_email(self, email: str) -> User | None:
        statement = select(User).where(User.email == email)
        result = await self.db.execute(statement)
        return result.scalar_one_or_none()

    async def get_user_by_phone(self, phone_number: str) -> User | None:
        statement = select(User).where(User.phone_number == phone_number)
        result = await self.db.execute(statement)
        return result.scalar_one_or_none()

    async def create_user(self, user: User) -> User:
        self.db.add(user)
        await self.db.flush()
        return user

    async def get_user_by_id(self, user_id: UUID) -> User:
        statement = select(User).where(User.user_id == user_id)
        result = await self.db.execute(statement)
        return result.scalar_one_or_none()
