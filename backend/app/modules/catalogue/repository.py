from decimal import Decimal
from uuid import UUID

from sqlalchemy import RowMapping, and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.catalogue.models.category import Category
from app.modules.catalogue.models.product import Product
from app.modules.catalogue.models.product_images import ProductImage
from app.modules.catalogue.models.variant import Variant


class CategoryRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_category_by_name(self, name: str) -> Category | None:
        statement = select(Category).where(func.lower(Category.name) == name.lower())
        result = await self.db.execute(statement)
        return result.scalar_one_or_none()

    async def get_category_by_id(self, category_id: UUID) -> Category | None:
        statement = select(Category).where(Category.category_id == category_id)
        result = await self.db.execute(statement)
        return result.scalar_one_or_none()

    async def list_categories(
        self, page: int, page_size: int
    ) -> tuple[list[Category], int]:
        offset = (page - 1) * page_size
        count_statement = select(func.count(Category.category_id))
        count_result = await self.db.execute(count_statement)
        total = count_result.scalar_one()

        statement = (
            select(Category)
            .order_by(Category.name.asc())
            .offset(offset)
            .limit(page_size)
        )
        result = await self.db.execute(statement)
        categories = list(result.scalars().all())
        return categories, total

    async def create_category(self, category: Category) -> Category:
        self.db.add(category)
        await self.db.flush()
        return category

    async def update_category(self, category: Category) -> Category:
        await self.db.flush()

        return category

    async def list_public_categories(self) -> list[Category]:
        statement = (
            select(Category)
            .where(Category.is_active.is_(True))
            .order_by(Category.name.asc(), Category.category_id.asc())
        )
        result = await self.db.execute(statement)
        return list(result.scalars().all())


class ProductRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_product(self, product: Product) -> Product:
        self.db.add(product)
        await self.db.flush()
        return product

    async def get_product_by_id(self, product_id: UUID) -> Product | None:
        statement = select(Product).where(Product.product_id == product_id)
        result = await self.db.execute(statement)
        return result.scalar_one_or_none()

    async def update_product(self, product: Product) -> Product:
        await self.db.flush()
        return product

    async def get_product_by_slug(self, slug: str) -> Product | None:
        statement = select(Product).where(Product.slug == slug)
        result = await self.db.execute(statement)
        return result.scalar_one_or_none()

    async def list_products(
        self,
        page: int,
        page_size: int,
        search: str | None = None,
        category_id: UUID | None = None,
        is_active: bool | None = None,
    ) -> tuple[list[Product], int]:
        offset = (page - 1) * page_size

        conditions = []

        if search is not None and search.strip():
            search_value = f"%{search.strip()}%"
            conditions.append(Product.name.ilike(search_value))

        if category_id is not None:
            conditions.append(Product.category_id == category_id)

        if is_active is not None:
            conditions.append(Product.is_active == is_active)

        count_statement = select(func.count(Product.product_id)).where(*conditions)

        count_result = await self.db.execute(count_statement)
        total = count_result.scalar_one()

        statement = (
            select(Product)
            .where(*conditions)
            .order_by(Product.name.asc())
            .offset(offset)
            .limit(page_size)
        )
        result = await self.db.execute(statement)
        products = list(result.scalars().all())
        return products, total


class VariantRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_variant(self, variant: Variant) -> Variant:
        self.db.add(variant)
        await self.db.flush()
        return variant

    async def get_variant_by_id(self, variant_id: UUID) -> Variant | None:
        statement = select(Variant).where(Variant.variant_id == variant_id)
        result = await self.db.execute(statement)
        return result.scalar_one_or_none()

    async def update_variant(self, variant: Variant) -> Variant:
        await self.db.flush()
        return variant

    async def get_variant_by_sku(self, sku: str) -> Variant | None:
        statement = select(Variant).where(Variant.sku == sku)
        result = await self.db.execute(statement)
        return result.scalar_one_or_none()

    async def list_variants(
        self,
        page: int,
        page_size: int,
        search: str | None = None,
        product_id: UUID | None = None,
        is_active: bool | None = None,
    ) -> tuple[list[Variant], int]:

        conditions = []

        if search is not None and search.strip():
            search_value = f"%{search.strip()}%"
            conditions.append(Variant.name.ilike(search_value))

        if product_id is not None:
            conditions.append(Variant.product_id == product_id)

        if is_active is not None:
            conditions.append(Variant.is_active == is_active)

        offset = (page - 1) * page_size

        count_statement = select(func.count(Variant.variant_id)).where(*conditions)
        count_result = await self.db.execute(count_statement)
        total = count_result.scalar_one()

        statement = (
            select(Variant)
            .where(*conditions)
            .order_by(Variant.name.asc(), Variant.variant_id.asc())
            .offset(offset)
            .limit(page_size)
        )
        result = await self.db.execute(statement)
        variants = list(result.scalars().all())
        return variants, total


class ProductImageRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_product_image(self, product_image: ProductImage) -> ProductImage:
        self.db.add(product_image)
        await self.db.flush()
        return product_image

    async def list_product_images_by_variant(
        self, variant_id: UUID
    ) -> list[ProductImage]:

        statement = (
            select(ProductImage)
            .where(ProductImage.variant_id == variant_id)
            .order_by(ProductImage.sort_order.asc(), ProductImage.created_at.asc())
        )

        result = await self.db.execute(statement)
        return list(result.scalars().all())

    async def get_product_image_by_id(
        self, product_image_id: UUID
    ) -> ProductImage | None:
        statement = select(ProductImage).where(
            ProductImage.product_image_id == product_image_id
        )
        result = await self.db.execute(statement)
        return result.scalar_one_or_none()

    async def get_primary_product_image_by_variant(
        self, variant_id: UUID
    ) -> ProductImage | None:
        statement = select(ProductImage).where(
            ProductImage.variant_id == variant_id, ProductImage.is_primary.is_(True)
        )
        result = await self.db.execute(statement)
        return result.scalar_one_or_none()

    async def update_product_image(self, product_image: ProductImage) -> ProductImage:
        await self.db.flush()
        return product_image

    async def get_thumbnail_for_variants(
        self, variant_ids: list[UUID]
    ) -> dict[UUID, ProductImage | None]:

        if not variant_ids:
            return {}

        statement = (
            select(ProductImage)
            .where(
                ProductImage.variant_id.in_(variant_ids),
                ProductImage.is_active.is_(True),
            )
            .order_by(
                ProductImage.variant_id.asc(),
                ProductImage.is_primary.desc(),
                ProductImage.sort_order.asc(),
                ProductImage.created_at.asc(),
                ProductImage.product_image_id.asc(),
            )
        )

        result = await self.db.execute(statement)

        thumbnails: dict[UUID, ProductImage | None] = {}

        for image in result.scalars().all():
            thumbnails.setdefault(image.variant_id, image)

        return thumbnails

    async def list_images_for_reorder(self, variant_id: UUID) -> list[ProductImage]:
        statement = (
            select(ProductImage)
            .where(ProductImage.variant_id == variant_id)
            .with_for_update()
        )
        result = await self.db.execute(statement)
        return list(result.scalars().all())

    async def get_next_sort_order_for_variant(self, variant_id: UUID) -> int:
        statement = select(func.max(ProductImage.sort_order)).where(
            ProductImage.variant_id == variant_id
        )
        result = await self.db.execute(statement)
        max_sort_order = result.scalar_one_or_none()
        return (max_sort_order or 0) + 1

    async def delete_product_image(self, product_image: ProductImage) -> None:
        await self.db.delete(product_image)
        await self.db.flush()


class PublicProductRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_public_products(
        self,
        page: int,
        page_size: int,
        search: str | None = None,
        category_id: UUID | None = None,
        sort: str | None = None,
        min_price: Decimal | None = None,
        max_price: Decimal | None = None,
    ) -> tuple[list[RowMapping], int]:
        offset = (page - 1) * page_size

        # Rank active variants from cheapest to most expensive for each product using window function
        ranked_variants = (
            select(
                Variant.variant_id,
                Variant.product_id,
                Variant.price,
                func.row_number()
                .over(
                    partition_by=Variant.product_id,
                    order_by=(Variant.price.asc(), Variant.variant_id.asc()),
                )
                .label("variant_rank"),
            )
            .where(Variant.is_active.is_(True))
            .subquery()
        )

        # Pick one image for each ranked variant, prioritizing primary images and then by sort order and creation date

        image_url = (
            select(ProductImage.image_url)
            .where(ProductImage.variant_id == ranked_variants.c.variant_id)
            .order_by(
                ProductImage.is_primary.desc(),
                ProductImage.sort_order.asc(),
                ProductImage.created_at.asc(),
                ProductImage.product_image_id.asc(),
            )
            .limit(1)
            .correlate(ranked_variants)
            .scalar_subquery()
        )

        # Build the main query to fetch products with their starting price and image URL

        conditions = [
            Product.is_active.is_(True),
            Category.is_active.is_(True),
        ]

        if category_id is not None:
            conditions.append(Product.category_id == category_id)

        if search is not None and search.strip():
            search_value = f"%{search.strip()}%"
            conditions.append(Product.name.ilike(search_value))

        if sort is not None:
            if sort == "price_asc":
                product_order_by = [
                    ranked_variants.c.price.asc().nulls_last(),
                    Product.product_id.asc(),
                ]
            elif sort == "price_desc":
                product_order_by = [
                    ranked_variants.c.price.desc().nulls_last(),
                    Product.product_id.asc(),
                ]
            elif sort == "name_asc":
                product_order_by = [Product.name.asc(), Product.product_id.asc()]
            elif sort == "name_desc":
                product_order_by = [Product.name.desc(), Product.product_id.asc()]
            else:
                product_order_by = [Product.name.asc(), Product.product_id.asc()]

        if min_price is not None:
            conditions.append(ranked_variants.c.price >= min_price)
        if max_price is not None:
            conditions.append(ranked_variants.c.price <= max_price)

        count_statement = (
            select(func.count(Product.product_id))
            .select_from(Product)
            .join(Category, Product.category_id == Category.category_id)
            .outerjoin(
                ranked_variants,
                and_(
                    Product.product_id == ranked_variants.c.product_id,
                    ranked_variants.c.variant_rank == 1,
                ),
            )
            .where(*conditions)
        )

        count_result = await self.db.execute(count_statement)
        total = count_result.scalar_one()

        statement = (
            select(
                Product.product_id,
                Product.category_id,
                Category.name.label("category_name"),
                Product.name,
                Product.slug,
                ranked_variants.c.price.label("starting_price"),
                image_url.label("image_url"),
            )
            .select_from(Product)
            .join(Category, Product.category_id == Category.category_id)
            .outerjoin(
                ranked_variants,
                and_(
                    Product.product_id == ranked_variants.c.product_id,
                    ranked_variants.c.variant_rank == 1,
                ),
            )
            .where(*conditions)
            .order_by(*product_order_by)
            .offset(offset)
            .limit(page_size)
        )

        result = await self.db.execute(statement)
        items = list(result.mappings().all())
        return items, total
