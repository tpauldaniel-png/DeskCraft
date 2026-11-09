import { apiClient } from "@/lib/api-client";

import type { CartResponse, AddToCartParams, UpdateCartItemParams } from "../types/cart";

export async function getCart(signal?: AbortSignal): Promise<CartResponse> {
    const response = await apiClient.get<CartResponse>("/api/v1/cart", { signal });
    return response.data;
}

export async function addToCart(params: AddToCartParams): Promise<CartResponse> {
    const response = await apiClient.post<CartResponse>("/api/v1/cart/items", params);
    return response.data;
}

export async function updateCartItem(params: UpdateCartItemParams): Promise<CartResponse> {
    const response = await apiClient.patch<CartResponse>(`/api/v1/cart/items/${params.cart_item_id}`, { quantity: params.quantity });
    return response.data;
}

export async function removeCartItem(cart_item_id: string): Promise<CartResponse> {
    const response = await apiClient.delete<CartResponse>(`/api/v1/cart/items/${cart_item_id}`);
    return response.data;
}
