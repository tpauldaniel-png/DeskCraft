import { apiClient } from "@/lib/api-client";

import type { PublicCategory } from "../types/category";

export async function getPublicCategories(): Promise<PublicCategory[]> {
    const response = await apiClient.get<PublicCategory[]>("/api/v1/catalogue/categories");
    return response.data;
}