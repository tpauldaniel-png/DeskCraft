from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, Path, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.modules.auth.dependencies import require_admin
from app.modules.catalogue.schemas.product_image import (
    ProductImageAltTextUpdateRequest,
    ProductImageListResponse,
    ProductImageReorderRequest,
    ProductImageResponse,
)
from app.modules.catalogue.service.product_image import ProductImageService
from app.modules.users.models.users import User

router = APIRouter(
    prefix="/api/v1/variants/{variant_id}/images", tags=["Product Image"]
)


@router.post(
    "", status_code=status.HTTP_201_CREATED, response_model=ProductImageResponse
)
async def upload_product_image(
    variant_id: Annotated[UUID, Path()],
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_admin)],
    image: UploadFile = File(...),
    alt_text: str = Form(...),
) -> ProductImageResponse:

    service = ProductImageService(db)
    product_image = await service.upload_product_image(variant_id, image, alt_text)

    return ProductImageResponse.model_validate(product_image)


@router.get("", response_model=ProductImageListResponse)
async def list_product_images(
    variant_id: Annotated[UUID, Path()],
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_admin)],
) -> ProductImageListResponse:

    service = ProductImageService(db)
    product_images = await service.list_product_images_by_variant(
        variant_id=variant_id,
    )

    return ProductImageListResponse(
        items=[
            ProductImageResponse.model_validate(product_image)
            for product_image in product_images
        ],
    )



@router.patch("/{image_id}", response_model=ProductImageResponse)
async def update_product_image(
    variant_id: Annotated[UUID, Path()],
    image_id: Annotated[UUID, Path()],
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_admin)],
    payload:ProductImageAltTextUpdateRequest,
) -> ProductImageResponse:

    service = ProductImageService(db)
    product_image = await service.update_product_image_alt_text(
        product_image_id=image_id, new_alt_text=payload.alt_text, variant_id=variant_id
    )

    return ProductImageResponse.model_validate(product_image)



@router.put("/order", status_code=status.HTTP_204_NO_CONTENT)
async def reorder_product_images(
    variant_id: Annotated[UUID, Path()],
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(require_admin)],
    payload: ProductImageReorderRequest,
) -> None:

    service = ProductImageService(db)
    await service.reorder_images(variant_id=variant_id, image_ids=payload.image_ids)