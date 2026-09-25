from datetime import datetime
from decimal import Decimal
from uuid import UUID

from sqlalchemy import (
    BOOLEAN,
    TIMESTAMP,
    VARCHAR,
    CheckConstraint,
    ForeignKey,
    Numeric,
    text,
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Variant(Base):
    __tablename__ = "variants"

    variant_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        nullable=False,
        server_default=text("gen_random_uuid()"),
    )

    product_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("products.product_id"),
        index=True,
        nullable=False,
    )

    name: Mapped[str] = mapped_column(VARCHAR(200), nullable=False)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    sku: Mapped[str] = mapped_column(VARCHAR(100), nullable=False, unique=True)

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

    __table_args__ = (CheckConstraint("price >= 0", name="check_price_non_negative"),)
