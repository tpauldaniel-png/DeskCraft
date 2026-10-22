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


CATALOGUE_CACHE_VERSION_KEY = "deskcraft:catalogue:cache_version"


async def get_catalogue_cache_version(redis_client: Redis | None) -> str | None:
    if redis_client is None:
        return None

    try:
        version = await redis_client.get(CATALOGUE_CACHE_VERSION_KEY)
        return version if version is not None else "0"
    except RedisError:
        logger.warning("Failed to get catalogue cache version. bypassing cache.")
        return None


async def invalidate_catalogue_cache(redis_client: Redis | None) -> None:
    if redis_client is None:
        return

    try:
        version = await redis_client.incr(CATALOGUE_CACHE_VERSION_KEY)
        logger.info("Catalogue cache invalidated. New version: %s", version)
    except RedisError:
        logger.warning(
            "Failed to invalidate catalogue cache. Existing entries will retain their ttl."
        )
