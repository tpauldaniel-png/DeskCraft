from datetime import datetime
from uuid import UUID

from sqlalchemy import (
    BOOLEAN,
    INTEGER,
    TIMESTAMP,
    VARCHAR,
    ForeignKey,
    Index,
    Text,
    text,
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ProductImage(Base):
    __tablename__ = "product_images"

    product_image_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        nullable=False,
        server_default=text("gen_random_uuid()"),
    )

    variant_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("variants.variant_id"),
        index=True,
        nullable=False,
    )

    image_url: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    cloudinary_public_id: Mapped[str] = mapped_column(
        VARCHAR(255),
        nullable=False,
    )

    alt_text: Mapped[str] = mapped_column(
        VARCHAR(255),
        nullable=False,
    )

    sort_order: Mapped[int] = mapped_column(
        INTEGER, nullable=False, server_default=text("0")
    )

    is_primary: Mapped[bool] = mapped_column(
        BOOLEAN, nullable=False, server_default=text("false")
    )

    is_active: Mapped[bool] = mapped_column(
        BOOLEAN, nullable=False, server_default=text("true")
    )

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        server_default=text("CURRENT_TIMESTAMP"),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        server_default=text("CURRENT_TIMESTAMP"),
        nullable=False,
        onupdate=text("CURRENT_TIMESTAMP"),
    )

    __table_args__ = (
        Index(
            "uq_product_images_one_primary_per_variant",
            "variant_id",
            unique=True,
            postgresql_where=text("is_primary IS TRUE"),
        ),
    )
