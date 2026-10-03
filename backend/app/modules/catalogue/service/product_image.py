from uuid import UUID

from fastapi import UploadFile, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import AppException
from app.modules.catalogue.models.product_images import ProductImage
from app.modules.catalogue.repository import ProductImageRepository, VariantRepository
from app.modules.catalogue.service.cloudinary_storage import CloudinaryStorage


class ProductImageService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = ProductImageRepository(db)
        self.cloudinary_storage = CloudinaryStorage(
            cloud_name=settings.cloudinary_cloud_name,
            api_key=settings.cloudinary_api_key,
            api_secret=settings.cloudinary_api_secret,
        )

    async def upload_product_image(
        self, variant_id: UUID, image: UploadFile, alt_text: str
    ) -> ProductImage:

        variant = await VariantRepository(self.db).get_variant_by_id(variant_id)
        if not variant:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                code="VARIANT_NOT_FOUND",
                message="Variant not found",
            )

        allowed_types = {"image/jpeg", "image/png", "image/gif", "image/webp"}
        if image.content_type not in allowed_types:
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                code="UNSUPPORTED_IMAGE_TYPE",
                message="Supported image types are JPEG, PNG, GIF, and WebP.",
            )

        alt_text = alt_text.strip()
        if not alt_text or len(alt_text) > 255:
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                code="INVALID_ALT_TEXT",
                message="Alt text must be between 1 and 255 characters.",
            )

        image_file_min_size = 1024  # 1KB
        image_file_max_size = 5 * 1024 * 1024  # 5MB
        contents = await image.read(
            image_file_max_size + 1
        )  # Read up to max size + 1 to check for overflow

        if not image_file_min_size <= len(contents) <= image_file_max_size:
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                code="INVALID_IMAGE_SIZE",
                message=" Image size must be between 1KB and 5MB.",
            )

        await image.seek(
            0
        )  # Reset the file pointer to the beginning for cloudinary upload

        try:
            upload_result = await self.cloudinary_storage.upload_file(image)
            next_sort_order = await self.repository.get_next_sort_order_for_variant(
                variant_id
            )
            product_image = ProductImage(
                variant_id=variant_id,
                image_url=upload_result["secure_url"],
                cloudinary_public_id=upload_result["public_id"],
                alt_text=alt_text,
                sort_order=next_sort_order,
            )
            created_product_image = await self.repository.create_product_image(
                product_image
            )
            await self.db.commit()
            await self.db.refresh(created_product_image)

        except IntegrityError as error:
            await self.db.rollback()
            raise AppException(
                status_code=status.HTTP_409_CONFLICT,
                code="IMAGE_UPLOAD_FAILED",
                message="Failed to upload image due to a database integrity error.",
            ) from error

        except SQLAlchemyError:
            await self.db.rollback()
            raise AppException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                code="IMAGE_UPLOAD_FAILED",
                message="Failed to upload image due to a database error.",
            )

        return created_product_image

    async def list_product_images_by_variant(
        self, variant_id: UUID
    ) -> list[ProductImage]:

        variant = await VariantRepository(self.db).get_variant_by_id(variant_id)
        if not variant:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                code="VARIANT_NOT_FOUND",
                message="Variant not found",
            )

        product_images = await self.repository.list_product_images_by_variant(
            variant_id
        )
        return product_images

    async def update_product_image_alt_text(
        self, product_image_id: UUID, new_alt_text: str, variant_id: UUID
    ) -> ProductImage:

        variant = await VariantRepository(self.db).get_variant_by_id(variant_id)
        if not variant:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                code="VARIANT_NOT_FOUND",
                message="Variant not found",
            )

        product_image = await self.repository.get_product_image_by_id(product_image_id)
        if not product_image:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                code="PRODUCT_IMAGE_NOT_FOUND",
                message="Product image not found",
            )

        if product_image.variant_id != variant_id:
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                code="VARIANT_MISMATCH",
                message="The product image does not belong to the specified variant.",
            )

        new_alt_text = new_alt_text.strip()
        if not new_alt_text or len(new_alt_text) > 255:
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                code="INVALID_ALT_TEXT",
                message="Alt text must be between 1 and 255 characters.",
            )

        product_image.alt_text = new_alt_text

        try:
            updated_product_image = await self.repository.update_product_image(
                product_image
            )
            await self.db.commit()
            await self.db.refresh(updated_product_image)

        except IntegrityError as error:
            await self.db.rollback()
            raise AppException(
                status_code=status.HTTP_409_CONFLICT,
                code="ALT_TEXT_UPDATE_FAILED",
                message="Failed to update alt text due to a database integrity error.",
            ) from error

        except SQLAlchemyError:
            await self.db.rollback()
            raise AppException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                code="ALT_TEXT_UPDATE_FAILED",
                message="Failed to update alt text due to a database error.",
            )

        return updated_product_image

    async def reorder_images(
        self, variant_id: UUID, image_ids: list[UUID]
    ) -> list[ProductImage]:
        variant = await VariantRepository(self.db).get_variant_by_id(variant_id)
        if not variant:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                code="VARIANT_NOT_FOUND",
                message="Variant not found",
            )

        try:
            images = await self.repository.list_images_for_reorder(variant_id)
            images_by_id = {}

            for image in images:
                images_by_id[image.product_image_id] = image

            if (
                len(images) != len(image_ids)
                or len(set(image_ids)) != len(image_ids)
                or set(image_ids) != set(images_by_id)
            ):
                raise AppException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    code="INVALID_IMAGE_IDS",
                    message="The provided image IDs do not match the existing images for this variant.",
                )

            for position, image_id in enumerate(image_ids, start=1):
                images_by_id[image_id].sort_order = position

            await self.db.commit()

        except SQLAlchemyError:
            await self.db.rollback()
            raise AppException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                code="IMAGE_REORDER_FAILED",
                message="Failed to reorder images due to a database error.",
            )

    async def delete_product_image(
        self, product_image_id: UUID, variant_id: UUID
    ) -> None:

        image = await self.repository.get_product_image_by_id(product_image_id)

        if image is None or image.variant_id != variant_id:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                code="PRODUCT_IMAGE_NOT_FOUND",
                message="Product image not found for the specified variant.",
            )

        public_id = image.cloudinary_public_id

        if not public_id:
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                code="CLOUDINARY_PUBLIC_ID_MISSING",
                message="Cloudinary public ID is missing for the product image.",
            )

        try:
            await self.cloudinary_storage.delete_file(public_id)

        except Exception as e:
            raise AppException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                code="CLOUDINARY_DELETE_FAILED",
                message=f"Failed to delete image from Cloudinary: {str(e)}",
            )

        try:
            await self.repository.delete_product_image(image)

            remaining_images = await self.repository.list_product_images_by_variant(
                variant_id
            )

            for position, img in enumerate(remaining_images, start=1):
                img.sort_order = position

            await self.db.commit()

        except SQLAlchemyError as error:
            await self.db.rollback()
            raise AppException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                code="PRODUCT_IMAGE_DELETE_FAILED",
                message="Failed to delete product image due to a database error.",
            ) from error
