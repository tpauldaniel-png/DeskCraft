from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from datetime import UTC, datetime
from decimal import Decimal
from uuid import UUID

from fastapi import status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException
from app.modules.cart.models.cart import Cart
from app.modules.cart.repositories.cart import CartRepository
from app.modules.cart.schemas.cart import (
    AddCartItemRequest,
    CartItemResponse,
    CartResponse,
    UpdateCartItemRequest,
)


class CartService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.cart_repository = CartRepository(db)

    @asynccontextmanager
    async def _write_transaction(self) -> AsyncIterator[None]:
        try:
            yield
            await self.db.commit()

        except IntegrityError as e:
            await self.db.rollback()
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                code="INTEGRITY_ERROR",
                message="Database integrity error",
            ) from e

        except SQLAlchemyError as e:
            await self.db.rollback()
            raise AppException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                code="DATABASE_ERROR",
                message="Database error",
            ) from e

        except Exception:
            await self.db.rollback()
            raise

    async def _get_locked_cart(self, user_id: UUID, *, create: bool = False) -> Cart:
        cart = await self.cart_repository.get_cart_for_update(
            user_id=user_id, create=create
        )
        if not cart:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                code="CART_NOT_FOUND",
                message="Cart not found",
            )
        return cart

    async def _validate_variant(self, variant_id: UUID) -> None:
        variant = await self.cart_repository.get_active_variant(variant_id=variant_id)

        if not variant:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                code="VARIANT_NOT_FOUND",
                message="Variant not found",
            )
        if not variant.is_active:
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                code="VARIANT_INACTIVE",
                message="Variant is inactive",
            )

    @staticmethod
    def _validate_quantity(quantity: int) -> None:
        if quantity <= 0 or isinstance(quantity, bool) or not isinstance(quantity, int):
            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                code="INVALID_QUANTITY",
                message="Quantity must be greater than zero",
            )

    async def _build_cart_response(self, cart: Cart) -> CartResponse:

        rows = await self.cart_repository.list_cart_item_details(cart_id=cart.cart_id)

        items: list[CartItemResponse] = []
        total_quantity = 0
        subtotal = Decimal("0.00")

        for row in rows:
            unit_price = row["current_unit_price"]
            quantity = row["quantity"]
            line_total = unit_price * quantity

            items.append(
                CartItemResponse(
                    cart_item_id=row["cart_item_id"],
                    variant_id=row["variant_id"],
                    product_name=row["product_name"],
                    sku=row["sku"],
                    image_url=row["image_url"],
                    quantity=quantity,
                    current_unit_price=unit_price,
                    line_total=line_total,
                    created_at=row["created_at"],
                    updated_at=row["updated_at"],
                )
            )

            subtotal += line_total
            total_quantity += quantity

        return CartResponse(
            cart_id=cart.cart_id,
            items=items,
            total_quantity=total_quantity,
            cart_subtotal=subtotal,
        )

    async def get_cart(self, user_id: UUID) -> CartResponse:

        cart = await self.cart_repository.get_cart_by_user_id(user_id=user_id)

        if cart is None:
            return CartResponse()

        return await self._build_cart_response(cart=cart)

    async def add_cart_item(
        self, user_id: UUID, data: AddCartItemRequest
    ) -> CartResponse:

        self._validate_quantity(data.quantity)

        async with self._write_transaction():
            cart = await self._get_locked_cart(user_id=user_id, create=True)

            await self._validate_variant(variant_id=data.variant_id)

            existing_item = await self.cart_repository.get_cart_item_by_variant_id(
                cart_id=cart.cart_id, variant_id=data.variant_id
            )

            if existing_item is None:
                await self.cart_repository.add_cart_item(
                    cart_id=cart.cart_id,
                    variant_id=data.variant_id,
                    quantity=data.quantity,
                )
            else:
                new_quantity = existing_item.quantity + data.quantity
                await self.cart_repository.update_cart_item_quantity(
                    cart_id=cart.cart_id,
                    cart_item_id=existing_item.cart_item_id,
                    quantity=new_quantity,
                )

            cart.updated_at = datetime.now(UTC)
            await self.db.flush()

            response = await self._build_cart_response(cart=cart)

        return response

    async def update_cart_item(
        self, user_id: UUID, cart_item_id: UUID, data: UpdateCartItemRequest
    ) -> CartResponse:

        self._validate_quantity(data.quantity)

        async with self._write_transaction():
            cart = await self._get_locked_cart(user_id=user_id)

            cart_item = await self.cart_repository.get_cart_item(
                cart_id=cart.cart_id, cart_item_id=cart_item_id
            )

            if cart_item is None:
                raise AppException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    code="CART_ITEM_NOT_FOUND",
                    message="Cart item not found",
                )

            await self._validate_variant(variant_id=cart_item.variant_id)

            await self.cart_repository.update_cart_item_quantity(
                cart_id=cart.cart_id,
                cart_item_id=cart_item.cart_item_id,
                quantity=data.quantity,
            )

            cart.updated_at = datetime.now(UTC)
            await self.db.flush()

            response = await self._build_cart_response(cart=cart)

        return response

    async def remove_cart_item(self, user_id: UUID, cart_item_id: UUID) -> CartResponse:

        async with self._write_transaction():
            cart = await self._get_locked_cart(user_id=user_id)

            removed = await self.cart_repository.remove_cart_item(
                cart_id=cart.cart_id, cart_item_id=cart_item_id
            )

            if not removed:
                raise AppException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    code="CART_ITEM_NOT_FOUND",
                    message="Cart item not found",
                )

            cart.updated_at = datetime.now(UTC)
            await self.db.flush()

            response = await self._build_cart_response(cart=cart)

        return response
