from collections.abc import Mapping

from sqlalchemy import UUID, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.addresses.models.address import Address
from app.modules.users.models.users import User


class AddressRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_address_by_id(
        self, *, user_id: UUID, address_id: UUID
    ) -> Address | None:
        statement = select(Address).where(
            Address.user_id == user_id, Address.address_id == address_id
        )
        result = await self.db.execute(statement)
        return result.scalar_one_or_none()

    async def list_addresses_by_user_id(self, user_id: UUID) -> list[Address]:
        statement = (
            select(Address)
            .where(Address.user_id == user_id)
            .order_by(Address.created_at, Address.address_id)
        )
        result = await self.db.execute(statement)
        return list(result.scalars().all())

    async def create_address(
        self,
        user_id: UUID,
        recipient_name: str,
        phone_number: str,
        address_line1: str,
        address_line2: str | None,
        city: str,
        state: str,
        postal_code: str,
        country: str,
        is_default: bool,
    ) -> Address:
        new_address = Address(
            user_id=user_id,
            recipient_name=recipient_name,
            phone_number=phone_number,
            address_line1=address_line1,
            address_line2=address_line2,
            city=city,
            state=state,
            postal_code=postal_code,
            country=country,
            is_default=is_default,
        )
        self.db.add(new_address)
        await self.db.flush()
        return new_address

    async def update_address(
        self,
        address: Address,
        changes: Mapping[str, object],
    ) -> Address:
        if not changes:
            return address

        for field, value in changes.items():
            setattr(address, field, value)

        await self.db.flush()
        await self.db.refresh(address, attribute_names=["updated_at"])
        return address

    async def delete_address(self, address: Address) -> None:
        await self.db.delete(address)
        await self.db.flush()

    async def clear_default_address(
        self, user_id: UUID, *, keep_address_id: UUID | None = None
    ) -> None:
        statement = update(Address).where(
            Address.user_id == user_id, Address.is_default.is_(True)
        )

        if keep_address_id is not None:
            statement = statement.where(Address.address_id != keep_address_id)

        await self.db.execute(statement.values(is_default=False))

    async def lock_customer(self, user_id: UUID) -> None:

        statement = (
            select(User.user_id)
            .where(User.user_id == user_id)
            .with_for_update(key_share=True)
        )

        await self.db.execute(statement)
