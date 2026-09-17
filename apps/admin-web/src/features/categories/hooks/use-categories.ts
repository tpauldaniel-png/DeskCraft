import type {CategoryCreateInput, CategoryUpdateInput} from "@/features/categories/types/category";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getCategories, updateCategory, createCategory } from "../api/categories-api";

const categoryKeys = {
    all: ["categories"] as const,
    
    list: (page: number, pageSize: number) => ["categories","list", page, pageSize] as const,
}


export function useCategories(page: number, pageSize:number) {
    return useQuery({
        queryKey: categoryKeys.list(page, pageSize),
        queryFn: () => getCategories(page, pageSize),
    });
}



export function useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (categoryData: CategoryCreateInput) => createCategory(categoryData),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: categoryKeys.all
            });
        },
    });
}


type UpdateCategoryVariables = {
    categoryId: string;
    categoryData: CategoryUpdateInput;
};


export function useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({categoryId, categoryData}:UpdateCategoryVariables) => updateCategory(categoryId, categoryData),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: categoryKeys.all
            });
        },
    });
}








