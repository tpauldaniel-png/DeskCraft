from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.cart.schemas.cart import (
    AddCartItemRequest,
    CartResponse,
    UpdateCartItemRequest,
)
from app.modules.cart.service.cart import CartService
from app.modules.users.models.users import User

router = APIRouter(prefix="/api/v1/cart", tags=["Cart"])


@router.get("/", response_model=CartResponse, status_code=status.HTTP_200_OK)
async def get_cart(
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):

    cart_service = CartService(db)
    cart = await cart_service.get_cart(user_id=current_user.user_id)

    return cart


@router.post("/items", response_model=CartResponse, status_code=status.HTTP_201_CREATED)
async def add_cart_item(
    request: AddCartItemRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    cart_service = CartService(db)
    cart = await cart_service.add_cart_item(
        user_id=current_user.user_id,
        data=request,
    )
    return cart


@router.patch(
    "/items/{cart_item_id}", response_model=CartResponse, status_code=status.HTTP_200_OK
)
async def update_cart_item(
    cart_item_id: UUID,
    request: UpdateCartItemRequest,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    cart_service = CartService(db)
    cart = await cart_service.update_cart_item(
        user_id=current_user.user_id,
        cart_item_id=cart_item_id,
        data=request,
    )
    return cart


@router.delete(
    "/items/{cart_item_id}", response_model=CartResponse, status_code=status.HTTP_200_OK
)
async def delete_cart_item(
    cart_item_id: UUID,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    cart_service = CartService(db)
    cart = await cart_service.remove_cart_item(
        user_id=current_user.user_id,
        cart_item_id=cart_item_id,
    )

    return cart
