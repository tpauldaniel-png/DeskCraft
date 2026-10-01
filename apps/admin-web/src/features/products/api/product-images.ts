import { apiClient } from "@/lib/api-client";
import type { ProductImage, ProductImageListResponse } from "../types/product-images";


export async function getProductImages(variantId: string): Promise<ProductImageListResponse> {
    const response = await apiClient.get<ProductImageListResponse>(
        `/api/v1/variants/${variantId}/images`
    );
    return response.data;
}


export async function createProductImage(variantId: string, imageData: FormData): Promise<ProductImage> {
    const response = await apiClient.post<ProductImage>(
        `/api/v1/variants/${variantId}/images`,
        imageData,
    );
    return response.data;
}
