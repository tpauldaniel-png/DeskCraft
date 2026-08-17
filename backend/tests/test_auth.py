from datetime import timedelta

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.auth.repository import UserRepository
from app.modules.auth.tokens import create_access_token

pytestmark = pytest.mark.anyio


async def create_test_user(
    client: AsyncClient,
    first_name: str = "test",
    last_name: str = "user",
    email: str = "user@example.com",
    phone_number: str = "1234567890",
    password: str = "Testpassword123",
):
    response = await client.post(
        "/api/v1/auth/register",
        json={
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "phone_number": phone_number,
            "password": password,
        },
    )

    assert response.status_code == 201, f"failed to create user: {response.text}"

    return response


async def test_registration_succeeds(
    client: AsyncClient,
) -> None:
    response = await create_test_user(client)

    assert response.status_code == 201
    assert "password_hash" not in response.text
    assert "StrongPassword123!" not in response.text


async def test_registration_for_duplicate_email(client: AsyncClient) -> None:

    await create_test_user(client)

    response1 = await client.post(
        "/api/v1/auth/register",
        json={
            "first_name": "user",
            "last_name": "test",
            "email": "user@example.com",
            "phone_number": "9874561230",
            "password": "password456",
        },
    )

    assert response1.status_code == 409, response1.text
    assert response1.json()["error"]["code"] == "EMAIL_ALREADY_EXISTS"


async def test_registration_for_invalid_request(client: AsyncClient) -> None:

    response = await client.post(
        "/api/v1/auth/register",
        json={
            "first_name": "user",
            "last_name": "test",
            "email": "user@example.com",
            "phone_number": "7894561230",
        },
    )

    assert response.status_code == 422, response.text
    assert response.json()["error"]["details"][0]["field"] == "body.password"


async def login_test_user(
    client: AsyncClient,
    email: str = "user@example.com",
    password: str = "Testpassword123",
):

    response = await client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": password},
    )

    assert response.status_code == 200, response.text

    access_token = response.cookies.get("access_token")

    assert access_token is not None

    return access_token


async def test_login_sets_access_token_cookie(client: AsyncClient):

    await create_test_user(client)

    access_token = await login_test_user(client)

    assert access_token


async def test_login_cookie_is_httponly(
    client: AsyncClient,
) -> None:
    await create_test_user(client)

    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "user@example.com",
            "password": "Testpassword123",
        },
    )

    assert response.status_code == 200, response.text

    set_cookie = response.headers["set-cookie"].lower()

    assert "access_token=" in set_cookie
    assert "httponly" in set_cookie
    assert "samesite=lax" in set_cookie


async def test_login_with_wrong_password_returns_401(
    client: AsyncClient,
) -> None:
    await create_test_user(client)

    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "user@example.com",
            "password": "WrongPassword123",
        },
    )

    assert response.status_code == 401, response.text
    assert response.json()["error"]["code"] == "INVALID_CREDENTIALS"
    assert client.cookies.get("access_token") is None


async def test_login_with_unknown_email_returns_401(
    client: AsyncClient,
) -> None:
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "unknown@example.com",
            "password": "Testpassword123",
        },
    )

    assert response.status_code == 401, response.text
    assert response.json()["error"]["code"] == "INVALID_CREDENTIALS"
    assert client.cookies.get("access_token") is None


async def test_login_without_password_returns_422(
    client: AsyncClient,
) -> None:
    response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": "user@example.com",
        },
    )

    assert response.status_code == 422, response.text
    assert client.cookies.get("access_token") is None


async def test_login_cookie_allows_access_to_current_user(client: AsyncClient) -> None:
    await create_test_user(client)
    await login_test_user(client)

    response = await client.get("/api/v1/auth/me")

    assert response.status_code == 200, response.text
    assert response.json()["email"] == "user@example.com"


async def test_current_user_succeeds(client: AsyncClient) -> None:

    await create_test_user(client)
    await login_test_user(client)

    response = await client.get("/api/v1/auth/me")

    assert response.status_code == 200, response.text

    assert "password" not in response.text
    assert "password_hash" not in response.text


