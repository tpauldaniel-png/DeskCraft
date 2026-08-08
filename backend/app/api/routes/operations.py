from typing import Annotated, Literal

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import get_db

router = APIRouter(tags=["Operations"])

DatabaseSession = Annotated[AsyncSession, Depends(get_db)]


class HealthResponse(BaseModel):
    status: Literal["healthy"]
    service: str


class ReadinessResponse(BaseModel):
    status: Literal["ready"]
    database: Literal["reachable"]


class VersionResponse(BaseModel):
    service: str
    version: str


@router.get(
    "/health", response_model=HealthResponse, summary="Check application health"
)
async def health_check() -> HealthResponse:
    return HealthResponse(status="healthy", service=settings.app_name)


@router.get(
    "/ready",
    response_model=ReadinessResponse,
    summary="Check application readiness",
    responses={
        status.HTTP_503_SERVICE_UNAVAILABLE: {
            "description": "A required dependency is unavailable"
        }
    },
)
async def readiness_check(db: DatabaseSession) -> ReadinessResponse:
    try:
        await db.execute(text("SELECT 1"))

    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database is unavailable",
        ) from exc

    return ReadinessResponse(
        status="ready",
        database="reachable",
    )


@router.get(
    "/version",
    response_model=VersionResponse,
    summary="Get application version",
)
async def version_check() -> VersionResponse:
    return VersionResponse(
        service=settings.app_name,
        version=settings.app_version,
    )
