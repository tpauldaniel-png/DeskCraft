from datetime import datetime
from uuid import UUID

from sqlalchemy import BOOLEAN, TIMESTAMP, VARCHAR, CheckConstraint, text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    user_id: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        nullable=False,
        server_default=text("gen_random_uuid()"),
    )
    first_name: Mapped[str] = mapped_column(VARCHAR(100), nullable=False)
    last_name: Mapped[str] = mapped_column(VARCHAR(100), nullable=False)
    email: Mapped[str] = mapped_column(VARCHAR(255), unique=True, nullable=False)
    phone_number: Mapped[str | None] = mapped_column(
        VARCHAR(20), nullable=True, unique=True
    )
    password_hash: Mapped[str] = mapped_column(VARCHAR(255), nullable=False)
    role: Mapped[str] = mapped_column(
        VARCHAR(20), server_default=text("'customer'"), nullable=False
    )
    is_active: Mapped[bool] = mapped_column(
        BOOLEAN, server_default=text("true"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        server_default=text("CURRENT_TIMESTAMP"),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        server_default=text("CURRENT_TIMESTAMP"),
        onupdate=text("CURRENT_TIMESTAMP"),
        nullable=False,
    )

    __table_args__ = (
        CheckConstraint(
            "role IN ('customer', 'admin')",
            name="check_user_role_valid",
        ),
    )
