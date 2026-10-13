

import { apiClient } from "@/lib/api-client";

import type { ProductListResponse, ProductListParams, ProductDetail } from "../types/product";



export async function getProducts(params: ProductListParams): Promise<ProductListResponse> {
    const response = await apiClient.get<ProductListResponse>(
        "/api/v1/catalogue/products",
        { params }
    );
    return response.data;
}

export async function getProductBySlug(slug: string): Promise<ProductDetail> {
    const response = await apiClient.get<ProductDetail>(`/api/v1/catalogue/products/${encodeURIComponent(slug)}`);
    return response.data;
}