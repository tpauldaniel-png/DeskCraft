
import { apiClient } from "@/lib/api-client";
import type {Product, ProductCreateInput, ProductListParams, ProductListResponse, ProductUpdateInput} from "../types/product";




export async function getProducts(params: ProductListParams): Promise<ProductListResponse> {
    const response = await apiClient.get<ProductListResponse>(
        "/api/v1/products",
        { params }
    )
    return response.data;
}

export async function createProduct(productData: ProductCreateInput): Promise<Product> {
    const response = await apiClient.post<Product>(
        "/api/v1/products",
        productData
    );
    return response.data;
}


export async function updateProduct(productId: string, productData: ProductUpdateInput): Promise<Product> {
    const response = await apiClient.patch<Product>(
        `/api/v1/products/${productId}`,
        productData
    );
    return response.data;
}
