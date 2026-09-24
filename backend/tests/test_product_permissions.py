from uuid import uuid4

import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.users.models.users import User

pytestmark = pytest.mark.anyio


async def create_admin_user(client: AsyncClient, db_session: AsyncSession) -> User:
    admin_user_data = {
        "first_name": "Admin",
        "last_name": "User",
        "email": "admin@example.com",
        "password": "securepassword",
    }

    register_response = await client.post(
        "/api/v1/auth/register",
        json=admin_user_data,
    )

    assert register_response.status_code == 201

    result = await db_session.execute(
        select(User).where(User.email == admin_user_data["email"])
    )

    admin_user = result.scalar_one()

    admin_user.role = "admin"

    await db_session.flush()

    return admin_user


async def admin_login(client: AsyncClient, admin_user: User) -> None:
    login_response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": admin_user.email,
            "password": "securepassword",
        },
    )

    assert login_response.status_code == 200
    assert client.cookies.get("access_token") is not None


async def create_test_category(client: AsyncClient) -> str:
    category_data = {
        "name": "Test Category",
        "description": "This is a test category.",
    }

    response = await client.post(
        "/api/v1/categories",
        json=category_data,
    )

    assert response.status_code == 201

    return response.json()["category_id"]


async def test_unauthenticated_user_cannot_create_product(client: AsyncClient) -> None:

    product_data = {
        "category_id": str(uuid4()),
        "name": "Test Product",
        "description": "This is a test product used for permission testing.",
    }

    response = await client.post(
        "/api/v1/products",
        json=product_data,
    )

    assert response.status_code == 401


async def test_customer_user_cannot_create_product(client: AsyncClient) -> None:
    # Create a test customer user
    user_data = {
        "first_name": "Customer",
        "last_name": "User",
        "email": "customer@example.com",
        "password": "securepassword",
    }

    response = await client.post(
        "/api/v1/auth/register",
        json=user_data,
    )

    assert response.status_code == 201

    # Log in as the customer user to get an access token
    login_response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": user_data["email"],
            "password": user_data["password"],
        },
    )

    print("Login response:", login_response.json())
    assert login_response.status_code == 200
    assert client.cookies.get("access_token") is not None

    # Attempt to create a product as the customer user
    product_data = {
        "category_id": str(uuid4()),
        "name": "Test Product",
        "description": "This is a test product used for permission testing.",
    }

    response = await client.post(
        "/api/v1/products",
        json=product_data,
    )

    assert response.status_code == 403


async def test_admin_user_can_create_product(
    client: AsyncClient, db_session: AsyncSession
) -> None:

    admin_user = await create_admin_user(client, db_session)

    await admin_login(client, admin_user)

    category_id = await create_test_category(client)

    product_data = {
        "category_id": category_id,
        "name": "Test Product",
        "description": "This is a test product used for permission testing.",
    }

    response = await client.post(
        "/api/v1/products",
        json=product_data,
    )

    assert response.status_code == 201

    response_data = response.json()

    assert response_data["name"] == "Test Product"
    assert response_data["category_id"] == category_id
    assert response_data["is_active"] is True


async def test_unauthenticated_user_cannot_update_product(client: AsyncClient) -> None:
    product_id = str(uuid4())
    update_data = {"is_active": False}

    response = await client.patch(
        f"/api/v1/products/{product_id}",
        json=update_data,
    )

    assert response.status_code == 401


async def test_customer_user_cannot_update_product(client: AsyncClient) -> None:
    user_data = {
        "first_name": "Customer",
        "last_name": "User",
        "email": "customer@example.com",
        "password": "securepassword",
    }

    response = await client.post(
        "/api/v1/auth/register",
        json=user_data,
    )

    assert response.status_code == 201

    # Log in as the customer user to get an access token
    login_response = await client.post(
        "/api/v1/auth/login",
        json={
            "email": user_data["email"],
            "password": user_data["password"],
        },
    )

    assert login_response.status_code == 200
    assert client.cookies.get("access_token") is not None

    # Attempt to update a product as the customer user
    product_id = str(uuid4())
    update_data = {"is_active": False}

    response = await client.patch(
        f"/api/v1/products/{product_id}",
        json=update_data,
    )

    assert response.status_code == 403


