from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from uuid import UUID

from fastapi import status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppException
from app.modules.addresses.models.address import Address
from app.modules.addresses.repositories.address import AddressRepository
from app.modules.addresses.schemas.address import (
    AddressCreate,
    AddressResponse,
    AddressUpdate,
)


class AddressService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.address_repository = AddressRepository(db)

    @asynccontextmanager
    async def _write_transaction(self, user_id: UUID) -> AsyncIterator[None]:
        try:
            await self.address_repository.lock_customer(user_id=user_id)
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

    async def _get_owned_address(self, user_id: UUID, address_id: UUID) -> Address:

        address = await self.address_repository.get_address_by_id(
            user_id=user_id, address_id=address_id
        )

        if not address:
            raise AppException(
                status_code=status.HTTP_404_NOT_FOUND,
                code="ADDRESS_NOT_FOUND",
                message="Address not found",
            )

        return address

    async def create_address(
        self, user_id: UUID, address_create: AddressCreate
    ) -> AddressResponse:

        async with self._write_transaction(user_id=user_id):
            if address_create.is_default:
                await self.address_repository.clear_default_address(user_id=user_id)

            address = await self.address_repository.create_address(
                user_id=user_id,
                recipient_name=address_create.recipient_name,
                phone_number=address_create.phone_number,
                address_line1=address_create.address_line1,
                address_line2=address_create.address_line2,
                city=address_create.city,
                state=address_create.state,
                postal_code=address_create.postal_code,
                country=address_create.country,
                is_default=address_create.is_default,
            )

            response = AddressResponse.model_validate(address)

        return response

    async def get_address_by_id(
        self, user_id: UUID, address_id: UUID
    ) -> AddressResponse:

        address = await self._get_owned_address(user_id=user_id, address_id=address_id)

        return AddressResponse.model_validate(address)

    async def list_addresses_by_user_id(self, user_id: UUID) -> list[AddressResponse]:
        addresses = await self.address_repository.list_addresses_by_user_id(
            user_id=user_id
        )
        return [AddressResponse.model_validate(address) for address in addresses]

    async def update_address(
        self, user_id: UUID, address_id: UUID, address_update: AddressUpdate
    ) -> AddressResponse:
        changes = address_update.model_dump(exclude_unset=True)

        async with self._write_transaction(user_id=user_id):
            address = await self._get_owned_address(
                user_id=user_id, address_id=address_id
            )

            if changes.get("is_default") is True:
                await self.address_repository.clear_default_address(
                    user_id=user_id, keep_address_id=address_id
                )

            address = await self.address_repository.update_address(
                address=address,
                changes=changes,
            )
            response = AddressResponse.model_validate(address)

        return response

    async def delete_address(self, user_id: UUID, address_id: UUID) -> None:

        async with self._write_transaction(user_id=user_id):
            address = await self._get_owned_address(
                user_id=user_id, address_id=address_id
            )
            await self.address_repository.delete_address(address=address)
