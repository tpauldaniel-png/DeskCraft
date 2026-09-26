
import { apiClient } from "@/lib/api-client";
import type { ProductVariant, ProductVariantCreateInput, ProductVariantListParams, ProductVariantListResponse, ProductVariantUpdateInput } from "../types/variant";


export async function getProductVariants(params: ProductVariantListParams): Promise<ProductVariantListResponse> {
    const response = await apiClient.get<ProductVariantListResponse>(
        "/api/v1/variants",
        { params }
    );
    return response.data;
}


export async function createProductVariant(variantData: ProductVariantCreateInput): Promise<ProductVariant> {
    const response = await apiClient.post<ProductVariant>(
        "/api/v1/variants",
        variantData
    );
    return response.data;
}

export async function updateProductVariant(variantId: string, variantData: ProductVariantUpdateInput): Promise<ProductVariant> {
    const response = await apiClient.put<ProductVariant>(
        `/api/v1/variants/${variantId}`,
        variantData
    );
    return response.data;
}

