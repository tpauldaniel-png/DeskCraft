import os
from collections.abc import AsyncGenerator

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.db.base import Base
from app.db.session import get_db
from app.main import app

TEST_DATABASE_URL = os.getenv("TEST_DATABASE_URL")

if TEST_DATABASE_URL is None:
    raise RuntimeError("TEST_DATABASE_URL must be configured before running tests")

database_name = make_url(TEST_DATABASE_URL).database or ""

if not database_name.endswith("_test"):
    raise RuntimeError("Tests must use a database whose name ends with '_test'")


@pytest.fixture(scope="session")
def anyio_backend() -> str:
    return "asyncio"


@pytest.fixture(scope="session")
def test_engine() -> AsyncEngine:
    engine = create_async_engine(
        TEST_DATABASE_URL,
        pool_pre_ping=True,
    )
    return engine


@pytest.fixture(scope="session", autouse=True)
async def setup_database(
    test_engine: AsyncEngine,
    anyio_backend: str,
) -> AsyncGenerator[None]:
    assert anyio_backend == "asyncio"

    async with test_engine.begin() as connection:
        await connection.run_sync(Base.metadata.drop_all)
        await connection.run_sync(Base.metadata.create_all)

    yield

    try:
        async with test_engine.begin() as connection:
            await connection.run_sync(Base.metadata.drop_all)
    finally:
        await test_engine.dispose()


@pytest.fixture
async def db_session(
    test_engine: AsyncEngine,
) -> AsyncGenerator[AsyncSession]:
    async with test_engine.connect() as connection:
        transaction = await connection.begin()

        session_factory = async_sessionmaker(
            bind=connection,
            class_=AsyncSession,
            expire_on_commit=False,
            join_transaction_mode="create_savepoint",
        )

        try:
            async with session_factory() as session:
                yield session
        finally:
            if transaction.is_active:
                await transaction.rollback()


@pytest.fixture
async def client(
    db_session: AsyncSession,
) -> AsyncGenerator[AsyncClient]:

    async def override_get_db() -> AsyncGenerator[AsyncSession]:
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    try:
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
        ) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.pop(get_db, None)
