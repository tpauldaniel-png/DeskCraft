import type {CategoryCreateInput, Category, CategoryListResponse, CategoryUpdateInput} from "@/features/categories/types/category";
import { apiClient } from "@/lib/api-client";


export async function createCategory(categoryData: CategoryCreateInput): Promise<Category> {
    const response = await apiClient.post<Category>(
        "/api/v1/categories",
        categoryData
    )

    return response.data;
}

export async function getCategories(page =1, page_size=20): Promise<CategoryListResponse> {
    const response = await apiClient.get<CategoryListResponse>(
        "/api/v1/categories",
        {
            params: {
                page,
                page_size: page_size
            },
        },
    );

    return response.data;
}

export async function updateCategory(categoryId: string,categoryData: CategoryUpdateInput): Promise<Category> {
    const response = await apiClient.patch<Category>(
        `/api/v1/categories/${categoryId}`,
        categoryData
    );

    return response.data;
}

