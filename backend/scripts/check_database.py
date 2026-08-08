import asyncio

from sqlalchemy import text

from app.db.session import engine


async def check_database() -> None:
    try:
        async with engine.connect() as connection:
            result = await connection.execute(
                text(
                    """
                SELECT
                    current_database(),
                    current_user,
                    version()
                """
                )
            )

            database_name, database_user, database_version = result.one()

            print("Database connection successful")
            print(f"Database: {database_name}")
            print(f"User: {database_user}")
            print(f"Version: {database_version}")

    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(
        check_database(),
        loop_factory=asyncio.SelectorEventLoop,
    )
