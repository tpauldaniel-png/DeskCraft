from decimal import Decimal
from uuid import uuid4

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.catalogue.models.category import Category
from app.modules.catalogue.models.product import Product
from app.modules.catalogue.models.variant import Variant
from tests.test_auth import create_test_user, login_test_user

pytestmark = pytest.mark.anyio


async def test_new_customer_has_empty_cart(client: AsyncClient) -> None:
    await create_test_user(client)
    await login_test_user(client)

    response = await client.get("/api/v1/cart/")

    assert response.status_code == 200, response.text

    cart = response.json()
    assert cart["items"] == []
    assert cart["total_quantity"] == 0
    assert Decimal(str(cart["cart_subtotal"])) == Decimal("0.00")


@pytest.fixture
async def active_variant_id(db_session: AsyncSession) -> str:

    suffix = uuid4().hex[:12]

    category = Category(
        name=f"Test Category {suffix}",
        is_active=True,
    )

    db_session.add(category)
    await db_session.flush()

    product = Product(
        category_id=category.category_id,
        name=f"Test Product {suffix}",
        slug=f"test-product-{suffix}",
        description="Test Product Description",
        is_active=True,
    )

    db_session.add(product)
    await db_session.flush()

    variant = Variant(
        product_id=product.product_id,
        name=f"Test Variant {suffix}",
        price=Decimal("500.00"),
        sku=f"TESTSKU-{suffix}",
        is_active=True,
    )

    db_session.add(variant)
    await db_session.flush()

    variant_id = str(variant.variant_id)
    await db_session.commit()
    return variant_id


async def test_cart_with_updated_item_quantity(
    client: AsyncClient, active_variant_id: str
) -> None:
    await create_test_user(client)
    await login_test_user(client)

    add_response = await client.post(
        "/api/v1/cart/items",
        json={
            "variant_id": active_variant_id,
            "quantity": 2,
        },
    )

    assert add_response.status_code == 201, add_response.text

    added_items = add_response.json()["items"]
    assert len(added_items) == 1
    assert added_items[0]["quantity"] == 2

    cart_item_id = added_items[0]["cart_item_id"]

    updated_response = await client.patch(
        f"/api/v1/cart/items/{cart_item_id}",
        json={
            "quantity": 5,
        },
    )

    assert updated_response.status_code == 200, updated_response.text

    cart = updated_response.json()
    assert len(cart["items"]) == 1

    item = cart["items"][0]
    assert item["cart_item_id"] == cart_item_id
    assert item["variant_id"] == active_variant_id
    assert item["quantity"] == 5
    assert cart["total_quantity"] == 5
    assert Decimal(str(cart["cart_subtotal"])) == Decimal("2500.00")
    assert Decimal(str(item["line_total"])) == Decimal("2500.00")


async def test_cart_merges_duplicate_adds_and_empties_after_removal(
    client: AsyncClient, active_variant_id: str
) -> None:
    await create_test_user(client)
    await login_test_user(client)

    add_response_1 = await client.post(
        "/api/v1/cart/items",
        json={
            "variant_id": active_variant_id,
            "quantity": 3,
        },
    )

    assert add_response_1.status_code == 201, add_response_1.text

    first_items = add_response_1.json()["items"]
    assert len(first_items) == 1
    assert first_items[0]["quantity"] == 3
    cart_item_id = first_items[0]["cart_item_id"]

    add_response_2 = await client.post(
        "/api/v1/cart/items",
        json={
            "variant_id": active_variant_id,
            "quantity": 2,
        },
    )

    assert add_response_2.status_code == 201, add_response_2.text

    cart = add_response_2.json()
    assert len(cart["items"]) == 1
    assert cart["items"][0]["cart_item_id"] == cart_item_id
    assert cart["items"][0]["quantity"] == 5
    assert cart["total_quantity"] == 5
    assert Decimal(str(cart["cart_subtotal"])) == Decimal("2500.00")

    remove_response = await client.delete(f"/api/v1/cart/items/{cart_item_id}")

    assert remove_response.status_code == 200, remove_response.text

    response = await client.get("/api/v1/cart/")
    assert response.status_code == 200, response.text

    cart = response.json()
    assert cart["items"] == []
    assert cart["total_quantity"] == 0
    assert Decimal(str(cart["cart_subtotal"])) == Decimal("0.00")


