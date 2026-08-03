from fastapi import FastAPI

from app.core.config import settings

def create_application() -> FastAPI:
    application = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        debug=settings.debug,
        description="Backend API for the DeskCraft e-commerce platform"
    )
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