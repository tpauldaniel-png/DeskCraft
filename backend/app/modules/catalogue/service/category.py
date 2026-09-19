from uuid import UUID

from fastapi import status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException
from app.modules.catalogue.models.category import Category
from app.modules.catalogue.repository import CategoryRepository
from app.modules.catalogue.schemas.category import CategoryCreate, CategoryUpdate


class CatalogueService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = CategoryRepository(db)

    async def create_category(self, category_data: CategoryCreate) -> Category:
        normalized_name = category_data.name.strip().lower()

        existing_name = await self.repository.get_category_by_name(normalized_name)

        if existing_name is not None:
            raise AppException(
                status_code=status.HTTP_409_CONFLICT,
                code="NAME_ALREADY_EXISTS",
                message="A Category with this name already exists",
            )

        category = Category(
            name=category_data.name,
            description=category_data.description,
        )

        try:
            created_category = await self.repository.create_category(category)
            await self.db.commit()
            await self.db.refresh(created_category)

        except IntegrityError as error:
            await self.db.rollback()

            raise AppException(
                status_code=status.HTTP_409_CONFLICT,
                code="NAME_ALREADY_EXISTS",
                message="A Category with this name already exists",
            ) from error

        except SQLAlchemyError:
            await self.db.rollback()
            raise

        return created_category

    async def list_categories(
        self, page: int, page_size: int
    ) -> tuple[list[Category], int]:
        return await self.repository.list_categories(page=page, page_size=page_size)

    async def update_category(
        self, category_id: UUID, category_data: CategoryUpdate
    ) -> Category:

        category = await self.repository.get_category_by_id(category_id)

        if category is None:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                code="CATEGORY_NOT_FOUND",
                message="Category not found",
            )

        update_data = category_data.model_dump(exclude_unset=True)

        new_name = update_data.get("name")

        if new_name is not None:
            existing_category = await self.repository.get_category_by_name(new_name)

            if (
                existing_category is not None
                and existing_category.category_id != category_id
            ):
                raise AppException(
                    status_code=status.HTTP_409_CONFLICT,
                    code="CATEGORY_NAME_ALREADY_EXISTS",
                    message="A category with this name already exists",
                )

        for field, value in update_data.items():
            setattr(category, field, value)

        try:
            updated_category = await self.repository.update_category(category)
            await self.db.commit()
            await self.db.refresh(updated_category)

        except IntegrityError as error:
            await self.db.rollback()

            raise AppException(
                status_code=status.HTTP_409_CONFLICT,
                code="CATEGORY_NAME_ALREADY_EXISTS",
                message="A category with this name already exists",
            ) from error

        except SQLAlchemyError:
            await self.db.rollback()
            raise

        return updated_category
