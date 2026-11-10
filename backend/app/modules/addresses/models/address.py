from datetime import datetime
from uuid import UUID

from sqlalchemy import TIMESTAMP, VARCHAR, ForeignKey, Index, text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Address(Base):
    __tablename__ = "addresses"

    address_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        nullable=False,
        server_default=text("gen_random_uuid()"),
    )
    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.user_id"),
        nullable=False,
    )
    recipient_name: Mapped[str] = mapped_column(VARCHAR(100), nullable=False)
    phone_number: Mapped[str] = mapped_column(VARCHAR(20), nullable=False)
    address_line1: Mapped[str] = mapped_column(VARCHAR(200), nullable=False)
    address_line2: Mapped[str] = mapped_column(VARCHAR(200), nullable=True)
    city: Mapped[str] = mapped_column(VARCHAR(100), nullable=False)
    state: Mapped[str] = mapped_column(VARCHAR(100), nullable=False)
    postal_code: Mapped[str] = mapped_column(VARCHAR(20), nullable=False)
    country: Mapped[str] = mapped_column(
        VARCHAR(50), nullable=False, server_default=text("'INDIA'")
    )
    is_default: Mapped[bool] = mapped_column(
        nullable=False, server_default=text("false")
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
            "ix_addresses_user_id",
            "user_id",
        ),
        Index(
            "uq_addresses_user_default",
            "user_id",
            unique=True,
            postgresql_where=text("is_default IS TRUE"),
        ),
    )