async def test_cart_with_price_recalculation_after_variant_price_change(
    client: AsyncClient, active_variant_id: str, db_session: AsyncSession
) -> None:
    await create_test_user(client)
    await login_test_user(client)

    add_response = await client.post(
        "/api/v1/cart/items",
        json={
            "variant_id": active_variant_id,
            "quantity": 2,
        },
    )

    assert add_response.status_code == 201, add_response.text

    cart = add_response.json()
    assert len(cart["items"]) == 1
    assert cart["items"][0]["quantity"] == 2
    assert Decimal(str(cart["cart_subtotal"])) == Decimal("1000.00")

    variant = await db_session.get(Variant, active_variant_id)
    variant.price = Decimal("600.00")
    await db_session.commit()

    response = await client.get("/api/v1/cart/")
    assert response.status_code == 200, response.text

    updated_cart = response.json()
    assert len(updated_cart["items"]) == 1
    assert updated_cart["items"][0]["quantity"] == 2
    assert Decimal(str(updated_cart["cart_subtotal"])) == Decimal("1200.00")


async def test_cart_with_invalid_quantity(
    client: AsyncClient, active_variant_id: str
) -> None:
    await create_test_user(client)
    await login_test_user(client)

    response = await client.post(
        "/api/v1/cart/items",
        json={
            "variant_id": active_variant_id,
            "quantity": -1,
        },
    )

    assert response.status_code == 422, response.text


async def test_cart_ownership_enforcement(
    client: AsyncClient, active_variant_id: str
) -> None:
    await create_test_user(client)
    await login_test_user(client)

    add_response = await client.post(
        "/api/v1/cart/items",
        json={
            "variant_id": active_variant_id,
            "quantity": 1,
        },
    )

    assert add_response.status_code == 201, add_response.text

    cart_item_id = add_response.json()["items"][0]["cart_item_id"]

    await create_test_user(
        client,
        first_name="Other",
        last_name="User",
        email="otheruser@example.com",
        phone_number="2234567890",
        password="password",
    )
    await login_test_user(client, email="otheruser@example.com", password="password")

    remove_response = await client.delete(f"/api/v1/cart/items/{cart_item_id}")

    assert remove_response.status_code == 404, remove_response.text

    update_response = await client.patch(
        f"/api/v1/cart/items/{cart_item_id}",
        json={
            "quantity": 5,
        },
    )

    assert update_response.status_code == 404, update_response.text

    await login_test_user(client)

    response = await client.get("/api/v1/cart/")
    assert response.status_code == 200, response.text

    assert len(response.json()["items"]) == 1
    assert response.json()["items"][0]["quantity"] == 1
    assert Decimal(str(response.json()["cart_subtotal"])) == Decimal("500.00")


async def test_cart_with_invalid_variant_id(client: AsyncClient) -> None:
    await create_test_user(client)
    await login_test_user(client)

    response = await client.post(
        "/api/v1/cart/items",
        json={
            "variant_id": "invalid-uuid",
            "quantity": 1,
        },
    )

    assert response.status_code == 422, response.text

    read_response = await client.get("/api/v1/cart/")
    assert read_response.status_code == 200, read_response.text

    assert read_response.json()["items"] == []
    assert read_response.json()["total_quantity"] == 0
    assert Decimal(str(read_response.json()["cart_subtotal"])) == Decimal("0.00")


async def test_cart_read_while_logged_out(
    client: AsyncClient, active_variant_id: str
) -> None:
    await create_test_user(client)
    await login_test_user(client)

    add_response = await client.post(
        "/api/v1/cart/items",
        json={
            "variant_id": active_variant_id,
            "quantity": 1,
        },
    )

    assert add_response.status_code == 201, add_response.text

    assert len(add_response.json()["items"]) == 1
    assert add_response.json()["items"][0]["quantity"] == 1
    assert Decimal(str(add_response.json()["cart_subtotal"])) == Decimal("500.00")

    await client.post("/api/v1/auth/logout")

    response = await client.get("/api/v1/cart/")

    assert response.status_code == 401, response.text
