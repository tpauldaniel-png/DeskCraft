

import { apiClient } from "@/lib/api-client";

import type { ProductListResponse, ProductListParams } from "../types/product";


export async function getProducts(params: ProductListParams): Promise<ProductListResponse> {
    const response = await apiClient.get<ProductListResponse>(
        "/api/v1/catalogue/products",
        { params }
    );
    return response.data;
}

