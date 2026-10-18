import logging

from fastapi import Request
from redis.asyncio import Redis
from redis.exceptions import RedisError

logger = logging.getLogger("deskcraft.cache")


def get_redis_client(request: Request) -> Redis | None:

    return getattr(request.app.state, "redis", None)


async def get_cached_value(redis_client: Redis, key: str) -> str | None:
    if redis_client is None:
        return None

    try:
        return await redis_client.get(key)

    except RedisError:
        logger.warning("Cached read failed; falling back to database.")
        return None


async def set_cached_value(
    redis_client: Redis | None, key: str, value: str, ttl: int = 60
) -> None:

    if redis_client is None:
        return

    try:
        await redis_client.set(key, value, ex=ttl)

    except RedisError:
        logger.warning("Cached write failed; skipping cache storage.")
