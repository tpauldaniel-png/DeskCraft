from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.catalogue.models.category import Category


class CategoryRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_category_by_name(self, name: str) -> Category | None:
        statement = select(Category).where(func.lower(Category.name) == name.lower())
        result = await self.db.execute(statement)
        return result.scalar_one_or_none()

    async def get_category_by_id(self, category_id: UUID) -> Category | None:
        statement = select(Category).where(Category.category_id == category_id)
        result = await self.db.execute(statement)
        return result.scalar_one_or_none()

    async def list_categories(
        self, page: int, page_size: int
    ) -> tuple[list[Category], int]:
        offset = (page - 1) * page_size
        count_statement = select(func.count(Category.category_id))
        count_result = await self.db.execute(count_statement)
        total = count_result.scalar_one()

        statement = (
            select(Category).order_by(Category.name.asc()).offset(offset).limit(page_size)
        )
        result = await self.db.execute(statement)
        categories = list(result.scalars().all())
        return categories, total

    async def create_category(self, category: Category) -> Category:
        self.db.add(category)
        await self.db.flush()
        return category

    async def update_category(self, category: Category) -> Category:
        await self.db.flush()

        return category