async def test_get_current_user_without_cookie_returns_401(
    client: AsyncClient,
) -> None:

    client.cookies.clear()

    response = await client.get("/api/v1/auth/me")

    assert response.status_code == 401, response.text
    assert response.json()["error"]["code"] == "AUTHENTICATION_REQUIRED"


async def test_get_current_user_with_invalid_token_returns_401(
    client: AsyncClient,
) -> None:

    client.cookies.clear()
    client.cookies.set(
        "access_token",
        "not-a-valid-jwt-token",
    )

    response = await client.get("/api/v1/auth/me")

    assert response.status_code == 401, response.text
    assert response.json()["error"]["code"] == "INVALID_ACCESS_TOKEN"


async def test_get_current_user_with_expired_token_returns_401(
    client: AsyncClient,
) -> None:
    expired_token = create_access_token(
        user_id="valid-user-id",
        role="customer",
        expires_delta=timedelta(seconds=-1),
    )

    client.cookies.set("access_token", expired_token)

    response = await client.get("/api/v1/auth/me")

    assert response.status_code == 401, response.text
    assert response.json()["error"]["code"] == "INVALID_ACCESS_TOKEN"


async def test_get_current_user_when_user_is_inactive_returns_403(
    client: AsyncClient, db_session: AsyncSession
) -> None:

    await create_test_user(client)
    await login_test_user(client)

    repository = UserRepository(db_session)

    user = await repository.get_user_by_email("user@example.com")
    assert user is not None

    user.is_active = False
    await db_session.commit()

    response = await client.get("/api/v1/auth/me")

    assert response.status_code == 403, response.text
    assert response.json()["error"]["code"] == "INACTIVE_USER"


async def test_admin_check_allows_admin_user(
    client: AsyncClient,
    db_session: AsyncSession,
) -> None:
    await create_test_user(client)

    repository = UserRepository(db_session)
    user = await repository.get_user_by_email("user@example.com")

    assert user is not None

    user.role = "admin"
    await db_session.commit()

    await login_test_user(client)

    response = await client.get("/api/v1/auth/admin-check")

    assert response.status_code == 200, response.text
    assert response.json()["email"] == "user@example.com"
    assert "password_hash" not in response.text


async def test_admin_check_rejects_customer_user(
    client: AsyncClient,
) -> None:
    await create_test_user(client)
    await login_test_user(client)

    response = await client.get("/api/v1/auth/admin-check")

    assert response.status_code == 403, response.text
    assert response.json()["error"]["code"] == "REQUIRE_ADMIN_ACCESS"


async def test_admin_check_without_cookie_returns_401(
    client: AsyncClient,
) -> None:
    client.cookies.clear()

    response = await client.get("/api/v1/auth/admin-check")

    assert response.status_code == 401, response.text
    assert response.json()["error"]["code"] == "AUTHENTICATION_REQUIRED"


async def test_logout_clears_access_token_cookie(
    client: AsyncClient,
) -> None:
    await create_test_user(client)
    await login_test_user(client)

    assert client.cookies.get("access_token") is not None

    response = await client.post("/api/v1/auth/logout")

    assert response.status_code == 204, response.text
    assert response.content == b""
    assert client.cookies.get("access_token") is None

    set_cookie = response.headers["set-cookie"].lower()

    assert "access_token=" in set_cookie
    assert "max-age=0" in set_cookie


async def test_protected_endpoint_rejects_user_after_logout(
    client: AsyncClient,
) -> None:
    await create_test_user(client)
    await login_test_user(client)

    logout_response = await client.post("/api/v1/auth/logout")
    assert logout_response.status_code == 204

    response = await client.get("/api/v1/auth/me")

    assert response.status_code == 401, response.text
    assert response.json()["error"]["code"] == "AUTHENTICATION_REQUIRED"


async def test_logout_without_authentication_returns_204(
    client: AsyncClient,
) -> None:
    client.cookies.clear()

    response = await client.post("/api/v1/auth/logout")

    assert response.status_code == 204, response.text
    assert response.content == b""
    assert client.cookies.get("access_token") is None
