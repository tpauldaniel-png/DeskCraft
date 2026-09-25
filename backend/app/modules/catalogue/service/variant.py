

from uuid import UUID

from fastapi import status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException
from app.modules.catalogue.models.variant import Variant

from app.modules.catalogue.repository import VariantRepository
from app.modules.catalogue.schemas.variant import VariantCreate, VariantUpdate
from app.modules.catalogue.repository import ProductRepository, CategoryRepository


class VariantService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.variant_repository = VariantRepository(db)
        self.product_repository = ProductRepository(db)
        self.category_repository = CategoryRepository(db)

    async def create_variant(self, variant_data: VariantCreate) -> Variant:
        product = await self.product_repository.get_product_by_id(
            variant_data.product_id
        )

        if product is None:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                code="PRODUCT_NOT_FOUND",
                message="Product not found",
            )

        normalized_sku = variant_data.sku.strip().lower()

        existing_variant = await self.variant_repository.get_variant_by_sku(
            normalized_sku
        )

        if existing_variant is not None:
            raise AppException(
                status_code=status.HTTP_409_CONFLICT,
                code="VARIANT_ALREADY_EXISTS",
                message="Variant with this SKU already exists",
            )

        

        

        variant = Variant(
            name=variant_data.name,
            price=variant_data.price,
            sku=normalized_sku,
            product_id=variant_data.product_id,
        )

        try:
            creatded_variant = await self.variant_repository.create_variant(variant)
            await self.db.commit()
            await self.db.refresh(creatded_variant)

        except IntegrityError as error:
            await self.db.rollback()

            raise AppException(
                status_code=status.HTTP_409_CONFLICT,
                code="VARIANT_CREATION_FAILED",
                message="Failed to create variant due to integrity error",
            )

        except SQLAlchemyError:
            await self.db.rollback()
            raise

        return creatded_variant



    async def update_variant(
        self, variant_id: UUID, variant_data: VariantUpdate
    ) -> Variant:
        variant = await self.variant_repository.get_variant_by_id(variant_id)
        if variant is None:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                code="VARIANT_NOT_FOUND",
                message="Variant not found",
            )
        
        normalized_sku = None
        if variant_data.sku is not None:
            normalized_sku = variant_data.sku.strip().lower()
            existing_variant = await self.variant_repository.get_variant_by_sku(
                normalized_sku
            )
            if existing_variant and existing_variant.variant_id != variant_id:
                raise AppException(
                    status_code=status.HTTP_409_CONFLICT,
                    code="VARIANT_ALREADY_EXISTS",
                    message="Variant with this SKU already exists",
                )


        if variant_data.product_id is not None:
            product = await self.product_repository.get_product_by_id(
                variant_data.product_id
            )
            if product is None:
                raise AppException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    code="PRODUCT_NOT_FOUND",
                    message="Product not found",
                )

        if normalized_sku is not None:
            variant.sku = normalized_sku

        if variant_data.name is not None:
            variant.name = variant_data.name

        if variant_data.price is not None:
            variant.price = variant_data.price

        if variant_data.is_active is not None:
            variant.is_active = variant_data.is_active

        if variant_data.product_id is not None:
            variant.product_id = variant_data.product_id
        
        try:
            updated_variant = await self.variant_repository.update_variant(variant)
            await self.db.commit()
            await self.db.refresh(updated_variant)

        except IntegrityError as error:
            await self.db.rollback()

            raise AppException(
                status_code=status.HTTP_409_CONFLICT,
                code="VARIANT_UPDATE_FAILED",
                message="Failed to update variant due to integrity error",
            )

        except SQLAlchemyError:
            await self.db.rollback()
            raise

        return updated_variant


    async def get_variant(self, variant_id: UUID) -> Variant:
        variant = await self.variant_repository.get_variant_by_id(variant_id)

        if variant is None:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                code="VARIANT_NOT_FOUND",
                message="Variant not found",
            )

        return variant

    async def list_variants(
        self,
        page: int,
        page_size: int,
        search: str | None = None,
        product_id: UUID | None = None,
        is_active: bool | None = None,
    ) -> tuple[list[Variant], int]:
        return await self.variant_repository.list_variants(
            page, page_size, search, product_id, is_active
        )

    
        




