from fastapi import FastAPI

from app.core.config import settings
from app.api.routes.operations import router as operations_router

from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging
from app.middleware.request_logging import request_logging_middleware


configure_logging()

def create_application() -> FastAPI:
    application = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        debug=settings.debug,
        description="Backend API for the DeskCraft e-commerce platform"
    )


    register_exception_handlers(application)

    application.middleware("http")(request_logging_middleware)

    application.include_router(operations_router)


    @application.get("/", tags=["Root"])
    async def root() -> dict[str, str]:
        return {
            "name": settings.app_name,
            "version": settings.app_version,
            "environment": settings.environment,
            "message":"DeskCraft API is running"
        }

    return application


app = create_application()


