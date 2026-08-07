from typing import Any
from fastapi.encoders import jsonable_encoder
from fastapi import FastAPI, Request

from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from starlette.responses import JSONResponse

from app.schemas.common import ErrorDetail, ErrorResponse



class AppException(Exception):
    def __init__(self, *, status_code: int, code: str, message: str, details: Any | None = None) -> None:
        self.status_code = status_code
        self.code = code
        self.message = message
        self.details = details
        super().__init__(message)



def create_error_content(*, code: str, message: str, details: Any | None = None):
    response = ErrorResponse(
        error = ErrorDetail(
            code=code,
            message=message,
            details=details,
        )
    )

    return jsonable_encoder(
        response,
        exclude_none=True,
    )


async def app_exception_handler(request: Request,exc: AppException) -> JSONResponse:

    return JSONResponse(
        status_code=exc.status_code,
        content=create_error_content(
            code=exc.code,
            message=exc.message,
            details=exc.details,
        ),
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    details = [
        {
            "field": ".".join(str(part) for part in error["loc"]),
            "message": error["msg"],
            "type": error["type"],
        }
        for error in exc.errors()
    ]

    return JSONResponse(
        status_code=422,
        content=create_error_content(
            code="VALIDATION_ERROR",
            message="Request validation failed",
            details=details,
        ),
    )

async def http_exception_handler(request: Request,exc: StarletteHTTPException,) -> JSONResponse:

    return JSONResponse(
        status_code=exc.status_code,
        content=create_error_content(
            code=f"HTTP_{exc.status_code}",
            message=str(exc.detail),
        ),
        headers=exc.headers,
    )

async def unexpected_exception_handler(request: Request,exc: Exception,) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content=create_error_content(
            code="INTERNAL_SERVER_ERROR",
            message="An unexpected error occurred",
        ),
    )



def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(AppException, app_exception_handler,)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(Exception, unexpected_exception_handler)