async def test_admin_user_can_update_product(
    client: AsyncClient, db_session: AsyncSession
) -> None:

    admin_user = await create_admin_user(client, db_session)
    await admin_login(client, admin_user)

    category_id = await create_test_category(client)

    product_data = {
        "category_id": category_id,
        "name": "Test Product",
        "description": "This is a test product used for permission testing.",
    }

    response = await client.post(
        "/api/v1/products",
        json=product_data,
    )

    assert response.status_code == 201

    response_data = response.json()

    assert response_data["name"] == "Test Product"
    assert response_data["category_id"] == category_id
    assert response_data["is_active"] is True

    product_id = response_data["product_id"]

    update_data = {"is_active": False}

    update_response = await client.patch(
        f"/api/v1/products/{product_id}",
        json=update_data,
    )

    assert update_response.status_code == 200


async def test_admin_user_create_product_without_name(
    client: AsyncClient, db_session: AsyncSession
) -> None:
    admin_user = await create_admin_user(client, db_session)
    await admin_login(client, admin_user)

    category_id = await create_test_category(client)

    product_data = {
        "category_id": category_id,
        "description": "This is a test product used for permission testing.",
    }

    response = await client.post(
        "/api/v1/products",
        json=product_data,
    )

    assert response.status_code == 422


async def test_admin_user_create_product_without_category_id(
    client: AsyncClient, db_session: AsyncSession
) -> None:
    admin_user = await create_admin_user(client, db_session)
    await admin_login(client, admin_user)

    product_data = {
        "name": "Test Product",
        "description": "This is a test product used for permission testing.",
    }

    response = await client.post(
        "/api/v1/products",
        json=product_data,
    )

    assert response.status_code == 422


async def test_admin_user_create_product_with_invalid_uuid(
    client: AsyncClient, db_session: AsyncSession
) -> None:
    admin_user = await create_admin_user(client, db_session)
    await admin_login(client, admin_user)

    invalid_category_id = "invalid-uuid"

    product_data = {
        "category_id": invalid_category_id,
        "name": "Test Product",
        "description": "This is a test product used for permission testing.",
    }

    response = await client.post(
        "/api/v1/products",
        json=product_data,
    )

    assert response.status_code == 422


async def test_admin_user_create_product_with_whitespace_name(
    client: AsyncClient, db_session: AsyncSession
) -> None:
    admin_user = await create_admin_user(client, db_session)
    await admin_login(client, admin_user)

    category_id = await create_test_category(client)

    product_data = {
        "category_id": category_id,
        "name": "   ",
        "description": "This is a test product used for permission testing.",
    }

    response = await client.post(
        "/api/v1/products",
        json=product_data,
    )

    assert response.status_code == 422


async def test_admin_user_update_product_with_empty_body(
    client: AsyncClient, db_session: AsyncSession
) -> None:
    admin_user = await create_admin_user(client, db_session)
    await admin_login(client, admin_user)

    category_id = await create_test_category(client)

    product_data = {
        "category_id": category_id,
        "name": "Test Product",
        "description": "This is a test product used for permission testing.",
    }

    response = await client.post(
        "/api/v1/products",
        json=product_data,
    )

    assert response.status_code == 201

    product_id = response.json()["product_id"]

    update_response = await client.patch(
        f"/api/v1/products/{product_id}",
        json={},
    )

    assert update_response.status_code == 422


async def test_admin_user_update_product_required_field_with_null(
    client: AsyncClient, db_session: AsyncSession
) -> None:
    admin_user = await create_admin_user(client, db_session)
    await admin_login(client, admin_user)

    category_id = await create_test_category(client)

    product_data = {
        "category_id": category_id,
        "name": "Test Product",
        "description": "This is a test product used for permission testing.",
    }

    response = await client.post(
        "/api/v1/products",
        json=product_data,
    )

    assert response.status_code == 201

    product_id = response.json()["product_id"]

    update_data = {"name": None}

    update_response = await client.patch(
        f"/api/v1/products/{product_id}",
        json=update_data,
    )

    assert update_response.status_code == 422


async def test_admin_user_update_product_with_description_to_null(
    client: AsyncClient, db_session: AsyncSession
) -> None:
    admin_user = await create_admin_user(client, db_session)
    await admin_login(client, admin_user)

    category_id = await create_test_category(client)

    product_data = {
        "category_id": category_id,
        "name": "Test Product",
        "description": "This is a test product used for permission testing.",
    }

    response = await client.post(
        "/api/v1/products",
        json=product_data,
    )

    assert response.status_code == 201

    product_id = response.json()["product_id"]

    update_data = {"description": None}

    update_response = await client.patch(
        f"/api/v1/products/{product_id}",
        json=update_data,
    )

    assert update_response.status_code == 200
