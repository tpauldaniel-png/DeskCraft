from uuid import UUID

from fastapi import UploadFile, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException
from app.modules.catalogue.models.product_images import ProductImage
from app.modules.catalogue.repository import ProductImageRepository, VariantRepository
from app.modules.catalogue.service.cloudinary_storage import CloudinaryStorage


class ProductImageService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repository = ProductImageRepository(db)
        self.cloudinary_storage = CloudinaryStorage(
            cloud_name="your_cloud_name",
            api_key="your_api_key",
            api_secret="your_api_secret",
            secure=True,
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
            product_image = ProductImage(
                variant_id=variant_id,
                image_url=upload_result["secure_url"],
                cloudinary_public_id=upload_result["public_id"],
                alt_text=alt_text,
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
