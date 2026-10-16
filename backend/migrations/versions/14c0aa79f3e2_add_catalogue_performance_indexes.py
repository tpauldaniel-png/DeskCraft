"""add catalogue performance indexes

Revision ID: 14c0aa79f3e2
Revises: 2348bf3c7566
Create Date: 2026-10-16 15:39:43.473752

"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "14c0aa79f3e2"
down_revision: str | Sequence[str] | None = "2348bf3c7566"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    """Add indexes supporting public catalogue queries."""
    op.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm;")

    op.create_index(
        "ix_products_name_trgs",
        "products",
        ["name"],
        postgresql_using="gin",
        postgresql_ops={"name": "gin_trgm_ops"},
    )

    op.create_index(
        "ix_variants_active_product_price",
        "variants",
        ["product_id", "price", "variant_id"],
        postgresql_where=sa.text("is_active IS TRUE"),
    )

    op.create_index(
        "ix_product_images_variant_display_order",
        "product_images",
        [
            "variant_id",
            sa.text("is_primary DESC"),
            "sort_order",
            "created_at",
            "product_image_id",
        ],
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(
        "ix_product_images_variant_display_order", table_name="product_images"
    )
    op.drop_index("ix_variants_active_product_price", table_name="variants")
    op.drop_index("ix_products_name_trgs", table_name="products")

    # retain the pg_trgm extension, as it may be used by other indexes or functions
