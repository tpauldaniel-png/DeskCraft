import json
import logging
from decimal import Decimal
from hashlib import sha256
from uuid import UUID

from pydantic import ValidationError
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.cache import (
    get_cached_value,
    get_catalogue_cache_version,
    set_cached_value,
)
from app.core.config import settings
from app.core.exceptions import AppException
from app.modules.catalogue.repository import PublicProductRepository
from app.modules.catalogue.schemas.public_product import (
    ProductSort,
    PublicProductCardResponse,
    PublicProductDetailResponse,
    PublicProductListResponse,
    PublicProductVariant,
    PublicProductVariantImage,
)

logger = logging.getLogger("deskcraft.catalogue.cache")


class PublicProductService:
    def __init__(self, db: AsyncSession, redis_client: Redis | None = None):
        self.repository = PublicProductRepository(db)
        self.redis_client = redis_client if settings.catalogue_cache_enabled else None

    async def list_public_products(
        self,
        page: int = 1,
        page_size: int = 10,
        search: str | None = None,
        category_id: UUID | None = None,
        sort: ProductSort = "name_asc",
        min_price: Decimal | None = None,
        max_price: Decimal | None = None,
    ) -> tuple[list[PublicProductCardResponse], int]:

        try:
            if (
                min_price is not None
                and max_price is not None
                and min_price > max_price
            ):
                raise AppException(
                    status_code=400,
                    code="INVALID_PRICE_RANGE",
                    message="min_price cannot be greater than max_price",
                )

            parameters = {
                "page": page,
                "page_size": page_size,
                "search": search,
                "category_id": category_id,
                "sort": sort,
                "min_price": min_price,
                "max_price": max_price,
            }

            parameters_json = json.dumps(parameters, default=str, sort_keys=True)

            fingerprint = sha256(parameters_json.encode("utf-8")).hexdigest()

            version = await get_catalogue_cache_version(self.redis_client)

            cache_key = (
                f"deskcraft:catalogue:products:list:v1:g{version}:{fingerprint}"
                if version is not None
                else None
            )

            cached_value = (
                await get_cached_value(self.redis_client, cache_key)
                if cache_key is not None
                else None
            )

            if cached_value is not None:
                try:
                    cached_response = PublicProductListResponse.model_validate_json(
                        cached_value
                    )

                except ValidationError:
                    logger.warning(
                        "Invalid catalogue cache entry; falling back to database."
                    )
                else:
                    logger.info("Cache HIT for catalogue list.")
                    return cached_response.items, cached_response.total

            logger.info("Cache MISS for catalogue products; querying database.")

            items, total = await self.repository.list_public_products(
                page=page,
                page_size=page_size,
                search=search,
                category_id=category_id,
                sort=sort,
                min_price=min_price,
                max_price=max_price,
            )

            items = [PublicProductCardResponse.model_validate(item) for item in items]

            response = PublicProductListResponse(
                items=items,
                total=total,
                page=page,
                page_size=page_size,
                sort=sort,
                min_price=min_price,
                max_price=max_price,
            )

            if cache_key is not None:
                await set_cached_value(
                    self.redis_client, cache_key, response.model_dump_json(), ttl=60
                )

            return items, total

        except AppException:
            raise

        except Exception as e:
            logger.exception("Unexpected error while listing public products.")
            raise AppException(
                status_code=500,
                code="INTERNAL_SERVER_ERROR",
                message="An unexpected error occurred while listing public products",
            ) from e

    async def get_public_product_by_slug(
        self, slug: str
    ) -> PublicProductDetailResponse:

        try:
            version = await get_catalogue_cache_version(self.redis_client)

            cache_key = (
                f"deskcraft:catalogue:products:detail:v1:g{version}:{slug}"
                if version is not None
                else None
            )

            cached_value = (
                await get_cached_value(self.redis_client, cache_key)
                if cache_key is not None
                else None
            )

            if cached_value is not None:
                try:
                    cached_response = PublicProductDetailResponse.model_validate_json(
                        cached_value
                    )

                except ValidationError:
                    logger.warning(
                        "Invalid catalogue cache entry; falling back to database."
                    )
                else:
                    logger.info("Cache HIT for public product detail.")
                    return cached_response

            logger.info("Cache MISS for public product detail; querying database.")

            product = await self.repository.get_public_product_by_slug(slug=slug)

            if not product:
                raise AppException(
                    status_code=404,
                    code="PRODUCT_NOT_FOUND",
                    message="Product not found",
                )

            variant_rows = await self.repository.list_public_product_variants(
                product_id=product["product_id"]
            )

            variant_ids = [variant["variant_id"] for variant in variant_rows]

            image_rows = await self.repository.list_public_variant_images(
                variant_ids=variant_ids
            )

            images_by_variant: dict[UUID, list[PublicProductVariantImage]] = {}

            for image in image_rows:
                variant_id = image["variant_id"]

                if variant_id not in images_by_variant:
                    images_by_variant[variant_id] = []

                images_by_variant[variant_id].append(
                    PublicProductVariantImage.model_validate(image)
                )

            variants = [
                PublicProductVariant(
                    variant_id=variant["variant_id"],
                    name=variant["name"],
                    price=variant["price"],
                    images=images_by_variant.get(variant["variant_id"], []),
                )
                for variant in variant_rows
            ]

            response = PublicProductDetailResponse(
                product_id=product["product_id"],
                category_id=product["category_id"],
                category_name=product["category_name"],
                name=product["name"],
                slug=product["slug"],
                description=product["description"],
                specifications=product["specifications"],
                variants=variants,
            )

            if cache_key is not None:
                await set_cached_value(
                    self.redis_client, cache_key, response.model_dump_json(), ttl=60
                )

            return response

        except AppException:
            raise

        except Exception as e:
            raise AppException(
                status_code=500,
                code="INTERNAL_SERVER_ERROR",
                message="An unexpected error occurred while retrieving public product by slug",
            ) from e
