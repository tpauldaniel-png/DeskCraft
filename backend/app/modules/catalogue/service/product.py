import re
from uuid import UUID

from fastapi import status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException
from app.modules.catalogue.models.product import Product
from app.modules.catalogue.repository import CategoryRepository, ProductRepository
from app.modules.catalogue.schemas.product import ProductCreate, ProductUpdate


class ProductService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.product_repository = ProductRepository(db)
        self.category_repository = CategoryRepository(db)

    def create_slug(self, name: str) -> str:
        """
        Create a slug from the product name.
        """
        slug = name.lower().strip()
        slug = re.sub(r"[^a-z0-9]+", "-", slug)
        return slug.strip("-")

    async def create_product(self, product_data: ProductCreate) -> Product:
        category = await self.category_repository.get_category_by_id(
            product_data.category_id
        )

        if category is None:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                code="CATEGORY_NOT_FOUND",
                message="Category not found",
            )

        slug = self.create_slug(product_data.name)

        existing_product = await self.product_repository.get_product_by_slug(slug)

        if existing_product:
            raise AppException(
                status_code=status.HTTP_409_CONFLICT,
                code="PRODUCT_CREATION_FAILED",
                message="Product with this name already exists",
            )

        product = Product(
            name=product_data.name,
            description=product_data.description,
            slug=slug,
            specifications=product_data.specifications,
            category_id=product_data.category_id,
        )

        try:
            created_product = await self.product_repository.create_product(product)
            await self.db.commit()
            await self.db.refresh(created_product)

        except IntegrityError as error:
            await self.db.rollback()

            raise AppException(
                status_code=status.HTTP_409_CONFLICT,
                code="PRODUCT_CREATION_FAILED",
                message="Product with this name already exists",
            ) from error

        except SQLAlchemyError:
            await self.db.rollback()
            raise

        return created_product

    async def list_products(
        self,
        page: int,
        page_size: int,
        search: str | None = None,
        category_id: UUID | None = None,
        is_active: bool | None = None,
    ) -> tuple[list[Product], int]:
        return await self.product_repository.list_products(
            page=page,
            page_size=page_size,
            search=search,
            category_id=category_id,
            is_active=is_active,
        )

    async def update_product(
        self, product_id: UUID, product_data: ProductUpdate
    ) -> Product:
        product = await self.product_repository.get_product_by_id(product_id)

        if product is None:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                code="PRODUCT_NOT_FOUND",
                message="Product not found",
            )

        update_data = product_data.model_dump(exclude_unset=True)

        new_category_id = update_data.get("category_id")

        if new_category_id is not None:
            category = await self.category_repository.get_category_by_id(
                new_category_id
            )

            if category is None:
                raise AppException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    code="CATEGORY_NOT_FOUND",
                    message="Category not found",
                )

        for field, value in update_data.items():
            setattr(product, field, value)

        try:
            updated_product = await self.product_repository.update_product(product)
            await self.db.commit()
            await self.db.refresh(updated_product)

        except IntegrityError as error:
            await self.db.rollback()

            raise AppException(
                status_code=status.HTTP_409_CONFLICT,
                code="PRODUCT_UPDATE_FAILED",
                message="Product with this name already exists",
            ) from error

        except SQLAlchemyError:
            await self.db.rollback()
            raise

        return updated_product

    async def get_product(self, product_id: UUID) -> Product:
        product = await self.product_repository.get_product_by_id(product_id)

        if product is None:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                code="PRODUCT_NOT_FOUND",
                message="Product not found",
            )

        return product
