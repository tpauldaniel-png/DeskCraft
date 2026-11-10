import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from redis.asyncio import Redis
from redis.exceptions import RedisError

from app.api.routes.operations import router as operations_router
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging
from app.middleware.request_logging import request_logging_middleware
from app.modules.addresses.routes.address import router as address_router
from app.modules.auth.routes import router as auth_router
from app.modules.cart.routes.cart import router as cart_router
from app.modules.catalogue.routes.category import router as catalogue_router
from app.modules.catalogue.routes.product import router as product_router
from app.modules.catalogue.routes.product_image import router as product_image_router
from app.modules.catalogue.routes.public_category import (
    router as public_category_router,
)
from app.modules.catalogue.routes.public_product import router as public_product_router
from app.modules.catalogue.routes.variant import router as variant_router

configure_logging()

logger = logging.getLogger("deskcraft.main")


@asynccontextmanager
async def lifespan(application: FastAPI) -> AsyncIterator[None]:
    async with Redis.from_url(
        settings.redis_url,
        decode_responses=True,
        socket_connect_timeout=1,
        socket_timeout=1,
    ) as redis_client:
        application.state.redis = redis_client

        try:
            await redis_client.ping()
            logger.info("Redis connection established successfully.")
        except RedisError:
            logger.warning(
                "Redis connection failed. The application will continue without Redis."
            )
        yield


def create_application() -> FastAPI:
    application = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        debug=settings.debug,
        description="Backend API for the DeskCraft e-commerce platform",
        lifespan=lifespan,
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5174",
        ],
        allow_credentials=True,
        allow_methods=[
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",
        ],
        allow_headers=[
            "Accept",
            "Content-Type",
        ],
    )

    register_exception_handlers(application)

    application.middleware("http")(request_logging_middleware)

    application.include_router(operations_router)
    application.include_router(auth_router)
    application.include_router(catalogue_router)
    application.include_router(product_router)
    application.include_router(variant_router)
    application.include_router(product_image_router)
    application.include_router(public_product_router)
    application.include_router(public_category_router)
    application.include_router(cart_router)
    application.include_router(address_router)

    @application.get("/", tags=["Root"])
    async def root() -> dict[str, str]:
        return {
            "name": settings.app_name,
            "version": settings.app_version,
            "environment": settings.environment,
            "message": "DeskCraft API is running",
        }

    return application


app = create_application()
