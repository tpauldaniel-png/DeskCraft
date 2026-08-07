import logging

from time import perf_counter

from fastapi import Request
from starlette.middleware.base import RequestResponseEndpoint
from starlette.responses import Response

logger = logging.getLogger("deskcraft.requests")



async def request_logging_middleware(request: Request, call_next: RequestResponseEndpoint):
    started_at = perf_counter()

    try:
        response = await call_next(request)

    except Exception:
        duration_ms = (perf_counter() - started_at) * 1000

        logger.exception(
            "%s %s failed %.2fms",
            request.method,
            request.url.path,
            duration_ms,
        )
        raise

    

    duration_ms = (perf_counter() - started_at) * 1000

    logger.info(
        "%s %s %s %.2fms",
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
    )

    return response