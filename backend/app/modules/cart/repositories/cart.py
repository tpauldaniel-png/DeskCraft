from uuid import UUID

from sqlalchemy import RowMapping, select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.cart.models.cart import Cart
from app.modules.cart.models.cart_items import CartItem
from app.modules.catalogue.models.category import Category
from app.modules.catalogue.models.product import Product
from app.modules.catalogue.models.product_images import ProductImage
from app.modules.catalogue.models.variant import Variant


class CartRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_cart_by_user_id(self, user_id: UUID) -> Cart | None:
        statement = select(Cart).where(Cart.user_id == user_id)
        result = await self.db.execute(statement)
        return result.scalar_one_or_none()

    async def create_cart(self, user_id: UUID) -> Cart:
        new_cart = Cart(user_id=user_id)
        self.db.add(new_cart)
        await self.db.flush()
        return new_cart

    async def list_cart_items(self, cart_id: UUID) -> list[CartItem]:
        statement = (
            select(CartItem)
            .where(CartItem.cart_id == cart_id)
            .order_by(CartItem.created_at, CartItem.cart_item_id)
        )
        result = await self.db.execute(statement)
        return list(result.scalars().all())

    async def get_cart_item(self, cart_id: UUID, cart_item_id: UUID) -> CartItem | None:
        statement = select(CartItem).where(
            CartItem.cart_item_id == cart_item_id, CartItem.cart_id == cart_id
        )
        result = await self.db.execute(statement)
        return result.scalar_one_or_none()

    async def get_cart_item_by_variant_id(
        self, cart_id: UUID, variant_id: UUID
    ) -> CartItem | None:
        statement = select(CartItem).where(
            CartItem.cart_id == cart_id, CartItem.variant_id == variant_id
        )
        result = await self.db.execute(statement)
        return result.scalar_one_or_none()

    async def add_cart_item(
        self, cart_id: UUID, variant_id: UUID, quantity: int
    ) -> CartItem:
        new_cart_item = CartItem(
            cart_id=cart_id, variant_id=variant_id, quantity=quantity
        )
        self.db.add(new_cart_item)
        await self.db.flush()
        return new_cart_item

    async def update_cart_item_quantity(
        self, cart_id: UUID, cart_item_id: UUID, quantity: int
    ) -> CartItem | None:
        cart_item = await self.get_cart_item(cart_id=cart_id, cart_item_id=cart_item_id)
        if cart_item is None:
            return None
        cart_item.quantity = quantity
        await self.db.flush()
        return cart_item

    async def remove_cart_item(self, cart_id: UUID, cart_item_id: UUID) -> bool:
        cart_item = await self.get_cart_item(cart_id=cart_id, cart_item_id=cart_item_id)

        if cart_item is None:
            return False

        await self.db.delete(cart_item)
        await self.db.flush()
        return True

    async def get_cart_for_update(
        self, user_id: UUID, *, create: bool = False
    ) -> Cart | None:

        if create:
            statement = (
                pg_insert(Cart)
                .values(user_id=user_id)
                .on_conflict_do_nothing(index_elements=[Cart.user_id])
            )

            await self.db.execute(statement)

        statement = (
            select(Cart)
            .where(Cart.user_id == user_id)
            .with_for_update()
            .execution_options(populate_existing=True)
        )

        result = await self.db.execute(statement)
        return result.scalar_one_or_none()

    async def get_active_variant(self, variant_id: UUID) -> Variant | None:

        statement = (
            select(Variant)
            .join(Product, Variant.product_id == Product.product_id)
            .join(Category, Product.category_id == Category.category_id)
            .where(
                Variant.variant_id == variant_id,
                Variant.is_active.is_(True),
                Product.is_active.is_(True),
                Category.is_active.is_(True),
            )
        )

        result = await self.db.execute(statement)
        return result.scalar_one_or_none()

    async def list_cart_item_details(self, cart_id: UUID) -> list[RowMapping]:
        thumbnail = (
            select(ProductImage.image_url)
            .where(ProductImage.variant_id == Variant.variant_id)
            .order_by(
                ProductImage.is_primary.desc(),
                ProductImage.sort_order,
                ProductImage.created_at,
                ProductImage.product_image_id,
            )
            .limit(1)
            .correlate(Variant)
            .scalar_subquery()
        )

        statement = (
            select(
                CartItem.cart_item_id,
                CartItem.variant_id,
                CartItem.quantity,
                CartItem.created_at,
                CartItem.updated_at,
                Variant.sku,
                Variant.price.label("current_unit_price"),
                Product.name.label("product_name"),
                thumbnail.label("image_url"),
            )
            .select_from(CartItem)
            .join(Variant, CartItem.variant_id == Variant.variant_id)
            .join(Product, Variant.product_id == Product.product_id)
            .where(CartItem.cart_id == cart_id)
            .order_by(CartItem.created_at, CartItem.cart_item_id)
        )

        result = await self.db.execute(statement)
        return list(result.mappings().all())
